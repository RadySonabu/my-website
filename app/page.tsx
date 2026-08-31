import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";
import { getAllProjects } from "./lib/projects";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Home() {
  const projects = getAllProjects();

  return (
    <>
      <nav
        aria-label="Primary"
        className="sticky top-0 z-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <main>
        <section
          id="home"
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        >
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Your Name
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            A short line about what you build and who it&apos;s for.
          </p>
        </section>

        {projects.length > 0 && (
          <section
            id="projects"
            aria-label="Projects"
            className="mx-auto max-w-5xl px-6 py-24"
          >
            <ScrollReveal>
              <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
                Projects
              </h2>
              <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
                {projects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}`}
                    className="group flex flex-col rounded-lg border border-white/10 p-5 transition-colors hover:border-white/30"
                  >
                    <div className="flex h-32 items-center justify-center rounded-md bg-white/5 text-2xl font-semibold text-muted">
                      {project.title
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 3)}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{project.summary}</p>
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
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </section>
        )}

        <section
          id="about"
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        >
          <ScrollReveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              About
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Placeholder bio: background, focus areas, and what drives the work.
            </p>
          </ScrollReveal>
        </section>

        <section
          id="contact"
          className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
        >
          <ScrollReveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Contact
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted">
              Contact form coming soon.
            </p>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
