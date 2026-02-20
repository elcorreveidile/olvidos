import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // IMPORTANT: Don't protect API routes or static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const userId = req.auth?.user?.id;
  const userEmail = req.auth?.user?.email;

  // Debug logging for protected routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/mi-cuenta")) {
    console.log("[Middleware]", {
      pathname,
      isLoggedIn,
      userRole,
      userId,
      userEmail: userEmail?.substring(0, userEmail?.indexOf('@') || 0) + '...',
    });
  }

  // Rutas de admin: solo ADMIN y EDITOR
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      console.log("[Middleware] Redirecting to /login - not logged in");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "MEMBER_ADMIN") {
      console.error("[Middleware] Access denied to /admin for user with role:", userRole);
      return NextResponse.redirect(new URL("/", req.url));
    }
    console.log("[Middleware] Access granted to /admin for role:", userRole);
  }

  // Área de miembros (mi-cuenta): requiere MEMBER role o roles superiores
  if (pathname.startsWith("/mi-cuenta")) {
    if (!isLoggedIn) {
      console.log("[Middleware] Redirecting to /login - not logged in");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole === "USER") {
      console.log("[Middleware] Redirecting to /hazte-socio - user is USER, not member");
      return NextResponse.redirect(new URL("/hazte-socio", req.url));
    }
    if (
      userRole !== "MEMBER" &&
      userRole !== "ADMIN" &&
      userRole !== "MEMBER_ADMIN" &&
      userRole !== "EDITOR"
    ) {
      console.log("[Middleware] Redirecting to /hazte-socio - invalid role:", userRole);
      return NextResponse.redirect(new URL("/hazte-socio", req.url));
    }
    console.log("[Middleware] Access granted to /mi-cuenta for role:", userRole);
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
