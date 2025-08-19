// src/data/games/index.ts - Export all games

import { Brain, Heart, Users, Shield, Crown, Lightbulb } from 'lucide-react';
import { SpiritualGame } from '@/types';
import { SCRIPTURE_DETECTIVE_QUESTIONS } from './scripture-detective';
import { MORAL_COMPASS_QUESTIONS } from './moral-compass';
import { FAITH_HEROES_QUESTIONS } from './faith-heroes';
import { LOVE_LANGUAGE_QUESTIONS } from './love-language';
import { WISDOM_WARRIOR_QUESTIONS } from './wisdom-warrior';
import { PRAYER_POWERUP_QUESTIONS } from './prayer-powerup';

export const SPIRITUAL_GAMES: SpiritualGame[] = [
  {
    id: 'scripture-detective',
    title: 'Scripture Detective',
    description: 'Can you spot the real Bible verse?',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600',
    questions: SCRIPTURE_DETECTIVE_QUESTIONS,
    category: 'scripture-detective'
  },
  {
    id: 'moral-compass',
    title: 'Moral Compass',
    description: 'Navigate ethical dilemmas with biblical wisdom',
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    questions: MORAL_COMPASS_QUESTIONS,
    category: 'moral-compass'
  },
  {
    id: 'faith-heroes',
    title: 'Faith Heroes',
    description: 'Learn from biblical champions',
    icon: Users,
    color: 'from-orange-500 to-red-600',
    questions: FAITH_HEROES_QUESTIONS,
    category: 'faith-heroes'
  },
  {
    id: 'love-language',
    title: 'Love Language Lab',
    description: 'Practice showing biblical love',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    questions: LOVE_LANGUAGE_QUESTIONS,
    category: 'love-language'
  },
  {
    id: 'wisdom-warrior',
    title: 'Wisdom Warrior',
    description: 'Counter worldly lies with biblical truth',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    questions: WISDOM_WARRIOR_QUESTIONS,
    category: 'wisdom-warrior'
  },
  {
    id: 'prayer-powerup',
    title: 'Prayer Power-Up',
    description: 'Level up your prayer life',
    icon: Lightbulb,
    color: 'from-cyan-500 to-blue-600',
    questions: PRAYER_POWERUP_QUESTIONS,
    category: 'prayer-powerup'
  }
];

// Export individual question sets for easy access
export {
  SCRIPTURE_DETECTIVE_QUESTIONS,
  MORAL_COMPASS_QUESTIONS,
  FAITH_HEROES_QUESTIONS,
  LOVE_LANGUAGE_QUESTIONS,
  WISDOM_WARRIOR_QUESTIONS,
  PRAYER_POWERUP_QUESTIONS
};

// Helper functions for games
export function getGameById(gameId: string): SpiritualGame | undefined {
  return SPIRITUAL_GAMES.find(game => game.id === gameId);
}

export function getGamesByCategory(category: string): SpiritualGame[] {
  return SPIRITUAL_GAMES.filter(game => game.category === category);
}

export function getRandomGame(): SpiritualGame {
  return SPIRITUAL_GAMES[Math.floor(Math.random() * SPIRITUAL_GAMES.length)];
}

export function getAllGameIds(): string[] {
  return SPIRITUAL_GAMES.map(game => game.id);
}

export function getTotalGamesCount(): number {
  return SPIRITUAL_GAMES.length;
}

export function getTotalQuestionsCount(): number {
  return SPIRITUAL_GAMES.reduce((total, game) => total + game.questions.length, 0);
}