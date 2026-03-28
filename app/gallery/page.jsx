// app/gallery/page.jsx
import connectMongo from '@/app/lib/mongodb';
import MediaItem from '@/app/models/MediaItem';
import GalleryGrid from '@/app/components/GalleryGrid'; 

export default async function GalleryPage() {
  try {
    // 1. Fetch ONLY gallery data on the server
    await connectMongo();
    const rawItems = await MediaItem.find({ category: 'gallery' }).sort({ createdAt: -1 });
    const allItems = JSON.parse(JSON.stringify(rawItems));

    if (!allItems || allItems.length === 0) {
      return (
        <div className="bg-slate-950 min-h-screen flex items-center justify-center pt-24">
          <p className="text-xl text-emerald-500 font-medium italic tracking-widest uppercase">
            Awaiting Media Assets
          </p>
        </div>
      );
    }

    // 2. Pass the data to our interactive Client Component
    return (
      <div className="bg-slate-950 min-h-screen pt-32 pb-24">
        {/* Simple, sleek header inside the page container */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
            The <span className="text-emerald-500">Gallery</span>
          </h1>
          <div className="h-1 w-24 bg-emerald-500 mt-6 rounded-full" />
        </div>

        {/* The Interactive Grid Component */}
        <GalleryGrid initialItems={allItems} />
      </div>
    );
  } catch (error) {
    console.error("Database Error:", error);
    return <div className="p-20 text-center text-white bg-slate-950 h-screen">Error loading gallery. Check console.</div>;
  }
}