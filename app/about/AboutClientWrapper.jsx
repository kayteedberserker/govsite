// app/about/AboutClientWrapper.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const testimonials = [
  {
    id: 1,
    quote: "A leader who actually listens. His economic policies saved my small business during the hardest times. He doesn't just talk; he executes.",
    name: "Sarah O.",
    role: "Market Chairwoman & Entrepreneur"
  },
  {
    id: 2,
    quote: "For the first time in a decade, we have someone who understands the tech ecosystem and youth empowerment. His vision is practical, not just political.",
    name: "David A.",
    role: "Startup Founder & Youth Advocate"
  },
  {
    id: 3,
    quote: "Integrity isn't just a buzzword for him. He delivered on the agricultural supply chain promises when no one else would step up.",
    name: "Dr. Ibrahim M.",
    role: "Director, Farmers Cooperative"
  }
];

export default function AboutClientWrapper({ heroImages, govPortrait }) {
  // --- STATE FOR CAROUSELS ---
  const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
  const [testIdx, setTestIdx] = useState(0);
  const [isHoveringTestimonials, setIsHoveringTestimonials] = useState(false);

  // Auto-play Hero Image Carousel (Crossfade)
  useEffect(() => {
    if (heroImages.length <= 1) return; 
    const interval = setInterval(() => {
      setCurrentHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-play Testimonial Carousel
  useEffect(() => {
    if (isHoveringTestimonials) return; // Pause on hover
    
    const interval = setInterval(() => {
      setTestIdx((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Changes every 6 seconds
    
    return () => clearInterval(interval);
  }, [isHoveringTestimonials]);

  const nextTestimonial = () => setTestIdx((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setTestIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-emerald-800 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="max-w-2xl">
              <span className="text-emerald-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                Meet The Candidate
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6">
                A lifetime of <span className="text-emerald-500 italic">service.</span> <br />
                A vision for <span className="underline decoration-emerald-600 decoration-4 underline-offset-8">tomorrow.</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
                I am not running to be somebody; I am running to do something. Our state stands at a crossroads, and it is time for leadership that prioritizes transparency, economic revival, and the security of every citizen.
              </p>
            </div>

            {/* Dynamic Hero Portrait Carousel */}
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <div className="absolute inset-0 bg-slate-800 animate-pulse z-0"></div>
              
              {heroImages.map((src, idx) => (
                <img 
                  key={idx}
                  src={src} 
                  alt={`Candidate Portrait ${idx + 1}`} 
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out z-10 ${
                    idx === currentHeroIdx 
                      ? 'opacity-80 grayscale-0 scale-100'
                      : 'opacity-0 grayscale scale-105 pointer-events-none'
                  }`}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-20"></div>
              
              {heroImages.length > 1 && (
                <div className="absolute top-6 right-6 flex gap-2 z-30">
                  {heroImages.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentHeroIdx ? 'w-6 bg-emerald-500' : 'w-2 bg-white/30'}`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute bottom-8 left-8 z-30">
                <p className="text-white font-black text-3xl tracking-tight">Buhari AbdulFatai</p>
                <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">For Governor 2027</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= THE ORIGIN STORY ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* The Text Column */}
            <div className="lg:col-span-7 prose prose-lg prose-slate">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">Rooted in our communities. Built for this moment.</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Born and raised in the heart of the capital, I learned the value of hard work and integrity from my parents. My father was a public school teacher, and my mother ran a small market stall. They taught me that leadership is not about title; it is about taking responsibility for your community.
              </p>
              <p className="text-slate-600 leading-relaxed mb-10">
                After graduating with honors in Economics and serving in the private sector for over two decades, I saw firsthand how disconnected our current policies are from the realities of everyday business owners, farmers, and youth. We don't just need better politicians; we need better managers of our state's vast resources.
              </p>

              <blockquote className="border-l-4 border-emerald-600 pl-6 py-2 my-12 bg-slate-50 rounded-r-2xl shadow-sm">
                <p className="text-2xl font-bold text-slate-800 italic leading-snug">
                  "We cannot tax our way to prosperity, nor can we secure our future without investing heavily in the minds of our youth today."
                </p>
              </blockquote>

              <p className="text-slate-600 leading-relaxed">
                My transition into public service was driven by a simple conviction: If competent people step back, the incompetent will step up. For the past six years serving as [Previous Title/Role], I have fought to reduce bureaucratic waste, champion tech-driven education, and empower local agriculture. But the work is not finished.
              </p>
            </div>

            {/* The Official Governor Portrait Column */}
            <div className="lg:col-span-5 sticky top-32 hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white p-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                  <img src={govPortrait} alt="Official Portrait" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                     <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-1">Official Campaign Portrait</p>
                     <p className="text-white font-black text-xl">The Candidate</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= THE TRACK RECORD (TIMELINE) ================= */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">A Record of Results</h2>
            <p className="text-slate-500 mt-4 font-medium uppercase tracking-widest text-sm">Actions Speak Louder Than Promises</p>
          </div>

          <div className="relative border-l-2 border-emerald-200 ml-4 md:ml-1/2">
            {/* Timeline Item 1 */}
            <div className="mb-12 relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5 z-10"></div>
              <div className="md:hidden absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5"></div>
              
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">2018 - 2022</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Commissioner of Economic Planning</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Spearheaded the "State First" initiative, driving a 24% increase in foreign direct investment and streamlining the business registration process for thousands of SMEs.
                </p>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="mb-12 relative pl-8 md:pl-0 flex justify-end">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5 z-10"></div>
              <div className="md:hidden absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5"></div>
              
              <div className="md:w-1/2 md:pl-12 text-left">
                <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">2012 - 2018</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">CEO, State Development Bank</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Restructured the bank's loan portfolio to favor local agriculture and tech startups, creating an estimated 15,000 direct jobs across rural communities.
                </p>
              </div>
            </div>

             {/* Timeline Item 3 */}
             <div className="relative pl-8 md:pl-0">
              <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5 z-10"></div>
              <div className="md:hidden absolute -left-[9px] w-4 h-4 rounded-full bg-emerald-600 border-4 border-slate-50 mt-1.5"></div>
              
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-emerald-600 font-bold tracking-widest text-sm uppercase">Early Career</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Grassroots Organizer & Advocate</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Founded the Youth Empowerment Network, providing free vocational training and scholarships to over 5,000 underprivileged students in the capital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE PILLARS ================= */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">The 2027 Agenda</h2>
            <p className="text-emerald-500 mt-4 font-bold uppercase tracking-widest text-sm">Four Pillars of Progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Economic Revival</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Slashing red tape, providing tax holidays for tech startups, and aggressively backing the agricultural supply chain to create sustainable wealth.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">21st Century Education</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Revamping public school curricula to include coding, vocational arts, and financial literacy, while improving teacher welfare and training.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Total Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Deploying modern technology, increasing community policing, and ensuring our law enforcement officers have the gear and morale they need.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Infrastructure</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Upgrading road networks linking farms to markets, investing in clean water initiatives, and pushing for stable power grids across all local governments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DYNAMIC TESTIMONIAL CAROUSEL ================= */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Voices of the People</h2>
            <p className="text-emerald-600 mt-4 font-bold uppercase tracking-widest text-sm">What community leaders are saying</p>
          </div>

          <div 
            className="relative w-full max-w-4xl mx-auto h-[350px] md:h-[300px] flex items-center justify-center"
            onMouseEnter={() => setIsHoveringTestimonials(true)}
            onMouseLeave={() => setIsHoveringTestimonials(false)}
          >
            {testimonials.map((test, idx) => {
              let position = 'next';
              if (idx === testIdx) position = 'active';
              else if (idx === (testIdx - 1 + testimonials.length) % testimonials.length) position = 'prev';

              return (
                <div 
                  key={test.id}
                  className={`absolute w-full px-4 md:px-12 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    position === 'active' 
                      ? 'opacity-100 scale-100 translate-x-0 z-20' 
                      : position === 'prev' 
                        ? 'opacity-0 scale-90 -translate-x-[50%] blur-sm z-10 pointer-events-none'
                        : 'opacity-0 scale-90 translate-x-[50%] blur-sm z-10 pointer-events-none'
                  }`}
                >
                  <div className="bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-800 relative text-center">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-emerald-500/10">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                    
                    <p className="relative z-10 text-lg md:text-2xl text-slate-300 font-medium italic leading-relaxed mb-8">
                      "{test.quote}"
                    </p>
                    <div className="relative z-10">
                      <p className="text-white font-black text-xl">{test.name}</p>
                      <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest mt-1">{test.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Premium Control Pod */}
          <div className="flex justify-center mt-12 relative z-30">
            <div className="inline-flex items-center bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100">
              <button 
                onClick={prevTestimonial}
                className="group flex items-center gap-3 px-6 py-3 rounded-full text-slate-600 font-bold uppercase tracking-widest text-xs hover:bg-slate-50 hover:text-slate-900 transition-all duration-300 active:scale-95"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Prev
              </button>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <button 
                onClick={nextTestimonial}
                className="group flex items-center gap-3 px-8 py-3 rounded-full bg-slate-900 text-white font-bold uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all duration-300 shadow-md active:scale-95"
              >
                Next
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Ready to make history?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-10 text-lg">
          This campaign isn't about one person. It's about all of us coming together to demand and build a better state. We need your voice, your time, and your energy.
        </p>
        <Link 
          href="/contact" 
          className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white px-10 py-4 rounded-full font-black tracking-widest uppercase transition-all duration-300 shadow-xl shadow-emerald-700/20 active:scale-95 hover:-translate-y-1"
        >
          Join The Campaign
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </Link>
      </section>

    </div>
  );
}