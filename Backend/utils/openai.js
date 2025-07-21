import "dotenv/config";

const getOpenAIResponse = async(message) => {
    const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

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

    // const aiResponse = completion.choices[0].message.content; // Reply from AI

    // ✅ Print AI output in terminal
    // console.log('\n🔹 AI Response:\n', aiResponse);

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('OpenRouter error:', error);

    // Optional: Handle 402 specifically
    if (error.status === 402) {
      return res.status(402).json({
        error: 'Insufficient credits or too many tokens. Reduce `max_tokens` or upgrade at https://openrouter.ai/settings/credits',
      });
    }

    res.status(500).json({ error: 'Something went wrong' });
  }
}

export default getOpenAIResponse;