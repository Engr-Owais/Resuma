export interface OptimizationResult {
  originalScore: number;
  optimizedScore: number;
  improvements: {
    keywordsAdded: string[];
    skillsOptimized: string[];
    experienceRewritten: string[];
    metricsIntroduced: string[];
  };
  latexCode: string;
  previewData: CVPreviewData;
}

export interface CVPreviewData {
  fullName: string;
  title: string;
  contactInfo: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  summary: string;
  experience: {
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    dates: string;
  }[];
  skills: {
    category: string;
    items: string[];
  }[];
}

export enum AppStep {
  HERO = 'HERO',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS'
}

export interface UploadedFile {
  name: string;
  content: string; // Base64 or Text
  type: 'pdf' | 'text';
}