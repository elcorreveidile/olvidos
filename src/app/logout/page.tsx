import { signOut } from "@/lib/auth";

export default async function LogoutPage() {
  await signOut({ redirectTo: "/" });

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Cerrando sesión...</p>
    </div>
  );
}
