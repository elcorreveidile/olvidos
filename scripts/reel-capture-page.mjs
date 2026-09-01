// Captura genérica de UNA página de www.olvidos.es (fullPage + viewport) para los
// clips de campaña. Chromium de Playwright por el proxy, forzando TLS 1.2 (evita
// que el ECH de TLS 1.3 corte la conexión). Salta la intro del telón.
//
// Uso: PAGE_PATH=/revista OUT_NAME=revista node scripts/reel-capture-page.mjs
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.OLVIDOS_URL || "https://www.olvidos.es";
const PATH = process.env.PAGE_PATH || "/revista";
const NAME = process.env.OUT_NAME || "page";
const OUT = process.env.RAW_DIR || "/home/user/olvidos/footage-reel/raw";
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const PROXY = process.env.HTTPS_PROXY || "http://127.0.0.1:38665";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXEC,
  proxy: { server: PROXY },
  args: [
    "--no-sandbox", "--disable-dev-shm-usage", "--ssl-version-max=tls1.2",
    "--disable-quic", "--disable-background-networking", "--disable-component-update",
    "--disable-domain-reliability", "--disable-sync", "--no-first-run",
    "--disable-features=EncryptedClientHello,Translate,OptimizationHints,MediaRouter",
  ],
});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true,
});
await ctx.addInitScript(() => { try { localStorage.setItem("olvidos-curtain-skip", "1"); } catch {} });
await ctx.route("**/*", (route) => {
  const h = (() => { try { return new URL(route.request().url()).hostname; } catch { return ""; } })();
  if (/(^|\.)google\.com$|googletagmanager|google-analytics|gstatic\.com$|doubleclick|mtalk\.google/.test(h)) return route.abort();
  return route.continue();
});

const page = await ctx.newPage();
await page.goto(BASE + PATH, { waitUntil: "domcontentloaded", timeout: 45000 });
await sleep(2500);
// dispara la carga perezosa
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 650) { await page.evaluate((yy) => scrollTo(0, yy), y); await sleep(220); }
await page.evaluate(() => scrollTo(0, 0));
await Promise.race([
  page.evaluate(async () => {
    await Promise.all([...document.querySelectorAll("img")].map((i) => i.complete ? 0 :
      new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })));
    if (document.fonts?.ready) await document.fonts.ready;
  }),
  sleep(9000),
]);
await sleep(600);

const info = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, title: document.title }));
await page.screenshot({ path: join(OUT, `${NAME}-viewport.png`) });
await page.screenshot({ path: join(OUT, `${NAME}-full.png`), fullPage: true });
writeFileSync(join(OUT, `${NAME}-meta.json`), JSON.stringify({ path: PATH, ...info }, null, 2));
console.log(`${NAME}: "${info.title}" fullHeight=${info.h}`);
await ctx.close(); await browser.close();
