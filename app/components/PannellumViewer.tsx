'use client';

import { useEffect, useRef, useState } from 'react';
import { loadPannellum } from '@/lib/pannellum-loader';
import { Scene } from '@/lib/scenes';
import { motion, AnimatePresence } from 'framer-motion';

interface PannellumViewerProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange?: (sceneId: string) => void;
  onHotspotClick?: (hotspot: any) => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  className?: string;
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

  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  /* =========================
     تحويل المشاهد إلى Pannellum
  ========================= */
  const getPannellumScenes = () => {
    const pannellumScenes: any = {};

    scenes.forEach(scene => {
      pannellumScenes[scene.id] = {
        title: scene.title,
        panorama: scene.imageUrl,
        autoLoad: true,

        hotSpots: scene.hotSpots?.map(hotspot => {
          if (hotspot.type === 'scene') {
            return {
              pitch: hotspot.pitch,
              yaw: hotspot.yaw,
              type: 'scene',
              text: hotspot.text,
              sceneId: hotspot.sceneId,
              cssClass: 'luxury-scene-hotspot'
            };
          }

          return {
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            type: 'info',
            text: hotspot.text,
            cssClass: 'luxury-info-hotspot'
          };
        }) || []
      };
    });

    return pannellumScenes;
  };

  /* =========================
     إنشاء الـ Viewer مرة واحدة
  ========================= */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        if (!containerRef.current || !mounted) return;

        const pannellum = await loadPannellum();

        if (viewerRef.current) {
          viewerRef.current.destroy();
        }

        viewerRef.current = pannellum.viewer(containerRef.current, {
          default: {
            firstScene: activeSceneId,
            autoLoad: true,
            autoRotate: -0.8,
            sceneFadeDuration: 1200,
            compass: false,
            mouseZoom: true,
            showControls: false,
            dragToThrow: true
          },
          scenes: getPannellumScenes()
        });

        /* عند تغيير المشهد من داخل Pannellum */
        viewerRef.current.on('scenechange', (id: string) => {
          onSceneChange?.(id);
        });

        /* عند الضغط على Hotspot */
        viewerRef.current.on('hotspotclick', (_id: any, hotspot: any) => {
          if (hotspot?.sceneId) {
            viewerRef.current.loadScene(hotspot.sceneId);
            onSceneChange?.(hotspot.sceneId);
          }
          onHotspotClick?.(hotspot);
        });

        viewerRef.current.on('load', () => {
          setIsInitialized(true);
          onLoad?.();
        });

        viewerRef.current.on('error', (err: any) => {
          setError(err?.message || 'خطأ غير معروف');
          onError?.(err);
        });
      } catch (err: any) {
        setError(err.message);
      }
    };

    init();

    return () => {
      mounted = false;
      if (viewerRef.current) viewerRef.current.destroy();
    };
  }, []);

  /* =========================
     الاستماع لتغيير activeSceneId
     (من Sidebar أو أي مكان آخر)
  ========================= */
  useEffect(() => {
    if (!viewerRef.current || !isInitialized) return;

    const current = viewerRef.current.getScene?.();
    if (current !== activeSceneId) {
      viewerRef.current.loadScene(activeSceneId);
    }
  }, [activeSceneId, isInitialized]);

  /* =========================
     أدوات التحكم
  ========================= */
  const handleZoom = (delta: number) => {
    if (!viewerRef.current) return;
    const hfov = viewerRef.current.getHfov();
    viewerRef.current.setHfov(hfov + delta);
  };

  /* =========================
     JSX
  ========================= */
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#040d08] ${className}`}>
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      <div ref={containerRef} className="w-full h-full min-h-[500px]" />

      {/* زر التحكم */}
      <div className="absolute bottom-8 right-8 z-30 flex flex-col-reverse gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowControls(!showControls)}
          className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl ${
            showControls ? 'bg-gold text-black' : 'bg-black/40 text-gold'
          }`}
        >
          {showControls ? '✕' : '☰'}
        </motion.button>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-3 p-3 rounded-3xl bg-black/30 backdrop-blur-2xl border border-white/10"
            >
              <button onClick={() => handleZoom(-10)}>➕</button>
              <button onClick={() => handleZoom(10)}>➖</button>
              <button onClick={() => viewerRef.current?.setHfov(100)}>🔄</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* رسالة الخطأ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-red-500/30 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-white/70 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gold text-black rounded-full font-bold"
              >
                إعادة تحميل
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
