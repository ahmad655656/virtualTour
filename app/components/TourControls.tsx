'use client';

interface TourControlsProps {
  onAudioToggle: () => void;
  onFullscreen: () => void;
  onInfoToggle: () => void;
  audioEnabled: boolean;
  infoEnabled: boolean;
}

export default function TourControls({
  onAudioToggle,
  onFullscreen,
  onInfoToggle,
  audioEnabled,
  infoEnabled
}: TourControlsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-center gap-4">
        {/* أزرار التحكم الدائرية */}
        <div className="flex items-center gap-4">
          {/* زر الصوت */}
          <button
            onClick={onAudioToggle}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              audioEnabled
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                : 'bg-gradient-to-br from-red-500/80 to-red-600/80 text-white'
            } hover:scale-110 hover:shadow-lg`}
            title={audioEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          >
            <span className="text-2xl">
              {audioEnabled ? '🔊' : '🔇'}
            </span>
            
            {/* تأثير النبض عند التشغيل */}
            {audioEnabled && (
              <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-50"></div>
            )}
          </button>
          
          {/* زر المعلومات */}
          <button
            onClick={onInfoToggle}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
              infoEnabled
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 text-white'
            } hover:scale-110 hover:shadow-lg`}
            title={infoEnabled ? 'إخفاء المعلومات' : 'إظهار المعلومات'}
          >
            <span className="text-2xl">ℹ️</span>
            
            {/* تأثير النبض عند التشغيل */}
            {infoEnabled && (
              <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-50"></div>
            )}
          </button>
          
          {/* زر ملء الشاشة */}
          <button
            onClick={onFullscreen}
            className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-gold to-yellow-400 text-black shadow-2xl hover:scale-110 hover:shadow-lg transition-all duration-300"
            title="ملء الشاشة"
          >
            <span className="text-2xl">⛶</span>
            
            {/* تأثير التوهج */}
            <div className="absolute inset-0 rounded-full bg-gold opacity-20 blur-md"></div>
          </button>
        </div>
        
        {/* شريط الحالة */}
        <div className="bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-gold/30 shadow-lg">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-gray-300">جولة نشطة</span>
            </div>
            
            <div className="h-4 w-px bg-gold/30"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-gold">360°</span>
              <span className="text-gray-300">بانوراما</span>
            </div>
            
            <div className="h-4 w-px bg-gold/30"></div>
            
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${audioEnabled ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className="text-gray-300">صوت {audioEnabled ? 'نشط' : 'معطل'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* تلميح الإرشادات */}
      <div className="absolute -left-40 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-3 rounded-xl border border-gold/30 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="text-xs text-gray-300 text-center whitespace-nowrap">
          <div className="font-bold text-gold mb-1">إرشادات التحكم:</div>
          <div>🔊 صوت الخلفية</div>
          <div>ℹ️ معلومات الموقع</div>
          <div>⛶ ملء الشاشة</div>
        </div>
        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
          <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gold/30"></div>
        </div>
      </div>
    </div>
  );
}