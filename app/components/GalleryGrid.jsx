// components/GalleryGrid.jsx
'use client';

import { useState } from 'react';

export default function GalleryGrid({ initialItems }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [albumIndex, setAlbumIndex] = useState(0); 

  // --- TOUCH SWIPE STATE ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in pixels) to trigger an image change
  const minSwipeDistance = 50; 

  const openLightbox = (item) => {
    setActiveMedia(item);
    setAlbumIndex(0); 
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setActiveMedia(null);
    setAlbumIndex(0);
  };

  let lightboxImages = [];
  if (activeMedia) {
    lightboxImages.push({ imageUrl: activeMedia.imageUrl });
    if (activeMedia.albumImages && activeMedia.albumImages.length > 0) {
      lightboxImages = [...lightboxImages, ...activeMedia.albumImages];
    }
  }

  const nextAlbumImage = () => {
    setAlbumIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevAlbumImage = () => {
    setAlbumIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // --- TOUCH HANDLERS ---
  const onTouchStart = (e) => {
    setTouchEnd(null); // Reset touch end to avoid false positives
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && lightboxImages.length > 1) {
      nextAlbumImage();
    }
    if (isRightSwipe && lightboxImages.length > 1) {
      prevAlbumImage();
    }
  };

  let safeItems = [...initialItems];
  while (safeItems.length < 12) {
    safeItems = [...safeItems, ...initialItems];
  }

  const third = Math.ceil(safeItems.length / 3);
  const row1 = safeItems.slice(0, third);
  const row2 = safeItems.slice(third, third * 2);
  const row3 = safeItems.slice(third * 2);

  return (
    <div className="w-full overflow-hidden pb-20">
      
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
        .marquee-container:hover .animate-marquee-left,
        .marquee-container:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}} />

      <div className="flex flex-col gap-6 md:gap-8">
        <MarqueeRow items={row1} direction="left" onImageClick={openLightbox} />
        <MarqueeRow items={row2} direction="right" onImageClick={openLightbox} />
        <MarqueeRow items={row3} direction="left" onImageClick={openLightbox} />
      </div>

      {/* ================= LIGHTBOX / ALBUM VIEWER ================= */}
      {isLightboxOpen && activeMedia && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-8 cursor-zoom-out"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600 transition-colors z-50 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center cursor-auto"
            onClick={(e) => e.stopPropagation()} // Prevents clicks on the image from closing the modal
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* The Image/Video Display */}
            <div className="relative flex items-center justify-center w-full select-none">
              
              {/* Prev Arrow (Desktop) */}
              {lightboxImages.length > 1 && (
                <button 
                  onClick={prevAlbumImage}
                  className="hidden sm:block absolute left-0 sm:-left-12 p-3 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur transition-colors shadow-xl z-20"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
              )}

              {/* Media Element */}
              {lightboxImages[albumIndex]?.imageUrl?.includes('/video/') ? (
                <video src={lightboxImages[albumIndex]?.imageUrl} controls autoPlay className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-300 pointer-events-auto" />
              ) : (
                <img 
                  src={lightboxImages[albumIndex]?.imageUrl} 
                  alt={`${activeMedia.title} - Image ${albumIndex + 1}`} 
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 transition-opacity duration-300 pointer-events-none" 
                />
              )}

              {/* Next Arrow (Desktop) */}
              {lightboxImages.length > 1 && (
                <button 
                  onClick={nextAlbumImage}
                  className="hidden sm:block absolute right-0 sm:-right-12 p-3 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-full backdrop-blur transition-colors shadow-xl z-20"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              )}
            </div>
            
            {/* Context/Description block */}
            <div className="mt-8 text-center bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/5 w-full sm:w-auto">
              <h3 className="text-2xl font-bold text-white tracking-tight">{activeMedia.title}</h3>
              <p className="text-slate-400 mt-2 max-w-2xl mx-auto text-sm">{activeMedia.description}</p>
              
              {/* Photo Counter */}
              {lightboxImages.length > 1 && (
                <div className="mt-4 flex justify-center gap-1.5">
                  {lightboxImages.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === albumIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-600'}`}></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarqueeRow({ items, direction, onImageClick }) {
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="marquee-container flex w-full overflow-hidden">
      <div className={`flex shrink-0 gap-6 md:gap-8 px-3 md:px-4 ${animationClass}`}>
        {items.map((item, index) => (
          <MediaCard key={`a-${item._id}-${index}`} item={item} index={index} onClick={() => onImageClick(item)} />
        ))}
      </div>
      <div className={`flex shrink-0 gap-6 md:gap-8 px-3 md:px-4 ${animationClass}`} aria-hidden="true">
        {items.map((item, index) => (
          <MediaCard key={`b-${item._id}-${index}`} item={item} index={index} onClick={() => onImageClick(item)} />
        ))}
      </div>
    </div>
  );
}

function MediaCard({ item, index, onClick }) {
  const dynamicSizes = [
    'w-[65vw] md:w-[25vw] aspect-[4/5]', 
    'w-[80vw] md:w-[35vw] aspect-video', 
    'w-[55vw] md:w-[20vw] aspect-square', 
    'w-[90vw] md:w-[40vw] aspect-[21/9]', 
    'w-[60vw] md:w-[22vw] aspect-[3/4]', 
  ];

  const sizeClass = dynamicSizes[index % dynamicSizes.length];
  const isVideo = item.imageUrl?.includes('/video/');
  const albumCount = item.albumImages ? item.albumImages.length : 0;

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
      
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h4 className="text-xl md:text-2xl font-extrabold text-white tracking-tight uppercase leading-tight">
          {item.title}
        </h4>
        <p className="text-xs text-emerald-500 font-bold tracking-widest uppercase mt-2">
          {item.category}
        </p>
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2">
        {isVideo && (
          <div className="rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 w-10 h-10 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/>
            </svg>
          </div>
        )}
        
        {albumCount > 0 && (
          <div className="rounded-full bg-emerald-600/90 backdrop-blur-md flex items-center justify-center text-white px-3 py-2 shadow-lg gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">+{albumCount} Photos</span>
          </div>
        )}
      </div>
      
    </div>
  );
}