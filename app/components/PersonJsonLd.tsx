export default function PersonJsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ardy Ubanos",
    jobTitle: "Senior Software Engineer",
    description:
      "Senior Software Engineer and part-time Faculty Lecturer based in Metro Manila, Philippines, building Python backends and AI/LLM-powered products.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Metro Manila",
      addressCountry: "PH",
    },
    sameAs: ["https://www.linkedin.com/in/ardy-ubanos/"],
    knowsAbout: [
      "Python",
      "Software Engineering",
      "Artificial Intelligence",
      "Large Language Models",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
