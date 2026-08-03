export type MembershipLevel = "STANDARD" | "COLLABORATOR" | "HONORARY" | "INSTITUTIONAL" | "HONOR";
export type MemberStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "SUSPENDED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";
export type PaymentType = "MEMBERSHIP_FEE" | "EVENT_TICKET" | "DONATION" | "OTHER";

export interface MemberProfile {
  id: string;
  memberNumber: number;
  membershipLevel: MembershipLevel;
  status: MemberStatus;
  joinDate: string;
  renewalDate: string | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  isPublic: boolean;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
}

export interface PaymentRecord {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  createdAt: string;
}

// Etiquetas visibles de cada nivel (fuente única). HONORARY se muestra como
// "Mecenas". HONOR es el "Socio de Honor" (distinción honorífica, sin cuota).
// COLLABORATOR se conserva solo para socios antiguos (legacy): ya no se ofrece
// en los formularios de alta.
export const MEMBERSHIP_LABELS: Record<MembershipLevel, string> = {
  STANDARD: "Estándar",
  COLLABORATOR: "Colaborador",
  HONORARY: "Mecenas",
  INSTITUTIONAL: "Institucional",
  HONOR: "Socio de Honor",
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  PENDING: "Pendiente",
  ACTIVE: "Activo",
  EXPIRED: "Caducado",
  SUSPENDED: "Suspendido",
  CANCELLED: "Baja",
};
