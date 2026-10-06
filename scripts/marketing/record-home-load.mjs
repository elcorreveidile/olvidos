// Graba la carga de la home de Olvidos para un reel.
// Contexto NUEVO y sin caché, viewport móvil 390x844 @2x, navegación waitUntil:'commit',
// y un screenshot del viewport cada ~90 ms durante ~5 s desde el commit de navegación.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const URL = process.env.TARGET_URL || "http://localhost:3000/";
const OUT = process.env.OUT_DIR || join(process.cwd(), "footage-olvidos");
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const INTERVAL_MS = 90;
const DURATION_MS = Number(process.env.DURATION_MS || 5300); // ventana de captura
// Si SKIP_INTRO=1, se siembra el flag de localStorage que desactiva la intro
// del telón (mismo key que usa el botón "No mostrar la próxima vez").
const SKIP_INTRO = process.env.SKIP_INTRO === "1";
const CURTAIN_SKIP_KEY = "olvidos-curtain-skip";

const pad3 = (n) => String(n).padStart(3, "0");
const pad5 = (n) => String(n).padStart(5, "0");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

// Contexto NUEVO, sin permisos de caché de servicio, viewport móvil @2x.
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  bypassCSP: true,
  serviceWorkers: "block",
});
// Siembra el flag que desactiva la intro del telón ANTES de cargar cualquier
// documento del origen, para que la home pinte directamente sin telón ni botón.
if (SKIP_INTRO) {
  await context.addInitScript((key) => {
    try {
      window.localStorage.setItem(key, "1");
    } catch {
      /* localStorage no disponible: se ignora */
    }
  }, CURTAIN_SKIP_KEY);
}

// Desactiva la caché HTTP a nivel de red para asegurar "metraje real" desde cero.
await context.route("**/*", (route) => {
  const h = { ...route.request().headers(), "cache-control": "no-cache", pragma: "no-cache" };
  route.continue({ headers: h });
});

const page = await context.newPage();

const manifest = [];
let stop = false;

// t0 = inicio de la navegación. Arrancamos el bucle de capturas ANTES de esperar
// la navegación para captar la pantalla en blanco (about:blank) del fotograma 0.
// El commit ocurre pocos ms después (se anota en el manifest como commitDelayMs).
let t0 = null;

// Bucle de captura: dispara fotogramas en instantes objetivo relativos a t0.
async function captureLoop() {
  while (t0 === null && !stop) await sleep(1);
  if (stop) return;

  let i = 1;
  while (!stop) {
    const targetMs = i * INTERVAL_MS;
    if (targetMs > DURATION_MS) break;
    const targetAbs = t0 + targetMs;
    const wait = targetAbs - Date.now();
    if (wait > 0) await sleep(wait);

    const realMs = Math.round(Date.now() - t0);
    const name = `f${pad3(i)}_${pad5(targetMs)}ms.png`;
    try {
      await page.screenshot({ path: join(OUT, name), animations: "allow" });
      manifest.push({ frame: i, file: name, scheduledMs: targetMs, actualMs: realMs });
    } catch (e) {
      manifest.push({ frame: i, file: name, scheduledMs: targetMs, actualMs: realMs, error: String(e.message || e) });
    }
    i++;
  }
}

// Fotograma 0: pantalla en blanco real (about:blank) antes de navegar.
await page.screenshot({ path: join(OUT, `f000_00000ms.png`), animations: "allow" });
manifest.push({ frame: 0, file: "f000_00000ms.png", scheduledMs: 0, actualMs: 0, blank: true });

const loop = captureLoop();

// Navegación con waitUntil:'commit'. Marcamos t0 = inicio de navegación y
// lanzamos goto SIN esperar, para que el bucle capture desde justo tras la
// pantalla en blanco. El commit ocurre pocos ms después.
const navStart = Date.now();
t0 = navStart;
const nav = page.goto(URL, { waitUntil: "commit", timeout: 30000 });
await nav;
const commitDelay = Date.now() - navStart;

// Deja correr el bucle hasta cubrir la ventana completa.
await sleep(DURATION_MS + 300);
stop = true;
await loop;

// La home ya cargada: espera a que el telón (intro) desaparezca y a red inactiva.
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
try {
  await page.waitForSelector('[aria-label="Bienvenida a Olvidos de Granada"]', { state: "detached", timeout: 8000 });
} catch {}
await sleep(400);

await page.screenshot({ path: join(OUT, "home-loaded-viewport.png"), animations: "allow" });
await page.screenshot({ path: join(OUT, "home-loaded-fullpage.png"), fullPage: true, animations: "allow" });

writeFileSync(
  join(OUT, "manifest.json"),
  JSON.stringify(
    {
      url: URL,
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      intervalMs: INTERVAL_MS,
      durationMs: DURATION_MS,
      commitDelayMs: commitDelay,
      frames: manifest,
      loadedShots: ["home-loaded-viewport.png", "home-loaded-fullpage.png"],
    },
    null,
    2,
  ),
);

await context.close();
await browser.close();

console.log(`OK -> ${manifest.length} fotogramas + 2 capturas de home cargada en ${OUT}`);
console.log(`commit delay: ${commitDelay} ms`);
