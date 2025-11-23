import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { FrameworkSelector } from './components/FrameworkSelector';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { BrandManager } from './components/BrandManager';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LoginScreen } from './components/LoginScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Language, Framework, Tone, ContentRequest, ContentPillar, BrandProfile } from './types';
import { generateCopy } from './services/geminiService';
import { DEFAULT_BRANDS } from './constants';

const AppContent: React.FC = () => {
  const { currentUser, isWhitelisted, loading } = useAuth();
  
  // UI Language default to English
  const [uiLanguage] = useState<Language>(Language.EN);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // API Key State - Managed internally or could be fetched from DB later
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem('gemini_api_key');
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Brand State
  const [brands, setBrands] = useState<BrandProfile[]>(DEFAULT_BRANDS);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState<ContentRequest>({
    topic: '',
    description: '',
    framework: Framework.AIDA,
    pillar: ContentPillar.PROMOTIONAL,
    language: Language.EN,
    tone: Tone.PROFESSIONAL,
    targetAudience: ''
  });

  const resultRef = useRef<HTMLDivElement>(null);

  // Effect: Handle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Effect: Handle Brand Defaults
  useEffect(() => {
    if (selectedBrandId) {
      const brand = brands.find(b => b.id === selectedBrandId);
      if (brand) {
        setFormData(prev => ({
          ...prev,
          tone: brand.defaultTone,
          targetAudience: brand.defaultAudience,
          brand: brand
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, brand: undefined }));
    }
  }, [selectedBrandId, brands]);

  // AUTHENTICATION GATE
  // If loading, show spinner
  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#31d190]"></div>
    </div>
  );

  // If not logged in OR not whitelisted, show Login Screen (which handles Access Denied UI internally)
  if (!currentUser || !isWhitelisted) {
    return <LoginScreen currentLang={uiLanguage} />;
  }

  // --- MAIN APP LOGIC (Only rendered if authenticated & whitelisted) ---

  const handleAddBrand = (newBrand: BrandProfile) => {
    setBrands(prev => [...prev, newBrand]);
    setSelectedBrandId(newBrand.id);
  };

  const handleDeleteBrand = (brandId: string) => {
    setBrands(prev => prev.filter(b => b.id !== brandId));
    if (selectedBrandId === brandId) {
      setSelectedBrandId(null);
    }
  };

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    setIsKeyModalOpen(false);
  };

  const handleRemoveKey = () => {
    setApiKey(null);
    localStorage.removeItem('gemini_api_key');
    setIsKeyModalOpen(true);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setGeneratedContent(null);
    
    try {
      const result = await generateCopy(formData, apiKey);
      setGeneratedContent(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (error: any) {
      console.error(error);
      if (error.message && error.message.includes('API Key')) {
         setIsKeyModalOpen(true);
         alert("Invalid API Key. Please check your settings.");
      } else {
         alert("Something went wrong. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setGeneratedContent(null);
    setFormData(prev => ({ 
      ...prev, 
      topic: '', 
      description: '',
      targetAudience: selectedBrandId ? prev.targetAudience : ''
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col font-sans transition-colors duration-300">
      <ApiKeyModal 
        isOpen={isKeyModalOpen}
        onClose={() => apiKey && setIsKeyModalOpen(false)}
        onSave={handleSaveKey}
        onRemove={handleRemoveKey}
        currentLang={uiLanguage}
        existingKey={apiKey}
      />

      <Header 
        currentLang={uiLanguage} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenKeySettings={() => setIsKeyModalOpen(true)}
        hasKey={!!apiKey}
      />

      <main className="flex-grow w-full px-2 py-8">
        <div className="max-w-3xl mx-auto space-y-8 mb-12 px-2">
          <section>
            <BrandManager 
              brands={brands}
              selectedBrandId={selectedBrandId}
              onSelectBrand={setSelectedBrandId}
              onAddBrand={handleAddBrand}
              onDeleteBrand={handleDeleteBrand}
              currentLang={uiLanguage}
            />
          </section>

          <section>
            <FrameworkSelector 
              selected={formData.framework} 
              onSelect={(fw) => setFormData(prev => ({ ...prev, framework: fw }))}
              currentLang={uiLanguage}
            />
          </section>

          <section>
            <InputForm 
              request={formData} 
              onChange={setFormData} 
              onSubmit={handleGenerate}
              isLoading={isLoading}
              currentUiLang={uiLanguage}
              selectedBrand={brands.find(b => b.id === selectedBrandId)}
            />
          </section>
        </div>

        <div ref={resultRef} className="w-full max-w-[99%] mx-auto">
          {generatedContent ? (
            <div className="animate-slide-up">
              <OutputDisplay 
                content={generatedContent} 
                currentUiLang={uiLanguage}
                outputLang={formData.language}
                onClear={handleClear}
              />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-white dark:bg-[#1E2A38] rounded-2xl border border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center p-12 text-slate-400 dark:text-slate-500 transition-colors">
              <div className="w-16 h-16 bg-slate-50 dark:bg-[#0f172a] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#1E2A38] dark:text-white mb-2">Ready to Create</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Generated content will appear here in full screen.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E2A38] mt-auto transition-colors">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Powered by <a href="https://web.facebook.com/PrimeNovaDigitalSolution" target="_blank" rel="noopener noreferrer" className="text-[#31d190] font-bold hover:underline">PrimeNova Digital Solution</a>
        </p>
      </footer>
    </div>
  );
};

// Wrap AppContent with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;