'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// تحميل الخريطة الكاملة ديناميكياً
const DynamicMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl h-[500px]">
      <div className="bg-gradient-to-r from-[#0a2919] to-[#0d351f] p-4 border-b border-gold/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center border border-gold/30">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">الخريطة التفاعلية لسوريا</h3>
              <p className="text-sm text-gray-400">جاري تحميل الخريطة...</p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full bg-gradient-to-br from-[#0a2919] to-[#0d351f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gold font-bold">جاري تحميل الخريطة</div>
        </div>
      </div>
    </div>
  )
});

interface SimpleMapProps {
  onLocationSelect?: (locationId: string) => void;
  activeLocationId?: string;
  className?: string;
}

export default function SimpleMap({ 
  onLocationSelect, 
  activeLocationId,
  className = '' 
}: SimpleMapProps) {
  return (
    <DynamicMap 
      onLocationSelect={onLocationSelect}
      activeLocationId={activeLocationId}
      className={className}
    />
  );
}