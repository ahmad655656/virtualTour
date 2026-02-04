'use client';

import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar.tsxSidebar';
import ErrorMessage from './components/ErrorMessage';
import TourControls from './components/TourControls';
import InfoPanel from './components/InfoPanel';
import PanoramaViewer from './components/PanoramaViewer';
import SyriaMap from './components/SyriaMap';
import { 
  createCompleteScenes, 
  sceneInfo,
  sceneAudio, 
  SceneId
} from '@/lib/scenes';

const scenes = createCompleteScenes();

export default function HomePage() {
// بدل const [currentSceneId, setCurrentSceneId] = useState('entrance');
const [currentSceneId, setCurrentSceneId] = useState<SceneId>('entrance');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentHotspot, setCurrentHotspot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'panorama' | 'map'>('panorama');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // الحصول على المشهد الحالي
 // الحصول على المشهد الحالي
const currentScene = scenes.find(scene => scene.id === currentSceneId);
const currentSceneTitle = currentScene?.title || 'المدخل الرئيسي';
// تعديل هنا لتجنب خطأ TypeScript
const currentSceneInfo = sceneInfo[currentSceneId];


  // محاكاة تقدم التحميل
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  // إدارة الصوت
  useEffect(() => {
    if (!currentScene || !audioEnabled) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (sceneAudio[currentSceneId]) {
      audioRef.current = new Audio(sceneAudio[currentSceneId]);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentSceneId, audioEnabled]);

  // تأخير تحميل العارض
  useEffect(() => {
    if (viewMode === 'panorama') {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // معالجة اختيار موقع من الخريطة
  const handleLocationSelect = (locationId: string) => {
    setCurrentSceneId(locationId as SceneId);
    setCurrentHotspot(null);
    setViewMode('panorama');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // معالجة النقر على Hotspot
  const handleHotspotClick = (hotspot: any) => {
    if (hotspot.type === 'info') {
      setCurrentHotspot(hotspot.content || hotspot.text);
      setShowInfo(true);
    }
  };

  // عند حدوث خطأ
  const handleViewerError = (err: any) => {
    console.error('Viewer error:', err);
    setError(`
      <div class="space-y-4">
        <div class="text-2xl font-bold text-white">⚠️ تعذر تحميل الجولة الافتراضية</div>
        <div class="text-red-200">${err.message || 'حدث خطأ غير معروف'}</div>
        <div class="bg-red-900/30 p-4 rounded-xl border border-red-700/50">
          <h4 class="font-bold mb-2 text-gold">تأكد من:</h4>
          <ul class="space-y-2 text-right">
            <li class="flex items-center gap-2">
              <span class="w-2 h-2 bg-gold rounded-full"></span>
              اتصال الإنترنت يعمل بشكل صحيح
            </li>
            <li class="flex items-center gap-2">
              <span class="w-2 h-2 bg-gold rounded-full"></span>
              المتصفح يدعم WebGL (جرب Chrome أو Firefox)
            </li>
            <li class="flex items-center gap-2">
              <span class="w-2 h-2 bg-gold rounded-full"></span>
              تفعيل JavaScript في المتصفح
            </li>
          </ul>
        </div>
      </div>
    `);
    setIsLoading(false);
  };

  // معالجة وضع ملء الشاشة بشكل آمن
  const handleFullscreen = () => {
    if (!viewerContainerRef.current) return;
    
    const container = viewerContainerRef.current.querySelector('.panorama-container') || viewerContainerRef.current;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen?.().catch(err => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a2919] via-[#0d351f] to-[#093316] overflow-hidden">
      <Header currentSceneTitle={currentSceneTitle} />
      
      {/* أزرار تبديل العرض */}
      <div className="flex justify-center gap-4 p-4 border-b border-gold/20 bg-black/20 backdrop-blur-sm z-20">
        <button
          onClick={() => setViewMode('panorama')}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'panorama'
              ? 'bg-gradient-to-r from-gold to-yellow-400 text-[#0a2919] shadow-lg'
              : 'bg-gradient-to-r from-black/40 to-black/20 border border-gold/30 text-gold hover:bg-gold/10'
          }`}
        >
          <span>🌅</span>
          <span>عرض البانوراما</span>
        </button>
        
        <button
          onClick={() => setViewMode('map')}
          className={`px-6 py-2 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'map'
              ? 'bg-gradient-to-r from-gold to-yellow-400 text-[#0a2919] shadow-lg'
              : 'bg-gradient-to-r from-black/40 to-black/20 border border-gold/30 text-gold hover:bg-gold/10'
          }`}
        >
          <span>🗺️</span>
          <span>عرض الخريطة التفاعلية</span>
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden relative">
        {/* تأثيرات خلفية */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* المحتوى الرئيسي */}
        <div ref={viewerContainerRef} className="flex-1 relative overflow-hidden">
          {viewMode === 'panorama' ? (
            /* عرض البانوراما */
            <div className="w-full h-full relative">
              {isLoading ? (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#040d08]/95 backdrop-blur-md">
                  <div className="w-full max-w-sm p-10 text-center relative">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 border-2 border-gold/10 rounded-full" />
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="46"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          className="text-gold"
                          strokeDasharray="289"
                          style={{ 
                            strokeDashoffset: 289 - (289 * progress) / 100,
                            transition: 'stroke-dashoffset 0.5s ease' 
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gold">
                        {Math.round(progress)}%
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2 tracking-wide">جاري تحميل المشهد</h2>
                    <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-8">Preparing Your Experience</p>
                    <div className="relative h-[2px] w-full bg-white/10 rounded-full overflow-hidden mb-4">
                      <div 
                        className="absolute h-full bg-gold transition-all duration-500 shadow-[0_0_10px_#D4AF37]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping" />
                      <span className="text-[10px] text-white/30 uppercase font-medium">Loading Scene</span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {currentScene && (
                    <PanoramaViewer
                      scene={currentScene}
                      onHotspotClick={handleHotspotClick}
                    />
                  )}
                  
                  {/* معلومات النقطة الساخنة */}
                  {currentHotspot && (
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-4 rounded-2xl border border-gold/30 shadow-2xl max-w-md animate-fadeIn z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gold">📍</span>
                        <h3 className="text-white font-bold">{currentHotspot}</h3>
                      </div>
                      <p className="text-gray-300 text-sm">انقر على أيقونة المعلومات لمزيد من التفاصيل</p>
                    </div>
                  )}
                  
                  {/* شارة تفاعلية */}
                  <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600/80 to-purple-800/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-300/30 shadow-lg z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-white animate-pulse">✨</span>
                      <span className="text-white text-sm font-medium">جولة تفاعلية</span>
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* عرض الخريطة التفاعلية */
            <div className="w-full h-full p-4">
              <SyriaMap 
                onLocationSelect={handleLocationSelect}
                activeLocationId={currentSceneId}
                className="h-full w-full"
              />
            </div>
          )}
        </div>
        
        {/* القائمة الجانبية - تظهر فقط في وضع البانوراما */}
        {viewMode === 'panorama' && !isLoading && (
          <Sidebar 
            scenes={scenes} 
            activeSceneId={currentSceneId} 
            onSceneChange={(sceneId) => {
              setCurrentSceneId(sceneId as SceneId);
              setCurrentHotspot(null);
            }} 
          />
        )}
      </div>
      
      {/* لوحة التحكم - تظهر فقط في وضع البانوراما */}
      {viewMode === 'panorama' && !isLoading && (
        <TourControls 
          onAudioToggle={() => setAudioEnabled(!audioEnabled)}
          onFullscreen={handleFullscreen}
          onInfoToggle={() => setShowInfo(!showInfo)}
          audioEnabled={audioEnabled}
          infoEnabled={showInfo}
        />
      )}
      
      {/* لوحة المعلومات */}
      <InfoPanel 
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        sceneInfo={currentSceneInfo}
        sceneTitle={currentSceneTitle}
      />
      
      {/* رسالة الخطأ */}
      {error && (
        <ErrorMessage 
          message={error} 
          show={!!error} 
          onClose={() => setError(null)}
        />
      )}
      
      {/* إرشادات الجوال */}
      <div className="lg:hidden bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-3 text-center border-t border-gold/30">
        <div className="flex items-center justify-center gap-4 text-sm">
          {viewMode === 'panorama' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="text-gold">👆</span>
                <span className="text-white">اسحب للتدوير</span>
              </span>
              <span className="h-4 w-px bg-gold/30"></span>
              <span className="flex items-center gap-1">
                <span className="text-gold">📍</span>
                <span className="text-white">انقر على النقاط</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="text-gold">📍</span>
                <span className="text-white">انقر على موقع</span>
              </span>
              <span className="h-4 w-px bg-gold/30"></span>
              <span className="flex items-center gap-1">
                <span className="text-gold">🗺️</span>
                <span className="text-white">تكبير/تصغير</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}