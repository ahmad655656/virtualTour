'use client';

import { Scene } from '@/lib/scenes';

interface SidebarProps {
  scenes: Scene[];
  activeSceneId: string;
  onSceneChange: (sceneId: string) => void;
}

export default function Sidebar({ scenes, activeSceneId, onSceneChange }: SidebarProps) {
  const getSceneIcon = (sceneId: string) => {
    const icons: Record<string, string> = {
      entrance: '🏛️',
      flower: '🌺',
      fountain: '⛲',
      rest: '🌊',
      playground: '🌾',
      palmyra: '🏛️',
      castle: '🏰',
      coast: '🏖️'
    };
    return icons[sceneId] || '📍';
  };

  const getSceneColor = (sceneId: string) => {
    const colors: Record<string, string> = {
      entrance: 'from-purple-600/30 to-purple-800/30',
      flower: 'from-emerald-600/30 to-emerald-800/30',
      fountain: 'from-blue-600/30 to-blue-800/30',
      rest: 'from-cyan-600/30 to-cyan-800/30',
      playground: 'from-green-600/30 to-green-800/30',
      palmyra: 'from-amber-600/30 to-amber-800/30',
      castle: 'from-red-600/30 to-red-800/30',
      coast: 'from-sky-600/30 to-sky-800/30'
    };
    return colors[sceneId] || 'from-gray-600/30 to-gray-800/30';
  };

  return (
    <div className="lg:w-80 w-full lg:h-auto h-64 overflow-hidden flex-shrink-0 border-r border-gold/20 bg-gradient-to-b from-black/50 to-black/30 backdrop-blur-xl">
      <div className="p-4 border-b border-gold/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">قائمة المواقع</h3>
            <p className="text-sm text-gray-400">انقر للانتقال إلى أي موقع</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
        {scenes.map((scene) => {
          const isActive = scene.id === activeSceneId;
          
          return (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              className={`w-full p-4 rounded-xl text-right transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold shadow-lg shadow-gold/20'
                  : `bg-gradient-to-r ${getSceneColor(scene.id)} border border-white/10 hover:bg-white/5`
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? 'bg-gradient-to-br from-gold to-yellow-400 text-black' 
                    : 'bg-black/30 text-gold'
                }`}>
                  <span className="text-xl">{getSceneIcon(scene.id)}</span>
                </div>
                
                <div className="flex-1 mr-3">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${isActive ? 'text-white' : 'text-gray-200'}`}>
                      {scene.title}
                    </h4>
                    {isActive && (
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                    {scene.description}
                  </p>
                  
                  {/* مؤشرات إضافية */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-gray-400">
                      {scene.hotSpots?.length || 0} نقطة تفاعلية
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-black/30 text-gray-400">
                      🔍 زووم 360°
                    </span>
                  </div>
                </div>
              </div>
              
              {/* شريط التقدم عند النشاط */}
              {isActive && (
                <div className="mt-3 pt-3 border-t border-gold/30">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gold animate-pulse">🎯 موقع نشط</span>
                    <span className="text-gray-400">انقر للنقاط التفاعلية</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* تذييل الشريط الجانبي */}
      <div className="p-4 border-t border-gold/20 bg-gradient-to-r from-black/40 to-transparent">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-black/50 to-black/30 border border-gold/30">
            <span className="text-gold">🌍</span>
            <span className="text-sm text-gray-300">8 مواقع تاريخية</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            تم تحديث البيانات آخر مرة اليوم
          </p>
        </div>
      </div>
    </div>
  );
}