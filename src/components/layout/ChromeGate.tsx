"use client";

import { usePathname } from "next/navigation";

/**
 * Muestra la cabecera y el pie públicos SALVO en las áreas con interfaz propia
 * (el área de socios y el panel de administración), que traen su propio layout.
 * Recibe header/footer/curtain ya renderizados (server components) como props.
 */
export function ChromeGate({
  header,
  footer,
  curtain,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  curtain: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/mi-cuenta") || pathname.startsWith("/admin");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      {curtain}
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
