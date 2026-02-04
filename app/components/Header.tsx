'use client';

import { useState } from 'react';

interface HeaderProps {
  currentSceneTitle: string;
}

export default function Header({ currentSceneTitle }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black/90 via-black/80 to-black/70 backdrop-blur-xl border-b border-gold/30 shadow-2xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center shadow-lg shadow-gold/30 border border-gold/50">
              <span className="text-2xl">🇸🇾</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-gold">✨</span>
                جولة افتراضية في سوريا
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                اكتشف الجمال والتاريخ السوري بانسيابية تامة
              </p>
            </div>
          </div>

          {/* العنوان الحالي */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold to-yellow-400 rounded-full blur opacity-30"></div>
              <div className="relative px-6 py-2 bg-gradient-to-r from-black/50 to-black/30 rounded-full border border-gold/30 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gold animate-pulse">📍</span>
                  <span className="text-white font-medium">أنت في: {currentSceneTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* قائمة الجوال */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-black/50 to-black/30 border border-gold/30 flex items-center justify-center"
            >
              <span className="text-gold text-xl">{showMenu ? '✕' : '☰'}</span>
            </button>
          </div>

          {/* الإحصائيات */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">8</div>
              <div className="text-xs text-gray-400">مواقع</div>
            </div>
            <div className="h-8 w-px bg-gold/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">24</div>
              <div className="text-xs text-gray-400">صورة</div>
            </div>
            <div className="h-8 w-px bg-gold/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">360°</div>
              <div className="text-xs text-gray-400">بانوراما</div>
            </div>
          </div>
        </div>

        {/* قائمة الجوال المنبثقة */}
        {showMenu && (
          <div className="mt-4 p-4 bg-gradient-to-b from-black/80 to-black/60 rounded-2xl border border-gold/30 backdrop-blur-xl animate-slideIn">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-gold/10 to-transparent rounded-xl border border-gold/20">
                <div className="flex items-center gap-2">
                  <span className="text-gold">📍</span>
                  <span className="text-white font-medium">الموقع: {currentSceneTitle}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-black/30 rounded-lg text-center">
                  <div className="text-sm font-bold text-gold">8</div>
                  <div className="text-xs text-gray-400">مواقع</div>
                </div>
                <div className="p-2 bg-black/30 rounded-lg text-center">
                  <div className="text-sm font-bold text-gold">24</div>
                  <div className="text-xs text-gray-400">صورة</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* مؤشر التقدم */}
      <div className="h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold animate-pulse"></div>
    </header>
  );
}