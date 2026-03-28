// app/updates/[id]/page.jsx
import connectMongo from '@/app/lib/mongodb';
import Article from '@/app/models/Article';
import Link from 'next/link';

export default async function SingleUpdatePage({ params }) {
  await connectMongo();
  const awaitedParams = await params
  // Fetch the specific article using the ID from the URL
  const article = await Article.findById(awaitedParams.id);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 text-center px-4">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-500 mb-8">The briefing you are looking for has been moved or deleted.</p>
        <Link href="/updates" className="text-emerald-600 font-bold uppercase tracking-widest hover:underline">Return to Newsroom</Link>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <article className="bg-white min-h-screen pb-24">
      
      {/* Editorial Hero Header */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-slate-900">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        {/* Title Block overlaying the image */}
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 translate-y-1/2">
          <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl border border-slate-100">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {article.category}
              </span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {formattedDate} • {article.readTime || '5 min read'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {article.title}
            </h1>
            
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
              <div className="w-12 h-12 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold tracking-tighter">
                BAF
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Official Campaign Desk</p>
                <p className="text-xs font-medium text-slate-500">Aspirant 2026 Media Team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-48 md:mt-56">
        <div className="prose prose-lg prose-slate prose-emerald max-w-none">
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium italic mb-10 border-l-4 border-emerald-500 pl-6">
            {article.excerpt}
          </p>
          
          {/* We use whitespace-pre-wrap to respect the line breaks from your Admin text area */}
          <div className="text-slate-700 leading-loose whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* Article Footer & Share */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/updates" className="text-emerald-600 font-bold uppercase tracking-widest text-sm hover:text-slate-900 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            Back to Newsroom
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Share Dispatch:</span>
            <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center font-bold text-xs uppercase">X</button>
            <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center font-bold text-xs uppercase">FB</button>
            <button className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center font-bold text-xs uppercase">IN</button>
          </div>
        </div>
      </div>
      
    </article>
  );
}