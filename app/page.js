// app/page.jsx
import Link from 'next/link';
import connectMongo from '@/app/lib/mongodb';
import Article from '@/app/models/Article';
import MediaItem from '@/app/models/MediaItem';
import HeroCarousel from '@/app/components/HeroCarousel'; // Adjusted import path to match your setup

// Rebuild the homepage in the background every 60 seconds if data changes
export const revalidate = 60; 

export default async function HomePage() {
  let latestNews = [];
  let carouselMedia = [];
  let gallerySnippets = [];

  try {
    await connectMongo();
    
    // Fetch the 3 most recent news articles for the preview
    const rawNews = await Article.find({}).sort({ createdAt: -1 }).limit(3);
    latestNews = JSON.parse(JSON.stringify(rawNews));

    // Fetch media specifically tagged for the carousel
    const rawCarousel = await MediaItem.find({ category: 'carousel' }).sort({ createdAt: -1 }).limit(5);
    carouselMedia = JSON.parse(JSON.stringify(rawCarousel));

    // Fetch the 4 most recent gallery images for the visual teaser
    const rawGallery = await MediaItem.find({ category: 'gallery' }).sort({ createdAt: -1 }).limit(4);
    gallerySnippets = JSON.parse(JSON.stringify(rawGallery));

  } catch (error) {
    console.error("Homepage Data Fetch Error:", error);
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ================= 1. DYNAMIC HERO CAROUSEL ================= */}
      {/* This gives the carousel its own breathing room (60-80% of screen height) */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-slate-950 pt-20">
        <HeroCarousel mediaItems={carouselMedia} />
      </section>

      {/* ================= 1.5. THE COMMAND CENTER TEXT ================= */}
      <section className="bg-slate-950 pt-16 pb-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center border-b border-slate-900">
        <div className="inline-block py-1.5 px-5 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-8 shadow-[0_0_20px_rgba(5,150,105,0.1)]">
          Official Campaign Hub
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-400 tracking-widest uppercase mb-4">
          Buhari AbdulFatai <span className="text-emerald-500">2027</span>
        </h2>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.95] mb-8">
          Proven Leadership. <br className="hidden md:block" />
          <span className="text-emerald-500">Real Results.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12">
          It is time for a governor who works for the people. Join the movement for economic revival, security, and a future we can believe in.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/about" className="bg-emerald-600 text-white px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(5,150,105,0.3)] active:scale-95 flex items-center justify-center gap-2">
            Meet The Candidate
          </Link>
          <Link href="/contact" className="bg-slate-800 border border-slate-700 text-white px-10 py-4 rounded-full font-black tracking-widest uppercase text-sm hover:bg-slate-700 transition-all active:scale-95 flex items-center justify-center">
            Volunteer Now
          </Link>
        </div>
      </section>

      {/* ================= 2. INFINITE TICKER ================= */}
      <div className="bg-emerald-700 py-4 overflow-hidden shadow-inner border-y border-emerald-800">
        <div className="whitespace-nowrap flex animate-[marquee-left_30s_linear_infinite]">
           {[...Array(4)].map((_, i) => (
             <span key={i} className="text-emerald-950 font-black uppercase tracking-[0.3em] text-sm mx-8 flex items-center">
               Economic Revival <span className="mx-8 text-emerald-500">•</span> 
               21st Century Education <span className="mx-8 text-emerald-500">•</span> 
               Total Security <span className="mx-8 text-emerald-500">•</span> 
               Modern Infrastructure <span className="mx-8 text-emerald-500">•</span>
             </span>
           ))}
        </div>
      </div>

      {/* ================= 3. MEET THE CANDIDATE TEASER ================= */}
      <section className="py-24 md:py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-50 rounded-[3rem] transform -rotate-3 z-0"></div>
              <div className="relative z-10 rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl border border-slate-100">
                <img 
                  src="https://res.cloudinary.com/dxqsvqhgl/image/upload/v1774707389/gubernatorial/governor/qd9z3mqi9ex93dhcsyyw.jpg" 
                  alt="Buhari AbdulFatai" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="relative z-10">
              <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Candidate</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Rooted in our communities. <br/> Built for this moment.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Buhari AbdulFatai isn't a career politician; he's a proven manager. Born in the capital and educated in our public schools, he spent two decades building local businesses before serving as the Commissioner of Economic Planning.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-10">
                He knows what it takes to balance a budget, create jobs, and secure our neighborhoods. Now, he's stepping up to lead our state into its most prosperous era yet.
              </p>
              
              <Link href="/about" className="inline-flex items-center gap-3 text-emerald-700 font-black uppercase tracking-widest text-sm hover:text-slate-900 transition-colors group">
                Read Full Biography 
                <span className="w-10 h-10 rounded-full bg-emerald-100 group-hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. THE MANIFESTO TEASER ================= */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-sm mb-4 block">The Agenda</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-16">Four Pillars for Progress</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Economy</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Backing local agriculture and startups to create wealth that stays in our communities.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 hover:-translate-y-2 transition-all duration-300 transform md:-translate-y-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-black text-white mb-3">Security</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Deploying modern tech and community policing to ensure every neighborhood sleeps safely.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21l9-5-9-5-9 5 9 5z" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Education</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Revamping curricula with digital literacy and vocational arts to build the workforce.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Infrastructure</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Upgrading roads linking farms to markets and pushing for stable power grids.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link href="/about" className="inline-flex items-center text-emerald-700 font-black uppercase tracking-widest text-sm hover:text-slate-900 transition-colors">
              Read the Full Manifesto <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 5. NEWSROOM TEASER ================= */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase text-sm mb-2 block">Campaign Trail</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Latest Dispatches</h2>
            </div>
            <Link href="/updates" className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 w-max">
              View Newsroom <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-slate-500 font-medium">No recent updates. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <Link key={article._id} href={`/updates/${article._id}`} className="group flex flex-col h-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden bg-slate-200">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">{article.category}</div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">{article.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="mt-auto text-emerald-600 font-bold uppercase tracking-widest text-xs flex items-center">
                      Read Article <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ================= 6. MEDIA/PRESS TEASER ================= */}
      <section className="bg-slate-900 py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-2">Member of the Press?</h3>
            <p className="text-slate-400 font-medium">Access official headshots, campaign logos, and approved biographies.</p>
          </div>
          <Link href="/media" className="shrink-0 bg-white hover:bg-slate-200 text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-colors shadow-lg active:scale-95">
            Access Press Kit
          </Link>
        </div>
      </section>

      {/* ================= 7. GALLERY TEASER ================= */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-emerald-500 font-bold tracking-[0.2em] uppercase text-sm mb-2 block">Campaign Gallery</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">On The Trail</h2>
            </div>
            <Link href="/gallery" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2 w-max">
              View Full Gallery <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>

          {gallerySnippets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallerySnippets.map((item, idx) => (
                <div key={item._id} className={`relative overflow-hidden rounded-2xl bg-slate-800 ${idx === 0 || idx === 3 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-slate-800 rounded-3xl">
              <p className="text-slate-500 font-medium">Gallery is currently empty.</p>
            </div>
          )}

        </div>
      </section>

      {/* ================= 8. FINAL CTA ================= */}
      <section className="py-32 bg-emerald-700 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555845579-38e0792ebf68?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-emerald-200 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Take Action</span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-tight">
            The Future Is In <br className="hidden md:block"/> Your Hands.
          </h2>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-full font-black tracking-widest uppercase text-sm hover:bg-slate-800 shadow-2xl active:scale-95 transition-all group">
            Volunteer Today
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Inline style for the Ticker animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />

    </div>
  );
}