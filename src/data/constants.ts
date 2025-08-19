// src/data/constants.ts - App constants

export const APP_CONFIG = {
  name: 'GABE Spiritual Companion',
  tagline: 'Gabefiyied ✨ — Where Parables Become Playables',
  version: '2.0.0',
  author: 'GABE Team'
};

export const XP_CONFIG = {
  CORRECT_ANSWER: 25,
  BONUS_STREAK_5: 10,
  BONUS_STREAK_10: 25,
  DAILY_LOGIN: 5
};

export const GAME_CONFIG = {
  DAILY_LIMIT_PER_GAME: 1,
  TOTAL_GAMES: 6,
  MIN_DIFFICULTY: 'easy',
  MAX_DIFFICULTY: 'hard'
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 500,
  TYPING_DELAY: 1000,
  AUTO_SCROLL_DELAY: 100
};

export const LEVEL_THRESHOLDS = {
  SEEDLING: { min: 0, max: 99 },
  DISCIPLE: { min: 100, max: 299 },
  MESSENGER: { min: 300, max: 599 },
  GUARDIAN: { min: 600, max: 999 },
  KINGDOM_BUILDER: { min: 1000, max: Infinity }
} as const;

export const COLORS = {
  primary: {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    pink: '#EC4899',
    orange: '#F59E0B',
    cyan: '#06B6D4'
  },
  gradients: {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-600',
    pink: 'from-pink-500 to-rose-600',
    purple: 'from-purple-500 to-violet-600',
    cyan: 'from-cyan-500 to-blue-600'
  }
} as const;

export const GAME_CATEGORIES = {
  SCRIPTURE_DETECTIVE: 'scripture-detective',
  MORAL_COMPASS: 'moral-compass',
  FAITH_HEROES: 'faith-heroes',
  LOVE_LANGUAGE: 'love-language',
  WISDOM_WARRIOR: 'wisdom-warrior',
  PRAYER_POWERUP: 'prayer-powerup'
} as const;

export const STORAGE_KEYS = {
  USER_STATS: 'gabe_user_stats',
  CHAT_HISTORY: 'gabe_chat_history',
  GAMES_PLAYED_TODAY: 'gabe_games_today',
  TEST_MODE: 'gabe_test_mode',
  LAST_VISIT: 'gabe_last_visit'
} as const;

export const API_ENDPOINTS = {
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  OPENAI: 'https://api.openai.com/v1/chat/completions'
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;