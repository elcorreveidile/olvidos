// Valida el reel.mp4 por ESTRUCTURA de cajas (Chromium open-source no decodifica
// H.264, así que no se valida reproduciéndolo). Comprueba: ftyp/mdat/moov,
// muestra de vídeo avc1 + avcC, dimensiones 1080x1920 y frameRate/duración.
import { readFileSync } from "node:fs";

const path = process.argv[2] || "/home/user/olvidos/footage-reel/reel.mp4";
const d = readFileSync(path);
const u32 = (o) => d.readUInt32BE(o);
const type = (o) => d.toString("latin1", o, o + 4);

// Recorre cajas a un nivel dado (walk recursivo por contenedores conocidos)
const CONTAINERS = new Set(["moov","trak","mdia","minf","stbl","dinf","edts","mvex"]);
function walk(start, end, depth, out) {
  let i = start;
  while (i + 8 <= end) {
    let size = u32(i);
    const t = type(i + 4);
    let hdr = 8;
    if (size === 1) { size = Number(d.readBigUInt64BE(i + 8)); hdr = 16; }
    if (size < 8) break;
    out.push({ t, size, off: i, depth });
    if (CONTAINERS.has(t)) walk(i + hdr, i + size, depth + 1, out);
    i += size;
  }
}
const boxes = [];
walk(0, d.length, 0, boxes);

// stsd y avc1 son cajas "especiales" (sample description / sample entry) que el
// walker genérico no abre; localizamos sus hijos (avc1, avcC) por su fourCC.
function findFourCC(cc, validate) {
  let from = 0, idx;
  const needle = Buffer.from(cc, "latin1");
  while ((idx = d.indexOf(needle, from)) !== -1) {
    // el fourCC de una caja va precedido de su tamaño (4 bytes): offset caja = idx-4
    const off = idx - 4;
    if (off >= 0 && (!validate || validate(off))) return off;
    from = idx + 1;
  }
  return -1;
}
// avc1 aparece también como "brand" en ftyp: aceptamos solo la ocurrencia cuyo
// sample-entry tiene dimensiones plausibles (16..8192).
const avc1Off = findFourCC("avc1", (off) => {
  const wo = off + 8 + 6 + 2 + 16;
  if (wo + 4 > d.length) return false;
  const w = d.readUInt16BE(wo), h = d.readUInt16BE(wo + 2);
  return w >= 16 && w <= 8192 && h >= 16 && h <= 8192;
});
const avcCOff = findFourCC("avcC");
if (avc1Off >= 0) boxes.push({ t: "avc1", size: u32(avc1Off), off: avc1Off, depth: 99 });
if (avcCOff >= 0) boxes.push({ t: "avcC", size: u32(avcCOff), off: avcCOff, depth: 99 });

const top = boxes.filter((b) => b.depth === 0).map((b) => b.t);
const has = (t) => boxes.some((b) => b.t === t);

// tkhd (dimensiones): width/height en 16.16 fixed al final de la caja
function tkhdDims() {
  const b = boxes.find((x) => x.t === "tkhd"); if (!b) return null;
  const ver = d[b.off + 8];
  const base = b.off + (ver === 1 ? 8 + 32 : 8 + 20); // hasta antes de layer... simplificamos leyendo los últimos 8 bytes
  const w = u32(b.off + b.size - 8) / 65536;
  const h = u32(b.off + b.size - 4) / 65536;
  return { w, h };
}
// stsd -> avc1 -> avcC ; dimensiones también en avc1 (16-bit width/height)
function avc1Dims() {
  const b = boxes.find((x) => x.t === "avc1"); if (!b) return null;
  // avc1: 8 (box) + 6 reserved + 2 dref idx + 16 predefined/reserved + width(2)+height(2)
  const wo = b.off + 8 + 6 + 2 + 16;
  const w = d.readUInt16BE(wo), h = d.readUInt16BE(wo + 2);
  return { w, h };
}
// mvhd -> timescale + duration
function mvhdInfo() {
  const b = boxes.find((x) => x.t === "mvhd"); if (!b) return null;
  const ver = d[b.off + 8];
  if (ver === 1) {
    const ts = u32(b.off + 8 + 4 + 8 + 8);
    const dur = Number(d.readBigUInt64BE(b.off + 8 + 4 + 8 + 8 + 4));
    return { timescale: ts, duration: dur, seconds: dur / ts };
  } else {
    const ts = u32(b.off + 8 + 4 + 4 + 4);
    const dur = u32(b.off + 8 + 4 + 4 + 4 + 4);
    return { timescale: ts, duration: dur, seconds: dur / ts };
  }
}

const checks = [];
const req = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });
req("ftyp presente y primero", top[0] === "ftyp");
req("mdat presente", has("mdat"));
req("moov presente", has("moov"));
req("muestra de vídeo avc1", has("avc1"));
req("config avcC (SPS/PPS)", has("avcC"));
const aDim = avc1Dims();
req("avc1 = 1080x1920", aDim && aDim.w === 1080 && aDim.h === 1920, JSON.stringify(aDim));
const tDim = tkhdDims();
req("tkhd = 1080x1920", tDim && Math.round(tDim.w) === 1080 && Math.round(tDim.h) === 1920, JSON.stringify(tDim));
const mv = mvhdInfo();
req("duración 8–30s", mv && mv.seconds > 8 && mv.seconds < 30, mv && (mv.seconds.toFixed(2) + "s"));
req("tamaño de fichero > 200 KB", d.length > 200000, (d.length / 1e6).toFixed(2) + " MB");

console.log("Cajas top-level:", top.join(" "));
let allOk = true;
for (const c of checks) { console.log(`${c.ok ? "✅" : "❌"} ${c.name}${c.detail ? "  (" + c.detail + ")" : ""}`); if (!c.ok) allOk = false; }
console.log(allOk ? "\nVALIDACIÓN OK" : "\nVALIDACIÓN FALLIDA");
process.exit(allOk ? 0 : 1);
