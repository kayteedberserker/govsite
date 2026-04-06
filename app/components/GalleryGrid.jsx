// components/GalleryGrid.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function GalleryGrid({ initialItems }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null);
  const [albumIndex, setAlbumIndex] = useState(0);

  // --- AUTO-SCROLL ENGINE STATE ---
  const scrollContainerRef = useRef(null);
  const firstSetRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // --- TOUCH SWIPE STATE (FOR LIGHTBOX) ---
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
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

  // Build the array of images to display in the Lightbox for the active item
  let lightboxImages = [];
  if (activeMedia) {
    lightboxImages.push({ imageUrl: activeMedia.imageUrl });
    if (activeMedia.albumImages && activeMedia.albumImages.length > 0) {
      lightboxImages = [...lightboxImages, ...activeMedia.albumImages];
    }
  }

  const nextAlbumImage = (e) => {
    if (e) e.stopPropagation();
    setAlbumIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevAlbumImage = (e) => {
    if (e) e.stopPropagation();
    setAlbumIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  // --- TOUCH HANDLERS (LIGHTBOX) ---
  const onTouchStartLB = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveLB = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndLB = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && lightboxImages.length > 1) nextAlbumImage();
    if (isRightSwipe && lightboxImages.length > 1) prevAlbumImage();
  };

  // Ensure we have enough items to loop seamlessly
  let safeItems = [...initialItems];
  while (safeItems.length < 8) {
    safeItems = [...safeItems, ...initialItems];
  }

  // --- JAVASCRIPT AUTO-SCROLL ENGINE ---
  useEffect(() => {
    let animationId;
    const container = scrollContainerRef.current;
    const firstSet = firstSetRef.current;

    const scrollStep = () => {
      if (container && firstSet && !isPaused) {
        container.scrollLeft += 1; // Adjust this number to change auto-scroll speed

        // Seamless infinite loop: If we've scrolled past the first exact duplicate block, instantly snap back to 0
        if (container.scrollLeft >= firstSet.offsetWidth) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scrollStep);
    };

    animationId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="w-full pb-20 relative">

      {/* Hide native scrollbars but keep functionality */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* ================= NATIVE SCROLL CONTAINER ================= */}
      {/* onMouseEnter/Leave handles desktop mouse pausing.
        onTouchStart/End handles mobile finger pausing so they can swipe natively.
      */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        className="flex items-center overflow-x-auto hide-scrollbar w-full py-8 cursor-grab active:cursor-grabbing"
      >
        {/* Block A: The main items */}
        <div ref={firstSetRef} className="flex shrink-0 gap-6 md:gap-8 px-3 md:px-4">
          {safeItems.map((item, index) => (
            <MediaCard key={`a-${item._id}-${index}`} item={item} index={index} onClick={() => openLightbox(item)} />
          ))}
        </div>

        {/* Block B: The identical clone for the seamless loop */}
        <div className="flex shrink-0 gap-6 md:gap-8 px-3 md:px-4" aria-hidden="true">
          {safeItems.map((item, index) => (
            <MediaCard key={`b-${item._id}-${index}`} item={item} index={index} onClick={() => openLightbox(item)} />
          ))}
        </div>
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
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-[#4b66c1] transition-colors z-50 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center cursor-auto"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStartLB}
            onTouchMove={onTouchMoveLB}
            onTouchEnd={onTouchEndLB}
          >
            {/* The Image/Video Display */}
            <div className="relative flex items-center justify-center w-full select-none">

              {/* Prev Arrow (Desktop) */}
              {lightboxImages.length > 1 && (
                <button
                  onClick={prevAlbumImage}
                  className="hidden sm:block absolute left-0 sm:-left-12 p-3 bg-slate-900/80 hover:bg-[#4b66c1] text-white rounded-full backdrop-blur transition-colors shadow-xl z-20"
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
                  className="hidden sm:block absolute right-0 sm:-right-12 p-3 bg-slate-900/80 hover:bg-[#4b66c1] text-white rounded-full backdrop-blur transition-colors shadow-xl z-20"
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
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === albumIndex ? 'w-6 bg-[#4b66c1]' : 'w-2 bg-slate-600'}`}></div>
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

// Sub-component for individual images
function MediaCard({ item, index, onClick }) {
  const dynamicSizes = [
    'w-[75vw] sm:w-[45vw] lg:w-[30vw] aspect-[4/5]',
    'w-[85vw] sm:w-[50vw] lg:w-[40vw] aspect-video',
    'w-[65vw] sm:w-[35vw] lg:w-[25vw] aspect-square',
    'w-[70vw] sm:w-[40vw] lg:w-[30vw] aspect-[3/4]',
  ];

  const sizeClass = dynamicSizes[index % dynamicSizes.length];
  const isVideo = item.imageUrl?.includes('/video/');
  const albumCount = item.albumImages ? item.albumImages.length : 0;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl group cursor-pointer shrink-0 border border-slate-800 bg-slate-900 shadow-xl ${sizeClass}`}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />

      {/* Text Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent p-6 md:p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <h4 className="text-xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-tight drop-shadow-md">
          {item.title}
        </h4>
        <p className="text-xs text-[#4b66c1] font-bold tracking-widest uppercase mt-2 drop-shadow">
          {item.category}
        </p>
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-none">
        {isVideo && (
          <div className="rounded-full bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 w-10 h-10 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          </div>
        )}

        {albumCount > 0 && (
          <div className="rounded-full bg-[#243465]/90 backdrop-blur-md flex items-center justify-center text-white px-3 py-2 shadow-lg gap-2 border border-white/10">
            <svg className="w-4 h-4 text-[#4b66c1]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">+{albumCount} Photos</span>
          </div>
        )}
      </div>

    </div>
  );
}