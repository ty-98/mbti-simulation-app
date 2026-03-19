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
    const { setupData, chatHistory } = req.body;

    const systemPrompt = `
あなたはコミュニケーションスキルの専門家です。
ユーザーは${setupData.mbti}のタイプを持つ相手（関係性：${setupData.relationship}）と、以下のシチュエーションで会話のシミュレーションを行いました。
シチュエーション：「${setupData.situation}」

提供されるチャットログを分析し、以下の要件を満たすJSON形式で評価を出力してください。必ずJSON形式のみを出力し、その他の文章は含めないでください。
{
  "score": 0〜100の総合スコア (数値),
  "goodPoints": ["良かった点1", "良かった点2", "良かった点3"] (簡潔な文字列の配列),
  "improvements": ["改善点1", "改善点2", "改善点3"] (簡潔な文字列の配列)
}
ユーザーの相手に対する配慮、MBTIの特性への理解度、シチュエーションへの適切な対応力を評価基準としてください。
`;

    const transcript = chatHistory.map((msg: any) => `${msg.sender}: ${msg.text}`).join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `【チャットログ】\n${transcript}` }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      response_format: { type: "json_object" }
    });

    const resultStr = response.choices[0]?.message?.content || '{}';
    const result = JSON.parse(resultStr);

    res.status(200).json(result);
  } catch (error) {
    console.error('Evaluate API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
