// Compositor determinista del reel: inyecta fuentes de marca + capturas REALES
// en la plantilla, renderiza frame a frame con Chromium (window.renderAt) y
// codifica el mp4 con h264-mp4-encoder (WASM). Chromium open-source NO decodifica
// H.264: el mp4 se valida por estructura de cajas en un script aparte.
import { chromium } from "playwright";
import sharp from "sharp";
import HME from "h264-mp4-encoder";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = "/home/user/olvidos";
const RAW = process.env.RAW_DIR || join(ROOT, "footage-reel/raw");
const OUTDIR = process.env.OUT_DIR || join(ROOT, "footage-reel");
const FPS = Number(process.env.FPS || 30);
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const PROBE = process.env.PROBE === "1";
mkdirSync(join(OUTDIR, "probe"), { recursive: true });

const b64 = (p, mime) => `data:${mime};base64,` + readFileSync(p).toString("base64");

// ---- Fuentes de marca como @font-face data-URI ----
const F = join(ROOT, "public/fonts");
const face = (family, weight, style, file) =>
  `@font-face{font-family:"${family}";font-weight:${weight};font-style:${style};font-display:block;src:url(${b64(join(F, file), "font/woff2")}) format("woff2");}`;
const FONT_CSS = [
  face("LibreFranklin", 400, "normal", "libre-franklin-400-normal-latin.woff2"),
  face("LibreFranklin", 700, "normal", "libre-franklin-700-normal-latin.woff2"),
  face("LibreFranklin", 800, "normal", "libre-franklin-800-normal-latin.woff2"),
  face("LibreFranklin", 900, "normal", "libre-franklin-900-normal-latin.woff2"),
  face("CrimsonText", 400, "normal", "crimson-text-400-normal-latin.woff2"),
  face("CrimsonText", 400, "italic", "crimson-text-400-italic-latin.woff2"),
].join("\n");

// ---- Capturas reales + dimensiones nativas (device px) ----
async function dims(p) { const m = await sharp(p).metadata(); return { w: m.width, h: m.height }; }
const homeFull = await dims(join(RAW, "home-full.png"));
const articleFull = await dims(join(RAW, "article-full.png"));
const ASSETS = {
  homeFull: { src: b64(join(RAW, "home-full.png"), "image/png"), w: homeFull.w, h: homeFull.h },
  articleFull: { src: b64(join(RAW, "article-full.png"), "image/png"), w: articleFull.w, h: articleFull.h },
};
console.log("home-full", homeFull, "article-full", articleFull);

// ---- Ensamblar reel.html ----
let html = readFileSync(join(ROOT, "scripts/reel.template.html"), "utf8");
html = html.replace("/* __FONT_CSS__ */", FONT_CSS);
html = html.replace("/* __ASSETS_INJECT__ */",
  "\nwindow.__ASSETS__ = " + JSON.stringify(ASSETS) + ";");
const reelPath = join(OUTDIR, "reel.html");
writeFileSync(reelPath, html);
console.log("reel.html escrito:", (html.length / 1e6).toFixed(1), "MB");

// ---- Render con Chromium ----
const browser = await chromium.launch({
  executablePath: EXEC,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const page = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
}).then((c) => c.newPage());

await page.goto("file://" + reelPath, { waitUntil: "load" });
await page.waitForFunction(() => window.__READY__ === true, { timeout: 20000 });
await page.evaluate(async () => { if (document.fonts && document.fonts.ready) await document.fonts.ready; });
const DURATION = await page.evaluate(() => window.__DURATION_MS__);
console.log("duración", DURATION, "ms @", FPS, "fps");

const shot = async () => await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1080, height: 1920 } });

if (PROBE) {
  // Renderiza fotogramas clave para inspección visual.
  const times = (process.env.PROBE_TIMES || "0,900,2000,3200,4300,6000,8000,10000,12000,14000,16000,18200,19600")
    .split(",").map(Number);
  for (const t of times) {
    await page.evaluate((tt) => window.renderAt(tt), t);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const buf = await shot();
    writeFileSync(join(OUTDIR, "probe", `t${String(t).padStart(5, "0")}.png`), buf);
  }
  console.log("PROBE listo ->", join(OUTDIR, "probe"));
  await browser.close();
  process.exit(0);
}

// ---- Codificación ----
const enc = await HME.createH264MP4Encoder();
enc.width = 1080; enc.height = 1920; enc.frameRate = FPS;
enc.quantizationParameter = Number(process.env.QP || 20); enc.speed = 4; enc.groupOfPictures = FPS * 2;
enc.initialize();

const total = Math.round((DURATION / 1000) * FPS);
let portadaBuf = null;
const portadaFrame = Math.round((3.4) * FPS); // telón medio-abierto
for (let f = 0; f < total; f++) {
  const t = (f / FPS) * 1000;
  await page.evaluate((tt) => window.renderAt(tt), t);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));
  const png = await shot();
  const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  enc.addFrameRgba(new Uint8Array(data.buffer, data.byteOffset, data.length));
  if (f === portadaFrame) portadaBuf = png;
  if (f % 30 === 0) console.log(`frame ${f}/${total} (t=${(t/1000).toFixed(1)}s)`);
}
enc.finalize();
const mp4 = enc.FS.readFile(enc.outputFilename);
writeFileSync(join(OUTDIR, "reel.mp4"), Buffer.from(mp4));
enc.delete();
if (portadaBuf) writeFileSync(join(OUTDIR, "portada.png"), portadaBuf);
console.log(`OK reel.mp4 (${(mp4.length/1e6).toFixed(2)} MB, ${total} frames) + portada.png`);
await browser.close();
