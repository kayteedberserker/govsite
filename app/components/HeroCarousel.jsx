// components/HeroCarousel.jsx
'use client';

import { useState, useEffect } from 'react';

export default function HeroCarousel({ mediaItems }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback high-quality objects if the database is empty
  const defaultItems = [
    {
      imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2000&auto=format&fit=crop",
      title: "A New Vision for Oyo",
      description: "Building a stronger, more resilient economy for every citizen."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1555845579-38e0792ebf68?q=80&w=2000&auto=format&fit=crop",
      title: "Empowering Local Communities",
      description: "Listening to the voices that matter most—yours."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2000&auto=format&fit=crop",
      title: "Securing Our Future",
      description: "Modern infrastructure and total security across the state."
    }
  ];

  const items = mediaItems && mediaItems.length > 0 ? mediaItems : defaultItems;

  useEffect(() => {
    if (items.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000); // Crossfade every 6 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-950">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image with slow zoom effect */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
              idx === currentIndex ? 'scale-105' : 'scale-100'
            }`}
          />
          
          {/* Dark gradient overlay to make the dynamic text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
          
          {/* Dynamic Content from Database */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 flex flex-col justify-end h-full">
            <div className={`max-w-4xl transition-all duration-1000 delay-300 ${
              idx === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <span className="inline-block py-1.5 px-3 rounded-lg bg-emerald-600/90 backdrop-blur-sm text-white font-black tracking-widest text-[10px] uppercase mb-4 shadow-lg">
                Campaign Highlight
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight mb-4 drop-shadow-xl">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-base md:text-xl text-slate-200 font-medium max-w-2xl drop-shadow-lg line-clamp-3">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 z-20 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-emerald-500' : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}