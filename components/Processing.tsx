import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, BrainCircuit, PenTool, CheckCircle2 } from 'lucide-react';

const steps = [
  { text: "Extracting CV content...", icon: Loader2 },
  { text: "Analyzing Job Requirements...", icon: BrainCircuit },
  { text: "Rewriting bullet points...", icon: PenTool },
  { text: "Optimizing Keywords & Metrics...", icon: CheckCircle2 },
];

const Processing: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000); // 2 seconds per step simulation
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-4 border-slate-700 border-t-primary rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
           <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-white mb-6">Optimizing your profile</h3>

      <div className="space-y-4 w-full max-w-sm">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                isActive || isCompleted 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'border-transparent opacity-50'
              }`}
            >
              <div className={`p-2 rounded-full ${isCompleted ? 'bg-secondary/20 text-secondary' : isActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-600'}`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className={`w-4 h-4 ${isActive ? 'animate-spin-slow' : ''}`} />}
              </div>
              <span className={`text-sm ${isActive || isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                {step.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Processing;