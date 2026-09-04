"use client";

import { useActionState, useState } from "react";
import { slugify } from "@/app/lib/slug";
import { createProjectAction } from "./actions";

export default function CreateProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    undefined,
  );
  const [slug, setSlug] = useState("");
  const [slugWasManuallyEdited, setSlugWasManuallyEdited] = useState(false);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-lg flex-col gap-4 text-left"
    >
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          onChange={(e) => {
            if (!slugWasManuallyEdited) {
              setSlug(slugify(e.target.value));
            }
          }}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <div>
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugWasManuallyEdited(true);
          }}
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>
      <input
        type="hidden"
        name="slugWasManuallyEdited"
        value={slugWasManuallyEdited ? "true" : "false"}
      />

      <div>
        <label htmlFor="summary" className="text-sm font-medium">
          Summary
        </label>
        <input
          id="summary"
          name="summary"
          type="text"
          required
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
          placeholder="Next.js, TypeScript, Tailwind"
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
          className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-white/30"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="featured" />
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
        {pending ? "Creating..." : "Create project"}
      </button>

      {state?.error && <p className="text-sm text-muted">{state.error}</p>}
    </form>
  );
}
