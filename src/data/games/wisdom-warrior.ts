// src/data/games/wisdom-warrior.ts

import { GameQuestion } from '@/types';

export const WISDOM_WARRIOR_QUESTIONS: GameQuestion[] = [
  {
    id: 'ww-1',
    question: 'The world says "Follow your heart." What does the Bible say?',
    options: [
      { text: 'Your heart always knows what\'s best' },
      { text: 'The heart is deceitful above all things' },
      { text: 'Trust your feelings completely' },
      { text: 'Your heart is basically good' }
    ],
    correctAnswer: 1,
    explanation: 'Jeremiah 17:9 warns that our hearts can deceive us. We need God\'s wisdom and His Word to guide our decisions, not just our emotions.',
    scripture: 'Jeremiah 17:9',
    difficulty: 'medium'
  },
  {
    id: 'ww-2',
    question: 'Culture says "You can be anything you want to be." What\'s the biblical perspective?',
    options: [
      { text: 'God has uniquely gifted and called each person' },
      { text: 'You can achieve anything through positive thinking' },
      { text: 'Success is entirely up to your own willpower' },
      { text: 'There are no limits to human potential' }
    ],
    correctAnswer: 0,
    explanation: 'While the world promotes unlimited self-determination, the Bible teaches that God has specifically gifted and called each person (1 Corinthians 12:7). Our identity and purpose come from Him, not our own ambitions.',
    scripture: '1 Corinthians 12:7',
    difficulty: 'hard'
  },
  {
    id: 'ww-3',
    question: 'Culture says "You deserve happiness." What does the Bible emphasize instead?',
    options: [
      { text: 'You deserve whatever makes you happy' },
      { text: 'Joy comes from serving God and others' },
      { text: 'Happiness is the most important goal in life' },
      { text: 'You should pursue pleasure above all else' }
    ],
    correctAnswer: 1,
    explanation: 'While culture focuses on personal happiness, the Bible teaches that true joy comes from serving God and loving others (Galatians 5:13). This joy is deeper and more lasting than temporary happiness.',
    scripture: 'Galatians 5:13',
    difficulty: 'hard'
  },
  {
    id: 'ww-4',
    question: 'The world says "Live your truth." What does the Bible say about truth?',
    options: [
      { text: 'Everyone has their own truth' },
      { text: 'Jesus said "I am the way, the truth, and the life"' },
      { text: 'Truth is whatever feels right to you' },
      { text: 'Truth changes based on circumstances' }
    ],
    correctAnswer: 1,
    explanation: 'Jesus declared Himself as the truth (John 14:6). Biblical truth isn\'t subjective or personal - it\'s absolute and found in God\'s character and Word.',
    scripture: 'John 14:6',
    difficulty: 'medium'
  },
  {
    id: 'ww-5',
    question: 'Culture says "You\'re perfect just the way you are." What does the Bible teach?',
    options: [
      { text: 'Everyone is already perfect and doesn\'t need to change' },
      { text: 'We are loved but need transformation through Christ' },
      { text: 'Self-improvement is unnecessary' },
      { text: 'You should never try to change anything about yourself' }
    ],
    correctAnswer: 1,
    explanation: 'While God loves us unconditionally, the Bible teaches that we all need transformation (Romans 3:23). God loves us as we are but loves us too much to leave us that way.',
    scripture: 'Romans 3:23',
    difficulty: 'hard'
  },
  {
    id: 'ww-6',
    question: 'The world says "Money is the key to happiness." What does the Bible say?',
    options: [
      { text: 'Money solves all problems' },
      { text: 'The love of money is the root of all evil' },
      { text: 'Rich people are automatically blessed by God' },
      { text: 'Poor people lack faith' }
    ],
    correctAnswer: 1,
    explanation: '1 Timothy 6:10 warns that the love of money leads to all kinds of evil. The Bible doesn\'t condemn wealth but warns against making money our god.',
    scripture: '1 Timothy 6:10',
    difficulty: 'easy'
  },
  {
    id: 'ww-7',
    question: 'Culture promotes "Self-care above all else." What\'s the biblical balance?',
    options: [
      { text: 'Always put yourself first' },
      { text: 'Care for yourself so you can serve others well' },
      { text: 'Ignore your own needs completely' },
      { text: 'Self-care is selfish and wrong' }
    ],
    correctAnswer: 1,
    explanation: 'Jesus taught us to love others as ourselves (Mark 12:31). This implies proper self-care, but always with the goal of being able to love and serve others better.',
    scripture: 'Mark 12:31',
    difficulty: 'medium'
  }
];