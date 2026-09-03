// Captura autenticada del ÁREA DE ADMINISTRACIÓN (panel del Equipo Editor) en
// local (next start, localhost:3000). Inicia sesión con el usuario EDITOR de
// prueba y toma viewport + fullPage de cada pantalla editorial, a 390x844 @2x
// (PNG de 780px de ancho), para los reels de campaña interna.
//
// Uso:
//   ADMIN_EMAIL=editora@olvidosdegranada.es ADMIN_PASS=Editor123! \
//   node scripts/reel-capture-admin.mjs
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";
const EMAIL = process.env.ADMIN_EMAIL || "editora@olvidosdegranada.es";
const PASS = process.env.ADMIN_PASS || "Editor123!";
const EDIT_ID = process.env.EDIT_ID || "";
const OUT = process.env.RAW_DIR || "/home/user/olvidos/footage-reel/raw-admin";
const EXEC = process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium";
const VW = Number(process.env.VW || 390);
const VH = Number(process.env.VH || 844);
const DSF = Number(process.env.DSF || 2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: "dashboard", path: "/admin" },
  { name: "articulos", path: "/admin/articulos" },
  { name: "articulo-nuevo", path: "/admin/articulos/nuevo", editor: true },
  ...(EDIT_ID
    ? [{ name: "articulo-editar", path: `/admin/articulos/${EDIT_ID}/editar`, editor: true }]
    : []),
  { name: "revista", path: "/admin/revista" },
  { name: "categorias", path: "/admin/categorias" },
  { name: "tags", path: "/admin/tags" },
  { name: "actividades", path: "/admin/actividades" },
  { name: "socios", path: "/admin/socios" },
  { name: "documentos", path: "/admin/documentos" },
  { name: "pagos", path: "/admin/pagos" },
  { name: "contabilidad", path: "/admin/contabilidad" },
  { name: "inscripciones", path: "/admin/inscripciones" },
  { name: "usuarios", path: "/admin/usuarios" },
  { name: "configuracion", path: "/admin/configuracion" },
];

const browser = await chromium.launch({
  executablePath: EXEC,
  // Conexión directa: es tráfico puramente local (sin el proxy del entorno).
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-color-profile=srgb", "--no-proxy-server"],
});
const ctx = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: DSF,
  ignoreHTTPSErrors: true,
});
const page = await ctx.newPage();

// -------- LOGIN --------
await page.goto(BASE + "/login", { waitUntil: "domcontentloaded", timeout: 45000 });
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
// OJO: hay varios botones submit (GitHub/Google además del de credenciales).
// Hay que pulsar el del formulario que contiene la contraseña.
const credSubmit = page.locator('form:has(input[name="password"]) button[type="submit"]');
await Promise.all([
  page.waitForURL(/\/(admin|post-login|mi-cuenta|hazte-socio)/, { timeout: 30000 }).catch(() => {}),
  credSubmit.click(),
]);
// Asegura llegar al panel.
await page.goto(BASE + "/admin", { waitUntil: "networkidle", timeout: 45000 });
const who = await page.evaluate(() => document.body.innerText.slice(0, 60));
console.log("tras login, /admin dice:", JSON.stringify(who));

async function settle(p, editor) {
  await p.waitForLoadState("networkidle").catch(() => {});
  // Dispara carga perezosa
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 650) {
    await p.evaluate((yy) => scrollTo(0, yy), y);
    await sleep(150);
  }
  await p.evaluate(() => scrollTo(0, 0));
  if (editor) {
    // Espera a que TipTap monte el editor
    await p.waitForSelector(".ProseMirror, [contenteditable='true']", { timeout: 8000 }).catch(() => {});
    await sleep(600);
  }
  await Promise.race([
    p.evaluate(async () => {
      await Promise.all([...document.querySelectorAll("img")].map((i) =>
        i.complete ? 0 : new Promise((r) => { i.addEventListener("load", r, { once: true }); i.addEventListener("error", r, { once: true }); })));
      if (document.fonts?.ready) await document.fonts.ready;
    }),
    sleep(6000),
  ]);
  await sleep(400);
}

for (const t of PAGES) {
  try {
    await page.goto(BASE + t.path, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page, t.editor);
    const info = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, title: document.title }));
    await page.screenshot({ path: join(OUT, `${t.name}-viewport.png`) });
    await page.screenshot({ path: join(OUT, `${t.name}-full.png`), fullPage: true });
    console.log(`OK ${t.name} "${info.title}" fullH=${info.h}`);
  } catch (e) {
    console.log(`FALLO ${t.name}: ${e.message}`);
  }
}

await ctx.close();
await browser.close();
console.log("Captura admin completa ->", OUT);
