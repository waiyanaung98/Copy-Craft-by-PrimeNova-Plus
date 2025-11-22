import React from 'react';
import { Framework, Language } from '../types';
import { FRAMEWORK_DETAILS, TRANSLATIONS } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface FrameworkSelectorProps {
  selected: Framework;
  onSelect: (f: Framework) => void;
  currentLang: Language;
}

export const FrameworkSelector: React.FC<FrameworkSelectorProps> = ({ selected, onSelect, currentLang }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200">
        {TRANSLATIONS.selectFramework[currentLang]}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.values(Framework) as Framework[]).map((fw) => {
          const details = FRAMEWORK_DETAILS[fw];
          const Icon = details.icon;
          const isSelected = selected === fw;

          return (
            <button
              key={fw}
              onClick={() => onSelect(fw)}
              type="button"
              className={`relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-left group
                ${isSelected 
                  ? 'border-[#31d190] bg-[#31d190]/5 ring-1 ring-[#31d190] dark:bg-[#31d190]/10' 
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E2A38] hover:border-[#31d190]/50 dark:hover:border-[#31d190]/50 hover:shadow-md'
                }`}
            >
              <div className={`mt-0.5 p-2 rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-[#31d190] text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-[#31d190]/10 group-hover:text-[#31d190]'
              }`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold transition-colors ${isSelected ? 'text-[#1E2A38] dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                    {details.title}
                  </h3>
                  {isSelected && <CheckCircle2 size={16} className="text-[#31d190]" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {details.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};