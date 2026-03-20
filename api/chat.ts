import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { setupData, chatHistory, inputText } = req.body;

    const systemPrompt = `あなたは${setupData.mbti}の性格を持つ人間として振る舞うAIです。
ユーザーからは「${setupData.relationship}」という関係性として接されます。
現在のシチュエーションは「${setupData.situation}」です。
MBTI（${setupData.mbti}）の特徴や行動パターン、口調を意識して返答してください。
テキストチャットのような、自然で簡潔な長さの返答を心がけてください。
AIやアシスタントとしてではなく、設定された人物として会話を続けてください。`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const history = chatHistory.map((msg: any) => ({
      role: msg.sender === 'USER' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(inputText);
    const reply = result.response.text();

    res.status(200).json({ text: reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
