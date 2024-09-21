import express from 'express';
import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.get('/', async (req, res) => {
  const chatCompletion = await getGroqChatCompletion();
  res.send(chatCompletion.choices[0]?.message?.content || "No content");
});

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});