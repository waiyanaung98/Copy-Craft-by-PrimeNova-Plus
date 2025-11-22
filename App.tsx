import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { FrameworkSelector } from './components/FrameworkSelector';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { BrandManager } from './components/BrandManager';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { Language, Framework, Tone, ContentRequest, ContentPillar, BrandProfile } from './types';
import { generateCopy } from './services/geminiService';
import { TRANSLATIONS, DEFAULT_BRANDS } from './constants';

const AppContent: React.FC = () => {
  const { currentUser, isWhitelisted, loading: authLoading } = useAuth();
  
  // UI Language default to English
  const [uiLanguage] = useState<Language>(Language.EN);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // API Key State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
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

  // Scroll to results when generated
  const resultRef = useRef<HTMLDivElement>(null);

  // Load API Key from Local Storage on Mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    
    // Priority: Local Storage -> Env Var (optional fallback)
    if (storedKey) {
      setApiKey(storedKey);
    } else if (process.env.API_KEY) {
      setApiKey(process.env.API_KEY);
    } else {
      // No key found, but we wait until login check is done before popping modal
    }
  }, []);

  // Effect: Handle Dark Mode Class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Effect: When brand changes, update formData defaults
  useEffect(() => {
    if (selectedBrandId) {
      const brand = brands.find(b => b.id === selectedBrandId);
      if (brand) {
        setFormData(prev => ({
          ...prev,
          tone: brand.defaultTone,
          targetAudience: brand.defaultAudience,
          brand: brand // Attach brand object to request for AI context
        }));
      }
    } else {
      // Reset brand context if deselected
      setFormData(prev => ({ ...prev, brand: undefined }));
    }
  }, [selectedBrandId, brands]);

  const handleAddBrand = (newBrand: BrandProfile) => {
    setBrands(prev => [...prev, newBrand]);
    setSelectedBrandId(newBrand.id); // Auto select the new brand
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

    setLoading(true);
    setGeneratedContent(null); // Clear previous while loading
    
    try {
      const result = await generateCopy(formData, apiKey);
      setGeneratedContent(result);
      
      // Scroll to result after a brief delay for render
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
      setLoading(false);
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

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#31d190]"></div>
      </div>
    );
  }

  // If not logged in OR not whitelisted, show Login Screen
  if (!currentUser || !isWhitelisted) {
    return <LoginScreen currentLang={uiLanguage} />;
  }

  // Main App (Only reachable if Logged In AND Whitelisted)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex flex-col font-sans transition-colors duration-300">
      {/* Show Key Modal only if logged in */}
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
        
        {/* Inputs Container - Centered with max width */}
        <div className="max-w-3xl mx-auto space-y-8 mb-12 px-2">
          
          {/* Brand Manager Section */}
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

          {/* Framework Selection */}
          <section>
            <FrameworkSelector 
              selected={formData.framework} 
              onSelect={(fw) => setFormData(prev => ({ ...prev, framework: fw }))}
              currentLang={uiLanguage}
            />
          </section>

          {/* Input Form */}
          <section>
            <InputForm 
              request={formData} 
              onChange={setFormData} 
              onSubmit={handleGenerate}
              isLoading={loading}
              currentUiLang={uiLanguage}
              selectedBrand={brands.find(b => b.id === selectedBrandId)}
            />
          </section>
        </div>

        {/* Output Container - Full Width (99%) */}
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
          Powered by <span className="text-[#1E2A38] dark:text-[#31d190] font-bold">PrimeNova Digital Solution</span>
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
