import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/server/auth";
import { isDatabaseConfigured } from "@/lib/server/db";
import { BrandMark } from "../_components/brand";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const configured = isDatabaseConfigured();
  if (configured && (await getCurrentAdmin())) redirect("/admin/recruitment");
  const { next } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <BrandMark className="w-[170px] h-auto mx-auto text-[#171a21]" />
        <div className="mt-8 rounded-[6px] border border-[#dce2ef] bg-white p-6 sm:p-8 shadow-[0_20px_45px_rgba(23,34,56,0.06)]">
          <h1 className="font-display text-2xl font-semibold tracking-[-0.02em]">Recruitment admin</h1>
          <p className="mt-1 text-sm text-[#636873]">Sign in to manage internship applicants.</p>
          {configured ? (
            <LoginForm next={next ?? ""} />
          ) : (
            <p role="alert" className="mt-6 rounded-[4px] bg-[#fef3f2] border border-[#fecdca] p-3 text-sm text-[#b42318]">
              The database is not configured. Set MONGODB_URI and restart the server.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
