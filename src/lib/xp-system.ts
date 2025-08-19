// src/lib/xp-system.ts - Pure XP and Level Logic

import { UserStats, Level } from '@/types';

// Level definitions
export const LEVELS: Level[] = [
  { id: 0, name: 'Seedling', icon: '🌱', minXP: 0, maxXP: 99, description: 'Starting your spiritual journey' },
  { id: 1, name: 'Disciple', icon: '👥', minXP: 100, maxXP: 299, description: 'Learning to follow' },
  { id: 2, name: 'Messenger', icon: '💬', minXP: 300, maxXP: 599, description: 'Sharing the good news' },
  { id: 3, name: 'Guardian', icon: '🛡️', minXP: 600, maxXP: 999, description: 'Protecting the faith' },
  { id: 4, name: 'Kingdom Builder', icon: '👑', minXP: 1000, maxXP: Infinity, description: 'Building God\'s kingdom' }
];

export const XP_PER_CORRECT_ANSWER = 25;

export function calculateLevel(xp: number): Level {
  return LEVELS.find(level => xp >= level.minXP && xp <= level.maxXP) || LEVELS[0];
}

export function calculateProgress(xp: number): number {
  const currentLevel = calculateLevel(xp);
  if (currentLevel.maxXP === Infinity) return 100;
  
  const progressInLevel = xp - currentLevel.minXP;
  const levelRange = currentLevel.maxXP - currentLevel.minXP + 1;
  return Math.min(Math.round((progressInLevel / levelRange) * 100), 100);
}

export function getNextLevelXP(currentXP: number): number {
  const currentLevel = calculateLevel(currentXP);
  const nextLevel = LEVELS.find(level => level.minXP > currentLevel.maxXP);
  return nextLevel ? nextLevel.minXP : currentLevel.maxXP;
}

export function awardXP(currentStats: UserStats, amount: number = XP_PER_CORRECT_ANSWER): UserStats {
  const newXP = currentStats.xp + amount;
  const newLevel = calculateLevel(newXP);
  const progress = calculateProgress(newXP);
  const nextLevelXP = getNextLevelXP(newXP);

  return {
    ...currentStats,
    xp: newXP,
    level: newLevel.id,
    levelName: newLevel.name,
    levelIcon: newLevel.icon,
    progress,
    nextLevelXP,
    correctAnswers: currentStats.correctAnswers + 1,
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    averageScore: Math.round(((currentStats.correctAnswers + 1) / (currentStats.totalGamesPlayed + 1)) * 100)
  };
}

export function recordIncorrectAnswer(currentStats: UserStats): UserStats {
  return {
    ...currentStats,
    incorrectAnswers: currentStats.incorrectAnswers + 1,
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    averageScore: Math.round((currentStats.correctAnswers / (currentStats.totalGamesPlayed + 1)) * 100)
  };
}

export function createDefaultUserStats(): UserStats {
  const defaultLevel = LEVELS[0];
  return {
    xp: 0,
    level: 0,
    levelName: defaultLevel.name,
    levelIcon: defaultLevel.icon,
    progress: 0,
    nextLevelXP: LEVELS[1].minXP,
    gamesPlayedToday: [],
    streak: 0,
    totalGamesPlayed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageScore: 0,
    lastPlayedDate: new Date().toDateString()
  };
}

// Game logic functions
export function canPlayGame(gameId: string, userStats: UserStats, isTestMode: boolean = false): boolean {
  if (isTestMode) return true;
  
  const today = new Date().toDateString();
  if (userStats.lastPlayedDate !== today) {
    // New day, reset games played
    return true;
  }
  
  return !userStats.gamesPlayedToday.includes(gameId);
}

export function markGameAsPlayed(gameId: string, userStats: UserStats): UserStats {
  const today = new Date().toDateString();
  
  if (userStats.lastPlayedDate !== today) {
    // New day, reset the games played list
    return {
      ...userStats,
      gamesPlayedToday: [gameId],
      lastPlayedDate: today
    };
  }
  
  return {
    ...userStats,
    gamesPlayedToday: [...userStats.gamesPlayedToday, gameId],
    lastPlayedDate: today
  };
}

export function resetDailyProgress(userStats: UserStats): UserStats {
  const today = new Date().toDateString();
  
  if (userStats.lastPlayedDate !== today) {
    return {
      ...userStats,
      gamesPlayedToday: [],
      lastPlayedDate: today
    };
  }
  
  return userStats;
}

export function updateStreak(userStats: UserStats, isCorrect: boolean): UserStats {
  if (isCorrect) {
    return {
      ...userStats,
      streak: userStats.streak + 1
    };
  } else {
    return {
      ...userStats,
      streak: 0
    };
  }
}