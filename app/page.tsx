import Link from "next/link";
import ContactForm from "./components/ContactForm";
import ResumeDownloadLink from "./components/ResumeDownloadLink";
import ScrollReveal from "./components/ScrollReveal";
import { getAllProjects } from "./lib/projects";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export default async function Home() {
  const projects = await getAllProjects();

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
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 200 400"
            preserveAspectRatio="none"
            className="pointer-events-none absolute right-0 top-0 h-full w-40 opacity-40 sm:w-56"
          >
            <line
              x1="170"
              y1="0"
              x2="40"
              y2="400"
              stroke="var(--hero-cream)"
              strokeWidth="1"
            />
            <line
              x1="130"
              y1="0"
              x2="0"
              y2="260"
              stroke="var(--hero-gradient-start)"
              strokeWidth="1"
            />
          </svg>

          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Ardy Ubanos
          </p>
          <h1
            className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl"
            style={{ color: "var(--hero-cream)" }}
          >
            AI Deve<span className="hero-gradient-letter">l</span>oper
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Building intelligent products from idea to deploy.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.linkedin.com/in/ardy-ubanos/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-muted transition-colors hover:border-white/30 hover:text-foreground"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
              >
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
              </svg>
              LinkedIn
            </a>
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
              Metro Manila, PH &middot; Open to remote
            </span>
          </div>

          <ResumeDownloadLink />
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
              I&apos;m a Senior Software Engineer based in Metro Manila,
              Philippines, focused on Python backend systems and applying
              LLMs and AI to real products. Alongside engineering work, I
              teach as a part-time Faculty Lecturer covering Software
              Analysis and Design. I hold an MS in Computer Science
              (Graduate), with research in AI-driven recommender systems.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <img
                src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"
                alt="Python"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/Django-092E20?style=flat-square&logo=django&logoColor=white"
                alt="Django"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white"
                alt="FastAPI"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"
                alt="PostgreSQL"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"
                alt="AWS"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/Azure-0078D4?style=flat-square&logo=microsoftazure&logoColor=white"
                alt="Azure"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"
                alt="Git"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"
                alt="JavaScript"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white"
                alt="MongoDB"
                height={20}
              />
              <img
                src="https://img.shields.io/badge/AI%20%2F%20LLMs-6E56CF?style=flat-square&logo=openai&logoColor=white"
                alt="AI / LLMs"
                height={20}
              />
            </div>
          </ScrollReveal>
        </section>

        <section
          id="experience"
          aria-label="Experience"
          className="mx-auto max-w-2xl px-6 py-24"
        >
          <ScrollReveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Experience
            </h2>
            <ul className="mt-10 flex flex-col gap-6">
              <li className="rounded-lg border border-white/10 p-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  Senior Software Engineer
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Python APIs, LLM-powered features, backend infrastructure.
                </p>
              </li>
              <li className="rounded-lg border border-white/10 p-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  Faculty Lecturer
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Software Analysis &amp; Design, curriculum and mentorship.
                </p>
              </li>
              <li className="rounded-lg border border-white/10 p-5">
                <h3 className="text-lg font-semibold tracking-tight">
                  Full-Stack Developer
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Django/DRF APIs, cloud deployment, sprint leadership.
                </p>
              </li>
            </ul>
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
            <ContactForm />
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
