#!/usr/bin/env python3
"""
Transcribe los cortes por orador de una sesión del Canal Parlamento del
Congreso con faster-whisper (CPU), para cotejar citas del especial
«Con-textos» mientras el Diario de Sesiones no está publicado.

Uso:
  pip install faster-whisper
  python3 scripts/con-textos-transcribir.py \
      --ficha 'https://app.congreso.es/AudiovisualCongreso/audiovisualEmisionSemiDirecto?codOrgano=400&codSesion=194&idLegislaturaElegida=15&fechaSesion=3/09/2026' \
      --salida docs/con-textos/espana-marruecos/transcripciones/pl194 \
      [--modelo small] [--prioridad 777808,777809,…] [--solo 777808]

Salida por corte: `<id>-<orador>.txt` con líneas «[h:mm:ss → h:mm:ss] texto»,
`<id>.json` con los segmentos y `progress.log`. Los MP4 se guardan en
`<salida>/mp4/`. La carpeta de salida está en .gitignore: las
transcripciones automáticas no son fuente; al dossier solo pasan los
fragmentos cotejados (ver docs/con-textos/README.md).

Con `--cotejar <id> <inicio> <fin>` vuelve a transcribir solo esa ventana
(segundos) con el modelo `medium` y beam_size=5, para verificar un pasaje.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) OlvidosDeGranada/1.0"


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def parse_ficha(raw: bytes) -> list[dict]:
    """Devuelve [{id, orador, mp4}] en el orden de la ficha (ISO-8859-1)."""
    text = raw.decode("iso-8859-1")
    cortes: list[dict] = []
    seen: set[str] = set()
    for m in re.finditer(r"<a id=\"(\d{6})\" href=\"javascript:cambiar\('([^']*)'\)", text):
        cid, name = m.group(1), html.unescape(m.group(2)).strip()
        if cid in seen:
            continue
        mp4 = re.search(rf'href="(https://static\.congreso\.es/[^"]*_{cid}\.mp4)"', text)
        if not mp4:
            continue
        seen.add(cid)
        cortes.append({"id": cid, "orador": name, "mp4": mp4.group(1)})
    return cortes


def slug(s: str) -> str:
    s = re.sub(r"\(.*?\)", "", s)
    s = re.sub(r"[^A-Za-z0-9]+", "-", s.encode("ascii", "ignore").decode()).strip("-").lower()
    return s[:40] or "orador"


def download(url: str, dest: Path, log) -> None:
    if dest.exists() and dest.stat().st_size > 1_000_000:
        return
    for intento in range(4):
        try:
            data = fetch(url)
            dest.write_bytes(data)
            log(f"DESCARGADO {dest.name} {len(data) // 1_000_000} MB")
            return
        except Exception as e:  # noqa: BLE001
            log(f"REINTENTO {dest.name} ({intento + 1}): {e}")
            time.sleep(5 * (intento + 1))
    raise RuntimeError(f"no se pudo descargar {url}")


def fmt(t: float) -> str:
    h, rem = divmod(int(t), 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}"


def transcribe(model, path: Path, out_txt: Path, out_json: Path, log, **kw) -> None:
    segments, info = model.transcribe(
        str(path), language=kw.pop("language", "es"), vad_filter=True, condition_on_previous_text=False, **kw
    )
    rows = []
    with out_txt.open("w", encoding="utf-8") as f:
        for seg in segments:
            f.write(f"[{fmt(seg.start)} → {fmt(seg.end)}] {seg.text.strip()}\n")
            f.flush()
            rows.append({"start": round(seg.start, 2), "end": round(seg.end, 2), "text": seg.text.strip()})
    out_json.write_text(json.dumps({"duration": info.duration, "segments": rows}, ensure_ascii=False, indent=1), "utf-8")
    log(f"OK {out_txt.name} duración {fmt(info.duration)} · {len(rows)} segmentos")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ficha", required=True)
    ap.add_argument("--salida", required=True)
    ap.add_argument("--modelo", default="small")
    ap.add_argument("--prioridad", default="", help="ids de corte separados por comas que van primero")
    ap.add_argument("--solo", default="", help="transcribir solo estos ids (comas)")
    ap.add_argument("--cotejar", nargs=3, metavar=("ID", "INICIO", "FIN"), help="ventana en segundos con modelo medium")
    ap.add_argument("--hilos", type=int, default=4)
    args = ap.parse_args()

    out = Path(args.salida)
    (out / "mp4").mkdir(parents=True, exist_ok=True)
    logf = (out / "progress.log").open("a", encoding="utf-8")

    def log(msg: str) -> None:
        line = f"{time.strftime('%H:%M:%S')} {msg}"
        print(line, flush=True)
        logf.write(line + "\n")
        logf.flush()

    ficha_path = out / "ficha.html"
    if not ficha_path.exists():
        ficha_path.write_bytes(fetch(args.ficha))
    cortes = parse_ficha(ficha_path.read_bytes())
    (out / "cortes.json").write_text(json.dumps(cortes, ensure_ascii=False, indent=1), "utf-8")
    log(f"{len(cortes)} cortes en la ficha")

    from faster_whisper import WhisperModel  # import tardío: la descarga del modelo tarda

    if args.cotejar:
        cid, ini, fin = args.cotejar[0], float(args.cotejar[1]), float(args.cotejar[2])
        c = next((x for x in cortes if x["id"] == cid), None)
        if not c:
            log(f"corte {cid} no está en la ficha")
            return 1
        mp4 = out / "mp4" / f"{cid}.mp4"
        download(c["mp4"], mp4, log)
        model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=args.hilos)
        dest = out / "cotejo"
        dest.mkdir(exist_ok=True)
        base = f"{cid}-{int(ini)}-{int(fin)}"
        transcribe(model, mp4, dest / f"{base}.txt", dest / f"{base}.json", log, beam_size=5, clip_timestamps=[ini, fin])
        return 0

    prioridad = [x for x in args.prioridad.split(",") if x]
    solo = {x for x in args.solo.split(",") if x}
    orden = [c for c in cortes if c["id"] in prioridad]
    orden.sort(key=lambda c: prioridad.index(c["id"]))
    orden += [c for c in cortes if c["id"] not in prioridad]
    if solo:
        orden = [c for c in orden if c["id"] in solo]

    model = WhisperModel(args.modelo, device="cpu", compute_type="int8", cpu_threads=args.hilos)
    for c in orden:
        txt = out / f"{c['id']}-{slug(c['orador'])}.txt"
        if txt.exists() and txt.stat().st_size > 0 and (out / f"{c['id']}.json").exists():
            continue
        mp4 = out / "mp4" / f"{c['id']}.mp4"
        try:
            download(c["mp4"], mp4, log)
            t0 = time.time()
            log(f"TRANSCRIBIENDO {c['id']} {c['orador']}")
            transcribe(model, mp4, txt, out / f"{c['id']}.json", log, beam_size=1)
            log(f"TIEMPO {c['id']} {int(time.time() - t0)} s")
        except Exception as e:  # noqa: BLE001
            log(f"ERROR {c['id']}: {e}")
    log("FIN")
    return 0


if __name__ == "__main__":
    sys.exit(main())
