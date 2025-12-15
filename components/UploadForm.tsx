import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { UploadedFile } from '../types';

interface UploadFormProps {
  onSubmit: (file: UploadedFile, jd: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [jd, setJd] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (fileObj: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract Base64 if PDF
      const content = fileObj.type === 'application/pdf' 
        ? result.split(',')[1] 
        : result; // For simplicity, treating text as is, normally text file reader is different but we assume basic upload here or handle differently
      
        // Actually for text files we need readAsText, let's fix
        if (fileObj.type === 'application/pdf') {
             setFile({ name: fileObj.name, content: result.split(',')[1], type: 'pdf' });
        } else {
            // Re-read as text if not PDF
            const textReader = new FileReader();
            textReader.onload = () => {
                setFile({ name: fileObj.name, content: textReader.result as string, type: 'text' });
            }
            textReader.readAsText(fileObj);
        }
    };
    reader.readAsDataURL(fileObj);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const isValid = file && jd.length > 50;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto w-full px-4 py-8"
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Tell us about the role</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* File Upload */}
        <div 
          className={`
            relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 h-64
            ${isDragging ? 'border-primary bg-primary/10' : 'border-slate-700 bg-surface/50 hover:border-slate-500'}
            ${file ? 'border-secondary/50 bg-secondary/5' : ''}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 text-secondary">
                <CheckCircle className="w-8 h-8" />
              </div>
              <p className="font-medium text-white truncate max-w-[200px]">{file.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-4 text-xs text-slate-400 hover:text-white underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 mb-4" />
              <p className="text-sm text-slate-300 font-medium mb-1">Drag & drop your CV</p>
              <p className="text-xs text-slate-500 mb-4">PDF or TXT (Max 5MB)</p>
              <label className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white cursor-pointer transition-colors">
                Browse Files
                <input type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileChange} />
              </label>
            </>
          )}
        </div>

        {/* Job Description Input */}
        <div className="relative h-64">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-full p-4 bg-surface/50 border border-slate-700 rounded-2xl text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none text-sm"
          />
          {jd.length > 0 && (
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {jd.length} chars
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          disabled={!isValid}
          onClick={() => file && onSubmit(file, jd)}
          className={`
            px-12 py-4 rounded-full font-bold text-lg transition-all duration-300
            ${isValid 
              ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transform hover:scale-105' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
          `}
        >
          Optimize My CV
        </button>
      </div>
    </motion.div>
  );
};

export default UploadForm;