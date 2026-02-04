'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const syriaLocations = [
  { id: 'entrance', name: 'دمشق', position: [36.2765, 33.5138] },
  // ... باقي المواقع
];

interface MapLibreMapProps {
  onLocationSelect?: (locationId: string) => void;
  activeLocationId?: string;
}

export default function MapLibreMap({ onLocationSelect, activeLocationId }: MapLibreMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [38.9968, 34.8021], // وسط سوريا
      zoom: 6
    });

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // إضافة العلامات
      syriaLocations.forEach(location => {
        const marker = new maplibregl.Marker()
          .setLngLat(location.position as [number, number])
          .setPopup(new maplibregl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${location.name}</h3>
              <button onclick="window.locationSelect && window.locationSelect('${location.id}')">
                ابدأ الجولة
              </button>
            </div>
          `))
          .addTo(map.current!);
          
        if (location.id === activeLocationId) {
          marker.getElement().classList.add('active-marker');
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}