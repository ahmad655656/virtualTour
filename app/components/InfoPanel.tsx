'use client';

import { SceneInfo } from '@/lib/scenes';
import { useState } from 'react';

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sceneInfo: SceneInfo;
  sceneTitle: string;
}

export default function InfoPanel({ isOpen, onClose, sceneInfo, sceneTitle }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'features' | 'tips'>('history');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-[#0a2919] to-[#0d351f] rounded-2xl border-2 border-gold/30 shadow-2xl animate-slideIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* الرأس */}
        <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-6 border-b border-gold/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold to-yellow-400 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">معلومات عن {sceneTitle}</h2>
                <p className="text-gray-300 mt-1">استكشف التاريخ والمعلومات المثيرة</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 flex items-center justify-center text-red-300 hover:bg-red-500/30 transition"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6">
          {/* التبويبات */}
          <div className="flex border-b border-gold/20 mb-6">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                activeTab === 'history'
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>📜</span>
                <span>التاريخ</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                activeTab === 'features'
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>✨</span>
                <span>المميزات</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('tips')}
              className={`flex-1 py-3 text-center font-medium transition-all ${
                activeTab === 'tips'
                  ? 'text-gold border-b-2 border-gold'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>💡</span>
                <span>نصائح</span>
              </div>
            </button>
          </div>

          {/* محتوى التبويبات */}
          <div className="space-y-6">
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-xl text-amber-300">🏛️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">التاريخ العريق</h3>
                    <p className="text-sm text-gray-400">قصة المكان عبر العصور</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-black/30 to-transparent p-4 rounded-xl border border-gold/20">
                  <p className="text-gray-300 leading-relaxed">
                    {sceneInfo.history || 'لم يتم إضافة معلومات تاريخية بعد.'}
                  </p>
                </div>
                
                {sceneInfo.bestTime && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 p-4 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-300">⏰</span>
                      <span className="font-bold text-emerald-300">أفضل وقت للزيارة:</span>
                    </div>
                    <p className="text-white">{sceneInfo.bestTime}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-xl text-blue-300">✨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">المميزات البارزة</h3>
                    <p className="text-sm text-gray-400">ما يجعل هذا المكان مميزاً</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sceneInfo.features?.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-black/30 to-transparent p-3 rounded-xl border border-gold/20 hover:border-gold/40 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gold">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="col-span-2 text-center py-8">
                      <span className="text-gray-400">لم يتم إضافة مميزات بعد.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
                    <span className="text-xl text-green-300">💡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">نصائح الزيارة</h3>
                    <p className="text-sm text-gray-400">لتحصل على أفضل تجربة</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {sceneInfo.tips?.map((tip, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-black/30 to-transparent p-4 rounded-xl border border-gold/20 hover:border-gold/40 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold">{index + 1}</span>
                        </div>
                        <p className="text-gray-300">{tip}</p>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <span className="text-gray-400">لم يتم إضافة نصائح بعد.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* إحصائيات سريعة */}
          <div className="mt-8 pt-6 border-t border-gold/20">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gradient-to-b from-black/30 to-transparent rounded-xl border border-gold/10">
                <div className="text-2xl font-bold text-gold">360°</div>
                <div className="text-xs text-gray-400">عرض بانورامي</div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-b from-black/30 to-transparent rounded-xl border border-gold/10">
                <div className="text-2xl font-bold text-gold">📷</div>
                <div className="text-xs text-gray-400">صور عالية الدقة</div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-b from-black/30 to-transparent rounded-xl border border-gold/10">
                <div className="text-2xl font-bold text-gold">🎧</div>
                <div className="text-xs text-gray-400">صوت تفاعلي</div>
              </div>
            </div>
          </div>
        </div>

        {/* التذييل */}
        <div className="bg-gradient-to-r from-black/40 to-transparent p-4 border-t border-gold/20">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-gold to-yellow-400 text-black font-bold hover:shadow-lg hover:shadow-gold/30 transition"
            >
              حسناً، فهمت
            </button>
            
            <div className="text-sm text-gray-400">
              <span className="text-gold">💡</span> انقر خارج النافذة للإغلاق
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}