import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  console.log("[Middleware] Path:", pathname, "Auth:", isLoggedIn, "Role:", userRole);

  // Rutas de admin: solo ADMIN y EDITOR
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      console.log("[Middleware] → /login (not authenticated)");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "MEMBER_ADMIN") {
      console.log("[Middleware] → / (access denied, role:", userRole, ")");
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("[Middleware] ✓ Access to /admin granted");
  }

  // Área de miembros (mi-cuenta): requiere MEMBER role o roles superiores
  if (pathname.startsWith("/mi-cuenta")) {
    if (!isLoggedIn) {
      console.log("[Middleware] → /login (not authenticated)");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      userRole !== "MEMBER" &&
      userRole !== "ADMIN" &&
      userRole !== "MEMBER_ADMIN" &&
      userRole !== "EDITOR"
    ) {
      console.log("[Middleware] → /hazte-socio (not a member, role:", userRole, ")");
      return NextResponse.redirect(new URL("/hazte-socio", req.url));
    }
    console.log("[Middleware] ✓ Access to /mi-cuenta granted");
  }

  // Directorio de socios: requiere login
  if (pathname.startsWith("/socios")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
