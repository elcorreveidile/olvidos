// Variante de reel-clip-build.mjs que codifica con el ffmpeg nativo de
// @ffmpeg-installer/ffmpeg (libx264) en vez del codificador WASM, que a
// 1080x1920 tardaba ~10 s por fotograma. Misma interfaz: inyecta las fuentes de
// marca y las PNG de RAW_DIR en la plantilla (window.__ASSETS__), renderiza
// frame a frame con Chromium (window.renderAt) y envía RGBA crudo a ffmpeg.
//
//   RAW_DIR=<carpeta con PNG> TEMPLATE=scripts/marketing/<reel>.template.html \
//   OUT=footage-reel/<reel>.mp4 PORTADA=footage-reel/<portada>.png PORTADA_T=1.6 \
//   [CRF=20] [FPS=30] node scripts/marketing/reel-ffmpeg-build.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename, dirname } from "node:path";

const require = createRequire(import.meta.url);
const FFMPEG = require("@ffmpeg-installer/ffmpeg").path;

const ROOT = "/home/user/olvidos";
const RAW = process.env.RAW_DIR || join(ROOT, "footage-reel/raw");
const TEMPLATE = process.env.TEMPLATE;
const OUT = process.env.OUT || join(ROOT, "footage-reel/clip.mp4");
const PORTADA = process.env.PORTADA || join(ROOT, "footage-reel/portada-clip.png");
const PORTADA_T = Number(process.env.PORTADA_T || 1.5);
const FPS = Number(process.env.FPS || 30);
const CRF = Number(process.env.CRF || 20);
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
if (!TEMPLATE) { console.error("Falta TEMPLATE"); process.exit(1); }
mkdirSync(dirname(OUT), { recursive: true });

const b64 = (p, mime) => `data:${mime};base64,` + readFileSync(p).toString("base64");
const F = join(ROOT, "public/fonts");
const face = (fam, w, s, file) =>
  `@font-face{font-family:"${fam}";font-weight:${w};font-style:${s};font-display:block;src:url(${b64(join(F, file), "font/woff2")}) format("woff2");}`;
const FONT_CSS = [
  face("LibreFranklin", 400, "normal", "libre-franklin-400-normal-latin.woff2"),
  face("LibreFranklin", 700, "normal", "libre-franklin-700-normal-latin.woff2"),
  face("LibreFranklin", 800, "normal", "libre-franklin-800-normal-latin.woff2"),
  face("LibreFranklin", 900, "normal", "libre-franklin-900-normal-latin.woff2"),
  face("CrimsonText", 400, "normal", "crimson-text-400-normal-latin.woff2"),
  face("CrimsonText", 400, "italic", "crimson-text-400-italic-latin.woff2"),
].join("\n");

const ASSETS = {};
for (const f of readdirSync(RAW).filter((f) => f.endsWith(".png"))) {
  const m = await sharp(join(RAW, f)).metadata();
  ASSETS[f] = { src: b64(join(RAW, f), "image/png"), w: m.width, h: m.height };
}
let html = readFileSync(TEMPLATE, "utf8");
html = html.replace("/* __FONT_CSS__ */", FONT_CSS);
html = html.replace("/* __ASSETS_INJECT__ */", "\nwindow.__ASSETS__ = " + JSON.stringify(ASSETS) + ";");
const reelPath = join(dirname(OUT), basename(TEMPLATE).replace(".template.html", ".html"));
writeFileSync(reelPath, html);

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
  .then((c) => c.newPage());
await page.goto("file://" + reelPath, { waitUntil: "load" });
await page.waitForFunction(() => window.__READY__ === true, { timeout: 20000 });
await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
const DURATION = await page.evaluate(() => window.__DURATION_MS__);
const total = Math.round((DURATION / 1000) * FPS);
console.log(`duración ${DURATION} ms @ ${FPS} fps → ${total} fotogramas; ffmpeg ${FFMPEG}`);

const ff = spawn(FFMPEG, [
  "-hide_banner", "-loglevel", "error", "-y",
  "-f", "rawvideo", "-pix_fmt", "rgba", "-s", "1080x1920", "-r", String(FPS), "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", String(CRF), "-preset", "medium",
  "-profile:v", "high", "-level", "4.1", "-g", String(FPS * 2), "-movflags", "+faststart",
  OUT,
], { stdio: ["pipe", "inherit", "inherit"] });
const ffDone = new Promise((res, rej) => ff.on("close", (code) => (code === 0 ? res() : rej(new Error("ffmpeg salió con " + code)))));
const write = (buf) => new Promise((res) => (ff.stdin.write(buf) ? res() : ff.stdin.once("drain", res)));

const pFrame = Math.round(PORTADA_T * FPS);
const t0 = Date.now();
for (let f = 0; f < total; f++) {
  const t = (f / FPS) * 1000;
  await page.evaluate((tt) => window.renderAt(tt), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
  const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  await write(data);
  if (f === pFrame) writeFileSync(PORTADA, png);
  if (f % 60 === 0) console.log(`frame ${f}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
ff.stdin.end();
await ffDone;
await browser.close();
console.log(`OK ${OUT} + ${PORTADA} (${total} fotogramas en ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
