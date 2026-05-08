import { GoogleGenAI } from "@google/genai";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Key is missing in environment variables!");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are ZenzBot, the friendly AI assistant for the e-commerce store "Zenzloom". 
      Your goal is to help customers with their queries. Be professional and concise. 
      Customer Query: ${message}`,
    });

    res.json({ reply: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "AI assistant is currently offline." });
  }
};