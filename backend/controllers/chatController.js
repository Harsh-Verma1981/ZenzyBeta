import axios from "axios";

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  // ✅ PASTE IT HERE
  if (!message || typeof message !== "string" || message.length > 1000) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You are ZenzBot...",
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
    console.error("ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI assistant is currently unavailable",
    });
  }
};