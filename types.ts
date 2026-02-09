
export enum VoiceType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  MALE_CHORUS = 'MALE_CHORUS',
  MIXED_CHORUS = 'MIXED_CHORUS'
}

export enum Emotion {
  PIOUS = 'خاشع',
  LONGING = 'مشتاق',
  SAD = 'حزين',
  ENTHUSIASTIC = 'حماسي',
  MAJESTIC = 'مهيب',
  SPIRITUAL_JOY = 'فرح روحاني'
}

export enum ChantingStyle {
  MADIH = 'مديح نبوي',
  KHIDIMIYYA = 'قصائد الشيخ أحمد بمبا',
  DHIKR = 'ذكر جماعي',
  ZAWIYA = 'إنشاد زاوية',
  EDUCATIONAL = 'إنشاد تعليمي',
  FESTIVE = 'إنشاد احتفالي'
}

export interface Munshid {
  id: string;
  name: string;
  type: VoiceType;
  description: string;
  pitch: 'low' | 'medium' | 'high';
  tone: string;
  geminiVoice: string;
}

export interface ChantConfig {
  voiceId: string;
  emotion: Emotion;
  style: ChantingStyle;
  humilityLevel: number; // 0-100
  speed: number; // 0.5 to 2.0
  expressionPower: number;
  pauseLength: number;
  repeatVerses: boolean;
}

export interface AudioSegment {
  id: string;
  text: string;
  audioUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface Project {
  id: string;
  title: string;
  originalText: string;
  segments: AudioSegment[];
  config: ChantConfig;
  createdAt: number;
}
