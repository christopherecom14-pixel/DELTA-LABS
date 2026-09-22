import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { StructuredData } from "./structured-data";

const siteUrl = new URL("https://deltalabs.tech");
const defaultTitle = "Custom Business Systems. Engineering Change. | Delta Labs";
const defaultDescription =
  "Delta Labs designs and builds custom software, ERP systems and automation around the way your business actually works. Based in Pakistan, working internationally.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: defaultTitle, template: "%s | Delta Labs" },
  description: defaultDescription,
  applicationName: "Delta Labs",
  alternates: { canonical: "/" },
  icons: { icon: "/icon.png" },
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
    siteName: "Delta Labs",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [
      {
        url: new URL("/og.png", siteUrl).toString(),
        width: 1536,
        height: 1024,
        alt: "Delta Labs — Engineering change through dependable business systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [new URL("/og.png", siteUrl).toString()],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=DM+Sans:wght@400;450;500;550;600;650;700&family=Manrope:wght@400;500;600;650;700;750;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#0A0B0D] text-[#F0F2F5] font-body selection:bg-[#3B8BFF] selection:text-white min-h-screen flex flex-col">
        <StructuredData />
        <Navbar />
        <div className="flex-1 w-full">{children}</div>
      </body>
    </html>
  );
}
