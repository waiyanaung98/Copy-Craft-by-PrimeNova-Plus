import React from 'react';
import { Language, Tone, ContentRequest, ContentPillar, BrandProfile } from '../types';
import { TRANSLATIONS, TONE_LABELS, PILLAR_LABELS } from '../constants';

interface InputFormProps {
  request: ContentRequest;
  onChange: (newRequest: ContentRequest) => void;
  onSubmit: () => void;
  isLoading: boolean;
  currentUiLang: Language;
  selectedBrand?: BrandProfile;
}

export const InputForm: React.FC<InputFormProps> = ({ request, onChange, onSubmit, isLoading, currentUiLang, selectedBrand }) => {
  
  const handleChange = (field: keyof ContentRequest, value: any) => {
    onChange({ ...request, [field]: value });
  };

  return (
    <div className="space-y-6 bg-white dark:bg-[#1E2A38] p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      
      {/* Topic */}
      <div>
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {selectedBrand ? `${selectedBrand.name} - ` : ''}{TRANSLATIONS.productTopic[currentUiLang]}
        </label>
        <input
          type="text"
          value={request.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          placeholder={currentUiLang === Language.MY ? "ဥပမာ - မြန်မာ့လက်ဖက်ရည်" : "e.g., Wireless Earbuds"}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#31d190] focus:border-[#31d190] outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {TRANSLATIONS.productDesc[currentUiLang]}
        </label>
        <textarea
          value={request.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          placeholder={currentUiLang === Language.MY ? "ကုန်ပစ္စည်းအကြောင်းအသေးစိတ်ထည့်ပါ..." : "Describe the key features, specs, or context..."}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#31d190] focus:border-[#31d190] outline-none transition-all text-sm font-medium resize-none"
        />
      </div>

      {/* Content Pillar Selection */}
      <div>
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {TRANSLATIONS.pillar[currentUiLang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.values(ContentPillar) as ContentPillar[]).map((pillar) => {
            const isSelected = request.pillar === pillar;
            return (
              <button
                key={pillar}
                onClick={() => handleChange('pillar', pillar)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border duration-200 ${
                  isSelected
                    ? 'bg-[#31d190] text-white border-[#31d190] shadow-md ring-1 ring-[#31d190] transform scale-105'
                    : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-[#31d190] hover:text-[#31d190] hover:bg-[#31d190]/5'
                }`}
              >
                {PILLAR_LABELS[pillar][currentUiLang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone of Voice Selection (Pills) */}
      <div>
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {TRANSLATIONS.tone[currentUiLang]}
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.values(Tone) as Tone[]).map((t) => {
            const isSelected = request.tone === t;
            return (
              <button
                key={t}
                onClick={() => handleChange('tone', t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border duration-200 ${
                  isSelected
                    ? 'bg-[#31d190] text-white border-[#31d190] shadow-md ring-1 ring-[#31d190] transform scale-105'
                    : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-[#31d190] hover:text-[#31d190] hover:bg-[#31d190]/5'
                }`}
              >
                {TONE_LABELS[t][currentUiLang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {TRANSLATIONS.targetAudience[currentUiLang]}
        </label>
        <input
          type="text"
          value={request.targetAudience || ''}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          placeholder={currentUiLang === Language.MY ? "ဥပမာ - ကျောင်းသားများ" : "e.g., Tech enthusiasts"}
          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#31d190] focus:border-[#31d190] outline-none transition-all text-sm font-medium"
        />
      </div>

      {/* Output Language Selection */}
      <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-100 dark:border-slate-600">
        <label className="block text-sm font-bold text-[#1E2A38] dark:text-slate-200 mb-2">
          {TRANSLATIONS.outputLanguage[currentUiLang]}
        </label>
        <div className="flex gap-3">
          {(Object.values(Language) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleChange('language', lang)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-bold transition-all border ${
                request.language === lang
                  ? 'bg-[#31d190] border-[#31d190] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1E2A38] border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-[#31d190]'
              }`}
            >
              {lang === Language.EN ? 'English' : lang === Language.MY ? 'Myanmar' : 'ไทย'}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          onClick={onSubmit}
          disabled={isLoading || !request.topic.trim() || !request.description.trim()}
          className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-all duration-200
            ${isLoading || !request.topic.trim() || !request.description.trim()
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#1E2A38] to-[#31d190] text-white hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{TRANSLATIONS.generating[currentUiLang]}</span>
            </>
          ) : (
            <>
               <span>{TRANSLATIONS.generateBtn[currentUiLang]}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};