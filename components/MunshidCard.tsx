
import React from 'react';
import { Munshid } from '../types';

interface Props {
  munshid: Munshid;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const MunshidCard: React.FC<Props> = ({ munshid, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(munshid.id)}
      className={`cursor-pointer transition-all duration-300 p-4 rounded-xl border-2 ${
        isSelected ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-stone-200 bg-white hover:border-emerald-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
          isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'
        }`}>
          {munshid.type.includes('CHORUS') ? '👥' : '👤'}
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-stone-800">{munshid.name}</h4>
          <p className="text-xs text-stone-500">{munshid.tone}</p>
        </div>
        {isSelected && <div className="text-emerald-600">✓</div>}
      </div>
      <p className="mt-2 text-sm text-stone-600 leading-relaxed line-clamp-2">
        {munshid.description}
      </p>
    </div>
  );
};

export default MunshidCard;
