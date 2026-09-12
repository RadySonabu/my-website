import {
  Bot,
  Code2,
  Compass,
  Database,
  GraduationCap,
  Megaphone,
  Palette,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    title: "AI integration & automation",
    description:
      "We add LLM-powered features, chatbots, and agents to your product, or automate the manual workflows slowing your team down. From a single feature to a full pipeline, we scope it to what actually moves the needle.",
    icon: Bot,
  },
  {
    title: "Custom software & web development",
    description:
      "Full-stack web apps and internal tools built on Next.js and React, from a first prototype to a production launch. We handle the whole build, not just the frontend.",
    icon: Code2,
  },
  {
    title: "Data & backend systems",
    description:
      "APIs, databases, and data pipelines designed to hold up under real usage. We design schemas and services that stay maintainable as your product grows.",
    icon: Database,
  },
  {
    title: "Consulting & strategy",
    description:
      "Not sure where AI or a rebuild fits into your roadmap? We assess your current setup and recommend a concrete, sequenced plan rather than a generic playbook.",
    icon: Compass,
  },
  {
    title: "Marketing",
    description:
      "Positioning and content support for launches and ongoing growth, informed by the same practical lens we bring to engineering work.",
    icon: Megaphone,
  },
  {
    title: "UI/UX design",
    description:
      "Interfaces designed for clarity first, aesthetics second, but never sacrificing either. We design and build in the same team, so nothing gets lost in handoff.",
    icon: Palette,
  },
  {
    title: "Training & workshops",
    description:
      "Hands-on sessions for teams adopting AI tools or a new stack, focused on what your team will actually use day-to-day rather than a generic curriculum.",
    icon: GraduationCap,
  },
];
