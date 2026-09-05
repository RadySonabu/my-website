"use client";

import { useActionState } from "react";
import type { Project } from "@/app/lib/projects";
import { updateProjectAction } from "./actions";

export default function EditProjectForm({ project }: { project: Project }) {
  const action = updateProjectAction.bind(null, project.slug);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-lg flex-col gap-4 text-left"
    >
      <div>
        <span className="text-sm font-medium text-muted">Slug</span>
        <p className="mt-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-muted">
          {project.slug}
        </p>
      </div>

      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={project.title}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="summary" className="text-sm font-medium">
          Summary
        </label>
        <input
          id="summary"
          name="summary"
          type="text"
          required
          defaultValue={project.summary}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={project.description}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="techStack" className="text-sm font-medium">
          Tech stack (comma-separated)
        </label>
        <input
          id="techStack"
          name="techStack"
          type="text"
          defaultValue={project.techStack.join(", ")}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="role" className="text-sm font-medium">
          Role
        </label>
        <input
          id="role"
          name="role"
          type="text"
          required
          defaultValue={project.role}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="year" className="text-sm font-medium">
          Year
        </label>
        <input
          id="year"
          name="year"
          type="text"
          required
          defaultValue={project.year}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="liveUrl" className="text-sm font-medium">
          Live URL (optional)
        </label>
        <input
          id="liveUrl"
          name="liveUrl"
          type="text"
          defaultValue={project.liveUrl ?? ""}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="repoUrl" className="text-sm font-medium">
          Repo URL (optional)
        </label>
        <input
          id="repoUrl"
          name="repoUrl"
          type="text"
          defaultValue={project.repoUrl ?? ""}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="featured" defaultChecked={project.featured} />
        Featured
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          borderColor: "var(--hero-cream)",
          color: "var(--hero-cream)",
        }}
      >
        {pending ? "Saving..." : "Save changes"}
      </button>

      {state?.error && <p className="text-sm text-muted">{state.error}</p>}
    </form>
  );
}
