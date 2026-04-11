// app/updates/page.jsx
import connectMongo from '@/app/lib/mongodb';
import Article from '@/app/models/Article';
import Link from 'next/link';

// ISR Configuration: Rebuild the page in the background every 30 seconds 
// if a new article is published. Keeps the site blazing fast.
export const revalidate = 30;

// Helper function to format the date nicely
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

export default async function UpdatesPage() {
  let allPosts = [];

  try {
    // 1. Connect to MongoDB and fetch all articles, newest first
    await connectMongo();
    const rawArticles = await Article.find({}).sort({ createdAt: -1 });

    // Clean up the Mongoose objects into standard JS objects for rendering
    allPosts = JSON.parse(JSON.stringify(rawArticles));
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  // 2. Logic to separate the featured post from the rest
  // We look for the first post marked as 'featured: true'
  const featuredPost = allPosts.find(post => post.featured);

  // The rest of the posts go into the grid
  const standardPosts = allPosts.filter(post => post._id !== featuredPost?._id);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">

      {/* ================= PAGE HEADER ================= */}
      <section className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#243465] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
            <div>
              <span className="text-[#4b66c1] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
                The Newsroom
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                Campaign <span className="text-[#4b66c1]">Updates</span>
              </h1>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base font-medium leading-relaxed md:text-right">
              Stay informed with the latest announcements, policy drops, and momentum from the campaign trail.
            </p>
          </div>
        </div>
      </section>

      {/* Show empty state if there are no articles yet */}
      {allPosts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="text-xl text-slate-500 font-bold italic">No updates have been published yet. Check back soon.</p>
        </div>
      ) : (
        <>
          {/* ================= FEATURED POST (EDITORIAL STYLE) ================= */}
          {featuredPost && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
              {/* Note: We use the MongoDB _id for the dynamic route */}
              <Link href={`/updates/${featuredPost._id}`} className="block group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col lg:flex-row transition-transform duration-300 group-hover:-translate-y-1">

                  {/* Featured Image */}
                  <div className="lg:w-3/5 relative aspect-video lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Featured Content */}
                  <div className="lg:w-2/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="bg-[#4b66c1]/10 text-[#243465] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-[#4b66c1]/20">
                        {featuredPost.category}
                      </span>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        {formatDate(featuredPost.createdAt)}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6 group-hover:text-[#4b66c1] transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-4">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center gap-3 text-[#4b66c1] font-black uppercase tracking-widest text-sm">
                      Read Full Briefing
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>

                </div>
              </Link>
            </section>
          )}

          {/* ================= RECENT UPDATES GRID ================= */}
          {standardPosts.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Recent Dispatches</h3>
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Archive</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {standardPosts.map((post) => (
                  <Link key={post._id} href={`/updates/${post._id}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:-translate-y-1">

                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#243465] shadow-sm">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                        <span>{formatDate(post.createdAt)}</span>
                        {/* We removed the read time since it wasn't hooked up to the backend to prevent layout issues */}
                      </div>

                      <h4 className="text-xl font-black text-slate-900 leading-snug mb-3 group-hover:text-[#4b66c1] transition-colors line-clamp-2">
                        {post.title}
                      </h4>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center text-[#4b66c1] font-bold uppercase tracking-widest text-xs">
                        Read More
                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>

                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ================= NEWSLETTER CTA ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 mt-12">
        <div className="bg-slate-900 rounded-[2rem] p-10 md:p-16 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute inset-0 bg-[#4b66c1]/10 mix-blend-overlay"></div>

          <div className="relative z-10">
            <svg className="w-12 h-12 text-[#4b66c1] mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Don't miss a single update.</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
              Subscribe to the official campaign newsletter to get breaking news, policy deep-dives, and rally schedules delivered straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-xl focus:outline-none focus:border-[#4b66c1] focus:bg-slate-800 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-[#243465] text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg shadow-[#243465]/20 hover:bg-[#172242] active:scale-95 transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="text-slate-500 text-xs mt-4 font-medium">We respect your privacy. No spam, ever.</p>
          </div>
        </div>
      </section>

    </div>
  );
}