import { GoogleGenerativeAI } from "@google/generative-ai";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Double check the key exists right now
    if (!process.env.GEMINI_API_KEY) {
      console.error("Key is missing in environment variables!");
      return res.status(500).json({ message: "Server configuration error." });
    }

    // 2. Initialize INSIDE the function to ensure the key is fresh
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `You are ZenzBot, the friendly AI assistant for the e-commerce store "Zenzloom". 
    Your goal is to help customers with their queries. Be professional and concise. 
    Customer Query: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "AI assistant is currently offline." });
  }
};