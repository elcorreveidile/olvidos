"use client";

import Link from "next/link";

interface MobileMemberLinkProps {
  href: string;
  label: string;
  onClose: () => void;
}

export function MobileMemberLink({ href, label, onClose }: MobileMemberLinkProps) {
  return (
    <Link
      href={href}
      className="block py-2 text-sm font-bold text-acero hover:text-coral transition-colors"
      onClick={onClose}
    >
      {label}
    </Link>
  );
}
