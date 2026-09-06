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
      className="mt-6 inline-block rounded-full px-5 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
      style={{
        backgroundColor: "var(--hero-cream)",
      }}
    >
      {downloaded ? "Downloaded ✓" : "Download Resume"}
    </a>
  );
}
