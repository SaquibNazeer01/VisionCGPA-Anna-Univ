import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export async function analyzeMarksheet(base64Image: string, mimeType: string): Promise<Course[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            text: `Extract course information from this Anna University (Chennai) marksheet. 
            Look for subject names, credits, and letter grades (O, A+, A, B+, B, C, U, RA).
            Return a JSON array of objects with 'name', 'credits' (number), and 'grade' (string). 
            If credits are missing, use 0. 
            Be as accurate as possible.`,
          },
          {
            inlineData: {
              data: base64Image.split(',')[1] || base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            credits: { type: Type.NUMBER },
            grade: { type: Type.STRING },
          },
          required: ["name", "credits", "grade"],
        },
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data.map((item: any, index: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name || "Unknown Subject",
      credits: Number(item.credits) || 0,
      grade: item.grade || "N/A",
    }));
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}

export const GRADE_POINTS: Record<string, number> = {
  'O': 10.0,
  'A+': 9.0,
  'A': 8.0,
  'B+': 7.0,
  'B': 6.0,
  'C': 5.0,
  'U': 0.0,
  'RA': 0.0,
  'SA': 0.0,
  'W': 0.0,
};

export function calculateCGPA(courses: Course[]): { cgpa: number; totalCredits: number } {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    const grade = course.grade.toUpperCase().trim();
    const points = GRADE_POINTS[grade];

    if (points !== undefined && course.credits > 0) {
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }
  });

  return {
    cgpa: totalCredits > 0 ? totalPoints / totalCredits : 0,
    totalCredits
  };
}
