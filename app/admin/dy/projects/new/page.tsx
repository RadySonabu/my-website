import { redirect } from "next/navigation";
import { requireAdminSession } from "@/app/lib/session";
import CreateProjectForm from "./CreateProjectForm";

export default async function NewProjectPage() {
  const authed = await requireAdminSession();
  if (!authed) {
    redirect("/admin/dy");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
      <div className="mt-8 w-full">
        <CreateProjectForm />
      </div>
    </main>
  );
}
