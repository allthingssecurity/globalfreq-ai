import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightData } from "../types";

// Ideally, check if key exists, but per instructions we assume process.env.API_KEY is valid/injected.
// We create the instance lazily or on demand to handle key selection if needed, 
// but standard instruction says initialize directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCountryMusicInsight = async (countryName: string): Promise<AIInsightData | null> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    const prompt = `
      Generate a brief and engaging music culture summary for ${countryName}.
      Include:
      1. A 2-sentence summary of the country's musical identity.
      2. A list of 3-5 popular music genres in that region.
      
      Return ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            country: { type: Type.STRING },
            summary: { type: Type.STRING },
            musicCulture: { type: Type.STRING, description: "A specific interesting fact about their radio or music history." },
            popularGenres: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["country", "summary", "musicCulture", "popularGenres"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as AIInsightData;

  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      country: countryName,
      summary: "Enjoy exploring radio stations from this region.",
      musicCulture: "Music connects the world.",
      popularGenres: ["Pop", "Traditional", "News"]
    };
  }
};

export const getDJIntro = async (stationName: string, country: string, genre: string): Promise<string> => {
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a cool, energetic radio DJ. Write a ONE SENTENCE intro for the station "${stationName}" from ${country}. Mention the genre "${genre}" if known. Keep it under 20 words.`,
      });
      return response.text || `Tuning into ${stationName} from ${country}...`;
  } catch (e) {
      return `Now playing ${stationName}...`;
  }
}
