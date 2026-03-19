import { useState, useEffect, useRef } from 'react';
import type { SetupData, ChatMessage } from '../types';
import { Send, LogOut, Cpu, User as UserIcon } from 'lucide-react';

interface Props {
  setupData: SetupData;
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onEnd: () => void;
}

export default function ChatSimulation({ setupData, chatHistory, setChatHistory, onEnd }: Props) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom limit
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: inputText.trim(),
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock AI Reply logic
    setTimeout(() => {
      const mockReplies = [
        `${setupData.mbti}として、その点をご指摘いただき感謝します。事実関係を確認しましょう。`,
        `${setupData.relationship}という関係性を踏まえると、それは興味深い視点ですね。`,
        `${setupData.situation}については、論理的なアプローチが必要だと考えています。`,
        `おっしゃることは分かりますが、長期的な影響も考慮に入れる必要があります。`
      ];
      
      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AI',
        text: mockReplies[Math.floor(Math.random() * mockReplies.length)],
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '800px', height: '85vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderTopLeftRadius: 'var(--radius-md)', borderTopRightRadius: 'var(--radius-md)' }}>
        <div>
          <h2 className="text-xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Cpu size={24} color="var(--accent-primary)" />
            {setupData.mbti} ({setupData.relationship})
          </h2>
          <span className="text-sm text-muted">シミュレーション: {setupData.situation}</span>
        </div>
        <button className="btn btn-secondary" onClick={onEnd} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <LogOut size={16} />
          終了して評価へ
        </button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {chatHistory.length === 0 && (
          <div className="text-center text-muted" style={{ margin: 'auto' }}>
            <p>{setupData.mbti}の{setupData.relationship}との会話を始めてください。</p>
          </div>
        )}
        
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'USER';
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', background: isUser ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)', flexShrink: 0
              }}>
                {isUser ? <UserIcon size={16} color="white" /> : <Cpu size={16} color="var(--text-primary)" />}
              </div>
              <div style={{
                background: isUser ? 'rgba(138, 43, 226, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isUser ? '1px solid rgba(138, 43, 226, 0.3)' : '1px solid var(--surface-border)',
                padding: '12px 16px',
                borderRadius: '16px',
                borderBottomRightRadius: isUser ? '4px' : '16px',
                borderBottomLeftRadius: isUser ? '16px' : '4px',
                maxWidth: '70%',
                color: 'var(--text-primary)',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'flex-end' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                <Cpu size={16} />
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--surface-border)', padding: '12px 16px',
                borderRadius: '16px', borderBottomLeftRadius: '4px', display: 'flex', gap: '4px', alignItems: 'center'
              }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'fadeIn 1s infinite' }} />
                <span style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'fadeIn 1s infinite 0.2s' }} />
                <span style={{ width: '8px', height: '8px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'fadeIn 1s infinite 0.4s' }} />
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '20px 24px', borderTop: '1px solid var(--surface-border)', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: 'var(--radius-md)', borderBottomRightRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          <textarea
            className="input-base"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`${setupData.mbti}にメッセージを送信...`}
            style={{ minHeight: '50px', paddingRight: '60px', borderRadius: '24px' }}
            rows={1}
          />
          <button 
            className="btn-primary" 
            onClick={handleSend}
            disabled={!inputText.trim()}
            style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', width: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: inputText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s', background: inputText.trim() ? 'var(--accent-gradient)' : 'var(--bg-tertiary)' }}
          >
            <Send size={18} color="white" />
          </button>
        </div>
        <p className="text-muted text-center mt-2" style={{ fontSize: '0.75rem', marginBottom: 0 }}>Enterで送信、Shift+Enterで改行</p>
      </div>
    </div>
  );
}
