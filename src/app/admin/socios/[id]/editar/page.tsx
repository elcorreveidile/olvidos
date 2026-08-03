import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { adminUpdateSocio } from "@/lib/actions/members";
import { MEMBERSHIP_LABELS, MEMBER_STATUS_LABELS } from "@/types/member";

export const dynamic = "force-dynamic";

const LEVELS = ["STANDARD", "HONORARY", "INSTITUTIONAL", "HONOR", "COLLABORATOR"] as const;
const STATUSES = ["ACTIVE", "PENDING", "EXPIRED", "SUSPENDED", "CANCELLED"] as const;

export default async function EditarSocioPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "ADMIN" && role !== "MEMBER_ADMIN") redirect("/admin");

  const member = await db.member.findUnique({
    where: { id: params.id },
    include: { user: true },
  });
  if (!member) notFound();

  const dateValue = member.joinDate
    ? new Date(member.joinDate).toISOString().slice(0, 10)
    : "";

  async function save(formData: FormData) {
    "use server";
    const result = await adminUpdateSocio(params.id, {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      membershipLevel: String(formData.get("membershipLevel") ?? "") || undefined,
      status: String(formData.get("status") ?? "") || undefined,
      joinDate: String(formData.get("joinDate") ?? "") || undefined,
      phone: String(formData.get("phone") ?? ""),
      dni: String(formData.get("dni") ?? ""),
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      isPublic: formData.get("isPublic") === "true",
    });
    if (result.success) {
      redirect(`/admin/socios/${params.id}?updated=1`);
    }
    const msg =
      (result as { error?: string }).error ?? "No se pudo guardar el socio";
    redirect(`/admin/socios/${params.id}/editar?error=${encodeURIComponent(msg)}`);
  }

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-coral";
  const labelCls = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="p-6 md:p-8">
      <Link
        href={`/admin/socios/${member.id}`}
        className="text-sm font-bold text-coral hover:text-coral-dark"
      >
        ← Volver a la ficha
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-black text-tinta">
        Editar socio #{member.memberNumber}
      </h1>
      <p className="mb-6 text-sm text-gray-500">{member.user.email}</p>

      {searchParams?.error && (
        <p className="mb-4 max-w-2xl rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={save} className="max-w-2xl space-y-5 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="name">Nombre</label>
            <input id="name" name="name" defaultValue={member.user.name ?? ""} className={input} />
          </div>
          <div>
            <label className={labelCls} htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" defaultValue={member.user.email} className={input} />
          </div>
          <div>
            <label className={labelCls} htmlFor="membershipLevel">Nivel</label>
            <select id="membershipLevel" name="membershipLevel" defaultValue={member.membershipLevel} className={`h-[42px] bg-white ${input}`}>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{MEMBERSHIP_LABELS[l]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="status">Estado</label>
            <select id="status" name="status" defaultValue={member.status} className={`h-[42px] bg-white ${input}`}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{MEMBER_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="joinDate">Fecha de alta</label>
            <input id="joinDate" name="joinDate" type="date" defaultValue={dateValue} className={`h-[42px] ${input}`} />
          </div>
          <div>
            <label className={labelCls} htmlFor="phone">Teléfono</label>
            <input id="phone" name="phone" defaultValue={member.phone ?? ""} className={input} />
          </div>
          <div>
            <label className={labelCls} htmlFor="dni">DNI <span className="font-normal text-gray-400">(interno)</span></label>
            <input id="dni" name="dni" defaultValue={member.dni ?? ""} className={input} />
          </div>
          <div>
            <label className={labelCls} htmlFor="city">Ciudad</label>
            <input id="city" name="city" defaultValue={member.city ?? ""} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="address">Domicilio <span className="font-normal text-gray-400">(interno)</span></label>
            <input id="address" name="address" defaultValue={member.address ?? ""} className={input} />
          </div>
          <div>
            <label className={labelCls} htmlFor="isPublic">Aparece en el directorio</label>
            <select id="isPublic" name="isPublic" defaultValue={member.isPublic ? "true" : "false"} className={`h-[42px] bg-white ${input}`}>
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-coral px-6 py-2 font-bold text-white transition-colors hover:bg-coral-dark">
            Guardar cambios
          </button>
          <Link href={`/admin/socios/${member.id}`} className="rounded-lg border border-gray-300 px-6 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-50">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
