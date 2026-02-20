"use client";

import Link from "next/link";

interface MemberAreaLinksProps {
  variant: "desktop" | "mobile";
  className?: string;
  onClose?: () => void;
  isAuthenticated: boolean;
}

export function MemberAreaLinks({ variant, className, onClose, isAuthenticated }: MemberAreaLinksProps) {
  const href = isAuthenticated ? "/mi-cuenta" : "/login";
  const label = isAuthenticated ? "Mi Cuenta" : "Área Socios";

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
