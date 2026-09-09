"use server";

import { revalidatePath } from "next/cache";
import { deleteProject } from "@/app/lib/projects";
import { requireAdminSession } from "@/app/lib/session";

export async function deleteProjectAction(slug: string): Promise<void> {
  if (!(await requireAdminSession())) {
    throw new Error("Unauthorized");
  }

  await deleteProject(slug);
  revalidatePath("/admin/dy/dashboard");
}
