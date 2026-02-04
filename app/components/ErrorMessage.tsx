'use client';

interface ErrorMessageProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

export default function ErrorMessage({ message, show, onClose }: ErrorMessageProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-2xl border-2 border-red-500/30 shadow-2xl animate-slideIn overflow-hidden">
        {/* الرأس */}
        <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 p-6 border-b border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">حدث خطأ</h2>
              <p className="text-red-200 text-sm mt-1">تعذر تحميل بعض البيانات</p>
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="p-6">
          <div 
            className="prose prose-invert max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          
          {/* الحلول المقترحة */}
          <div className="mt-6 bg-gradient-to-r from-black/30 to-transparent p-4 rounded-xl border border-gold/20">
            <h4 className="font-bold text-gold mb-3 flex items-center gap-2">
              <span>🔧</span>
              <span>حلول سريعة:</span>
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
                  <span className="text-green-300">1</span>
                </div>
                <span className="text-gray-300 text-sm">تحديث الصفحة (F5)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-blue-300">2</span>
                </div>
                <span className="text-gray-300 text-sm">التأكد من اتصال الإنترنت</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-purple-300">3</span>
                </div>
                <span className="text-gray-300 text-sm">استخدام متصفح Chrome أو Firefox</span>
              </li>
            </ul>
          </div>
        </div>

        {/* التذييل */}
        <div className="bg-gradient-to-r from-black/40 to-transparent p-4 border-t border-red-500/20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition flex items-center gap-2"
            >
              <span>🔄</span>
              <span>تحديث الصفحة</span>
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold hover:shadow-lg transition"
            >
              تجاهل والمتابعة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}