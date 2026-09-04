import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllProjects } from "@/app/lib/projects";
import { requireAdminSession } from "@/app/lib/session";
import { logout } from "../actions";

export default async function AdminDashboardPage() {
  const authed = await requireAdminSession();
  if (!authed) {
    redirect("/admin/dy");
  }

  const projects = await getAllProjects();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <Link
          href="/admin/dy/projects/new"
          className="rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/5"
          style={{
            borderColor: "var(--hero-cream)",
            color: "var(--hero-cream)",
          }}
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">No projects yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="flex items-center justify-between rounded-lg border border-white/10 p-4"
            >
              <div>
                <p className="font-medium">
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted">{project.year}</p>
              </div>
              <Link
                href={`/admin/dy/projects/${project.slug}/edit`}
                className="text-sm text-muted hover:text-foreground"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form action={logout} className="mt-auto">
        <button
          type="submit"
          className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5"
          style={{
            borderColor: "var(--hero-cream)",
            color: "var(--hero-cream)",
          }}
        >
          Log out
        </button>
      </form>
    </main>
  );
}
