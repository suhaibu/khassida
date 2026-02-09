
import { VoiceType, Munshid, Emotion, ChantingStyle } from './types';

export const MUNSHIDS: Munshid[] = [
  {
    id: 'm1',
    name: 'المنشد عثمان',
    type: VoiceType.MALE,
    description: 'صوت رخيم عميق يتسم بالوقار والخشوع السنغالي الأصيل.',
    pitch: 'low',
    tone: 'سنغالي - إفريقي صوفي',
    geminiVoice: 'Kore'
  },
  {
    id: 'm2',
    name: 'المنشدة مريم',
    type: VoiceType.FEMALE,
    description: 'نبرة روحانية صافية مناسبة للمناجاة والمديح النسائي.',
    pitch: 'medium',
    tone: 'روحاني ناعم',
    geminiVoice: 'Puck'
  },
  {
    id: 'm3',
    name: 'كورال التوحيد',
    type: VoiceType.MALE_CHORUS,
    description: 'أداء جماعي مهيب يحاكي حلقات الذكر في الزوايا الكبرى.',
    pitch: 'medium',
    tone: 'جماعي - زاوية',
    geminiVoice: 'Charon'
  },
  {
    id: 'm4',
    name: 'المنشد إبراهيم',
    type: VoiceType.MALE,
    description: 'صوت حماسي مرتفع الطبقة للقصائد الحماسية والمناسبات.',
    pitch: 'high',
    tone: 'حماسي - مغربي/سنغالي',
    geminiVoice: 'Fenrir'
  }
];

export const STYLE_PRESETS: Record<ChantingStyle, Partial<any>> = {
  [ChantingStyle.MADIH]: { speed: 1.0, humilityLevel: 80, emotion: Emotion.LONGING },
  [ChantingStyle.KHIDIMIYYA]: { speed: 0.9, humilityLevel: 95, emotion: Emotion.PIOUS },
  [ChantingStyle.DHIKR]: { speed: 1.1, humilityLevel: 70, emotion: Emotion.MAJESTIC },
  [ChantingStyle.ZAWIYA]: { speed: 0.8, humilityLevel: 90, emotion: Emotion.PIOUS },
  [ChantingStyle.EDUCATIONAL]: { speed: 1.2, humilityLevel: 50, emotion: Emotion.SPIRITUAL_JOY },
  [ChantingStyle.FESTIVE]: { speed: 1.3, humilityLevel: 40, emotion: Emotion.SPIRITUAL_JOY },
};
