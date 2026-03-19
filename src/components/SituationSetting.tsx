import { useState } from 'react';
import type { FormEvent } from 'react';
import type { SetupData, MBTIType, Relationship } from '../types';
import { User, Users, MessageSquare, Play } from 'lucide-react';

const mbtiTypes: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const relationships: Relationship[] = [
  '上司', '部下', '同僚', '恋人', '友人', '初対面'
];

interface Props {
  onStart: (data: SetupData) => void;
}

export default function SituationSetting({ onStart }: Props) {
  const [data, setData] = useState<SetupData>({
    mbti: '',
    relationship: '',
    situation: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (data.mbti && data.relationship && data.situation) {
      onStart(data);
    }
  };

  const isFormValid = data.mbti !== '' && data.relationship !== '' && data.situation.trim() !== '';

  return (
    <div className="glass-panel p-8 animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: '40px auto' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl text-gradient mb-2">シミュレーション設定</h1>
        <p className="text-muted">対人練習のためのパラメータを設定してください。</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <User size={18} />
            相手のMBTIタイプ
          </label>
          <select 
            className="input-base"
            value={data.mbti}
            onChange={(e) => setData({ ...data, mbti: e.target.value as MBTIType })}
            required
          >
            <option value="" disabled>MBTIタイプを選択</option>
            {mbtiTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <Users size={18} />
            自分との関係
          </label>
          <select 
            className="input-base"
            value={data.relationship}
            onChange={(e) => setData({ ...data, relationship: e.target.value as Relationship })}
            required
          >
            <option value="" disabled>関係を選択</option>
            {relationships.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <MessageSquare size={18} />
            具体的なシチュエーション
          </label>
          <textarea 
            className="input-base"
            placeholder="例：昇進の交渉、悪いニュースを伝える、初デートの会話..."
            value={data.situation}
            onChange={(e) => setData({ ...data, situation: e.target.value })}
            required
            rows={4}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary mt-4" style={{ width: '100%' }}
          disabled={!isFormValid}
        >
          <Play size={20} />
          シミュレーション開始
        </button>
      </form>
    </div>
  );
}
