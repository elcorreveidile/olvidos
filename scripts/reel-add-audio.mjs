// Incrusta una pista de música en el reel.mp4. El VÍDEO se copia TAL CUAL
// (-c:v copy: sin recodificar, se preserva el H.264 que generó el pipeline con
// h264-mp4-encoder) y solo se añade una pista de AUDIO AAC. Recorta a la duración
// del vídeo y aplica fundidos de entrada/salida.
//
// Usa un ffmpeg nativo instalado vía npm (@ffmpeg-installer/ffmpeg): el binario
// viaja dentro del paquete, sin descargas externas. (El ffmpeg de Playwright está
// compilado sin mp4/aac, por eso no sirve.)
//
// Uso:
//   node scripts/reel-add-audio.mjs <musica> [salida.mp4] \
//        [--offset S] [--gain dB] [--fadein S] [--fadeout S] [--video reel.mp4] [--loop]
//   --offset  : segundos que se saltan al inicio de la música (alinear el clímax)
//   --gain    : ganancia en dB (p. ej. -3 baja el volumen)
//   --fadein  : fundido de entrada (def. 0.3)
//   --fadeout : fundido de salida (def. 0.9)
//   --loop    : si la música es más corta que el vídeo, la repite en bucle
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path;

// --- args ---
const argv = process.argv.slice(2);
const positional = [];
const opt = { offset: 0, gain: 0, fadein: 0.3, fadeout: 0.9, loop: false,
  video: "/home/user/olvidos/footage-reel/reel.mp4" };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--offset") opt.offset = parseFloat(argv[++i]);
  else if (a === "--gain") opt.gain = parseFloat(argv[++i]);
  else if (a === "--fadein") opt.fadein = parseFloat(argv[++i]);
  else if (a === "--fadeout") opt.fadeout = parseFloat(argv[++i]);
  else if (a === "--video") opt.video = argv[++i];
  else if (a === "--loop") opt.loop = true;
  else positional.push(a);
}
const music = positional[0];
const outPath = positional[1] || "/home/user/olvidos/footage-reel/reel-con-musica.mp4";
if (!music) { console.error("Falta la ruta de la música. Uso: node scripts/reel-add-audio.mjs <musica> [salida.mp4]"); process.exit(2); }

// --- duración exacta del vídeo (mvhd) para recortar ---
function videoSeconds(path) {
  const d = readFileSync(path);
  const idx = d.indexOf(Buffer.from("mvhd"));
  if (idx < 4) return null;
  const off = idx - 4, ver = d[off + 8];
  if (ver === 1) { const ts = d.readUInt32BE(off + 20); const dur = Number(d.readBigUInt64BE(off + 24)); return dur / ts; }
  const ts = d.readUInt32BE(off + 20); const dur = d.readUInt32BE(off + 24); return dur / ts;
}
const dur = videoSeconds(opt.video);
if (!dur) { console.error("No pude leer la duración del vídeo:", opt.video); process.exit(2); }
const fadeOutStart = Math.max(0, dur - opt.fadeout);

const af = [
  `afade=t=in:st=0:d=${opt.fadein}`,
  `afade=t=out:st=${fadeOutStart.toFixed(3)}:d=${opt.fadeout}`,
  opt.gain !== 0 ? `volume=${opt.gain}dB` : null,
].filter(Boolean).join(",");

const args = [
  "-y",
  ...(opt.offset > 0 ? ["-ss", String(opt.offset)] : []),
  ...(opt.loop ? ["-stream_loop", "-1"] : []),
  "-i", music,             // 0 = audio
  "-i", opt.video,         // 1 = vídeo
  "-map", "1:v:0", "-map", "0:a:0",
  "-c:v", "copy",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-af", af,
  "-t", dur.toFixed(3),
  "-movflags", "+faststart",
  outPath,
];

console.log(`vídeo ${opt.video} (${dur.toFixed(2)}s) · música ${music}`);
console.log("offset", opt.offset + "s", "gain", opt.gain + "dB", "fade", opt.fadein + "/" + opt.fadeout + "s", "loop", opt.loop);
try {
  execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "pipe"] });
} catch (e) {
  const err = (e.stderr ? e.stderr.toString() : "").split("\n").filter(Boolean).slice(-12).join("\n");
  console.error("ffmpeg falló:\n" + err);
  process.exit(1);
}
const outSize = readFileSync(outPath).length;
console.log(`OK -> ${outPath} (${(outSize / 1e6).toFixed(2)} MB)`);
