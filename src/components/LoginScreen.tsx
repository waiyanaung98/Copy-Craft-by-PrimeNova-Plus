import React from 'react';
import { ShieldAlert, PenLine, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface LoginScreenProps {
  currentLang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ currentLang }) => {
  const { signInWithGoogle, currentUser, isWhitelisted, logout, permissionCheckLoading } = useAuth();

  // State 1: Checking Database (Loading)
  if (currentUser && permissionCheckLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1E2A38] rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
          <Loader2 className="w-12 h-12 text-[#31d190] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1E2A38] dark:text-white mb-2">
            Verifying Access...
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Checking permission for:<br/>
            <span className="font-mono font-bold text-[#31d190]">{currentUser.email}</span>
          </p>
        </div>
      </div>
    );
  }

  // State 2: Access Denied (Not in Database)
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
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {TRANSLATIONS.accessDeniedDesc[currentLang]}
            <br/>
            <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-2 inline-block">
              {currentUser.email}
            </span>
          </p>
          <div className="text-xs text-slate-400 mb-4">
            *Admin Note: Add this email to Firestore collection "allowed_users" to grant access.
          </div>
          <button
            onClick={logout}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {TRANSLATIONS.signOut[currentLang]}
          </button>
        </div>
      </div>
    );
  }

  // State 3: Not Logged In
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
            className="w-full py-4 px-6 rounded-xl bg-white border border-slate-300 dark:border-slate-600 text-[#1E2A38] font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group"
          >
            <img 
              src="https://www.svgrepo.com/show/475656/google-color.svg" 
              alt="Google" 
              className="w-6 h-6" 
            />
            <span>{TRANSLATIONS.signInGoogle[currentLang]}</span>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-400">
        Powered by <span className="text-[#31d190] font-bold">PrimeNova Digital Solution</span>
      </p>
    </div>
  );
};