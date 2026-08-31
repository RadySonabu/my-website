import ScrollReveal from "./components/ScrollReveal";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Home() {
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

        {/* feature 2 (Projects grid & detail pages) inserts its card grid here */}
        <section id="projects" aria-label="Projects" />

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
