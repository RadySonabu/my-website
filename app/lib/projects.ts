import { z } from "zod";
import { redis } from "./redis";

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  role: string;
  year: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
};

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  slugWasManuallyEdited: z.boolean(),
  summary: z.string().trim().min(1, "Summary is required"),
  description: z.string().trim().min(1, "Description is required"),
  techStack: z.string().trim(),
  role: z.string().trim().min(1, "Role is required"),
  year: z.string().trim().min(1, "Year is required"),
  liveUrl: z.string().trim().optional(),
  repoUrl: z.string().trim().optional(),
  featured: z.boolean(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

export const editProjectFormSchema = projectFormSchema.omit({
  slug: true,
  slugWasManuallyEdited: true,
});

export type EditProjectFormInput = z.infer<typeof editProjectFormSchema>;

const INDEX_KEY = "project:index";

function projectKey(slug: string): string {
  return `project:${slug}`;
}

export async function getAllProjects(): Promise<Project[]> {
  const slugs = (await redis.get<string[]>(INDEX_KEY)) ?? [];
  if (slugs.length === 0) {
    return [];
  }

  const records = await Promise.all(
    slugs.map((slug) => redis.get<Project>(projectKey(slug))),
  );

  return records.filter((project): project is Project => project !== null);
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const project = await redis.get<Project>(projectKey(slug));
  return project ?? undefined;
}

export async function createProject(project: Project): Promise<void> {
  await redis.set(projectKey(project.slug), project);

  const slugs = (await redis.get<string[]>(INDEX_KEY)) ?? [];
  await redis.set(INDEX_KEY, [...slugs, project.slug]);
}

export async function updateProject(
  slug: string,
  project: Omit<Project, "slug">,
): Promise<void> {
  await redis.set(projectKey(slug), { ...project, slug });
}

export async function deleteProject(slug: string): Promise<void> {
  await redis.del(projectKey(slug));

  const slugs = (await redis.get<string[]>(INDEX_KEY)) ?? [];
  await redis.set(
    INDEX_KEY,
    slugs.filter((existing) => existing !== slug),
  );
}
