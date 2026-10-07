// Captura metraje REAL de www.olvidos.es para el reel: pocas tomas de alta
// calidad (fullPage + viewport) de home y de un artículo real. El telón se
// recrea luego en el compositor con el CSS de marca (no se captura en vivo,
// porque hacerlo frame a frame contra el proxy es lentísimo).
//
// Chromium de Playwright vía el proxy del entorno, forzando TLS 1.2 (evita que
// el ECH de TLS 1.3 haga que el proxy corte la conexión). Se bloquea el ruido
// de fondo (Google) para acelerar y estabilizar.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.OLVIDOS_URL || "https://www.olvidos.es";
const ARTICLE = process.env.ARTICLE_PATH ||
  "/articulos/cuarenta-anos-de-palabras-para-un-tiempo-de-silencio";
const OUT = process.env.RAW_DIR || "/home/user/olvidos/footage-reel/raw";
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const PROXY = process.env.HTTPS_PROXY || "http://127.0.0.1:38665";
const CURTAIN_SKIP_KEY = "olvidos-curtain-skip";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXEC,
  proxy: { server: PROXY },
  args: [
    "--no-sandbox", "--disable-dev-shm-usage",
    "--ssl-version-max=tls1.2",
    "--disable-quic", "--disable-background-networking",
    "--disable-component-update", "--disable-domain-reliability",
    "--disable-sync", "--no-first-run",
    "--disable-features=EncryptedClientHello,Translate,OptimizationHints,MediaRouter",
  ],
});

const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  ignoreHTTPSErrors: true,
});
// Salta la intro del telón (lo recreamos en el compositor) para que las tomas
// fullPage no lleven el overlay encima.
await ctx.addInitScript((key) => {
  try { window.localStorage.setItem(key, "1"); } catch {}
}, CURTAIN_SKIP_KEY);
// Bloquea hosts de terceros que sólo añaden ruido/latencia (analytics, Google).
await ctx.route("**/*", (route) => {
  const host = (() => { try { return new URL(route.request().url()).hostname; } catch { return ""; } })();
  const noise = /(^|\.)google\.com$|googletagmanager|google-analytics|gstatic\.com$|doubleclick|mtalk\.google/;
  if (noise.test(host)) return route.abort();
  return route.continue();
});

async function loadAndSettle(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await sleep(2500);
  // Provoca la carga perezosa recorriendo la página en pasos y volviendo arriba.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = 844;
  for (let y = 0; y < h; y += Math.floor(vh * 0.8)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  // Espera a imágenes y fuentes, acotado.
  await Promise.race([
    page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll("img"));
      await Promise.all(imgs.map((img) => (img.complete)
        ? Promise.resolve()
        : new Promise((res) => { img.addEventListener("load", res, { once: true }); img.addEventListener("error", res, { once: true }); })));
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
    }),
    sleep(8000),
  ]);
  await sleep(600);
}

const page = await ctx.newPage();

// -------- HOME --------
await loadAndSettle(page, BASE + "/");
const homeInfo = await page.evaluate(() => ({
  fullHeight: document.documentElement.scrollHeight,
  title: document.title,
}));
await page.screenshot({ path: join(OUT, "home-viewport.png") });
await page.screenshot({ path: join(OUT, "home-full.png"), fullPage: true });
console.log(`HOME "${homeInfo.title}" fullHeight=${homeInfo.fullHeight}`);

// -------- ARTÍCULO --------
await loadAndSettle(page, BASE + ARTICLE);
const artInfo = await page.evaluate(() => ({
  fullHeight: document.documentElement.scrollHeight,
  title: document.title,
}));
await page.screenshot({ path: join(OUT, "article-viewport.png") });
await page.screenshot({ path: join(OUT, "article-full.png"), fullPage: true });
console.log(`ARTICLE "${artInfo.title}" fullHeight=${artInfo.fullHeight}`);

writeFileSync(join(OUT, "capture-meta.json"), JSON.stringify({
  base: BASE, article: ARTICLE,
  home: { ...homeInfo, deviceScaleFactor: 2, cssViewport: { w: 390, h: 844 } },
  articleInfo: artInfo,
}, null, 2));

await ctx.close();
await browser.close();
console.log("Captura completa ->", OUT);
