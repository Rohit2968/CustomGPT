import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';
import mongoose from 'mongoose';
import chatRoutes from "./routes/chat.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.YOUR_SITE_URL,
    'X-Title': process.env.YOUR_SITE_NAME,
  },
});

app.use("/api", chatRoutes);

// Optional: remove if unused
app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [{ role: 'user', content: message }],
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content; // ✅ fixed
    res.json({ response: aiResponse });

  } catch (error) {
    console.error('OpenRouter error:', error);
    if (error.status === 402) {
      return res.status(402).json({
        error: 'Insufficient credits or too many tokens. Reduce `max_tokens` or upgrade at https://openrouter.ai/settings/credits',
      });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Connect DB and Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
  }
};

startServer();
