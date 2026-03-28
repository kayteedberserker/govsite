// components/GalleryGrid.jsx
'use client';

import { useState } from 'react';

export default function GalleryGrid({ initialItems }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);

  const openLightbox = (item) => {
    setActiveMedia(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setActiveMedia(null);
  };

  // We need enough items to fill a row so the infinite scroll doesn't have blank gaps.
  // If the database has very few items, we duplicate them until we have enough.
  let safeItems = [...initialItems];
  while (safeItems.length < 12) {
    safeItems = [...safeItems, ...initialItems];
  }

  // Split the items into 3 rows for the flowing effect
  const third = Math.ceil(safeItems.length / 3);
  const row1 = safeItems.slice(0, third);
  const row2 = safeItems.slice(third, third * 2);
  const row3 = safeItems.slice(third * 2);

  return (
    <div className="w-full overflow-hidden pb-20">
      
      {/* Injecting the infinite scroll keyframes directly here 
        so you don't have to mess with globals.css on your phone
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }
        /* Pause the entire row when the user hovers to click an image */
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}} />

      <div className="flex flex-col gap-6 md:gap-8">
        {/* ROW 1: Flows Left */}
        <MarqueeRow items={row1} direction="left" onImageClick={openLightbox} />
        
        {/* ROW 2: Flows Right */}
        <MarqueeRow items={row2} direction="right" onImageClick={openLightbox} />
        
        {/* ROW 3: Flows Left */}
        <MarqueeRow items={row3} direction="left" onImageClick={openLightbox} />
      </div>

      {/* LIGHTBOX COMPONENT */}
      {isLightboxOpen && activeMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-8"
          onClick={closeLightbox}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600 transition-colors z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} 
          >
            {activeMedia.imageUrl?.includes('/video/') ? (
              <video src={activeMedia.imageUrl} controls autoPlay className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10" />
            ) : (
              <img src={activeMedia.imageUrl} alt={activeMedia.title} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl ring-1 ring-white/10" />
            )}
            
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-white tracking-tight">{activeMedia.title}</h3>
              <p className="text-emerald-500 font-bold tracking-widest uppercase text-xs mt-1">{activeMedia.category}</p>
              <p className="text-slate-400 mt-3 max-w-2xl mx-auto text-sm">{activeMedia.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component that handles the infinite duplicated scroll
function MarqueeRow({ items, direction, onImageClick }) {
  // To create a perfect infinite loop, we need two identical side-by-side containers
  // As the first one slides completely out of view, the second one has taken its place
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="marquee-container flex w-full overflow-hidden">
      
      {/* First block of images */}
      <div className={`flex shrink-0 gap-6 md:gap-8 px-3 md:px-4 ${animationClass}`}>
        {items.map((item, index) => (
          <MediaCard key={`a-${item._id}-${index}`} item={item} index={index} onClick={() => onImageClick(item)} />
        ))}
      </div>
      
      {/* Exact duplicate block of images trailing right behind it to create the loop */}
      <div className={`flex shrink-0 gap-6 md:gap-8 px-3 md:px-4 ${animationClass}`} aria-hidden="true">
        {items.map((item, index) => (
          <MediaCard key={`b-${item._id}-${index}`} item={item} index={index} onClick={() => onImageClick(item)} />
        ))}
      </div>

    </div>
  );
}

// Sub-component for individual images with dynamic sizes
function MediaCard({ item, index, onClick }) {
  // This array fixes the "rigid" problem. It applies different sizes based on the item's position.
  const dynamicSizes = [
    'w-[65vw] md:w-[25vw] aspect-[4/5]', // Tall portrait
    'w-[80vw] md:w-[35vw] aspect-video', // Wide landscape
    'w-[55vw] md:w-[20vw] aspect-square', // Standard square
    'w-[90vw] md:w-[40vw] aspect-[21/9]', // Ultra-wide cinematic
    'w-[60vw] md:w-[22vw] aspect-[3/4]', // Standard portrait
  ];

  // Pick a size based on the index so it loops through the styles
  const sizeClass = dynamicSizes[index % dynamicSizes.length];
  const isVideo = item.imageUrl?.includes('/video/');

  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl group cursor-pointer shrink-0 border border-slate-800 bg-slate-900 ${sizeClass}`}
    >
      <img 
        src={item.imageUrl} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h4 className="text-xl md:text-2xl font-extrabold text-white tracking-tight uppercase leading-tight">
          {item.title}
        </h4>
        <p className="text-xs text-emerald-500 font-bold tracking-widest uppercase mt-2">
          {item.category}
        </p>
      </div>
      
      {/* Video Play Icon */}
      {isVideo && (
        <div className="absolute top-4 right-4 rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 w-10 h-10 md:w-12 md:h-12 shadow-lg">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
          </svg>
        </div>
      )}
    </div>
  );
}