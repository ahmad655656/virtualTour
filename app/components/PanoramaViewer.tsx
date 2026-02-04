'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Loader } from '@react-three/drei';
import { TextureLoader } from 'three';
import { Scene, HotSpot } from '@/lib/scenes';

interface PanoramaProps {
  scene: Scene;
  onHotspotClick: (hotspot: HotSpot) => void;
}

function SpherePanorama({ scene, onHotspotClick }: PanoramaProps) {
  const texture = useLoader(TextureLoader, scene.imageUrl);
  const meshRef = useRef<any>(null);
  const { camera, size } = useThree();

  // نقاط Hotspotsىحة قعى يثر
  return (
    <>
      <mesh ref={meshRef}>
        <sphereGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={2} />
      </mesh>

      {scene.hotSpots?.map((hotspot, index) => {
        // تحويل yaw/pitch إلى إحداثيات ثلاثية الأبعاد على الكرة
        const phi = (90 - hotspot.pitch) * (Math.PI / 180);
        const theta = (hotspot.yaw + 180) * (Math.PI / 180);
        const radius = 500;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        return (
          <Html
            key={index}
            position={[x, y, z]}
            center
            className="cursor-pointer"
            onClick={() => onHotspotClick(hotspot)}
          >
            <div className={`p-2 rounded-full ${
              hotspot.type === 'scene' ? 'bg-yellow-500' : 'bg-blue-500'
            } text-white shadow-lg`}>
              {hotspot.type === 'scene' ? '📍' : 'ℹ️'}
            </div>
          </Html>
        );
      })}
    </>
  );
}

export default function PanoramaViewer3D({ scene, onHotspotClick }: PanoramaProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ fov: 75, position: [0, 0, 0.1] }}>
        <Suspense fallback={null}>
          <SpherePanorama scene={scene} onHotspotClick={onHotspotClick} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            rotateSpeed={0.4}
            zoomSpeed={0.6}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{ background: 'rgba(0,0,0,0.8)' }}
        innerStyles={{ color: '#D4AF37' }}
      />
    </div>
  );
}
