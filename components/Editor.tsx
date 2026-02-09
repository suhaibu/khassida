
import React from 'react';

interface Props {
  text: string;
  setText: (t: string) => void;
}

const Editor: React.FC<Props> = ({ text, setText }) => {
  const lineCount = text.split('\n').filter(l => l.trim()).length;
  const wordCount = text.split(/\s+/).filter(w => w.trim()).length;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex justify-between items-center text-xs text-stone-500 font-medium">
        <div className="flex gap-4">
          <span>عدد الأبيات: {lineCount}</span>
          <span>عدد الكلمات: {wordCount}</span>
        </div>
        <div className="text-emerald-600 font-bold uppercase tracking-wider">محرر القصائد</div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="أدخل القصيدة الخديمية هنا... (ادعم القصائد الطويلة، سيتم تقسيمها تلقائياً)"
        className="flex-1 p-6 text-xl font-amiri leading-loose resize-none focus:outline-none placeholder:text-stone-300 placeholder:italic"
        dir="rtl"
      />
    </div>
  );
};

export default Editor;
