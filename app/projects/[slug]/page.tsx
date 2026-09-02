import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/app/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return { title: `${project.title} - my-website` };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        &larr; Back
      </Link>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight">
        {project.title}
      </h1>

      <p className="mt-2 text-sm text-muted">
        {project.role} &middot; {project.year}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-lg leading-relaxed text-foreground/90">
        {project.description}
      </p>

      <div className="mt-8 flex gap-4 text-sm font-medium">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Live site &rarr;
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Source &rarr;
          </a>
        )}
      </div>
    </main>
  );
}
