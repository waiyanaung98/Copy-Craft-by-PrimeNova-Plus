import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import ReactMarkdown from 'react-markdown';

interface OutputDisplayProps {
  content: string | null;
  currentUiLang: Language;
  outputLang: Language;
  onClear: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, currentUiLang, outputLang, onClear }) => {
  const [copied, setCopied] = useState(false);

  if (!content) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Determine font class based on output language
  const fontClass = outputLang === Language.MY ? 'lang-my' : outputLang === Language.TH ? 'lang-th' : '';

  return (
    <div className="bg-white dark:bg-[#1E2A38] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-fade-in transition-colors">
      <div className="bg-[#1E2A38] dark:bg-[#0f172a] px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
        <h3 className="font-bold text-white flex items-center gap-2">
          {TRANSLATIONS.resultTitle[currentUiLang]}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2A38] dark:bg-[#1E2A38] border border-slate-600 text-slate-300 hover:bg-[#31d190] hover:text-[#1E2A38] hover:border-[#31d190] transition-colors font-medium"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? TRANSLATIONS.copied[currentUiLang] : TRANSLATIONS.copyBtn[currentUiLang]}
          </button>
          <button
            onClick={onClear}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E2A38] dark:bg-[#1E2A38] border border-slate-600 text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors font-medium"
          >
            <RefreshCw size={14} />
            {TRANSLATIONS.clearBtn[currentUiLang]}
          </button>
        </div>
      </div>
      {/* 
        Standard prose size (prose-base) used to keep text normal size.
        max-w-none ensures it fills the 99% container width.
      */}
      <div className={`p-8 min-h-[75vh] prose prose-slate dark:prose-invert prose-base max-w-none ${fontClass}`}>
         <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};