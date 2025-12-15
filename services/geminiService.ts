import { GoogleGenAI, Schema, Type } from "@google/genai";
import { OptimizationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    originalScore: { type: Type.INTEGER, description: "ATS score of the original CV (0-100)" },
    optimizedScore: { type: Type.INTEGER, description: "ATS score of the optimized CV (0-100)" },
    improvements: {
      type: Type.OBJECT,
      properties: {
        keywordsAdded: { type: Type.ARRAY, items: { type: Type.STRING } },
        skillsOptimized: { type: Type.ARRAY, items: { type: Type.STRING } },
        experienceRewritten: { type: Type.ARRAY, items: { type: Type.STRING } },
        metricsIntroduced: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    latexCode: { type: Type.STRING, description: "Complete LaTeX code using ModernCV banking style" },
    previewData: {
      type: Type.OBJECT,
      properties: {
        fullName: { type: Type.STRING },
        title: { type: Type.STRING },
        contactInfo: {
          type: Type.OBJECT,
          properties: {
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            location: { type: Type.STRING },
            linkedin: { type: Type.STRING }
          }
        },
        summary: { type: Type.STRING },
        experience: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              company: { type: Type.STRING },
              role: { type: Type.STRING },
              dates: { type: Type.STRING },
              location: { type: Type.STRING },
              bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        },
        education: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              institution: { type: Type.STRING },
              degree: { type: Type.STRING },
              dates: { type: Type.STRING }
            }
          }
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              items: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    }
  },
  required: ["originalScore", "optimizedScore", "improvements", "latexCode", "previewData"]
};

export const optimizeCV = async (
  cvFile: { content: string; type: 'pdf' | 'text' },
  jobDescription: string
): Promise<OptimizationResult> => {
  
  const systemInstruction = `
    You are an expert CV writer and ATS optimization specialist. 
    Your task is to take a user's CV and a Job Description, and strictly optimize the CV for that job.
    
    1. Analyze the original CV against the Job Description. Estimate a baseline ATS score (0-100).
    2. Rewrite the CV content:
       - Use strong action verbs.
       - Add measurable impact and numbers/percentages where plausible based on context.
       - Inject specific keywords from the Job Description.
       - Rephrase experience to align with the job requirements.
    3. Generate a NEW ATS score (aim for 90+).
    4. Provide a structured summary of changes (keywords added, etc.).
    5. Generate the complete LaTeX code for the new CV. 
       - USE THE 'moderncv' CLASS with 'banking' style.
       - Color scheme: blue.
       - Ensure the LaTeX compiles correctly.
    6. Provide a structured JSON object for a web preview of the CV.
  `;

  const model = "gemini-2.5-flash";

  try {
    const parts: any[] = [];
    
    // Add CV Content
    if (cvFile.type === 'pdf') {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cvFile.content
        }
      });
    } else {
      parts.push({
        text: `ORIGINAL CV CONTENT:\n${cvFile.content}`
      });
    }

    // Add Job Description
    parts.push({
      text: `\n\nTARGET JOB DESCRIPTION:\n${jobDescription}`
    });

    const result = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    if (!result.text) {
      throw new Error("No response generated from AI");
    }

    return JSON.parse(result.text) as OptimizationResult;

  } catch (error) {
    console.error("Optimization failed:", error);
    throw error;
  }
};