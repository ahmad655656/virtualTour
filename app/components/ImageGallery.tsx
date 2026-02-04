'use client';

import { useState, useEffect } from 'react';

interface ImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  locationName: string;
}

export default function ImageGallery({
  isOpen,
  onClose,
  images,
  locationName
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-gold/20 border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-gold/30 transition"
            >
              <span className="text-2xl">✕</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white">🖼️ {locationName}</h2>
              <p className="text-gray-300">معرض الصور الحقيقية • {images.length} صورة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/30 text-gold rounded-xl hover:bg-gold/30 transition flex items-center gap-2"
            >
              <span>{isFullscreen ? '⛶' : '⛶'}</span>
              <span>{isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="relative max-w-5xl w-full h-[70vh] mx-auto">
        <img
          src={images[currentIndex]}
          alt={`${locationName} - صورة ${currentIndex + 1}`}
          className="w-full h-full object-contain rounded-2xl shadow-2xl"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl hover:bg-black/70 transition border-2 border-white/20"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl hover:bg-black/70 transition border-2 border-white/20"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl border-2 border-white/20">
          <div className="text-white font-bold">
            <span className="text-gold">{currentIndex + 1}</span> / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-4 ring-gold scale-110' 
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={img}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6">
        <a
          href={images[currentIndex]}
          download={`${locationName}_صورة_${currentIndex + 1}.jpg`}
          className="px-6 py-3 bg-gradient-to-r from-gold to-yellow-400 text-[#0a2919] rounded-xl font-bold hover:shadow-xl transition flex items-center gap-2"
        >
          <span>⬇️</span>
          <span>تحميل الصورة</span>
        </a>
      </div>
    </div>
  );
}