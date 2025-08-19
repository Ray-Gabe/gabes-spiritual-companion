// src/data/games/scripture-detective.ts

import { GameQuestion } from '@/types';

export const SCRIPTURE_DETECTIVE_QUESTIONS: GameQuestion[] = [
  {
    id: 'sd-1',
    question: 'Which of these is a real Bible verse?',
    options: [
      { text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
      { text: 'God helps those who help themselves and rely on their own strength.' },
      { text: 'The universe conspires to give you exactly what you need when you need it.' },
      { text: 'Prayer is just positive thinking directed toward the cosmos.' }
    ],
    correctAnswer: 0,
    explanation: 'This is Joshua 1:9, where God encourages Joshua before entering the Promised Land. The other quotes promote self-reliance and new-age thinking, not biblical dependence on God.',
    scripture: 'Joshua 1:9',
    difficulty: 'easy'
  },
  {
    id: 'sd-2', 
    question: 'Which of these is a real Bible verse?',
    options: [
      { text: 'Trust in yourself, for you have all the answers within.' },
      { text: 'Trust in the Lord with all your heart and lean not on your own understanding.' },
      { text: 'The path to enlightenment is through self-discovery alone.' },
      { text: 'God only helps those who first help themselves.' }
    ],
    correctAnswer: 1,
    explanation: 'This is Proverbs 3:5, teaching us to rely on God\'s wisdom rather than our limited human understanding. True wisdom comes from trusting God, not ourselves.',
    scripture: 'Proverbs 3:5',
    difficulty: 'easy'
  },
  {
    id: 'sd-3',
    question: 'Which of these is a real Bible verse about God\'s love?',
    options: [
      { text: 'God loves you only when you\'re being good and following the rules.' },
      { text: 'For God so loved the world that he gave his one and only Son.' },
      { text: 'God\'s love must be earned through good works and perfect behavior.' },
      { text: 'Divine love flows to those who achieve spiritual enlightenment.' }
    ],
    correctAnswer: 1,
    explanation: 'This is John 3:16, one of the most famous verses about God\'s unconditional love. God\'s love isn\'t earned - it\'s freely given to everyone.',
    scripture: 'John 3:16',
    difficulty: 'easy'
  },
  {
    id: 'sd-4',
    question: 'Which of these is a real Bible verse about worry?',
    options: [
      { text: 'Worry is natural and shows you care about important things.' },
      { text: 'Anxiety is just your intuition telling you something is wrong.' },
      { text: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself.' },
      { text: 'Stress is a sign that you\'re pushing yourself to achieve greatness.' }
    ],
    correctAnswer: 2,
    explanation: 'This is Matthew 6:34, where Jesus teaches us not to worry about the future. God wants us to trust Him with our concerns instead of being consumed by anxiety.',
    scripture: 'Matthew 6:34',
    difficulty: 'medium'
  },
  {
    id: 'sd-5',
    question: 'Which of these is a real Bible verse about forgiveness?',
    options: [
      { text: 'Forgive others only after they prove they\'ve truly changed.' },
      { text: 'Be kind to one another, tenderhearted, forgiving one another.' },
      { text: 'Some people don\'t deserve forgiveness for what they\'ve done.' },
      { text: 'Forgiveness is weakness; justice and revenge are strength.' }
    ],
    correctAnswer: 1,
    explanation: 'This is Ephesians 4:32, teaching us to forgive others as God has forgiven us. Biblical forgiveness isn\'t conditional on the other person\'s behavior.',
    scripture: 'Ephesians 4:32',
    difficulty: 'medium'
  }
];