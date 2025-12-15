import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-slate-700 text-sm text-slate-300 mb-6">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>AI-Powered Career Accelerator</span>
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 max-w-4xl"
      >
        Upload your CV. <br />
        Paste the job. <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Get Hired.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg text-slate-400 mb-10 max-w-2xl"
      >
        Our AI strictly aligns your experience with the job description, 
        injects ATS keywords, and rewrites your bullets for maximum impact.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={onStart}
        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow"
      >
        Start Optimization
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
};

export default Hero;