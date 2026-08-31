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

const PLACEHOLDER_PROJECTS: Project[] = [
  {
    slug: "sample-project-one",
    title: "Sample Project One",
    summary: "A short one-liner describing this placeholder project.",
    description:
      "A fuller placeholder write-up of Sample Project One: what it does, the problem it solves, and how it was built. Replace with real project content later.",
    techStack: ["Next.js", "TypeScript", "Tailwind"],
    role: "Full-stack developer",
    year: "2026",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/example/sample-project-one",
    featured: true,
  },
  {
    slug: "sample-project-two",
    title: "Sample Project Two",
    summary: "Another short one-liner for a second placeholder project.",
    description:
      "A fuller placeholder write-up of Sample Project Two. Replace with real project content later.",
    techStack: ["React", "Node.js"],
    role: "Frontend developer",
    year: "2025",
    repoUrl: "https://github.com/example/sample-project-two",
    featured: false,
  },
  {
    slug: "sample-project-three",
    title: "Sample Project Three",
    summary: "A third placeholder project one-liner.",
    description:
      "A fuller placeholder write-up of Sample Project Three. Replace with real project content later.",
    techStack: ["Python", "PostgreSQL"],
    role: "Backend developer",
    year: "2025",
    featured: false,
  },
];

export function getAllProjects(): Project[] {
  return PLACEHOLDER_PROJECTS;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PLACEHOLDER_PROJECTS.find((project) => project.slug === slug);
}
