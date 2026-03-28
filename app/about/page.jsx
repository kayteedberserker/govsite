// app/about/page.jsx
import Link from 'next/link';
import connectMongo from '@/app/lib/mongodb';
import MediaItem from '@/app/models/MediaItem';
import AboutClientWrapper from './AboutClientWrapper'; // We will create this below

// ISR caching: Rebuild page every 60 seconds if new media is uploaded
export const revalidate = 60;

export default async function AboutPage() {
  let heroImages = [];
  let govPortrait = "https://images.unsplash.com/photo-1555845579-38e0792ebf68?q=80&w=1000&auto=format&fit=crop"; // Fallback placeholder

  try {
    await connectMongo();

    // 1. Fetch images for the top Hero Crossfade
    const rawCarousel = await MediaItem.find({ category: 'governor' }).sort({ createdAt: -1 }).limit(3);
    const parsedCarousel = JSON.parse(JSON.stringify(rawCarousel));
    if (parsedCarousel.length > 0) {
      heroImages = parsedCarousel.map(item => item.imageUrl);
    } else {
      // Fallbacks if no carousel items uploaded yet
      heroImages = [
        "https://images.unsplash.com/photo-1555845579-38e0792ebf68?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1000&auto=format&fit=crop"
      ];
    }

    // 2. Fetch the Official Governor Portrait
    const rawPortrait = await MediaItem.findOne({ category: 'governor' }).sort({ createdAt: -1 });
    if (rawPortrait) {
      govPortrait = rawPortrait.imageUrl;
    }

  } catch (error) {
    console.error("About Page Data Fetch Error:", error);
  }

  // Pass the fetched data down to the client component that handles the interactive carousels
  return <AboutClientWrapper heroImages={heroImages} govPortrait={govPortrait} />;
}