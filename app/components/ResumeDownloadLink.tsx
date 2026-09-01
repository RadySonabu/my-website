"use client";

import { useState } from "react";

export default function ResumeDownloadLink() {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <a
      href="/resume.pdf"
      download
      aria-label="Download resume (PDF)"
      onClick={() => {
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2000);
      }}
      className="mt-6 inline-block rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-white/5"
      style={{
        borderColor: "var(--hero-cream)",
        color: "var(--hero-cream)",
      }}
    >
      {downloaded ? "Downloaded ✓" : "Download Resume"}
    </a>
  );
}
