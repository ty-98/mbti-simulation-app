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

  const handleStartSimulation = (data: SetupData) => {
    setSetupData(data);
    setChatHistory([]); // Reset chat history
    setCurrentScreen('CHAT');
  };

  const handleEndChat = () => {
    // Generate mock evaluation based on chat history length and MBTI
    const mockEval: EvaluationResult = {
      score: Math.floor(Math.random() * 20) + 70, // Random 70-90
      goodPoints: [
        `You respected the ${setupData.mbti}'s preference for clear communication.`,
        "Your tone was appropriate for your relationship.",
        "You actively listened and responded thoughtfully."
      ],
      improvements: [
        `Be careful not to overwhelm the ${setupData.mbti} with too much emotion.`,
        "Try to provide more concrete examples next time.",
        "Ensure you ask more open-ended questions."
      ]
    };
    setEvaluationResult(mockEval);
    setCurrentScreen('EVALUATION');
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
        {currentScreen === 'EVALUATION' && evaluationResult && (
          <EvaluationDashboard 
            result={evaluationResult} 
            setupData={setupData} 
            onReturnHome={handleReturnHome} 
          />
        )}
      </main>
    </>
  );
}

export default App;
