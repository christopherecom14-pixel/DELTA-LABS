import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { StructuredData } from "./structured-data";

const siteName = "Delta Labs";
const defaultTitle = "AI Automation & Custom Software | Delta Labs";
const defaultDescription =
  "Delta Labs builds AI agents, workflow automation and custom software that reduce manual work, connect business systems and help growing teams scale.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "delta-labs-engineering-change.asharautomate.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const canonical = new URL("/", base);

  return {
    metadataBase: base,
    title: { default: defaultTitle, template: `%s | ${siteName}` },
    description: defaultDescription,
    applicationName: siteName,
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      siteName,
      type: "website",
      locale: "en_US",
      url: canonical,
      images: [{ url: new URL("/og.png", base).toString(), width: 1536, height: 1024, alt: "Delta Labs AI automation and custom software" }],
    },
    twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription, images: [new URL("/og.png", base).toString()] },
    category: "technology",
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StructuredData />{children}</body></html>;
}
