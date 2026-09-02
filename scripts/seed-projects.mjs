import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const PROJECTS = [
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

async function seed() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.error(
      "Missing KV_REST_API_URL/KV_REST_API_TOKEN. Run with env vars loaded, e.g.:\n" +
        "  node --env-file=.env.local scripts/seed-projects.mjs",
    );
    process.exit(1);
  }

  for (const project of PROJECTS) {
    await redis.set(`project:${project.slug}`, project);
    console.log(`Seeded project:${project.slug}`);
  }

  await redis.set(
    "project:index",
    PROJECTS.map((p) => p.slug),
  );
  console.log(`Seeded project:index with ${PROJECTS.length} slugs`);
}

seed();
