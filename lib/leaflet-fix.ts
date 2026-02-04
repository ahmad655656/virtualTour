// حل مشكلة أيقونات Leaflet في Next.js
if (typeof window !== 'undefined') {
  // إصلاح مشكلة أيقونات Leaflet
  delete (window as any).L.Icon.Default.prototype._getIconUrl;
  
  // استيراد Leaflet فقط في المتصفح
  import('leaflet').then((L) => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/images/marker-icon-2x.png',
      iconUrl: '/leaflet/images/marker-icon.png',
      shadowUrl: '/leaflet/images/marker-shadow.png',
    });
  }).catch(console.error);
}