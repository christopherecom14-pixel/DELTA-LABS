import type { Metadata } from "next";
import { headers } from "next/headers";
import deltaLogo from "../output/logo-concepts/06-interlocking-flows.png";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "delta-labs-engineering-change.asharautomate.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const title = "Delta Labs — AI-powered business systems";
  const description = "We build AI agents, automation and software that eliminate manual work, connect fragmented operations and help businesses scale.";

  return {
    metadataBase: base,
    title,
    description,
    icons: { icon: deltaLogo.src, apple: deltaLogo.src },
    openGraph: { title, description, type: "website", url: base, images: [{ url: new URL("/og.png", base).toString(), width: 1536, height: 1024, alt: "Delta Labs — AI-powered business systems" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
