import axios from "axios";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const askGroq = async (systemPrompt, userPrompt) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Server configuration error: Groq API Key missing");
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: "llama-3.3-70b-versatile", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, 
      }
    );

    return response.data.choices[0]?.message?.content?.trim() || "I am unsure.";
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    throw new Error("AI service temporarily unavailable.");
  }
};
