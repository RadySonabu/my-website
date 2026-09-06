"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "../lib/projects";

function initials(title: string) {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-[22rem] flex-col rounded-lg border border-white/10 p-5 transition-colors hover:border-white/30"
    >
      <div className="flex h-32 shrink-0 items-center justify-center rounded-md bg-white/5 text-2xl font-semibold text-muted">
        {initials(project.title)}
      </div>
      <h3 className="mt-4 truncate text-lg font-semibold tracking-tight group-hover:text-foreground">
        {project.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{project.summary}</p>
      <ul className="mt-4 flex h-8 flex-wrap gap-2 overflow-hidden">
        {project.techStack.map((tech) => (
          <li
            key={tech}
            className="h-fit rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>
    </Link>
  );
}

const INITIAL_COUNT = 3;

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = projects.length > INITIAL_COUNT;

  if (!expanded) {
    return (
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {projects.slice(0, INITIAL_COUNT).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        {canExpand && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              style={{
                borderColor: "var(--hero-cream)",
                color: "var(--hero-cream)",
              }}
            >
              View all projects
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5"
        >
          Show less
        </button>
      </div>
    </div>
  );
}
