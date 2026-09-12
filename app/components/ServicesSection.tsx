import { services } from "../lib/services";

export default function ServicesSection() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Icon
                  className="h-5 w-5"
                  style={{ color: "var(--hero-cream)" }}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{service.description}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-10 text-center text-sm text-muted">
        We work end-to-end, from idea to launch, so you have one team
        accountable for the whole build.
      </p>
    </div>
  );
}
