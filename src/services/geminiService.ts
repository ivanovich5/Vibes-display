import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchMotivationalQuotes(): Promise<Quote[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a list of 10 deeply inspiring and diverse motivational quotes in Spanish. Each quote should have a unique ID, the text, and the author. Focus on themes of perseverance, inner peace, and growth.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              author: { type: Type.STRING },
            },
            required: ["id", "text", "author"],
          },
        },
      },
    });

    const quotes = JSON.parse(response.text || "[]");
    return quotes;
  } catch (error) {
    console.error("Error fetching quotes:", error);
    // Fallback quotes
    return [
      { id: "1", text: "La única forma de hacer un gran trabajo es amar lo que haces.", author: "Steve Jobs" },
      { id: "2", text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
      { id: "3", text: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", author: "Robert Collier" },
      { id: "4", text: "Tu tiempo es limitado, no lo malgastes viviendo la vida de otro.", author: "Steve Jobs" },
      { id: "5", text: "Cree que puedes y ya habrás recorrido la mitad del camino.", author: "Theodore Roosevelt" },
    ];
  }
}
