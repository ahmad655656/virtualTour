'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// تعريفات المواقع
const syriaLocations = [
  {
    id: 'entrance',
    name: 'المدخل الرئيسي - دمشق',
    description: 'بوابة الحديقة مع أشجار النخيل',
    position: [33.5138, 36.2765] as [number, number],
    icon: '🚪',
    type: 'entrance'
  },
  // ... باقي المواقع
];

// إصلاح أيقونات Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface LeafletMapProps {
  onLocationSelect?: (locationId: string) => void;
  activeLocationId?: string;
  className?: string;
}

export default function LeafletMap({ 
  onLocationSelect, 
  activeLocationId,
  className = '' 
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const syriaCenter: [number, number] = [34.8021, 38.9968];

  const createCustomIcon = (isActive: boolean, icon: string) => {
    return L.divIcon({
      html: `
        <div class="relative">
          <div class="w-12 h-12 bg-gradient-to-br from-[#0a2919] to-[#0d351f] rounded-full border-2 ${
            isActive ? 'border-gold shadow-lg shadow-gold/30' : 'border-gold/50'
          } flex items-center justify-center shadow-lg">
            <span class="text-xl">${icon}</span>
          </div>
          ${
            isActive 
              ? '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gold rotate-45 border-r border-b border-gold/50"></div>' 
              : ''
          }
        </div>
      `,
      className: 'custom-leaflet-icon',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48]
    });
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl ${className}`}>
      <div className="bg-gradient-to-r from-[#0a2919] to-[#0d351f] p-4 border-b border-gold/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center border border-gold/30">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">الخريطة التفاعلية لسوريا</h3>
              <p className="text-sm text-gray-400">انقر على موقع لاستكشاف الجولة الافتراضية</p>
            </div>
          </div>
        </div>
      </div>
      
      <MapContainer
        center={syriaCenter}
        zoom={7}
        className="h-[500px] w-full"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="bottomright" />
        
        {syriaLocations.map((location) => {
          const isActive = activeLocationId === location.id;
          const customIcon = createCustomIcon(isActive, location.icon);
          
          return (
            <Marker
              key={location.id}
              position={location.position}
              icon={customIcon}
              eventHandlers={{
                click: () => onLocationSelect?.(location.id)
              }}
            >
              <Popup>
                <div className="p-3 min-w-[200px]">
                  <h4 className="font-bold text-[#0a2919]">{location.name}</h4>
                  <p className="text-sm text-gray-600">{location.description}</p>
                  <button
                    onClick={() => onLocationSelect?.(location.id)}
                    className="mt-2 w-full bg-gold text-[#0a2919] py-1 rounded font-bold"
                  >
                    ابدأ الجولة
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}