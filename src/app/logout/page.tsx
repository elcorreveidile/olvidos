"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all auth cookies
    document.cookie.split(";").forEach((c) => {
      const cookieName = c.split("=")[0]?.trim();
      if (cookieName?.includes("authjs") || cookieName?.includes("session-token")) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });

    // Redirect to home after clearing cookies
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 100);
  }, [router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", fontFamily: "system-ui" }}>
      <p>Cerrando sesión...</p>
      <p style={{ fontSize: "0.875rem", color: "#666" }}>Serás redirigido en un momento...</p>
    </div>
  );
}
