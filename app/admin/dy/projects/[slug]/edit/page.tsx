import { notFound, redirect } from "next/navigation";
import { getProjectBySlug } from "@/app/lib/projects";
import { requireAdminSession } from "@/app/lib/session";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const authed = await requireAdminSession();
  if (!authed) {
    redirect("/admin/dy");
  }

  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
      <div className="mt-8 w-full">
        <EditProjectForm project={project} />
      </div>
    </main>
  );
}
