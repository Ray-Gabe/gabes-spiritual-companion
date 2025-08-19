// src/data/games/prayer-powerup.ts

import { GameQuestion } from '@/types';

export const PRAYER_POWERUP_QUESTIONS: GameQuestion[] = [
  {
    id: 'pp-1',
    question: 'What is the most important part of prayer?',
    options: [
      { text: 'Using the right words and phrases' },
      { text: 'Praying for a long time' },
      { text: 'Having a sincere heart and relationship with God' },
      { text: 'Praying in a specific location' }
    ],
    correctAnswer: 2,
    explanation: 'God looks at the heart, not external performance (1 Samuel 16:7). Sincere relationship and honest communication matter more than perfect words or lengthy prayers.',
    scripture: '1 Samuel 16:7',
    difficulty: 'easy'
  },
  {
    id: 'pp-2',
    question: 'According to Jesus, what should we do when we pray?',
    options: [
      { text: 'Pray loudly so everyone can hear our faith' },
      { text: 'Use many repetitive words to get God\'s attention' },
      { text: 'Go to a private place and pray to our Father' },
      { text: 'Only pray when we feel spiritually ready' }
    ],
    correctAnswer: 2,
    explanation: 'Jesus taught us to pray privately to our Father (Matthew 6:6). Prayer is intimate conversation with God, not a performance for others.',
    scripture: 'Matthew 6:6',
    difficulty: 'medium'
  },
  {
    id: 'pp-3',
    question: 'What should be our attitude when we pray?',
    options: [
      { text: 'Demanding what we want from God' },
      { text: 'Humble and thankful, seeking God\'s will' },
      { text: 'Confident that God will give us everything we ask for' },
      { text: 'Formal and using fancy religious words' }
    ],
    correctAnswer: 1,
    explanation: 'Jesus taught us to pray "Your will be done" (Matthew 6:10). Prayer is about aligning our hearts with God\'s will, not demanding our own way.',
    scripture: 'Matthew 6:10',
    difficulty: 'medium'
  },
  {
    id: 'pp-4',
    question: 'When should we pray?',
    options: [
      { text: 'Only on Sundays at church' },
      { text: 'Pray continually throughout the day' },
      { text: 'Only when we\'re in trouble' },
      { text: 'Only before meals and bedtime' }
    ],
    correctAnswer: 1,
    explanation: 'Paul instructs us to "pray continually" (1 Thessalonians 5:17). Prayer isn\'t just a formal activity - it\'s ongoing conversation with God throughout our day.',
    scripture: '1 Thessalonians 5:17',
    difficulty: 'easy'
  },
  {
    id: 'pp-5',
    question: 'What should we do when God doesn\'t answer our prayers the way we want?',
    options: [
      { text: 'Stop praying because God isn\'t listening' },
      { text: 'Trust that God knows what\'s best for us' },
      { text: 'Try praying harder and more often' },
      { text: 'Assume we\'re not good enough for God to answer' }
    ],
    correctAnswer: 1,
    explanation: 'Romans 8:28 reminds us that God works all things for good. Sometimes God\'s "no" or "wait" is better than our "yes" because He sees the bigger picture.',
    scripture: 'Romans 8:28',
    difficulty: 'hard'
  },
  {
    id: 'pp-6',
    question: 'What did Jesus teach us about persistence in prayer?',
    options: [
      { text: 'Give up if God doesn\'t answer immediately' },
      { text: 'Keep asking, seeking, and knocking' },
      { text: 'Only pray once about each request' },
      { text: 'Assume silence means no' }
    ],
    correctAnswer: 1,
    explanation: 'Jesus taught us to keep asking, seeking, and knocking (Matthew 7:7). Persistent prayer shows faith and dependence on God, not lack of faith.',
    scripture: 'Matthew 7:7',
    difficulty: 'medium'
  },
  {
    id: 'pp-7',
    question: 'What should we include in our prayers?',
    options: [
      { text: 'Only requests for what we want' },
      { text: 'Praise, confession, thanksgiving, and requests' },
      { text: 'Only thanksgiving for blessings' },
      { text: 'Only confessing our sins' }
    ],
    correctAnswer: 1,
    explanation: 'Philippians 4:6 teaches us to present our requests with thanksgiving. Balanced prayer includes worship, confession, gratitude, and asking - like a complete conversation.',
    scripture: 'Philippians 4:6',
    difficulty: 'medium'
  }
];