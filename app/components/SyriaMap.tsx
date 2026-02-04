'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { syriaLocations } from '@/lib/scenes';

// تحميل مكونات Leaflet ديناميكياً مع تعطيل SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const ZoomControl = dynamic(
  () => import('react-leaflet').then((mod) => mod.ZoomControl),
  { ssr: false }
);

interface SyriaMapProps {
  onLocationSelect?: (locationId: string) => void;
  activeLocationId?: string;
  className?: string;
}

export default function SyriaMap({ 
  onLocationSelect, 
  activeLocationId,
  className = '' 
}: SyriaMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const leafletRef = useRef<any>(null);

  // التأكد من أننا في متصفح العميل
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل Leaflet ديناميكياً
  useEffect(() => {
    if (!isClient) return;

    const loadLeaflet = async () => {
      try {
        const L = await import('leaflet');
        leafletRef.current = L;
        
        // إصلاح مشكلة أيقونات Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
        
        setLeafletLoaded(true);
        setTimeout(() => setIsMapLoaded(true), 500);
      } catch (error) {
        console.error('فشل تحميل Leaflet:', error);
      }
    };

    loadLeaflet();
  }, [isClient]);

  const syriaCenter: [number, number] = [34.8021, 38.9968];
  const syriaBounds: [[number, number], [number, number]] = [
    [32.3, 35.6],
    [37.3, 42.4]
  ];

  const handleMarkerClick = (locationId: string) => {
    setSelectedLocation(locationId);
    setSelectedImageIndex(0);
    if (onLocationSelect) onLocationSelect(locationId);
  };

  const createCustomIcon = (isActive: boolean, icon: string) => {
    if (!leafletRef.current) return null;
    const L = leafletRef.current;
    return L.divIcon({
      html: `
        <div class="relative flex flex-col items-center">
          <div class="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gold ${
            isActive ? 'bg-gradient-to-br from-gold to-yellow-400 animate-pulse shadow-lg' : 'bg-black/50'
          } transition-transform duration-300 hover:scale-110">
            <span class="text-xl">${icon}</span>
          </div>
          ${isActive ? '<div class="w-3 h-3 bg-gold rotate-45 mt-[-6px]"></div>' : ''}
        </div>
      `,
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 48],
      popupAnchor: [0, -48],
    });
  };

  const nextImage = () => {
    const location = syriaLocations.find(loc => loc.id === selectedLocation);
    if (location) setSelectedImageIndex((prev) => (prev + 1) % location.realImages.length);
  };

  const prevImage = () => {
    const location = syriaLocations.find(loc => loc.id === selectedLocation);
    if (location) setSelectedImageIndex((prev) => (prev - 1 + location.realImages.length) % location.realImages.length);
  };

  if (!isClient || !leafletLoaded) {
    return (
      <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl ${className}`}>
        <div className="bg-gradient-to-r from-[#0a2919] to-[#0d351f] p-4 border-b border-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center border border-gold/30">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">الخريطة التفاعلية لسوريا</h3>
              <p className="text-sm text-gray-400">جاري تحميل الخريطة والصور الحقيقية...</p>
            </div>
          </div>
        </div>
        <div className="h-[500px] w-full bg-gradient-to-br from-[#0a2919] to-[#0d351f] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg text-gold font-bold">جاري تحميل الخريطة التفاعلية</div>
            <p className="text-sm text-gray-400 mt-2">نحضر لك صوراً حقيقية من جميع أنحاء سوريا</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-2xl ${className}`}>
      {/* ترويسة الخريطة */}
      <div className="bg-gradient-to-r from-[#0a2919] to-[#0d351f] p-4 border-b border-gold/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center border border-gold/30">
            <span className="text-xl">🗺️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">الخريطة التفاعلية لسوريا</h3>
            <p className="text-sm text-gray-400">انقر على موقع لاستكشاف الصور الحقيقية والبدء بالجولة</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-gold/10 rounded-full border border-gold/30">
          <span className="text-sm font-medium text-gold">{syriaLocations.length} موقع حقيقي</span>
        </div>
      </div>

      {/* منطقة الخريطة */}
      <div className="relative h-[500px] w-full">
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0a2919]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-lg text-gold font-bold">جاري تحميل الخريطة التفاعلية</div>
            </div>
          </div>
        ) : (
          <MapContainer
            center={syriaCenter}
            zoom={7}
            minZoom={6}
            maxZoom={12}
            maxBounds={syriaBounds}
            maxBoundsViscosity={1.0}
            className="h-full w-full"
            zoomControl={false}
            scrollWheelZoom={true}
            dragging={true}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
              attribution='&copy; Stadia Maps'
            />
            <ZoomControl position="bottomright" />

            {/* إضافة المواقع */}
            {leafletLoaded &&syriaLocations.map((location) => {
              const isActive = activeLocationId === location.id;
              const customIcon = createCustomIcon(isActive, location.icon);
              if (!customIcon) return null;

              return (
                <Marker
                  key={location.id}
                  position={location.position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(location.id),
                  }}
                >
                  <Popup
                    autoPan={false} // يمنع تحريك الخريطة عند فتح Popup
                    className="custom-popup"
                    closeButton={false}
                    autoClose={false}
                    closeOnEscapeKey={true}
                    maxWidth={500}
                    minWidth={300}
                  >
                    <div className="p-3 min-w-[300px] max-w-[500px]">
                      {/* محتوى Popup: الصور، المعلومات، الأزرار */}
                      <div className="relative mb-4 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-black/20 relative">
                          <img
                            src={location.realImages[selectedImageIndex]}
                            alt={location.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1583160247711-2191776b4b91?w=800&auto=format&fit=crop';
                            }}
                          />
                          {location.realImages.length > 1 && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition">←</button>
                              <button onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition">→</button>
                            </>
                          )}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {location.realImages.map((_, idx) => (
                              <div key={idx} className={`w-2 h-2 rounded-full ${idx === selectedImageIndex ? 'bg-gold' : 'bg-white/50'}`}/>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* معلومات الموقع */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isActive ? 'bg-gradient-to-br from-gold to-yellow-400' : 'bg-gradient-to-br from-[#0a2919] to-[#0d351f] border border-gold/30'}`}>
                          <span className={`text-xl ${isActive ? 'text-black' : 'text-gold'}`}>{location.icon}</span>
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${isActive ? 'text-[#0a2919]' : 'text-white'}`}>{location.name}</h4>
                          <p className="text-sm text-gray-300">{location.description}</p>
                        </div>
                      </div>
                      {/* تفاصيل إضافية */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/20 p-3 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">الإحداثيات</div>
                            <div className="text-sm font-mono text-gray-300">{location.position[0].toFixed(4)}, {location.position[1].toFixed(4)}</div>
                          </div>
                          <div className="bg-black/20 p-3 rounded-lg">
                            <div className="text-xs text-gray-400 mb-1">عدد الصور</div>
                            <div className="text-sm text-gray-300">{location.realImages.length} صورة</div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-black/30 to-transparent p-3 rounded-lg border border-gold/20">
                          <div className="text-xs text-gold mb-2 font-bold">حقائق مثيرة:</div>
                          <ul className="space-y-1">
                            {location.facts.map((fact, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                <span className="text-gold mt-1">•</span>
                                <span>{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {/* أزرار التحكم */}
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <button
                          onClick={() => {
                            const customEvent = new CustomEvent('showRealImages', {
                              detail: { locationId: location.id, images: location.realImages, name: location.name }
                            });
                            window.dispatchEvent(customEvent);
                          }}
                          className="py-2 px-4 bg-gradient-to-r from-black/40 to-black/20 border border-gold/30 text-gold rounded-lg hover:bg-gold/20 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <span>🖼️</span>
                          <span>المعرض الكامل</span>
                        </button>
                        <button
                          onClick={() => handleMarkerClick(location.id)}
                          className={`py-2 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                            isActive ? 'bg-gradient-to-r from-gold to-yellow-400 text-[#0a2919]' : 'bg-gradient-to-r from-[#0a2919] to-[#0d351f] border border-gold text-gold hover:bg-gold/20'
                          }`}
                        >
                          {isActive ? '✅ المشهد معروض' : '🚀 ابدأ الجولة'}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}

        {/* لوحة المعلومات الجانبية */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-4 rounded-2xl border border-gold/30 shadow-2xl max-w-xs z-[1000]">
          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-gold">📍</span>
            دليل المواقع الحقيقية
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {syriaLocations.map((location) => (
              <div
                key={location.id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 group ${
                  activeLocationId === location.id
                    ? 'bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/50'
                    : 'bg-black/30 border border-gold/20 hover:bg-black/50'
                }`}
                onClick={() => handleMarkerClick(location.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeLocationId === location.id ? 'bg-gold text-black' : 'bg-black/50 text-gold'
                  }`}>
                    <span className="text-sm">{location.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{location.name}</div>
                    <div className="text-xs text-gray-400 truncate">{location.description}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-gold">🖼️ {location.realImages.length} صور</span>
                    </div>
                  </div>
                  {activeLocationId === location.id && <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* تذييل الخريطة */}
      <div className="bg-gradient-to-r from-black/40 to-transparent p-3 border-t border-gold/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-300">خريطة تفاعلية مع صور حقيقية</span>
        </div>
        <button
          onClick={() => {
            const randomLocation = syriaLocations[Math.floor(Math.random() * syriaLocations.length)];
            handleMarkerClick(randomLocation.id);
          }}
          className="text-gold hover:text-yellow-400 transition flex items-center gap-1 text-sm"
        >
          <span>🎲</span>
          <span>موقع عشوائي</span>
        </button>
      </div>
    </div>
  );
}
