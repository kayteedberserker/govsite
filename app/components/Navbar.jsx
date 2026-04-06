// components/Navbar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Change navbar styling on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when a route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open (Premium app-like feel)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  // Split links for the symmetrical desktop layout
  const leftLinks = navLinks.slice(0, 2);
  const rightLinks = navLinks.slice(2, 4);

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-[#243465]/10 shadow-sm py-3'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center relative w-full">

            {/* ================= MOBILE: LOGO (Hidden on Desktop) ================= */}
            <div className="lg:hidden flex items-center z-50">
              <Link href="/" className="flex items-center gap-3 group">
                <div className={`flex items-center justify-center rounded-xl font-bold transition-all duration-500 shadow-lg shadow-[#243465]/20 w-10 h-10 bg-[#243465] text-white text-lg`}>
                  BAF
                </div>
              </Link>
            </div>

            {/* ================= DESKTOP: TIGHT CENTERED GROUP ================= */}
            {/* By placing the links and logo in one absolute centered container, they stay close together */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 xl:gap-12">

              {/* Left Links */}
              <div className="flex items-center gap-8">
                {leftLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`text-sm tracking-wide font-bold uppercase transition-all duration-300 ${isActive
                        ? 'text-[#4b66c1]'
                        : 'text-slate-500 hover:text-[#4b66c1] hover:-translate-y-0.5'
                        }`}
                    >
                      {link.name}
                      {isActive && <div className="h-0.5 w-full bg-[#4b66c1] mt-1 rounded-full" />}
                    </Link>
                  );
                })}
              </div>

              {/* Desktop Logo */}
              <Link href="/" className="flex items-center gap-3 group px-2">
                <div className={`flex items-center justify-center rounded-xl font-bold transition-all duration-500 shadow-lg shadow-[#243465]/20 ${scrolled ? 'w-10 h-10 bg-[#243465] text-white text-lg' : 'w-12 h-12 bg-slate-900 text-white text-xl'
                  }`}>
                  BAF
                </div>
              </Link>

              {/* Right Links */}
              <div className="flex items-center gap-8">
                {rightLinks.map((link) => {
                  const isActive = pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      href={link.path}
                      className={`text-sm tracking-wide font-bold uppercase transition-all duration-300 ${isActive
                        ? 'text-[#4b66c1]'
                        : 'text-slate-500 hover:text-[#4b66c1] hover:-translate-y-0.5'
                        }`}
                    >
                      {link.name}
                      {isActive && <div className="h-0.5 w-full bg-[#4b66c1] mt-1 rounded-full" />}
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* ================= RIGHT SIDE: CTA & HAMBURGER ================= */}
            <div className="flex items-center gap-3 ml-auto z-50">
              <Link
                href="/contact"
                className="hidden lg:inline-flex bg-[#243465] hover:bg-[#172242] text-white px-7 py-3 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-300 shadow-md shadow-[#243465]/20 hover:shadow-xl hover:shadow-[#243465]/30 active:scale-[0.98]"
              >
                Support Us
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-3 rounded-xl transition-colors duration-300 focus:outline-none ${isOpen ? 'bg-slate-100 text-slate-900' : 'bg-white shadow-sm border border-slate-100 text-slate-900'
                  }`}
              >
                {/* Hamburger Icon */}
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h16" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* ================= MOBILE: OVERLAY BACKDROP ================= */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ================= MOBILE: SLIDING NATIVE-STYLE DRAWER ================= */}
      <div
        className={`fixed inset-y-0 right-0 w-[85vw] max-w-sm bg-white z-50 lg:hidden shadow-2xl flex flex-col transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Explicit Close Header */}
        <div className="flex justify-between items-center px-8 pt-6 pb-4 border-b border-slate-100">
          <span className="font-bold text-slate-900 tracking-wide uppercase text-sm"></span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`py-4 text-2xl font-extrabold tracking-tight transition-colors border-b border-slate-100 ${isActive
                    ? 'text-[#4b66c1]'
                    : 'text-slate-400 hover:text-slate-900'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-12">
            <Link
              href="/contact"
              className="flex items-center justify-center w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              Support The Campaign
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <p className="text-sm font-bold text-slate-900 mb-2">Campaign Headquarters</p>
            <p className="text-sm text-slate-500 mb-4">123 Freedom Way,<br />Capital City</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#4b66c1] font-bold">X</div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#4b66c1] font-bold">in</div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#4b66c1] font-bold">ig</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}