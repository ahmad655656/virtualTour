'use client';

import { useEffect, useRef, useState } from 'react';
import { Scene } from '@/lib/scenes';

// تحميل Pannellum ديناميكيًا
const loadPannellum = async () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // تحميل مكتبة Pannellum
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    
    document.head.appendChild(link);
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        // @ts-ignore
        resolve(window.pannellum);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Failed to load Pannellum:', error);
    return null;
  }
};

interface PannellumViewerProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange?: (sceneId: string) => void;
  onHotspotClick?: (hotspot: any) => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  className?: string;
}

declare global {
  interface Window {
    pannellum: any;
  }
}

export default function PannellumViewer({
  scenes,
  activeSceneId,
  onSceneChange,
  onHotspotClick,
  onLoad,
  onError,
  className = ''
}: PannellumViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentHfov, setCurrentHfov] = useState(100);

  // تحميل Pannellum والمشاهد
  useEffect(() => {
    let isMounted = true;

    const initializeViewer = async () => {
      try {
        if (!containerRef.current || !isMounted) return;

        // تحميل مكتبة Pannellum
        const pannellum = await loadPannellum();
        if (!pannellum) {
          throw new Error('فشل تحميل مكتبة الجولة الافتراضية');
        }

        // تهيئة المشاهد لـ Pannellum
        const pannellumScenes: Record<string, any> = {};
        
        scenes.forEach(scene => {
          pannellumScenes[scene.id] = {
            title: scene.title,
            type: 'equirectangular',
            panorama: scene.imageUrl,
            autoLoad: true,
            hotSpots: (scene.hotSpots || []).map(hotspot => ({
              pitch: hotspot.pitch,
              yaw: hotspot.yaw,
              type: hotspot.type,
              text: hotspot.text,
              cssClass: hotspot.type === 'scene' ? 'scene-hotspot' : 'info-hotspot',
              clickHandlerFunc: function(this: any) {
                if (hotspot.type === 'scene' && hotspot.sceneId) {
                  onSceneChange?.(hotspot.sceneId);
                } else if (hotspot.type === 'info') {
                  onHotspotClick?.(hotspot);
                }
              }
            }))
          };
        });

        // إنشاء العارض
        viewerRef.current = pannellum.viewer(containerRef.current, {
          default: {
            firstScene: activeSceneId,
            sceneFadeDuration: 1000,
            autoLoad: true,
            autoRotate: -2,
            autoRotateInactivityDelay: 3000,
            autoRotateStopDelay: 300,
            compass: true,
            mouseZoom: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true,
            keyboardZoom: true,
            draggable: true,
            disableKeyboardCtrl: false,
            minHfov: 30,
            maxHfov: 150,
            hfov: 100,
            backgroundColor: [0, 0, 0]
          },
          scenes: pannellumScenes,
          hotSpotDebug: false
        });

        // إضافة الأحداث
        viewerRef.current.on('load', () => {
          if (isMounted) {
            setIsLoaded(true);
            setIsInitialized(true);
            onLoad?.();
          }
        });

        viewerRef.current.on('scenechange', (newSceneId: string) => {
          if (isMounted && newSceneId !== activeSceneId) {
            onSceneChange?.(newSceneId);
          }
        });

        viewerRef.current.on('zoomchange', (hfov: number) => {
          if (isMounted) {
            setCurrentHfov(hfov);
          }
        });

        viewerRef.current.on('error', (error: any) => {
          console.error('Pannellum error:', error);
          if (isMounted) {
            onError?.(error);
          }
        });

      } catch (error: any) {
        console.error('Failed to initialize viewer:', error);
        if (isMounted) {
          onError?.(error);
        }
      }
    };

    initializeViewer();

    return () => {
      isMounted = false;
      if (viewerRef.current && typeof viewerRef.current.destroy === 'function') {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          console.error('Error destroying viewer:', e);
        }
      }
    };
  }, [scenes]);

  // تحديث المشهد عند التغيير
  useEffect(() => {
    if (viewerRef.current && isInitialized && activeSceneId) {
      try {
        const currentScene = viewerRef.current.getScene();
        if (currentScene !== activeSceneId) {
          viewerRef.current.loadScene(activeSceneId);
        }
      } catch (error) {
        console.error('Error changing scene:', error);
      }
    }
  }, [activeSceneId, isInitialized]);

  // وظائف التحكم
  const handleZoomIn = () => {
    if (viewerRef.current) {
      const hfov = viewerRef.current.getHfov();
      viewerRef.current.setHfov(Math.max(30, hfov - 10));
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const hfov = viewerRef.current.getHfov();
      viewerRef.current.setHfov(Math.min(150, hfov + 10));
    }
  };

  const handleResetView = () => {
    if (viewerRef.current) {
      viewerRef.current.setHfov(100);
      viewerRef.current.setPitch(0);
      viewerRef.current.setYaw(0);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    const pannellumContainer = containerRef.current.querySelector('.pnlm-container');
    const element = pannellumContainer || containerRef.current;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen?.().catch(err => {
        console.warn('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] overflow-hidden rounded-2xl border-2 border-gold/30 shadow-2xl ${className}`}>
      {/* حاوية Pannellum */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-xl"
        style={{ 
          minHeight: '500px',
          background: 'linear-gradient(135deg, #0a2919 0%, #0d351f 50%, #093316 100%)'
        }}
      />
      
      {/* شاشة التحميل */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a2919]/95 to-[#0d351f]/95 backdrop-blur-md">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl text-gold">🌍</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">جاري تحميل الجولة الافتراضية</h3>
            <p className="text-gold/70 text-sm">يرجى الانتظار...</p>
          </div>
        </div>
      )}
      
      {/* أدوات التحكم المخصصة */}
      {isLoaded && (
        <>
          {/* التحكم في الزووم */}
          <div className="absolute bottom-6 left-6 z-40 bg-black/50 backdrop-blur-xl rounded-2xl p-3 border border-gold/30 shadow-2xl">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleZoomIn}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center text-black hover:scale-110 transition-transform"
                title="تكبير"
              >
                <span className="text-xl">+</span>
              </button>
              
              <button 
                onClick={handleResetView}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white hover:scale-110 transition-transform"
                title="إعادة التعيين"
              >
                <span className="text-xl">⟳</span>
              </button>
              
              <button 
                onClick={handleZoomOut}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center text-black hover:scale-110 transition-transform"
                title="تصغير"
              >
                <span className="text-xl">−</span>
              </button>
            </div>
            
            {/* شريط الزووم */}
            <div className="mt-4 px-2">
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-300"
                  style={{ width: `${((150 - currentHfov) / 120) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>🔍+</span>
                <span>{Math.round(currentHfov)}°</span>
                <span>🔍-</span>
              </div>
            </div>
          </div>
          
          {/* زر ملء الشاشة */}
          <button
            onClick={handleFullscreen}
            className="absolute top-6 right-6 z-40 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 hover:text-yellow-400 transition-all"
            title="ملء الشاشة"
          >
            <span className="text-xl">⛶</span>
          </button>
          
          {/* معلومات المشهد */}
          <div className="absolute top-6 left-6 z-40 bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-gold/30 shadow-2xl max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center">
                <span className="text-lg">📍</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {scenes.find(s => s.id === activeSceneId)?.title}
                </h3>
                <p className="text-sm text-gray-300">
                  {scenes.find(s => s.id === activeSceneId)?.description}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gold/20">
              <div className="text-xs text-gold flex items-center gap-2">
                <span>🔍</span>
                <span>استخدم الماوس أو السحب للتحرك في المشهد</span>
              </div>
            </div>
          </div>
          
          {/* مؤشر التفاعل */}
          <div className="absolute bottom-20 right-6 z-40 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-gold/20">
            <div className="flex items-center gap-2 text-sm text-gold">
              <span className="animate-pulse">📍</span>
              <span>انقر على النقاط للتنقل</span>
            </div>
          </div>
        </>
      )}
      
      {/* إضافة الأنماط الخاصة بالنقاط الساخنة */}
      <style jsx global>{`
        .scene-hotspot {
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #D4AF37, #FFD700) !important;
          border: 2px solid white !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 18px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        
        .scene-hotspot:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 0 30px rgba(212, 175, 55, 1) !important;
        }
        
        .info-hotspot {
          width: 35px !important;
          height: 35px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
          border: 2px solid white !important;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.8) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 16px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
        }
        
        .info-hotspot:hover {
          transform: scale(1.2) !important;
          box-shadow: 0 0 25px rgba(59, 130, 246, 1) !important;
        }
        
        .pnlm-container {
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        
        .pnlm-panorama-info {
          display: none !important;
        }
      `}</style>
    </div>
  );
}