import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delta Labs — Engineering Change",
  description:
    "Delta Labs builds AI, software, automation and intelligent business systems designed to create measurable change.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
