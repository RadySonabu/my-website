"use server";

import { redirect } from "next/navigation";
import { resolveUniqueSlug } from "@/app/lib/slug";
import {
  createProject,
  getAllProjects,
  projectFormSchema,
} from "@/app/lib/projects";
import { requireAdminSession } from "@/app/lib/session";

const GENERIC_ERROR = "Unable to create project. Check the fields and slug.";

export async function createProjectAction(
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!(await requireAdminSession())) {
    return { error: "Unauthorized" };
  }

  const parsed = projectFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    slugWasManuallyEdited: formData.get("slugWasManuallyEdited") === "true",
    summary: formData.get("summary"),
    description: formData.get("description"),
    techStack: formData.get("techStack") ?? "",
    role: formData.get("role"),
    year: formData.get("year"),
    liveUrl: formData.get("liveUrl") || undefined,
    repoUrl: formData.get("repoUrl") || undefined,
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const existing = await getAllProjects();
  const existingSlugs = existing.map((project) => project.slug);

  const slug = resolveUniqueSlug(
    parsed.data.slug,
    existingSlugs,
    parsed.data.slugWasManuallyEdited,
  );

  if (!slug) {
    return { error: "That slug is already taken." };
  }

  const techStack = parsed.data.techStack
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  await createProject({
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    description: parsed.data.description,
    techStack,
    role: parsed.data.role,
    year: parsed.data.year,
    liveUrl: parsed.data.liveUrl,
    repoUrl: parsed.data.repoUrl,
    featured: parsed.data.featured,
  });

  redirect("/admin/dy/dashboard");
}
