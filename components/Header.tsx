import React from 'react';
import { PenLine, Moon, Sun, Key, LogOut } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentLang: Language;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenKeySettings: () => void;
  hasKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentLang, 
  isDarkMode, 
  toggleTheme,
  onOpenKeySettings,
  hasKey
}) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-[#1E2A38] border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Gradient Logo Box */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br from-[#1E2A38] to-[#31d190]">
            <PenLine size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1E2A38] dark:text-white leading-none transition-colors">
              {TRANSLATIONS.appTitle[currentLang]}
            </h1>
            <p className="text-xs text-[#31d190] font-semibold mt-1 tracking-wide">
              {TRANSLATIONS.appSubtitle[currentLang]}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Key Settings */}
           <button
            onClick={onOpenKeySettings}
            className={`p-2 rounded-full transition-all flex items-center gap-2 text-xs font-bold border ${
              hasKey 
                ? 'bg-slate-100 dark:bg-[#0f172a] text-[#1E2A38] dark:text-slate-300 border-transparent hover:border-[#31d190]' 
                : 'bg-red-50 text-red-500 border-red-200 animate-pulse'
            }`}
            title="Manage API Key"
           >
             <Key size={18} />
             <span className="hidden sm:inline">{hasKey ? 'API Key' : 'Set Key'}</span>
           </button>

           {/* Theme Toggle */}
           <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-[#0f172a] text-slate-600 dark:text-[#31d190] hover:bg-slate-200 dark:hover:bg-slate-900 transition-all"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
           >
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>

           {/* User Profile / Logout */}
           {currentUser && (
             <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
               {currentUser.photoURL ? (
                 <img 
                   src={currentUser.photoURL} 
                   alt="User" 
                   className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600"
                 />
               ) : (
                 <div className="w-8 h-8 rounded-full bg-[#31d190] flex items-center justify-center text-white font-bold text-xs">
                   {currentUser.email?.charAt(0).toUpperCase()}
                 </div>
               )}
               <button 
                 onClick={logout}
                 className="p-2 rounded-full bg-slate-50 dark:bg-[#0f172a] text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                 title="Sign Out"
               >
                 <LogOut size={18} />
               </button>
             </div>
           )}
        </div>
      </div>
    </header>
  );
};