// Captura de carruseles de campaña: renderiza una plantilla con N slides
// (cada uno .slide de 1080x1350) inyectando las fuentes de marca y exporta
// un PNG por slide a alta resolución (deviceScaleFactor 2 -> 2160x2700), listo
// para publicar en Instagram (formato 4:5). No hay animación: son slides fijos.
//
// Uso:
//   TEMPLATE=scripts/carousel-formato.template.html SLUG=formato \
//   OUTDIR=footage-carrusel node scripts/carousel-capture.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename, resolve } from "node:path";

const ROOT = "/home/user/olvidos";
const TEMPLATE = resolve(ROOT, process.env.TEMPLATE || join(ROOT, "scripts/carousel-formato.template.html"));
const SLUG = process.env.SLUG || basename(TEMPLATE).replace(".template.html", "").replace("carousel-", "");
const OUTDIR = resolve(ROOT, process.env.OUTDIR || join(ROOT, "footage-carrusel"));
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const DSF = Number(process.env.DSF || 2);
mkdirSync(OUTDIR, { recursive: true });

const b64 = (p, mime) => `data:${mime};base64,` + readFileSync(p).toString("base64");

// Fuentes de marca (mismas woff2 locales que los reels)
const F = join(ROOT, "public/fonts");
const face = (fam, w, s, file) =>
  `@font-face{font-family:"${fam}";font-weight:${w};font-style:${s};font-display:block;src:url(${b64(join(F, file), "font/woff2")}) format("woff2");}`;
const FONT_CSS = [
  face("LibreFranklin", 400, "normal", "libre-franklin-400-normal-latin.woff2"),
  face("LibreFranklin", 600, "normal", "libre-franklin-600-normal-latin.woff2"),
  face("LibreFranklin", 700, "normal", "libre-franklin-700-normal-latin.woff2"),
  face("LibreFranklin", 800, "normal", "libre-franklin-800-normal-latin.woff2"),
  face("LibreFranklin", 900, "normal", "libre-franklin-900-normal-latin.woff2"),
  face("CrimsonText", 400, "normal", "crimson-text-400-normal-latin.woff2"),
  face("CrimsonText", 400, "italic", "crimson-text-400-italic-latin.woff2"),
].join("\n");

let html = readFileSync(TEMPLATE, "utf8");
html = html.replace("/* __FONT_CSS__ */", FONT_CSS);
const outHtml = join(OUTDIR, `carousel-${SLUG}.html`);
writeFileSync(outHtml, html);

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb", "--hide-scrollbars"],
});
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: DSF });
const page = await ctx.newPage();
await page.goto("file://" + outHtml, { waitUntil: "load" });
await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

const slides = await page.$$(".slide");
if (!slides.length) { console.error("No hay .slide en la plantilla"); process.exit(1); }
let i = 0;
for (const s of slides) {
  i++;
  const name = join(OUTDIR, `${SLUG}-${String(i).padStart(2, "0")}.png`);
  await s.screenshot({ type: "png", path: name });
  console.log("slide", i, "->", name);
}
console.log(`OK ${SLUG}: ${slides.length} slides en ${OUTDIR}`);
await browser.close();
