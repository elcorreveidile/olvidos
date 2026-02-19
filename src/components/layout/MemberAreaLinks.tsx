import Link from "next/link";
import { auth } from "@/lib/auth";

interface MemberAreaLinksProps {
  variant: "desktop" | "mobile";
  className?: string;
  onClose?: () => void;
}

export async function MemberAreaLinks({ variant, className, onClose }: MemberAreaLinksProps) {
  const session = await auth();
  const hasUser = !!session?.user;
  const href = hasUser ? "/mi-cuenta" : "/login";
  const label = hasUser ? "Mi Cuenta" : "Área Socios";

  if (variant === "desktop") {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  // Mobile variant
  return (
    <Link href={href} className={className} onClick={onClose}>
      {label}
    </Link>
  );
}
