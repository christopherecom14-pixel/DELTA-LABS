import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Recruitment", template: "%s · Recruitment admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#f4f6fa] text-[#171a21]">{children}</div>;
}
