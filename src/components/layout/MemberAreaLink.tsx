import Link from "next/link";
import { auth } from "@/lib/auth";

// Server component that returns member area info
export async function getMemberAreaInfo() {
  const session = await auth();
  const hasUser = !!session?.user;
  return {
    href: hasUser ? "/mi-cuenta" : "/login",
    label: hasUser ? "Mi Cuenta" : "Área Socios",
  };
}

// Desktop version - Server Component
export async function MemberAreaLink({ className }: { className?: string }) {
  const { href, label } = await getMemberAreaInfo();

  return (
    <Link
      href={href}
      className={className || "text-sm font-bold tracking-wide text-azul hover:text-coral transition-colors"}
    >
      {label}
    </Link>
  );
}
