import type { MetadataRoute } from "next";
import { headers } from "next/headers";

async function getOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "delta-labs-engineering-change.asharautomate.chatgpt.site";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getOrigin();

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
