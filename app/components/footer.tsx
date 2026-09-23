import Link from "next/link";

function BrandLockup({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370 108" aria-hidden="true">
      <path d="M49 8 13 73h24L62 28Z" fill="currentColor" />
      <path d="m65 35-12 22 10 17H43L31 94h66Z" fill="currentColor" />
      <text x="126" y="61" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="31" letterSpacing="1.1" fill="currentColor">DELTA LABS</text>
    </svg>
  );
}

export function Footer({ hideTeaser = false }: { hideTeaser?: boolean }) {
  return (
    <footer className="bg-[#fafbfc] border-t border-[#171a21]/[0.08] mt-16 sm:mt-24 md:mt-32">
      {/* High impact CTA teaser */}
      {!hideTeaser && (
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 text-center border-b border-[#171a21]/[0.08] relative overflow-hidden">
          {/* Subtle glow blob */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[300px] bg-[#2e4dff]/8 rounded-full blur-[100px]" />
          </div>
          <div className="relative max-w-4xl mx-auto">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2e4dff] block mb-3 sm:mb-4">
              Operational systems assessment
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 sm:mb-10 tracking-tight text-[#171a21]">
              Which part of the operation should work better?
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 bg-[#2e4dff] text-white text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#1534dc] hover:scale-105 shadow-[0_0_32px_rgba(46,77,255,0.25)] rounded-[4px]"
            >
              Map the Operational Gap ↗
            </Link>
          </div>
        </section>
      )}

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3 text-[#171a21] group mb-5">
                <BrandLockup className="w-[170px] h-auto text-[#171a21]" />
              </Link>
              <p className="text-[#636873] text-xs sm:text-sm max-w-md leading-relaxed font-body">
                We find operational friction and engineer the systems that move
                businesses forward.
              </p>
            </div>
            <div className="mt-6 sm:mt-8 font-mono text-xs text-[#636873] uppercase tracking-widest font-semibold flex items-center gap-2">
              <span className="text-[#2e4dff] font-bold text-sm">Δ</span>
              <span>Change is the product. Technology is the mechanism.</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#87909f] mb-4 sm:mb-6">
              Navigation
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#636873]">
              <li><Link href="/" className="hover:text-[#171a21] transition-colors block py-0.5">Home</Link></li>
              <li><Link href="/services" className="hover:text-[#171a21] transition-colors block py-0.5">Systems & Capabilities</Link></li>
              <li><Link href="/methodology" className="hover:text-[#171a21] transition-colors block py-0.5">The Delta Method</Link></li>
              <li><Link href="/contact" className="hover:text-[#171a21] transition-colors block py-0.5">Map the Operational Gap</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] font-semibold text-[#87909f] mb-4 sm:mb-6">
              Direct Contact
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <a
                href="mailto:hello@deltalabs.tech"
                className="block font-display text-lg sm:text-xl md:text-2xl font-bold text-[#171a21] hover:text-[#2e4dff] transition-colors border-b border-[#171a21]/[0.08] pb-2 break-all"
              >
                hello@deltalabs.tech
              </a>
              <p className="font-mono text-[11px] sm:text-xs text-[#87909f] uppercase tracking-widest pt-1">
                Pakistan-based · Local and international work
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-[#171a21]/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 font-mono text-[10px] sm:text-xs text-[#87909f] uppercase tracking-wider text-center sm:text-left">
          <span>© {new Date().getFullYear()} Delta Labs. Engineering change.</span>
          <span>Serving international markets</span>
        </div>
      </div>
    </footer>
  );
}
