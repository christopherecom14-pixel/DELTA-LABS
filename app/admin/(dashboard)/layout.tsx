import Link from "next/link";
import { can, requireAdmin } from "@/lib/server/auth";
import { logoutAction } from "../actions";
import { BrandMark } from "../_components/brand";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin("view");
  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#dfe2e9]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4 sm:gap-8">
          <Link href="/admin/recruitment" className="shrink-0" aria-label="Recruitment dashboard">
            <BrandMark className="w-[118px] h-auto text-[#171a21]" />
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link href="/admin/recruitment" className="px-3 py-2 rounded-[3px] hover:bg-[#f0f3f8]">Applicants</Link>
            {can(user.role, "manage") && (
              <Link href="/admin/users" className="px-3 py-2 rounded-[3px] hover:bg-[#f0f3f8]">Team</Link>
            )}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-[#636873]">
              {user.name} · <span className="capitalize">{user.role}</span>
            </span>
            <form action={logoutAction}>
              <button type="submit" className="h-9 px-3 rounded-[3px] border border-[#d5dae3] bg-white font-medium hover:border-[#171a21] cursor-pointer">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</div>
    </>
  );
}
