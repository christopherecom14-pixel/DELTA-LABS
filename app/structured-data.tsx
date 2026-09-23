const origin = "https://deltalabs.tech";

export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": origin + "/#organization",
        name: "Delta Labs",
        url: origin + "/",
        logo: {
          "@type": "ImageObject",
          "@id": origin + "/#logo",
          url: origin + "/delta-logo.png",
          contentUrl: origin + "/delta-logo.png",
          caption: "Delta Labs",
        },
        email: "hello@deltalabs.tech",
        description:
          "Pakistan-based business systems engineering company that maps operational gaps and builds dependable software, workflows, and connected infrastructure.",
        areaServed: ["Pakistan", "International markets"],
        knowsAbout: [
          "Operational discovery",
          "Business systems architecture",
          "Custom business software",
          "ERP systems",
          "Workflow automation",
          "AI-assisted operations",
          "Systems integration",
        ],
      },
      {
        "@type": "WebSite",
        "@id": origin + "/#website",
        url: origin + "/",
        name: "Delta Labs",
        publisher: { "@id": origin + "/#organization" },
        inLanguage: "en",
      },
      ...[
        [
          "Operational Systems Assessment",
          "Mapping the current operation, defining the required change, and identifying the highest-leverage system opportunity.",
        ],
        [
          "Custom Business Systems",
          "Focused internal software, ERP modules, portals, and calculation systems built around real operating requirements.",
        ],
        [
          "Workflow Automation",
          "Connected workflows for stable rules, handoffs, approvals, routing, reporting, and exception handling.",
        ],
        [
          "AI-Assisted Operations",
          "Bounded AI-assisted responsibilities with controlled data access, clear escalation, and human ownership.",
        ],
        [
          "Systems Integration",
          "Connections and shared data flows that make existing and new business systems work as one operating layer.",
        ],
      ].map(([name, description], index) => ({
        "@type": "Service",
        "@id": origin + "/#service-" + (index + 1),
        name,
        description,
        provider: { "@id": origin + "/#organization" },
        areaServed: ["Pakistan", "International markets"],
        url: origin + "/services",
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
