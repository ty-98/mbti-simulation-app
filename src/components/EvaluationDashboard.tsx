import type { EvaluationResult, SetupData } from '../types';
import { Home, CheckCircle2, AlertCircle, Award } from 'lucide-react';

interface Props {
  result: EvaluationResult;
  setupData: SetupData;
  onReturnHome: () => void;
}

export default function EvaluationDashboard({ result, setupData, onReturnHome }: Props) {
  // Determine color based on score
  const scoreColor = result.score >= 80 ? 'var(--success)' : result.score >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="glass-panel p-8 animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '40px auto' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl text-gradient mb-2">シミュレーション評価</h1>
        <p className="text-muted">{setupData.mbti}（{setupData.relationship}）とのやり取りを分析しました。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '32px' }}>
        
        {/* Score Area */}
        <div className="card text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifySelf: 'center', width: '100%' }}>
          <Award size={48} color={scoreColor} style={{ marginBottom: '16px' }} />
          <h2 className="text-xl mb-2 text-muted">総合スコア</h2>
          <div style={{ 
            fontSize: '4rem', fontWeight: 'bold', color: scoreColor,
            textShadow: `0 0 20px ${scoreColor}40`
          }}>
            {result.score}
            <span style={{ fontSize: '1.5rem', marginLeft: '4px', opacity: 0.7 }}>/100</span>
          </div>
        </div>

        {/* Feedback Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 className="text-lg font-bold mb-4 flex-row items-center gap-2" style={{ color: 'var(--success)', display: 'flex' }}>
              <CheckCircle2 size={20} />
              良かった点
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.goodPoints.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--success)', marginTop: '2px' }}>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 className="text-lg font-bold mb-4 flex-row items-center gap-2" style={{ color: 'var(--danger)', display: 'flex' }}>
              <AlertCircle size={20} />
              改善ポイント
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.improvements.map((point, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--danger)', marginTop: '2px' }}>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center" style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '24px', display: 'flex', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={onReturnHome} style={{ width: '100%', maxWidth: '300px' }}>
          <Home size={20} />
          設定に戻る
        </button>
      </div>
    </div>
  );
}
