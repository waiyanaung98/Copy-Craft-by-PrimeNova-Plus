import React, { useState } from 'react';
import { Briefcase, Plus, Building2, X, Trash2 } from 'lucide-react';
import { BrandProfile, Language, Tone } from '../types';
import { TRANSLATIONS } from '../constants';

interface BrandManagerProps {
  brands: BrandProfile[];
  selectedBrandId: string | null;
  onSelectBrand: (id: string) => void;
  onAddBrand: (brand: BrandProfile) => void;
  onDeleteBrand: (id: string) => void;
  currentLang: Language;
}

export const BrandManager: React.FC<BrandManagerProps> = ({ 
  brands, 
  selectedBrandId, 
  onSelectBrand, 
  onAddBrand, 
  onDeleteBrand,
  currentLang 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBrand, setNewBrand] = useState<Partial<BrandProfile>>({
    name: '',
    industry: '',
    description: '',
    defaultTone: Tone.PROFESSIONAL,
    defaultAudience: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrand.name && newBrand.industry) {
      onAddBrand({
        id: Date.now().toString(),
        name: newBrand.name!,
        industry: newBrand.industry!,
        description: newBrand.description || '',
        defaultTone: newBrand.defaultTone || Tone.PROFESSIONAL,
        defaultAudience: newBrand.defaultAudience || 'General Audience'
      });
      setIsAdding(false);
      setNewBrand({
        name: '',
        industry: '',
        description: '',
        defaultTone: Tone.PROFESSIONAL,
        defaultAudience: ''
      });
    }
  };

  const activeBrand = brands.find(b => b.id === selectedBrandId);

  return (
    <div className="bg-white dark:bg-[#1E2A38] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6 transition-colors">
      {/* Header */}
      <div className="bg-[#1E2A38] dark:bg-[#0f172a] px-4 py-3 flex items-center justify-between transition-colors">
        <h2 className="text-white font-bold text-sm flex items-center gap-2">
          <Briefcase size={16} className="text-[#31d190]" />
          {TRANSLATIONS.brandSection[currentLang]}
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs bg-[#31d190]/20 text-[#31d190] px-2 py-1 rounded hover:bg-[#31d190] hover:text-white transition-colors font-semibold border border-[#31d190]/30"
          >
            {TRANSLATIONS.addNewBrand[currentLang]}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="space-y-3 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-[#1E2A38] dark:text-white">New Brand Profile</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                placeholder="Brand Name (e.g. Nike)"
                className="w-full text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#31d190] focus:border-transparent outline-none bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                value={newBrand.name}
                onChange={e => setNewBrand({...newBrand, name: e.target.value})}
                required
              />
              <input
                placeholder="Industry (e.g. Sports Apparel)"
                className="w-full text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#31d190] focus:border-transparent outline-none bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                value={newBrand.industry}
                onChange={e => setNewBrand({...newBrand, industry: e.target.value})}
                required
              />
              <textarea
                placeholder="Brand Description/Context (Short summary)"
                className="w-full text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#31d190] focus:border-transparent outline-none bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all resize-none"
                rows={2}
                value={newBrand.description}
                onChange={e => setNewBrand({...newBrand, description: e.target.value})}
              />
              <input
                placeholder="Default Audience (e.g. Athletes)"
                className="w-full text-sm px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#31d190] focus:border-transparent outline-none bg-white dark:bg-[#0f172a] text-[#1E2A38] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                value={newBrand.defaultAudience}
                onChange={e => setNewBrand({...newBrand, defaultAudience: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-[#1E2A38] dark:bg-[#31d190] text-white dark:text-[#1E2A38] text-sm font-bold py-2.5 rounded-lg hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all">
              Save Brand
            </button>
          </form>
        ) : (
          <div className="space-y-2">
             <label className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
               {TRANSLATIONS.selectBrand[currentLang]}
             </label>
             <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-600 text-[#1E2A38] dark:text-white font-semibold text-sm rounded-lg px-3 py-2.5 outline-none focus:border-[#31d190] focus:ring-1 focus:ring-[#31d190]"
                  value={selectedBrandId || ''}
                  onChange={(e) => onSelectBrand(e.target.value)}
                >
                  <option value="">-- No Brand Selected --</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                <Building2 className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
             </div>
             
             {activeBrand && (
               <div className="mt-3 p-3 bg-[#31d190]/5 dark:bg-[#31d190]/10 rounded-lg border border-[#31d190]/20 text-xs relative group">
                 <div className="flex justify-between items-start">
                   <div className="pr-6">
                     <p className="font-bold text-[#1E2A38] dark:text-white text-sm">{activeBrand.name}</p>
                     <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{activeBrand.description}</p>
                     <div className="flex flex-wrap gap-2 mt-2">
                       <span className="px-2 py-0.5 bg-white dark:bg-[#0f172a] rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-medium">{activeBrand.industry}</span>
                       <span className="px-2 py-0.5 bg-white dark:bg-[#0f172a] rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 font-medium">{activeBrand.defaultAudience}</span>
                     </div>
                   </div>
                   <button 
                    onClick={() => onDeleteBrand(activeBrand.id)}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-md transition-colors"
                    title="Remove Brand"
                   >
                     <Trash2 size={16} />
                   </button>
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};