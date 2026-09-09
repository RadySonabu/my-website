"use server";

import { redirect } from "next/navigation";
import { editProjectFormSchema, updateProject } from "@/app/lib/projects";
import { requireAdminSession } from "@/app/lib/session";

const GENERIC_ERROR = "Unable to update project. Check the fields.";

export async function updateProjectAction(
  slug: string,
  _prevState: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!(await requireAdminSession())) {
    return { error: "Unauthorized" };
  }

  const parsed = editProjectFormSchema.safeParse({
    title: formData.get("title"),
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

  const techStack = parsed.data.techStack
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  await updateProject(slug, {
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
