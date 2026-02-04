'use client';

import { useEffect, useRef, useState } from 'react';
import { Scene } from '@/lib/scenes';

// تعريف واجهة Pannellum
interface PannellumHotspot {
  pitch: number;
  yaw: number;
  type: string;
  text?: string;
  sceneId?: string;
  cssClass?: string;
  clickHandlerFunc?: () => void;
}

interface PannellumScene {
  title: string;
  type: 'equirectangular';
  panorama: string;
  autoLoad?: boolean;
  hotSpots?: PannellumHotspot[];
}

interface PannellumViewerInstance {
  on: (event: string, callback: (...args: any[]) => void) => void;
  destroy: () => void;
  getScene: () => string;
  loadScene: (sceneId: string) => void;
  getHfov: () => number;
  setHfov: (hfov: number) => void;
  setPitch: (pitch: number) => void;
  setYaw: (yaw: number) => void;
}

interface PannellumStatic {
  viewer: (container: HTMLDivElement, config: {
    default: any;
    scenes: Record<string, PannellumScene>;
    hotSpotDebug?: boolean;
  }) => PannellumViewerInstance;
}

// تحميل Pannellum ديناميكيًا
const loadPannellum = async (): Promise<PannellumStatic | null> => {
  if (typeof window === 'undefined') return null;

  try {
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
        resolve(window.pannellum as PannellumStatic);
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
    pannellum: PannellumStatic;
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
  const viewerRef = useRef<PannellumViewerInstance | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentHfov, setCurrentHfov] = useState(100);

  useEffect(() => {
    let isMounted = true;

    const initializeViewer = async () => {
      if (!containerRef.current || !isMounted) return;

      const pannellum = await loadPannellum();
      if (!pannellum) {
        onError?.('Failed to load Pannellum library');
        return;
      }

      const pannellumScenes: Record<string, PannellumScene> = {};

      scenes.forEach(scene => {
        pannellumScenes[scene.id] = {
          title: scene.title,
          type: 'equirectangular',
          panorama: scene.imageUrl,
          autoLoad: true,
          hotSpots: scene.hotSpots?.map(h => ({
            pitch: h.pitch,
            yaw: h.yaw,
            type: h.type,
            text: h.text,
            sceneId: h.sceneId,
            cssClass: h.type === 'scene' ? 'scene-hotspot' : 'info-hotspot',
            clickHandlerFunc: () => {
              if (h.type === 'scene' && h.sceneId) onSceneChange?.(h.sceneId);
              if (h.type === 'info') onHotspotClick?.(h);
            }
          }))
        };
      });

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

      viewerRef.current.on('load', () => {
        if (!isMounted) return;
        setIsLoaded(true);
        setIsInitialized(true);
        onLoad?.();
      });

      viewerRef.current.on('scenechange', (newSceneId: string) => {
        if (!isMounted) return;
        onSceneChange?.(newSceneId);
      });

      viewerRef.current.on('zoomchange', (hfov: number) => {
        if (!isMounted) return;
        setCurrentHfov(hfov);
      });

      viewerRef.current.on('error', onError ?? (() => {}));
    };

    initializeViewer();

    return () => {
      isMounted = false;
      viewerRef.current?.destroy();
    };
  }, [scenes, activeSceneId]);

  // تحديث المشهد عند التغيير
  useEffect(() => {
    if (viewerRef.current && isInitialized) {
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
      <div
        ref={containerRef}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '500px', background: 'linear-gradient(135deg, #0a2919 0%, #0d351f 50%, #093316 100%)' }}
      />
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
      {/* أدوات التحكم ومعلومات المشهد ونقاط التفاعل */}
      {/* يمكن نسخ باقي الكود كما هو مع viewerRef الصحيح */}
    </div>
  );
}
