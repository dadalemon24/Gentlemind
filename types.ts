export type Language = 'th' | 'en';

export enum Mood {
  AMAZING = 'Amazing',
  HAPPY = 'Happy',
  NORMAL = 'Normal',
  EXHAUSTED = 'Exhausted',
  DEPRESSED = 'Depressed',
  ANGRY = 'Angry',
}

export interface MoodConfig {
  id: Mood;
  label: { th: string; en: string };
  emoji: string;
  color: string;
  bgColor: string;
  description: { th: string; en: string };
}

export interface SessionRecord {
  id: string;
  date: string; // ISO string
  durationMinutes: number;
  moodBefore: Mood;
  moodAfter?: Mood;
}

export interface MeditationConfig {
  durationSeconds: number; 
}

export enum AppView {
  MOOD_CHECKIN = 'MOOD_CHECKIN',
  WISDOM = 'WISDOM',
  SETUP = 'SETUP',
  MEDITATION = 'MEDITATION',
  SUMMARY = 'SUMMARY',
  STATS = 'STATS',
}