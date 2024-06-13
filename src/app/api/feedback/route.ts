import { Configuration, OpenAIApi } from "openai";
import dbConnect from '../../lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST requests are allowed' });
    return;
  }

  const { transcript } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    basePath: process.env.AZURE_OPENAI_ENDPOINT,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: process.env.MODEL_NAME,
      messages: [{ role: 'user', content: transcript }],
      max_tokens: 100,
      temperature: 0.5,
    });

    const botMessage = response.data.choices[0].message.content;

    res.status(200).json({ text: botMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
