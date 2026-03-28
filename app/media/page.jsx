// app/media/page.jsx
import connectMongo from '@/app/lib/mongodb';
import MediaItem from '@/app/models/MediaItem';
import MediaClientWrapper from './MediaClientWrapper';

// Rebuild page every 60 seconds if new media is uploaded
export const revalidate = 60;

export default async function MediaPage() {
  // Default fallback if you haven't uploaded a portrait yet
  let headshotUrl = "https://images.unsplash.com/photo-1555845579-38e0792ebf68?q=80&w=2000&auto=format&fit=crop";

  try {
    await connectMongo();
    
    // Fetch the latest Official Governor Portrait
    const rawPortrait = await MediaItem.findOne({ category: 'governor' }).sort({ createdAt: -1 });
    
    if (rawPortrait) {
      headshotUrl = rawPortrait.imageUrl;
    }
  } catch (error) {
    console.error("Media Page Fetch Error:", error);
  }

  // PRO TRICK: If it's a Cloudinary URL, we can force the browser to download it 
  // instead of just opening it in a new tab by injecting 'fl_attachment'
  let downloadUrl = headshotUrl;
  if (downloadUrl.includes('cloudinary.com')) {
    downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
  }

  // For the logo, we assume you will place a 'logo-pack.zip' in your public folder,
  // OR you can upload a zip to the "General File Hosting" in your Admin panel and paste the URL here later.
  const logoUrl = "/logo.png"; 

  return <MediaClientWrapper headshotUrl={downloadUrl} logoUrl={logoUrl} />;
}