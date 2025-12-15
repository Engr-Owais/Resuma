import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './components/Hero';
import UploadForm from './components/UploadForm';
import Processing from './components/Processing';
import ResultsDashboard from './components/ResultsDashboard';
import { AppStep, OptimizationResult, UploadedFile } from './types';
import { optimizeCV } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.HERO);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimizationStart = async (file: UploadedFile, jd: string) => {
    setStep(AppStep.PROCESSING);
    setError(null);
    try {
      const data = await optimizeCV(file, jd);
      setResult(data);
      setStep(AppStep.RESULTS);
    } catch (err: any) {
      console.error(err);
      setError("Failed to optimize CV. Please try again. Ensure your file contains readable text.");
      setStep(AppStep.UPLOAD);
    }
  };

  const handleReset = () => {
      setStep(AppStep.HERO);
      setResult(null);
      setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-primary/30">
        
      {/* Navbar Placeholder */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto cursor-pointer" onClick={handleReset}>
            <span className="text-xl font-bold tracking-tight text-white">CV Forge<span className="text-primary">.ai</span></span>
        </div>
      </nav>

      <main className="pt-20 pb-10 min-h-screen flex flex-col">
        <AnimatePresence mode='wait'>
          {step === AppStep.HERO && (
            <motion.div key="hero" exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col justify-center">
              <Hero onStart={() => setStep(AppStep.UPLOAD)} />
            </motion.div>
          )}

          {step === AppStep.UPLOAD && (
            <motion.div 
                key="upload" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center"
            >
              <UploadForm onSubmit={handleOptimizationStart} />
              {error && (
                  <div className="text-red-400 text-center mt-4 bg-red-900/20 p-2 rounded-lg mx-auto max-w-md border border-red-900/50">
                      {error}
                  </div>
              )}
            </motion.div>
          )}

          {step === AppStep.PROCESSING && (
            <motion.div 
                key="processing" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center"
            >
              <Processing />
            </motion.div>
          )}

          {step === AppStep.RESULTS && result && (
            <motion.div 
                key="results" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex-1"
            >
              <ResultsDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="text-center py-6 text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} CV Forge AI. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;