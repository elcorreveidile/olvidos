// Build de un reel a partir de fotos (motor reel-foto.template.html). Inyecta
// fuentes de marca + las imágenes de RAW_DIR (jpg/png) + escenas + META, y
// codifica el mp4 con h264-mp4-encoder (WASM).
//   RAW_DIR=footage-vida/jpg SCENES=scripts/scenes-vida-teaser.json \
//   OUT=footage-vida/teaser.mp4 PORTADA=footage-vida/portada-teaser.png \
//   [PROBE=1 PROBE_TIMES=...] node scripts/reel-foto-build.mjs
import { chromium } from "playwright";
import HME from "h264-mp4-encoder";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { createRequire } from "node:module";
const require = createRequire("/home/user/olvidos/package.json");
const sharp = require("sharp");

const ROOT = "/home/user/olvidos";
const RAW = process.env.RAW_DIR || join(ROOT, "footage-vida/jpg");
const TEMPLATE = process.env.TEMPLATE || join(ROOT, "scripts/reel-foto.template.html");
const SCENES = process.env.SCENES;
const OUT = process.env.OUT || join(ROOT, "footage-vida/reel.mp4");
const PORTADA = process.env.PORTADA || join(ROOT, "footage-vida/portada.png");
const PORTADA_T = Number(process.env.PORTADA_T || 3.0);
const FPS = Number(process.env.FPS || 30);
const QP = Number(process.env.QP || 22);
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const PROBE = process.env.PROBE === "1";
const OUTDIR = join(ROOT, "footage-vida");
mkdirSync(join(OUTDIR, "probe"), { recursive: true });

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

const scenesFile = JSON.parse(readFileSync(SCENES, "utf8"));
const META = scenesFile.meta || {};
const SCENE_LIST = scenesFile.scenes || [];

// Sólo se incrustan las imágenes que usan las escenas (evita mp4/html gigantes)
const used = new Set(SCENE_LIST.map((s) => s.img).filter(Boolean));
const ASSETS = {};
for (const f of readdirSync(RAW).filter((f) => /\.(jpg|jpeg|png)$/i.test(f))) {
  if (!used.has(f)) continue;
  const m = await sharp(join(RAW, f)).metadata();
  ASSETS[f] = { src: b64(join(RAW, f), f.toLowerCase().endsWith("png") ? "image/png" : "image/jpeg"), w: m.width, h: m.height };
}
console.log("escenas:", SCENE_LIST.length, "| imágenes:", Object.keys(ASSETS).length);

let html = readFileSync(TEMPLATE, "utf8");
html = html.replace("/* __FONT_CSS__ */", FONT_CSS);
html = html.replace("/* __ASSETS_INJECT__ */", "\nwindow.__ASSETS__ = " + JSON.stringify(ASSETS) + ";");
html = html.replace("/* __SCENES_INJECT__ */", "\nwindow.__SCENES__ = " + JSON.stringify(SCENE_LIST) + ";");
html = html.replace("/* __META_INJECT__ */", "\nwindow.__META__ = " + JSON.stringify(META) + ";");
const reelPath = join(OUTDIR, basename(OUT).replace(/\.mp4$/, ".html"));
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
console.log("duración", DURATION, "ms @", FPS, "fps");
const shot = () => page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1080, height: 1920 } });

if (PROBE) {
  const times = (process.env.PROBE_TIMES || "500,2500,4500,6500,8500,10500,12500,14500").split(",").map(Number);
  for (const t of times) {
    await page.evaluate((tt) => window.renderAt(tt), t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    writeFileSync(join(OUTDIR, "probe", `p${String(t).padStart(5, "0")}.png`), await shot());
  }
  console.log("PROBE listo ->", join(OUTDIR, "probe")); await browser.close(); process.exit(0);
}

const enc = await HME.createH264MP4Encoder();
enc.width = 1080; enc.height = 1920; enc.frameRate = FPS; enc.quantizationParameter = QP;
enc.speed = 4; enc.groupOfPictures = FPS * 2; enc.initialize();
const total = Math.round((DURATION / 1000) * FPS);
let portadaBuf = null; const pFrame = Math.round(PORTADA_T * FPS);
for (let f = 0; f < total; f++) {
  const t = (f / FPS) * 1000;
  await page.evaluate((tt) => window.renderAt(tt), t);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
  const png = await shot();
  const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  enc.addFrameRgba(new Uint8Array(data.buffer, data.byteOffset, data.length));
  if (f === pFrame) portadaBuf = png;
  if (f % 30 === 0) console.log(`frame ${f}/${total} (t=${(t / 1000).toFixed(1)}s)`);
}
enc.finalize();
writeFileSync(OUT, Buffer.from(enc.FS.readFile(enc.outputFilename)));
enc.delete();
if (portadaBuf) writeFileSync(PORTADA, portadaBuf);
console.log(`OK ${OUT} + ${PORTADA} (${total} frames)`);
await browser.close();
