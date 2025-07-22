import "dotenv/config";
import OpenAI from "openai";

// ✅ Initialize openai instance
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, // from your .env file
  baseURL: "https://openrouter.ai/api/v1",
});

const getOpenAIResponse = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content;

    // ✅ return the message to caller
    return aiResponse;

  } catch (error) {
    console.error('OpenRouter error:', error);

    // Optional: Handle 402 errors from OpenRouter
    if (error.status === 402) {
      throw new Error("Insufficient credits or too many tokens.");
    }

    throw new Error("AI Request Failed");
  }
};

export default getOpenAIResponse;
