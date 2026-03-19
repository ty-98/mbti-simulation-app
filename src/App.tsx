import { useState } from 'react';
import SituationSetting from './components/SituationSetting';
import ChatSimulation from './components/ChatSimulation';
import EvaluationDashboard from './components/EvaluationDashboard';
import type { Screen, SetupData, ChatMessage, EvaluationResult } from './types';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  
  const [setupData, setSetupData] = useState<SetupData>({
    mbti: '',
    relationship: '',
    situation: ''
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleStartSimulation = (data: SetupData) => {
    setSetupData(data);
    setChatHistory([]); // Reset chat history
    setCurrentScreen('CHAT');
  };

  const handleEndChat = async () => {
    setCurrentScreen('EVALUATION');
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupData, chatHistory })
      });

      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      setEvaluationResult(data);
    } catch (error) {
      console.error(error);
      setEvaluationResult({
        score: 0,
        goodPoints: ['エラーが発生しました'],
        improvements: ['API設定（OPENAI_API_KEY）などを確認してください']
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReturnHome = () => {
    setSetupData({ mbti: '', relationship: '', situation: '' });
    setChatHistory([]);
    setEvaluationResult(null);
    setCurrentScreen('HOME');
  };

  return (
    <>
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2" style={{ top: 'auto', bottom: '-10%', right: '-10%' }}></div>
      <div className="bg-blob bg-blob-1" style={{ top: '40%', left: '70%', opacity: 0.1, filter: 'blur(120px)' }}></div>
      
      <main className="container flex-col items-center justify-center p-4">
        {currentScreen === 'HOME' && (
          <SituationSetting onStart={handleStartSimulation} />
        )}
        {currentScreen === 'CHAT' && (
          <ChatSimulation 
            setupData={setupData} 
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
            onEnd={handleEndChat} 
          />
        )}
        {currentScreen === 'EVALUATION' && (
          isEvaluating ? (
            <div className="flex-col items-center justify-center p-8 text-center text-muted animate-fade-in" style={{ display: 'flex', gap: '16px', height: '60vh' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>評価を生成中...</div>
              <div>AIがあなたのコミュニケーションを詳細に分析しています。数秒お待ちください。</div>
            </div>
          ) : evaluationResult && (
            <EvaluationDashboard 
              result={evaluationResult} 
              setupData={setupData} 
              onReturnHome={handleReturnHome} 
            />
          )
        )}
      </main>
    </>
  );
}

export default App;
