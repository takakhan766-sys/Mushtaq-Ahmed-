
import { GoogleGenAI } from "@google/genai";

export const getFortune = async (name: string, zodiac: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are 'Pandit Ji', a mystical and wise fortune teller at a vibrant Indian Mela (fair). 
      The person's name is ${name} and their zodiac sign is ${zodiac}. 
      Give them a short, mysterious, and poetic fortune prediction for their future. 
      Use a warm, encouraging tone. Include one reference to a traditional Indian fair element (like sweets, lights, or music). 
      Keep it under 3 sentences.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text || "The stars are shy today, my child. Come back when the moon is higher.";
  } catch (error) {
    console.error("Fortune error:", error);
    return "The cosmic threads are tangled. Try again in a moment.";
  }
};
