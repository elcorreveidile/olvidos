import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Rutas de admin: solo ADMIN y EDITOR
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN" && userRole !== "EDITOR" && userRole !== "MEMBER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Área de miembros (mi-cuenta): requiere MEMBER role o roles superiores
  if (pathname.startsWith("/mi-cuenta")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      userRole !== "MEMBER" &&
      userRole !== "ADMIN" &&
      userRole !== "MEMBER_ADMIN" &&
      userRole !== "EDITOR"
    ) {
      return NextResponse.redirect(new URL("/hazte-socio", req.url));
    }
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
  matcher: ["/admin/:path*", "/mi-cuenta/:path*", "/socios/:path*"],
};
