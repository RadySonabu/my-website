"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../lib/projects";

const ROTATE_INTERVAL_MS = 5500;
const MAX_VISIBLE = 5;

function initials(title: string) {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
}

const CARD_WIDTH_BASE = 236;
const CARD_HEIGHT_BASE = 350;
const STEP_X_BASE = 104;

function useCarouselScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.55);
      else if (w < 640) setScale(0.65);
      else if (w < 1024) setScale(0.8);
      else setScale(1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return scale;
}

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [front, setFront] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const scale = useCarouselScale();

  const total = projects.length;

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setFront((current) => (current + 1) % total);
      }
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [total]);

  if (total === 0) return null;

  // Visual footprint scaled for layout/positioning math only; the card's own
  // box stays at its base size so fixed-size text/padding never overflows -
  // the responsive shrink happens purely via the CSS transform scale below.
  const CARD_WIDTH = CARD_WIDTH_BASE * scale;
  const CARD_HEIGHT = CARD_HEIGHT_BASE * scale;
  const STEP_X = STEP_X_BASE * scale;

  const visibleCount = Math.min(MAX_VISIBLE, total);
  const leftCount = Math.floor((visibleCount - 1) / 2);
  const rightCount = visibleCount - 1 - leftCount;
  const positions = Array.from(
    { length: visibleCount },
    (_, i) => i - leftCount
  );
  const maxSide = Math.max(leftCount, rightCount);
  const containerWidth = CARD_WIDTH + maxSide * STEP_X * 2 + 24;

  return (
    <div
      className="relative mx-auto max-w-full"
      style={{
        width: containerWidth,
        height: CARD_HEIGHT + 24,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {positions.map((pos) => {
        const index = (((front + pos) % total) + total) % total;
        const project = projects[index];
        const isCenter = pos === 0;
        const depth = Math.abs(pos);
        const depthScale = 1 - depth * 0.12;
        const opacity = 1 - depth * 0.28;
        const translateX = pos * STEP_X;

        return (
          <Link
            key={`${project.slug}-${pos}`}
            href={`/projects/${project.slug}`}
            className="absolute left-1/2 top-1/2 flex flex-col overflow-hidden rounded-2xl border backdrop-blur transition-all duration-[1200ms] ease-in-out"
            style={{
              width: CARD_WIDTH_BASE,
              height: CARD_HEIGHT_BASE,
              transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${depthScale * scale})`,
              opacity,
              zIndex: 50 - depth,
              pointerEvents: isCenter ? "auto" : "none",
              backgroundColor:
                "color-mix(in srgb, var(--background) 94%, transparent)",
              borderColor: isCenter
                ? "var(--hero-cream)"
                : "rgba(255,255,255,0.12)",
              boxShadow: isCenter
                ? "0 0 18px 2px color-mix(in srgb, var(--hero-cream) 50%, transparent), 0 12px 40px 0 rgba(0,0,0,0.5)"
                : "0 8px 24px 0 rgba(0,0,0,0.4)",
            }}
          >
            <div className="relative flex h-32 shrink-0 items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] text-lg font-semibold text-muted">
              {initials(project.title)}
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-4 pb-5">
              <div className="flex items-center gap-1 text-[11px] text-muted">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  width="11"
                  height="11"
                  fill="currentColor"
                >
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                </svg>
                {project.role}
              </div>

              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>

              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted/70">
                  Description
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted">
                  {project.summary}
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-muted">
                <span>{project.year}</span>
                <span>{project.techStack.length} tech</span>
                <span>{project.featured ? "Featured" : "Project"}</span>
              </div>

              <div className="flex items-center justify-between pt-1.5">
                <span className="text-xs font-medium text-foreground/90">
                  View project
                </span>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: isCenter
                      ? "var(--hero-cream)"
                      : "rgba(255,255,255,0.2)",
                    color: isCenter ? "var(--hero-cream)" : undefined,
                  }}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
