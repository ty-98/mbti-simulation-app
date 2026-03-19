import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { setupData, chatHistory, inputText } = req.body;

    const systemPrompt = `
あなたは${setupData.mbti}の性格を持つ人間として振る舞うAIです。
ユーザーからは「${setupData.relationship}」という関係性として接されます。
現在のシチュエーションは「${setupData.situation}」です。

MBTI（${setupData.mbti}）の特徴や行動パターン、口調を意識して返答してください。
テキストチャットのような、自然で簡潔な長さの返答を心がけてください。
AIやアシスタントとしてではなく、設定された人物として会話を続けてください。
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.sender === 'USER' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: inputText }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
    });

    const reply = response.choices[0]?.message?.content || '申し訳ありません、エラーが発生しました。';
    res.status(200).json({ text: reply });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
