// src/types/index.ts - All TypeScript type definitions

export interface GameQuestion {
  id: string;
  question: string;
  options: GameOption[];
  correctAnswer: number;
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  scripture?: string;
}

export interface GameOption {
  text: string;
  isCorrect?: boolean;
}

export interface SpiritualGame {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  questions: GameQuestion[];
  category: GameCategory;
}

export type GameCategory = 
  | 'scripture-detective'
  | 'moral-compass' 
  | 'faith-heroes'
  | 'love-language'
  | 'wisdom-warrior'
  | 'prayer-powerup';

export interface UserStats {
  xp: number;
  level: number;
  levelName: string;
  levelIcon: string;
  progress: number;
  nextLevelXP: number;
  gamesPlayedToday: string[];
  streak: number;
  totalGamesPlayed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageScore: number;
  lastPlayedDate: string;
}

export interface Level {
  id: number;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'gabe';
  timestamp: Date;
  emotion?: string;
  context?: string;
}

export interface BibleHero {
  id: string;
  name: string;
  title: string;
  story: string;
  lesson: string;
  scripture: string;
  modernApplication: string;
  keyQuote: string;
}

export interface DailyPromise {
  id: string;
  title: string;
  promise: string;
  scripture: string;
  personalApplication: string;
  prayerStarter: string;
}

export interface Prayer {
  id: string;
  title: string;
  category: string;
  situation: string;
  prayerText: string;
  bibleVerse: string;
  personalNote: string;
}

export interface AIPromptConfig {
  gameType: GameCategory;
  userLevel: number;
  userAge: number;
  difficulty: 'easy' | 'medium' | 'hard';
  context?: string;
  weakAreas?: string[];
}

export interface AIGeneratedContent {
  questions?: GameQuestion[];
  chatResponse?: string;
  dailyPromise?: DailyPromise;
  prayer?: Prayer;
  hero?: BibleHero;
}

export interface AppState {
  currentPage: 'landing' | 'chat' | 'games';
  user: UserStats;
  isTestMode: boolean;
  activeGame: string | null;
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface StorageKeys {
  USER_STATS: 'gabe_user_stats';
  CHAT_HISTORY: 'gabe_chat_history';
  GAMES_PLAYED_TODAY: 'gabe_games_today';
  TEST_MODE: 'gabe_test_mode';
  LAST_VISIT: 'gabe_last_visit';
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}