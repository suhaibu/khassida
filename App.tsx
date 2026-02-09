
import React, { useState, useCallback, useEffect } from 'react';
import { 
  VoiceType, 
  Munshid, 
  Emotion, 
  ChantingStyle, 
  ChantConfig, 
  Project, 
  AudioSegment 
} from './types';
import { MUNSHIDS, STYLE_PRESETS } from './constants';
import { generateChantSegment } from './services/audioService';
import MunshidCard from './components/MunshidCard';
import Editor from './components/Editor';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [config, setConfig] = useState<ChantConfig>({
    voiceId: MUNSHIDS[0].id,
    emotion: Emotion.PIOUS,
    style: ChantingStyle.KHIDIMIYYA,
    humilityLevel: 90,
    speed: 1.0,
    expressionPower: 70,
    pauseLength: 1.0,
    repeatVerses: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [segments, setSegments] = useState<AudioSegment[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const applyStyle = (style: ChantingStyle) => {
    const preset = STYLE_PRESETS[style];
    setConfig(prev => ({ ...prev, ...preset, style }));
  };

  const splitTextIntoSegments = (fullText: string): string[] => {
    // Logic to split long text into logical chunks (e.g., every 4 lines or chapters)
    const lines = fullText.split('\n').filter(l => l.trim());
    const chunks: string[] = [];
    for (let i = 0; i < lines.length; i += 4) {
      chunks.push(lines.slice(i, i + 4).join('\n'));
    }
    return chunks;
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    const textChunks = splitTextIntoSegments(text);
    const newSegments: AudioSegment[] = textChunks.map((chunk, idx) => ({
      id: `seg-${Date.now()}-${idx}`,
      text: chunk,
      status: 'pending'
    }));

    setSegments(newSegments);

    try {
      const processedSegments = [...newSegments];
      for (let i = 0; i < processedSegments.length; i++) {
        processedSegments[i].status = 'processing';
        setSegments([...processedSegments]);
        
        try {
          const audioUrl = await generateChantSegment(processedSegments[i].text, config);
          processedSegments[i].audioUrl = audioUrl;
          processedSegments[i].status = 'completed';
        } catch (err) {
          console.error("Error processing segment:", err);
          processedSegments[i].status = 'error';
        }
        
        setSegments([...processedSegments]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]" dir="rtl">
      {/* Header */}
      <header className="bg-emerald-900 text-white py-4 px-8 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-900 text-2xl font-bold">
            خ
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">الخادم</h1>
            <p className="text-[10px] opacity-70 uppercase">منصة الإنشاد الصوفي السنغالي</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-emerald-300 transition-colors">الرئيسية</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">مكتبة المنشدين</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">مشاريعي</a>
          <a href="#" className="hover:text-emerald-300 transition-colors">الأسعار</a>
        </nav>
        <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md">
          حسابي
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
              <span>🔊</span> اختر المنشد
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {MUNSHIDS.map(m => (
                <MunshidCard 
                  key={m.id} 
                  munshid={m} 
                  isSelected={config.voiceId === m.id}
                  onSelect={(id) => setConfig(prev => ({ ...prev, voiceId: id }))}
                />
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <h3 className="text-lg font-bold text-stone-800 mb-2 flex items-center gap-2">
              <span>🎨</span> نمط الإنشاد
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(ChantingStyle).map(s => (
                <button
                  key={s}
                  onClick={() => applyStyle(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    config.style === s 
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-800' 
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <hr className="border-stone-100" />

            <div className="space-y-4">
              <label className="block text-sm font-bold text-stone-700">المشاعر الروحية</label>
              <select 
                value={config.emotion}
                onChange={(e) => setConfig(prev => ({ ...prev, emotion: e.target.value as Emotion }))}
                className="w-full p-3 rounded-xl border border-stone-200 text-stone-700 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {Object.values(Emotion).map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-500">
                  <span>مستوى الخشوع</span>
                  <span>{config.humilityLevel}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={config.humilityLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, humilityLevel: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-stone-500">
                  <span>سرعة الإنشاد</span>
                  <span>{config.speed}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="2.0" step="0.1"
                  value={config.speed}
                  onChange={(e) => setConfig(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>
          </section>
        </aside>

        {/* Editor & Output Area */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 min-h-[500px]">
            <Editor text={text} setText={setText} />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleGenerate}
              disabled={isProcessing || !text.trim()}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                isProcessing 
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  جاري التوليد...
                </>
              ) : (
                <>
                  <span>✨</span> توليد الإنشاد الصوفي
                </>
              )}
            </button>
          </div>

          {/* Results/Segments Area */}
          {segments.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-stone-800">الأجزاء المُولّدة</h3>
                <span className="text-sm bg-stone-100 px-3 py-1 rounded-full text-stone-500">
                  {segments.filter(s => s.status === 'completed').length} / {segments.length} مكتمل
                </span>
              </div>
              
              <div className="space-y-3">
                {segments.map((seg, i) => (
                  <div key={seg.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border border-stone-200">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-amiri text-stone-700 line-clamp-1 italic">
                        "{seg.text.substring(0, 100)}..."
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                          seg.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          seg.status === 'processing' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                          seg.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-500'
                        }`}>
                          {seg.status === 'completed' ? 'مكتمل' : 
                           seg.status === 'processing' ? 'جاري المعالجة' :
                           seg.status === 'error' ? 'خطأ' : 'بانتظار الدور'}
                        </span>
                      </div>
                    </div>
                    {seg.audioUrl && (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <audio controls src={seg.audioUrl} className="h-8 w-full md:w-64" />
                        <a 
                          href={seg.audioUrl} 
                          download={`chant-part-${i+1}.wav`}
                          className="p-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-stone-600 transition-colors"
                          title="تحميل"
                        >
                          ⬇️
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {segments.every(s => s.status === 'completed') && (
                <div className="mt-6 pt-6 border-t border-stone-100 flex flex-col items-center">
                  <p className="text-stone-500 text-sm mb-4">تم توليد جميع المقاطع بنجاح. يمكنك دمجها أو تحميلها فرادى.</p>
                  <button className="bg-emerald-100 text-emerald-800 font-bold px-10 py-3 rounded-full hover:bg-emerald-200 transition-all">
                    دمج الكل في ملف واحد (MP3)
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-white font-bold mb-4">عن الخادم</h4>
            <p className="text-sm leading-relaxed">
              منصة تهدف لخدمة التراث الخديمي السنغالي والصوفي عبر تطويع أحدث تقنيات الذكاء الاصطناعي الصوتي لإنتاج محتوى روحي يليق بمكانة القصائد الخديمية.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-emerald-500">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-emerald-500">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-emerald-500">الدعم الفني</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <p className="text-sm mb-4">نحن هنا لخدمة طلاب الحقيقة ومحبي الشيخ أحمد بمبا.</p>
            <div className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer">X</span>
              <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer">F</span>
              <span className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-emerald-600 cursor-pointer">I</span>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs">
          جميع الحقوق محفوظة © {new Date().getFullYear()} منصة الخادم للإنشاد الصوفي.
        </div>
      </footer>
    </div>
  );
};

export default App;
