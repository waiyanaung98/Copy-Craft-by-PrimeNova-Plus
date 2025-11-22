import React, { useState } from 'react';
import { Key, Lock, ExternalLink, X, Trash2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  onRemove: () => void;
  currentLang: Language;
  existingKey: string | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onRemove,
  currentLang, 
  existingKey 
}) => {
  const [keyInput, setKeyInput] = useState(existingKey || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSave(keyInput.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-[#1E2A38] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="bg-[#1E2A38] dark:bg-[#0f172a] px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Key className="text-[#31d190]" size={20} />
            {TRANSLATIONS.apiKeyTitle[currentLang]}
          </h3>
          {existingKey && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {TRANSLATIONS.apiKeyDesc[currentLang]}
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-600 rounded-xl text-[#1E2A38] dark:text-white focus:ring-2 focus:ring-[#31d190] outline-none transition-all"
              />
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
            </div>

            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-[#31d190] hover:underline font-medium"
            >
              {TRANSLATIONS.getKeyLink[currentLang]} <ExternalLink size={12} />
            </a>

            <div className="flex gap-3 pt-2">
              {existingKey && (
                <button 
                  type="button"
                  onClick={onRemove}
                  className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={16} />
                  {TRANSLATIONS.removeKey[currentLang]}
                </button>
              )}
              <button
                type="submit"
                disabled={!keyInput.trim()}
                className="flex-1 bg-[#31d190] text-[#1E2A38] font-bold py-2.5 rounded-xl hover:bg-[#29b079] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {TRANSLATIONS.saveKey[currentLang]}
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-slate-50 dark:bg-[#0f172a]/50 px-6 py-3 border-t border-slate-100 dark:border-slate-700">
           <p className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
             <Lock size={10} /> Your key is stored securely in your browser.
           </p>
        </div>
      </div>
    </div>
  );
};