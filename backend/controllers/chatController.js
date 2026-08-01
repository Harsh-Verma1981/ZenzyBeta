import axios from "axios";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.length > 1000) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // 🟢 UPDATE THIS LINE: Use the official router that auto-selects free models
        model: "openrouter/free", 
        messages: [
          {
            role: "system",
            content: "You are ZenzBot, an AI shopping assistant for Zenzloom.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });

  } catch (error) {
    // This log prints directly in your local VS Code terminal
    console.error("ERROR DETAILS:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI assistant is currently unavailable",
    });
  }
};