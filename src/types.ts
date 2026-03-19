export type Screen = 'HOME' | 'CHAT' | 'EVALUATION';

export type MBTIType = 
  'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' |
  'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' |
  'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' |
  'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type Relationship = 
  'Boss' | 'Subordinate' | 'Colleague' | 'Lover' | 'Friend' | 'First Meeting';

export interface SetupData {
  mbti: MBTIType | '';
  relationship: Relationship | '';
  situation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: Date;
}

export interface EvaluationResult {
  score: number;
  goodPoints: string[];
  improvements: string[];
}
