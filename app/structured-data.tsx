import { headers } from "next/headers";

export async function StructuredData() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "delta-labs-engineering-change.asharautomate.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "Delta Labs",
        url: `${origin}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${origin}/#logo`,
          url: `${origin}/icon.png`,
          contentUrl: `${origin}/icon.png`,
          caption: "Delta Labs",
        },
        email: "hello@deltalabs.com",
        description: "Delta Labs designs and builds AI agents, workflow automation, custom software and integrated business systems for growing companies.",
        areaServed: "Worldwide",
        knowsAbout: ["AI agents", "workflow automation", "custom software", "systems integration", "business process automation"],
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/`,
        name: "Delta Labs",
        publisher: { "@id": `${origin}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": `${origin}/#webpage`,
        url: `${origin}/`,
        name: "AI Automation & Custom Software | Delta Labs",
        description: "AI agents, workflow automation and custom software for growing businesses.",
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@id": `${origin}/#organization` },
        inLanguage: "en",
      },
      ...[
        ["AI Agent Development", "Purpose-built AI agents that qualify leads, retrieve company knowledge, coordinate work and support business decisions."],
        ["Workflow Automation", "Connected business workflows that move information, trigger actions and remove repetitive manual handoffs."],
        ["Custom Software Development", "Internal tools and business applications designed around a company's real operating processes."],
        ["Business Systems Integration", "Integration of CRM, communication, data, marketing and delivery tools into a dependable operating layer."],
      ].map(([name, description], index) => ({
        "@type": "Service",
        "@id": `${origin}/#service-${index + 1}`,
        name,
        description,
        provider: { "@id": `${origin}/#organization` },
        areaServed: "Worldwide",
        url: `${origin}/#solutions`,
      })),
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
