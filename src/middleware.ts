import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { SESSION_HINT_COOKIE, SESSION_HINT_MAX_AGE } from "@/lib/session-hint";

// ---------------------------------------------------------------------------
// Rutas-cebo (honeypot): sondeos típicos de escáneres y ataques a WordPress/PHP.
// A quien las pida le devolvemos una página con un mensaje, en vez de dejar que
// husmee. NO afecta a nuestras rutas reales (/admin, /api, /mi-cuenta…).
// ---------------------------------------------------------------------------
const PROBE_PATTERNS: RegExp[] = [
  /^\/wp[-/]/i, // wp-admin, wp-login, wp-content, wp-includes, wp-json…
  /^\/wordpress\b/i,
  /^\/xmlrpc/i,
  /^\/wp-config/i,
  /^\/\.(env|git|svn|hg|htaccess|htpasswd|aws|ssh|npmrc|ds_store)/i, // .env, .git…
  /^\/(administrator|adminer|phpmyadmin|myadmin|pma|dbadmin|mysqladmin|sqladmin|websql)\b/i,
  /^\/(vendor|cgi-bin|autodiscover|owa|actuator)\b/i,
  /^\/(license\.txt|readme\.html)$/i,
  /\.(php|phtml|asp|aspx|jsp|cgi|sh|bak|old|sql|env)$/i, // extensiones de sondeo
];

const MENSAJES = [
  "Por aquí no, cariño. Olvídate.",
  "Olvídate de todo: esta no es tu ruta.",
  "Esto no es WordPress, majo. Aquí no hay puerta trasera que forzar.",
  "¿Buscabas una grieta por donde colarte? Se nos olvidó dejarla.",
  "Nada que copiar por aquí. Vuelve por donde viniste.",
  "Ruta equivocada. Y, mira, mejor así. Olvídalo.",
  "Aquí solo hay olvido para ti.",
  "Esta puerta no existe. Y la que existe, tampoco es para ti.",
];

function isProbe(pathname: string, search: URLSearchParams): boolean {
  if (search.has("author")) return true; // author enumeration (?author=1)
  return PROBE_PATTERNS.some((re) => re.test(pathname));
}

function honeypotResponse(): NextResponse {
  const msg = MENSAJES[Math.floor(Math.random() * MENSAJES.length)];
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Nada por aquí · Olvidos de Granada</title>
<style>
  html,body{height:100%;margin:0}
  body{background:#141414;color:#fff;font-family:Georgia,"Times New Roman",serif;
    display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem}
  .mark{color:#ff6261;font-weight:800;letter-spacing:.02em;font-family:Arial,Helvetica,sans-serif;
    font-size:.9rem;text-transform:uppercase;margin-bottom:1.5rem}
  h1{font-size:clamp(1.6rem,5vw,3rem);line-height:1.15;margin:0 0 1.5rem;max-width:22ch}
  a{color:#ff6261;text-decoration:none;font-weight:bold;font-family:Arial,Helvetica,sans-serif;font-size:.9rem}
  a:hover{color:#fff}
  .code{opacity:.35;font-size:.8rem;margin-top:2rem;font-family:monospace}
</style></head><body><div>
  <div class="mark"><span style="color:#ff6261">[</span>Olvidos de Granada</div>
  <h1>${msg}</h1>
  <a href="/">← Volver a lo que sí existe</a>
  <div class="code">403 · nice try</div>
</div></body></html>`;
  return new NextResponse(html, {
    status: 403,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

// ---------------------------------------------------------------------------
// Sesión. Auth.js solo se ejecuta en las rutas que la exigen: en las públicas
// ni se lee el JWT ni se ponen cookies (antes ponía la de CSRF y la de
// callback en cada visita anónima, lo que impedía cachear las páginas).
// ---------------------------------------------------------------------------
const PROTECTED_PREFIXES = ["/admin", "/mi-cuenta", "/socios"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** ¿Lleva la petición la cookie de sesión de Auth.js (entera o troceada)? */
function hasSessionCookie(req: NextRequest): boolean {
  return req.cookies
    .getAll()
    .some((c) => /authjs\.session-token(?:\.\d+)?$/.test(c.name) && c.value.length > 0);
}

/**
 * Mantiene la cookie-pista que lee la cabecera (`src/lib/session-hint.ts`):
 * se escribe solo cuando su estado no coincide con el de la sesión, así en
 * régimen normal la respuesta no lleva Set-Cookie y se puede cachear.
 */
function syncSessionHint(req: NextRequest, res: NextResponse, active: boolean): NextResponse {
  const hinted = req.cookies.get(SESSION_HINT_COOKIE)?.value === "1";
  if (active && !hinted) {
    res.cookies.set({
      name: SESSION_HINT_COOKIE,
      value: "1",
      path: "/",
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      maxAge: SESSION_HINT_MAX_AGE,
    });
  } else if (!active && hinted) {
    res.cookies.delete(SESSION_HINT_COOKIE);
  }
  return res;
}

/** Rutas protegidas: aquí sí se valida la sesión y el rol. */
const protectedMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const finish = (res: NextResponse) => syncSessionHint(req, res, isLoggedIn);

  // Rutas de admin: solo ADMIN, EDITOR y MEMBER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return finish(NextResponse.redirect(new URL("/login", req.url)));
    }
    if (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "MEMBER_ADMIN") {
      return finish(NextResponse.redirect(new URL("/", req.url)));
    }
  }

  // Área de miembros (mi-cuenta): requiere un rol válido
  if (pathname.startsWith("/mi-cuenta")) {
    if (!isLoggedIn) {
      return finish(NextResponse.redirect(new URL("/login", req.url)));
    }
    if (
      userRole !== "MEMBER" &&
      userRole !== "ADMIN" &&
      userRole !== "MEMBER_ADMIN" &&
      userRole !== "EDITOR"
    ) {
      return finish(NextResponse.redirect(new URL("/", req.url)));
    }
  }

  // Directorio de socios: requiere login
  if (pathname.startsWith("/socios")) {
    if (!isLoggedIn) {
      return finish(NextResponse.redirect(new URL("/login", req.url)));
    }
  }

  return finish(NextResponse.next());
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const { pathname, searchParams } = req.nextUrl;

  // 0) Rutas-cebo: cortamos antes de nada.
  if (isProbe(pathname, searchParams)) {
    return honeypotResponse();
  }

  // Skip middleware for API routes, static files, and specific public routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isProtected(pathname)) {
    // Auth.js tipa el contexto como el de una route handler; es el mismo objeto.
    return protectedMiddleware(req, event as unknown as Parameters<typeof protectedMiddleware>[1]);
  }

  // Páginas públicas: sin Auth.js; solo se sincroniza la cookie-pista a partir
  // de la presencia de la cookie de sesión (no se valida: es una pista de UI).
  return syncSessionHint(req, NextResponse.next(), hasSessionCookie(req));
}

export const config = {
  matcher: [
    /*
     * Ejecuta el middleware en todo menos los recursos estáticos/medios. (Antes
     * se excluía TODO lo que tuviera punto; ahora solo extensiones de estáticos,
     * para poder interceptar sondeos como /wp-login.php o /.env.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|apple-icon\\.png|.*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|mjs|map|woff|woff2|ttf|otf|mp4|webm|mp3|pdf|txt|xml)$).*)",
  ],
};
