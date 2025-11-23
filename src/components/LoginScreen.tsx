import React from 'react';
import { LogIn, ShieldAlert, PenLine, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface LoginScreenProps {
  currentLang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ currentLang }) => {
  const { signInWithGoogle, currentUser, isWhitelisted, logout, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31d190]"></div>
      </div>
    );
  }

  // CASE 1: Logged in BUT Not Whitelisted (ACCESS DENIED)
  if (currentUser && !isWhitelisted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1E2A38] rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-red-100 dark:border-red-900/30">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="text-red-500" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-[#1E2A38] dark:text-white mb-2">
            {TRANSLATIONS.accessDeniedTitle[currentLang]}
          </h2>
          
          <div className="text-slate-600 dark:text-slate-400 mb-6 space-y-4">
            <p>{TRANSLATIONS.accessDeniedDesc[currentLang]}</p>
            
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <a 
                href="viber://chat?number=%2B66805631811" 
                className="flex items-center justify-center gap-2 bg-[#7360f2] text-white px-4 py-3 rounded-lg font-bold hover:bg-[#5e4ad1] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Phone size={20} />
                Viber: (+66) 80 563 1811
              </a>
            </div>

            <div className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 py-1 px-2 rounded inline-block">
              Logged in as: <span className="font-mono text-[#1E2A38] dark:text-slate-200">{currentUser.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {TRANSLATIONS.signOut[currentLang]}
          </button>
        </div>
      </div>
    );
  }

  // CASE 2: Not Logged In (LOGIN SCREEN)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1E2A38] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
        <div className="w-20 h-20 bg-gradient-to-br from-[#1E2A38] to-[#31d190] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white">
          <PenLine size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-[#1E2A38] dark:text-white mb-2">
          {TRANSLATIONS.appTitle[currentLang]}
        </h1>
        <p className="text-[#31d190] font-semibold mb-8">
          {TRANSLATIONS.appSubtitle[currentLang]}
        </p>

        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {TRANSLATIONS.loginDesc[currentLang]}
          </p>
          
          <button
            onClick={signInWithGoogle}
            className="w-full py-4 px-6 rounded-xl bg-white border border-slate-300 dark:border-slate-600 text-[#1E2A38] font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-6 h-6 relative z-10" 
            />
            <span className="relative z-10">{TRANSLATIONS.signInGoogle[currentLang]}</span>
          </button>
          
          {/* Purchase Info Section */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {TRANSLATIONS.purchaseInfo[currentLang]}
            </p>
            <a 
              href="viber://chat?number=%2B66805631811" 
              className="flex items-center justify-center gap-2 bg-[#7360f2]/10 text-[#7360f2] px-4 py-3 rounded-lg font-bold hover:bg-[#7360f2] hover:text-white transition-all border border-[#7360f2]/20"
            >
              <Phone size={18} />
              Viber: (+66) 80 563 1811
            </a>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-400">
        Powered by <a href="https://web.facebook.com/PrimeNovaDigitalSolution" target="_blank" rel="noopener noreferrer" className="text-[#31d190] font-bold hover:underline">PrimeNova Digital Solution</a>
      </p>
    </div>
  );
};