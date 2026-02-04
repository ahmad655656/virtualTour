'use client';

import { Scene } from '@/lib/scenes';

interface LocationInfoCardProps {
  scene: Scene;
  info?: any;
  onStartTour: () => void;
  onShowGallery: () => void;
  viewCount: number;
}

export default function LocationInfoCard({
  scene,
  info,
  onStartTour,
  onShowGallery,
  viewCount
}: LocationInfoCardProps) {
  return (
    <div className="mt-4 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-xl p-5 rounded-2xl border-2 border-gold/40 shadow-2xl animate-slideUp">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-gold to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">
              {scene.id === 'entrance' ? '🚪' :
               scene.id === 'flower' ? '🌺' :
               scene.id === 'fountain' ? '⛲' :
               scene.id === 'rest' ? '🪑' : '🎪'}
            </span>
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold">
            {viewCount}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{scene.title}</h3>
          <p className="text-gray-300 text-sm mt-1">{scene.description}</p>
          
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-3 py-1 bg-gold/20 text-gold rounded-full border border-gold/30">
              {info?.features?.[0] || 'موقع سياحي'}
            </span>
            <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
              صور متاحة
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-300">
              {scene.realImages?.length || 3} صورة
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button
            onClick={onStartTour}
            className="px-5 py-3 bg-gradient-to-r from-gold to-yellow-400 text-[#0a2919] rounded-xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <span className="text-lg">🚀</span>
            <span>ابدأ الجولة</span>
          </button>
          
          {scene.realImages && scene.realImages?.length > 0 && (
            <button
              onClick={onShowGallery}
              className="px-5 py-2 bg-gradient-to-r from-black/40 to-black/20 border-2 border-gold/30 text-gold rounded-xl hover:bg-gold/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <span>🖼️</span>
              <span>معرض الصور</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}