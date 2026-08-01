import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { IssueForm } from "@/components/admin/IssueForm";

export default async function NewIssuePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/");
  }

  return <IssueForm />;
}
