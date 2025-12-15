import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, FileText, Code } from 'lucide-react';
import { OptimizationResult } from '../types';
import ScoreGauge from './ScoreGauge';

interface ResultsDashboardProps {
  result: OptimizationResult;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result }) => {
  const [viewMode, setViewMode] = useState<'preview' | 'latex'>('preview');

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 h-full flex flex-col">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="md:col-span-1 bg-surface rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center">
          <h3 className="text-slate-400 text-sm font-medium mb-4">ATS Score Improvement</h3>
          <div className="flex items-center gap-8">
            <div className="text-center">
                <span className="block text-2xl font-bold text-slate-500">{result.originalScore}</span>
                <span className="text-xs text-slate-600">Original</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-700"></div>
            <ScoreGauge score={result.optimizedScore} />
          </div>
        </div>

        <div className="md:col-span-3 bg-surface rounded-xl p-6 border border-slate-700">
           <h3 className="text-slate-400 text-sm font-medium mb-3">Optimization Report</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatItem label="Keywords Added" value={result.improvements.keywordsAdded.length} />
              <StatItem label="Skills Optimized" value={result.improvements.skillsOptimized.length} />
              <StatItem label="Sections Rewritten" value={result.improvements.experienceRewritten.length} />
              <StatItem label="Metrics Added" value={result.improvements.metricsIntroduced.length} />
           </div>
           <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
             {result.improvements.keywordsAdded.slice(0, 5).map((kw, i) => (
               <span key={i} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded border border-secondary/20 whitespace-nowrap">
                 + {kw}
               </span>
             ))}
             {result.improvements.keywordsAdded.length > 5 && (
                 <span className="px-2 py-1 text-xs text-slate-500 self-center">+{result.improvements.keywordsAdded.length - 5} more</span>
             )}
           </div>
        </div>
      </motion.div>

      {/* Main Content Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
        
        {/* Left: Preview */}
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Live Preview</h2>
                <div className="flex bg-surface rounded-lg p-1 border border-slate-700">
                    <button 
                        onClick={() => setViewMode('preview')}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'preview' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        <FileText size={14} /> Visual
                    </button>
                    <button 
                         onClick={() => setViewMode('latex')}
                         className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'latex' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Code size={14} /> LaTeX Source
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-lg shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    {viewMode === 'preview' ? (
                        <CVVisualPreview data={result.previewData} />
                    ) : (
                        <pre className="p-4 text-xs text-slate-800 font-mono whitespace-pre-wrap">
                            {result.latexCode}
                        </pre>
                    )}
                </div>
            </div>
        </div>

        {/* Right: Breakdown & Actions */}
        <div className="flex flex-col gap-6">
            <div className="bg-surface border border-slate-700 rounded-xl p-6 flex-1 overflow-y-auto max-h-[500px]">
                <h3 className="text-lg font-semibold text-white mb-4">Why this wins interviews</h3>
                
                <div className="space-y-6">
                    <ChangeGroup title="Experience Transformation" items={result.improvements.experienceRewritten} color="text-indigo-400" />
                    <ChangeGroup title="Impact & Metrics" items={result.improvements.metricsIntroduced} color="text-emerald-400" />
                    <ChangeGroup title="Skill Alignment" items={result.improvements.skillsOptimized} color="text-blue-400" />
                </div>
            </div>

            <div className="bg-surface border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Download Optimized CV</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => downloadFile(result.latexCode, 'optimized_cv.tex', 'text/plain')}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                    >
                        <Code size={18} />
                        LaTeX Source
                    </button>
                     <button 
                        // In a real app, this would hit a backend to generate PDF. 
                        // Here we just download text as a placeholder or explain.
                        onClick={() => alert("In a full production build, this generates a PDF server-side from the LaTeX source. For this demo, please use the LaTeX download.")}
                        className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                    * PDF generation requires server-side LaTeX compilation.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: number }) => (
    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
        <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-xl font-bold text-white mt-1">{value}</p>
    </div>
);

const ChangeGroup = ({ title, items, color }: { title: string, items: string[], color: string }) => (
    <div>
        <h4 className={`text-sm font-medium ${color} mb-3 flex items-center gap-2`}>
            <Check size={14} /> {title}
        </h4>
        <ul className="space-y-3">
            {items.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-sm text-slate-300 leading-relaxed bg-slate-900/30 p-2 rounded border border-slate-800/50">
                    "{item}"
                </li>
            ))}
        </ul>
    </div>
);

// A simple HTML representation of the ModernCV Banking style
const CVVisualPreview = ({ data }: { data: OptimizationResult['previewData'] }) => (
    <div className="p-8 text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] bg-white text-[11px] leading-relaxed font-sans">
        {/* Header */}
        <div className="text-center mb-6">
            <h1 className="text-3xl font-normal tracking-wide text-gray-900 uppercase mb-2">{data.fullName}</h1>
            <p className="text-xs text-gray-500 mb-2">{data.title}</p>
            <div className="flex flex-wrap justify-center gap-3 text-gray-600 text-[10px]">
                {data.contactInfo.email && <span>{data.contactInfo.email}</span>}
                {data.contactInfo.phone && <span>• {data.contactInfo.phone}</span>}
                {data.contactInfo.location && <span>• {data.contactInfo.location}</span>}
                {data.contactInfo.linkedin && <span>• {data.contactInfo.linkedin}</span>}
            </div>
        </div>

        {/* Section: Summary */}
        <div className="mb-6">
            <h2 className="text-sm font-bold text-blue-800 border-b border-gray-300 mb-2 pb-1 uppercase">Executive Summary</h2>
            <p className="text-justify">{data.summary}</p>
        </div>

        {/* Section: Experience */}
        <div className="mb-6">
            <h2 className="text-sm font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1 uppercase">Experience</h2>
            <div className="space-y-4">
                {data.experience.map((job, i) => (
                    <div key={i}>
                        <div className="flex justify-between font-bold text-gray-900">
                            <span>{job.role}</span>
                            <span className="text-xs font-normal text-gray-600">{job.dates}</span>
                        </div>
                        <div className="flex justify-between italic text-blue-700 mb-1">
                            <span>{job.company}</span>
                            <span className="text-xs text-gray-500 not-italic">{job.location}</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 mt-1 marker:text-blue-800">
                            {job.bullets.map((b, idx) => (
                                <li key={idx}>{b}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

        {/* Section: Education */}
        <div className="mb-6">
            <h2 className="text-sm font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1 uppercase">Education</h2>
             {data.education.map((edu, i) => (
                <div key={i} className="mb-2">
                    <div className="flex justify-between font-bold text-gray-900">
                         <span>{edu.institution}</span>
                         <span className="text-xs font-normal text-gray-600">{edu.dates}</span>
                    </div>
                    <div className="italic text-gray-700">{edu.degree}</div>
                </div>
            ))}
        </div>

         {/* Section: Skills */}
         <div>
            <h2 className="text-sm font-bold text-blue-800 border-b border-gray-300 mb-3 pb-1 uppercase">Skills</h2>
            <div className="space-y-2">
                {data.skills.map((cat, i) => (
                    <div key={i} className="flex">
                        <span className="w-32 font-bold text-gray-900 shrink-0">{cat.category}</span>
                        <span className="text-gray-700">{cat.items.join(', ')}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default ResultsDashboard;