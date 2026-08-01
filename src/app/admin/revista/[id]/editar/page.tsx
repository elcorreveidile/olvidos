import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getMagazineIssue } from "@/lib/actions/magazine-issues";
import { IssueForm } from "@/components/admin/IssueForm";

export default async function EditIssuePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/");
  }

  const issue = await getMagazineIssue(params.id);

  if (!issue) {
    notFound();
  }

  return (
    <IssueForm
      issue={{
        id: issue.id,
        number: issue.number,
        title: issue.title,
        slug: issue.slug,
        year: issue.year,
        month: issue.month,
        description: issue.description,
        coverImage: issue.coverImage,
        pdfUrl: issue.pdfUrl,
        status: issue.status,
        publishedAt: issue.publishedAt,
      }}
    />
  );
}
