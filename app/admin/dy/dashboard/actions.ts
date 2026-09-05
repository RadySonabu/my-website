"use server";

import { revalidatePath } from "next/cache";
import { deleteProject } from "@/app/lib/projects";

export async function deleteProjectAction(slug: string): Promise<void> {
  await deleteProject(slug);
  revalidatePath("/admin/dy/dashboard");
}
