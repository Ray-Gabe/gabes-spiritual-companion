// src/data/games/moral-compass.ts

import { GameQuestion } from '@/types';

export const MORAL_COMPASS_QUESTIONS: GameQuestion[] = [
  {
    id: 'mc-1',
    question: 'Your friend asks you to lie to their parents about where they were last night. What do you do?',
    options: [
      { text: 'Lie to help your friend avoid trouble' },
      { text: 'Tell your friend you can\'t lie, and encourage honesty' },
      { text: 'Avoid the situation by not answering' },
      { text: 'Tell a "white lie" since it\'s not that serious' }
    ],
    correctAnswer: 1,
    explanation: 'Integrity matters to God (Proverbs 12:22). While we want to help friends, lying breaks trust and goes against biblical values. Encouraging honesty shows true friendship.',
    scripture: 'Proverbs 12:22',
    difficulty: 'medium'
  },
  {
    id: 'mc-2',
    question: 'You find $20 on the ground in a busy area with no one around. What do you do?',
    options: [
      { text: 'Keep it since no one saw you find it' },
      { text: 'Turn it in to security or police' },
      { text: 'Wait around for 10 minutes, then keep it' },
      { text: 'Use it to buy something for someone else' }
    ],
    correctAnswer: 1,
    explanation: 'Honesty isn\'t about who\'s watching - it\'s about character (Luke 16:10). Turning in lost money shows integrity and gives the rightful owner a chance to claim it.',
    scripture: 'Luke 16:10',
    difficulty: 'medium'
  },
  {
    id: 'mc-3',
    question: 'You see someone being bullied at school. What\'s the best response?',
    options: [
      { text: 'Mind your own business to avoid getting involved' },
      { text: 'Stand up for the person being bullied' },
      { text: 'Join in so you don\'t become the next target' },
      { text: 'Record it on your phone for social media' }
    ],
    correctAnswer: 1,
    explanation: 'Proverbs 31:8-9 calls us to speak up for those who cannot speak for themselves. Standing up for others reflects God\'s heart for justice and protection of the vulnerable.',
    scripture: 'Proverbs 31:8-9',
    difficulty: 'easy'
  },
  {
    id: 'mc-4',
    question: 'Your teacher makes a mistake grading your test and gives you a higher score than you earned. What do you do?',
    options: [
      { text: 'Keep quiet and accept the higher grade' },
      { text: 'Tell the teacher about the mistake' },
      { text: 'Only mention it if someone else notices' },
      { text: 'Consider it a blessing and don\'t worry about it' }
    ],
    correctAnswer: 1,
    explanation: 'Honesty in small things leads to honesty in big things (Luke 16:10). Pointing out the error shows integrity and builds character, even when it costs you.',
    scripture: 'Luke 16:10',
    difficulty: 'hard'
  },
  {
    id: 'mc-5',
    question: 'A friend is spreading rumors about someone you know. How should you respond?',
    options: [
      { text: 'Listen to the gossip since it\'s interesting' },
      { text: 'Gently change the subject or defend the person' },
      { text: 'Add your own thoughts to the conversation' },
      { text: 'Tell the person being talked about what was said' }
    ],
    correctAnswer: 1,
    explanation: 'Proverbs 16:28 warns against gossip because it separates close friends. We should refuse to participate in harmful talk and instead speak words that build others up.',
    scripture: 'Proverbs 16:28',
    difficulty: 'medium'
  },
  {
    id: 'mc-6',
    question: 'You accidentally break something valuable at a friend\'s house. What do you do?',
    options: [
      { text: 'Don\'t say anything and hope they don\'t notice' },
      { text: 'Immediately tell them what happened and offer to pay for it' },
      { text: 'Blame it on someone else who was there' },
      { text: 'Wait to see if they ask about it first' }
    ],
    correctAnswer: 1,
    explanation: 'Taking responsibility shows integrity and respect for others (Ephesians 4:25). God honors honesty, and true friendship is built on trust and transparency.',
    scripture: 'Ephesians 4:25',
    difficulty: 'easy'
  }
];