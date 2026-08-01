import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PostLoginPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  if (role === "ADMIN" || role === "EDITOR" || role === "MEMBER_ADMIN") {
    redirect("/admin");
  }

  if (role === "MEMBER") {
    redirect("/mi-cuenta");
  }

  redirect("/hazte-socio");
}
