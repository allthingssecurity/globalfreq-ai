import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightData } from "../types";

// Resolve API key in a way that works both locally (with env) and on
// GitHub Pages (no env) without crashing in the browser.
const apiKey =
  (typeof process !== "undefined" &&
    (process.env?.GEMINI_API_KEY || process.env?.API_KEY)) ||
  "";

// Only create the client when a key is actually available.
const ai: GoogleGenAI | null = apiKey
  ? new GoogleGenAI({ apiKey })
  : null;

export const getCountryMusicInsight = async (countryName: string): Promise<AIInsightData | null> => {
  try {
    if (!ai) {
      // No key available (e.g. GitHub Pages) – return a friendly fallback.
      return {
        country: countryName,
        summary: `Discover live radio from ${countryName} and explore its soundscape in real time.`,
        musicCulture: "AI insights are disabled on this deployment, but the music still tells the story.",
        popularGenres: ["Pop", "Traditional", "News"]
      };
    }

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
      if (!ai) {
        return `Now playing ${stationName} from ${country} – enjoy the vibes.`;
      }

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a cool, energetic radio DJ. Write a ONE SENTENCE intro for the station "${stationName}" from ${country}. Mention the genre "${genre}" if known. Keep it under 20 words.`,
      });
      return response.text || `Tuning into ${stationName} from ${country}...`;
  } catch (e) {
      return `Now playing ${stationName}...`;
  }
}
