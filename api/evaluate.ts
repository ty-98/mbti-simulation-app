import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { setupData, chatHistory } = req.body;

    const systemPrompt = `あなたはコミュニケーションスキルの専門家です。
ユーザーは${setupData.mbti}のタイプを持つ相手（関係性：${setupData.relationship}）と、以下のシチュエーションで会話のシミュレーションを行いました。
シチュエーション：「${setupData.situation}」
ユーザーの相手に対する配慮、MBTIの特性への理解度、シチュエーションへの適切な対応力を総合的に100点満点で評価してください。`;

    const transcript = chatHistory.map((msg: any) => `${msg.sender}: ${msg.text}`).join('\n');
    const prompt = `以下のチャットログを分析し、JSONで評価結果を出力してください。\n\n【チャットログ】\n${transcript}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.INTEGER, description: "0〜100の総合スコア" },
            goodPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "良かった点3つの配列" },
            improvements: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "改善点3つの配列" }
          },
          required: ["score", "goodPoints", "improvements"]
        }
      }
    });

    const result = await model.generateContent(prompt);
    const jsonStr = result.response.text();
    const evaluation = JSON.parse(jsonStr);

    res.status(200).json(evaluation);
  } catch (error) {
    console.error('Evaluate API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
