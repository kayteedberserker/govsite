// components/Footer.jsx
"use client";

import Link from 'next/link';

export default function Footer() {
  // Social media configuration with unique links and raw SVG icons
  const socialLinks = [
    {
      platform: 'Facebook',
      href: 'https://www.facebook.com/share/1E38KRKSCJ/',
      // Facebook Icon
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      hoverColor: 'hover:bg-[#1877F2]'
    },
    {
      platform: 'Twitter',
      href: '#',
      // X (Twitter) Icon
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverColor: 'hover:bg-black'
    },
    {
      platform: 'Instagram',
      href: '#',
      // Instagram Icon
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      hoverColor: 'hover:bg-[#E4405F]'
    },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 border-t border-[#243465]/40 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#4b66c1]/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= TOP SECTION: BRANDING ================= */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-16 border-b border-slate-900">
          <div className="max-w-xl">
            <Link href="/" className="flex items-center gap-4 mb-8 group">
              <div className="w-14 h-14 bg-[#243465] text-white flex items-center justify-center rounded-2xl font-bold text-2xl shadow-lg shadow-[#172242]/50 group-hover:rotate-6 transition-transform duration-300">
                BAF
              </div>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 leading-tight mb-6">
              A new vision for progress, <br className="hidden md:block" />
              built on <span className="text-[#4b66c1]">transparency</span> and action.
            </h2>
          </div>

          {/* Social Links as Premium Floating Cards */}
          <div className="flex gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.platform}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 ${item.hoverColor} hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-xl`}
                aria-label={item.platform}
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ================= MIDDLE SECTION: ASYMMETRICAL GRID ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 py-16">

          {/* Column 1: Navigation */}
          <div className="col-span-1">
            <h3 className="text-[#4b66c1] font-bold text-xs tracking-[0.2em] uppercase mb-8">Navigation</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="hover:text-white transition-colors text-sm font-semibold">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors text-sm font-semibold">Meet the Candidate</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors text-sm font-semibold">Campaign Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors text-sm font-semibold">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Column 2: Quick Actions */}
          <div className="col-span-1">
            <h3 className="text-[#4b66c1] font-bold text-xs tracking-[0.2em] uppercase mb-8">Connect</h3>
            <ul className="space-y-4">
              <li><Link href="/contact" className="hover:text-white transition-colors text-sm font-semibold text-[#4b66c1] underline decoration-[#4b66c1]/40 underline-offset-4">Volunteer Today</Link></li>
              <li><Link href="/updates" className="hover:text-white transition-colors text-sm font-semibold">Campaign Updates</Link></li>
              <li><Link href="/media" className="hover:text-white transition-colors text-sm font-semibold">Media Inquiries</Link></li>
            </ul>
          </div>

          {/* Column 3: Location */}
          <div className="col-span-2">
            <h3 className="text-[#4b66c1] font-bold text-xs tracking-[0.2em] uppercase mb-8">Headquarters</h3>
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#4b66c1]/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#4b66c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-lg mb-1">Central District Office</p>
                  <p className="text-sm leading-relaxed text-slate-400">123 Freedom Way, Suite 400<br />Capital City, State HQ</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4b66c1]/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#4b66c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">info@buhariabdulfatai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-slate-600 tracking-widest uppercase text-center md:text-left">
            &copy; 2027 BUHARI ABDULFATAI Campaign Organization (BAFCO).
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#4b66c1] hover:text-white transition-colors"
          >
            Back to Top
            <div className="w-8 h-8 rounded-full border border-[#4b66c1]/40 flex items-center justify-center group-hover:bg-[#4b66c1] group-hover:text-white transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}