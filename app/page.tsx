import ContactForm from "./components/ContactForm";
import Logo from "./components/Logo";
import ProjectCarousel from "./components/ProjectCarousel";
import ProjectsGrid from "./components/ProjectsGrid";
import ScrollReveal from "./components/ScrollReveal";
import ServicesSection from "./components/ServicesSection";
import { getAllProjects } from "./lib/projects";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

export default async function Home() {
  const projects = await getAllProjects();

  return (
    <>
      <nav
        aria-label="Primary"
        className="sticky top-0 z-10 border-b border-white/10 bg-background/80 px-6 py-4 backdrop-blur sm:px-10 lg:px-16"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <a href="#home" aria-label="Home">
            <Logo />
          </a>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <section
          id="home"
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 sm:px-10 lg:px-16"
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

          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-10">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-muted">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Currently available for new projects
              </span>

              <h1
                className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
                style={{ color: "var(--hero-cream)" }}
              >
                AI That Sh<span className="hero-gradient-letter">i</span>ps
              </h1>
              <p className="mt-3 max-w-md text-lg text-muted">
                We offer AI solutions to your personal and business needs.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                  Metro Manila, PH &middot; Serving clients worldwide
                </span>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <a
                  href="#contact"
                  className="inline-block rounded-full px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--hero-cream)" }}
                >
                  Get in Touch
                </a>
                <a
                  href="#projects"
                  className="inline-block rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{
                    borderColor: "var(--hero-cream)",
                    color: "var(--hero-cream)",
                  }}
                >
                  View Our Work
                </a>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="w-full lg:w-auto lg:shrink-0">
                <ProjectCarousel projects={projects} />
              </div>
            )}
          </div>
        </section>

        {projects.length > 0 && (
          <section
            id="projects"
            aria-label="Projects"
            className="mx-auto max-w-5xl px-6 py-24 sm:px-10 lg:px-16"
          >
            <ScrollReveal>
              <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
                Projects
              </h2>
              <div className="mt-10">
                <ProjectsGrid projects={projects} />
              </div>
            </ScrollReveal>
          </section>
        )}

        <section
          id="about"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center sm:px-10 lg:px-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--hero-gradient-start) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full opacity-20 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--hero-cream) 0%, transparent 70%)",
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="pointer-events-none absolute right-8 top-16 h-32 w-32 opacity-30 sm:h-40 sm:w-40"
          >
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="var(--hero-cream)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="var(--hero-gradient-start)"
              strokeWidth="1"
            />
            <circle cx="100" cy="30" r="3" fill="var(--hero-cream)" />
          </svg>

          <ScrollReveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              About
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              At Ubanox, we solve problems other teams get stuck on.
              We&apos;re an AI solutions company based in Metro Manila,
              Philippines, built around one idea: the best fix isn&apos;t
              always the obvious one, so we look sideways before we look
              harder.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              We work across Python backend systems, LLM integration, and
              full-stack delivery — turning ambiguous problems into shipped,
              working products. If the standard approach doesn&apos;t fit
              your problem, we&apos;ll find the one that does.
            </p>
            <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
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
          id="services"
          className="mx-auto max-w-5xl px-6 py-24 sm:px-10 lg:px-16"
        >
          <ScrollReveal>
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              Services
            </h2>
            <div className="mt-10">
              <ServicesSection />
            </div>
          </ScrollReveal>
        </section>

        <section
          id="contact"
          className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 sm:px-10 lg:px-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--hero-gradient-start) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-0 h-[320px] w-[320px] rounded-full opacity-20 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, var(--hero-cream) 0%, transparent 70%)",
            }}
          />

          <ScrollReveal>
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
              <div className="flex flex-col items-center text-center lg:w-1/2 lg:items-start lg:text-left">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 160 160"
                  className="h-28 w-28 opacity-80 sm:h-36 sm:w-36"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    fill="none"
                    stroke="var(--hero-cream)"
                    strokeWidth="1"
                    strokeDasharray="3 7"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="38"
                    fill="none"
                    stroke="var(--hero-gradient-start)"
                    strokeWidth="1"
                  />
                  <circle cx="80" cy="20" r="3" fill="var(--hero-cream)" />
                  <circle cx="128" cy="104" r="2" fill="var(--hero-gradient-start)" />
                </svg>

                <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let&apos;s build something
                </h2>
                <p className="mt-4 max-w-sm text-lg text-muted">
                  Have a project in mind, or just want to explore what&apos;s
                  possible with AI? Tell us about it and we&apos;ll get back
                  to you.
                </p>
                {/* <a
                  href="mailto:hello@ubanox.com"
                  className="mt-4 text-sm font-medium text-foreground/80 underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground"
                >
                  hello@gmail.com
                </a> */}
              </div>

              <div className="w-full lg:w-1/2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
