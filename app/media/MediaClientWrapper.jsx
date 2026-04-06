// app/media/MediaClientWrapper.jsx
'use client';

import { useState } from 'react';

export default function MediaClientWrapper({ headshotUrl, logoUrl }) {
  const [copiedShort, setCopiedShort] = useState(false);
  const [copiedLong, setCopiedLong] = useState(false);

  const shortBio = "Buhari AbdulFatai is a dedicated public servant with over two decades of legislative and executive experience. Having served as a Member of the House of Representatives, State Commissioner, and multi-term Senator, he has a proven track record of fighting for tech-driven infrastructure, economic revival, and the agricultural supply chain. He is running for Governor in 2027 to lead Oyo State into a new era of prosperity.";

  const longBio = "Born and raised with deep roots in Ogbomosho, Buhari AbdulFatai learned the value of hard work, community, and integrity from a young age. He was taught early on that true leadership is not about acquiring a title; it is about taking profound responsibility for the welfare of your people.\n\nOver the past two decades, he has had the distinct honor of serving Oyo State across multiple capacities. He began his legislative career representing the Ogbomosho North/South/Ori Ire Federal Constituency in the House of Representatives. As a State Commissioner, he managed complex administrative affairs across local governments, ensuring grassroots stability.\n\nIn the House of Senate, representing the Oyo North Senatorial District, he has spearheaded critical legislative oversight. He has served as Chairman of the Senate Committees on Aviation, Land Transport, and ICT & Cybercrime, driving modernization and digital security initiatives.\n\nNow, as the leading Gubernatorial Aspirant for 2027, his campaign is built on a four-pillar agenda: Economic Revival, 21st Century Education, Total Security, and Modern Infrastructure. He believes that with proven, competent management, Oyo State can achieve sustainable wealth and total security for every citizen.";

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'short') {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    } else {
      setCopiedLong(true);
      setTimeout(() => setCopiedLong(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">

      {/* ================= PAGE HEADER ================= */}
      <section className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#243465] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <span className="text-[#4b66c1] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                Press & Media
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Official <span className="text-[#4b66c1]">Press Kit</span>
              </h1>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base font-medium leading-relaxed md:text-right">
              Resources, official biographies, and high-resolution assets for journalists, broadcasters, and media professionals.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= LEFT COLUMN: CONTACT & ASSETS ================= */}
          <div className="lg:col-span-1 space-y-8">

            {/* Direct Press Contact Card */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100">
              <div className="w-12 h-12 bg-[#4b66c1]/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-[#4b66c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                </svg>
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Media Inquiries</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                For interview requests, press passes, or official statements, please contact our Communications Director directly.
              </p>
              <div className="pt-6 border-t border-slate-100">
                <p className="font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-sm font-medium text-[#4b66c1] mb-2">Director of Communications</p>
                <a href="mailto:press@campaign2027.com" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  press@campaign2027.com
                </a>
              </div>
            </div>

            {/* Downloadable Assets */}
            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 text-white">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-white">Brand Assets</h2>
              <div className="space-y-4">

                {/* Asset 1: Dynamic Governor Headshot Download */}
                <a
                  href={headshotUrl}
                  download="official-headshot.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-800 hover:bg-[#243465] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Official Headshots</p>
                      <p className="text-xs text-slate-400 group-hover:text-[#bcc8eb]">High-Res Image</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>

                {/* Asset 2: Logo Download */}
                <a
                  href={logoUrl}
                  download="campaign-logo.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-800 hover:bg-[#243465] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Campaign Logos</p>
                      <p className="text-xs text-slate-400 group-hover:text-[#bcc8eb]">PNG format</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>

              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: OFFICIAL BIOS ================= */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.06)] border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 border-b border-slate-100 pb-4">Official Biographies</h2>

              {/* Short Bio */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#4b66c1]">Short Bio (100 Words)</h3>
                  <button
                    onClick={() => handleCopy(shortBio, 'short')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {copiedShort ? <span className="text-[#4b66c1]">Copied!</span> : 'Copy Text'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-slate-700 leading-relaxed font-medium">{shortBio}</p>
                </div>
              </div>

              {/* Long Bio */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#4b66c1]">Full Bio (Detailed)</h3>
                  <button
                    onClick={() => handleCopy(longBio, 'long')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {copiedLong ? <span className="text-[#4b66c1]">Copied!</span> : 'Copy Text'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{longBio}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}