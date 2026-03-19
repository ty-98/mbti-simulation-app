import React, { useState } from 'react';
import { SetupData, MBTIType, Relationship } from '../types';
import { User, Users, MessageSquare, Play } from 'lucide-react';

const mbtiTypes: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const relationships: Relationship[] = [
  'Boss', 'Subordinate', 'Colleague', 'Lover', 'Friend', 'First Meeting'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.mbti && data.relationship && data.situation) {
      onStart(data);
    }
  };

  const isFormValid = data.mbti !== '' && data.relationship !== '' && data.situation.trim() !== '';

  return (
    <div className="glass-panel p-8 animate-fade-in" style={{ width: '100%', maxWidth: '600px', margin: '40px auto' }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl text-gradient mb-2">Simulation Setup</h1>
        <p className="text-muted">Configure the parameters for your interpersonal practice.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <User size={18} />
            Target MBTI Type
          </label>
          <select 
            className="input-base"
            value={data.mbti}
            onChange={(e) => setData({ ...data, mbti: e.target.value as MBTIType })}
            required
          >
            <option value="" disabled>Select MBTI Type</option>
            {mbtiTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <Users size={18} />
            Relationship
          </label>
          <select 
            className="input-base"
            value={data.relationship}
            onChange={(e) => setData({ ...data, relationship: e.target.value as Relationship })}
            required
          >
            <option value="" disabled>Select Relationship</option>
            {relationships.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label flex-row items-center gap-2" style={{ display: 'flex' }}>
            <MessageSquare size={18} />
            Specific Situation
          </label>
          <textarea 
            className="input-base"
            placeholder="e.g. Asking for a raise, Breaking bad news, First date conversation..."
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
          Start Simulation
        </button>
      </form>
    </div>
  );
}
