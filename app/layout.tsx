import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import PersonJsonLd from "./components/PersonJsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ardyubanos.vercel.app"),
  title: "Ardy Ubanos - AI Developer & Python Developer, Philippines",
  description:
    "Ardy Ubanos is a Senior Software Engineer and part-time Faculty Lecturer based in Metro Manila, Philippines, building Python backends and AI/LLM-powered products.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ardy Ubanos - AI Developer & Python Developer, Philippines",
    description:
      "Senior Software Engineer and part-time Faculty Lecturer based in Metro Manila, Philippines, building Python backends and AI/LLM-powered products.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ardy Ubanos - AI Developer & Python Developer, Philippines",
    description:
      "Senior Software Engineer and part-time Faculty Lecturer based in Metro Manila, Philippines, building Python backends and AI/LLM-powered products.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PersonJsonLd />
        {children}
      </body>
    </html>
  );
}
