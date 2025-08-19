// src/data/games/faith-heroes.ts

import { GameQuestion } from '@/types';

export const FAITH_HEROES_QUESTIONS: GameQuestion[] = [
  {
    id: 'fh-1',
    question: 'This young shepherd boy defeated a giant with just a sling and a stone. Who was he?',
    options: [
      { text: 'Samuel' },
      { text: 'David' },
      { text: 'Jonathan' },
      { text: 'Gideon' }
    ],
    correctAnswer: 1,
    explanation: 'David trusted in God\'s power, not his own strength (1 Samuel 17:45). His victory teaches us that with God, we can overcome seemingly impossible challenges.',
    scripture: '1 Samuel 17:45',
    difficulty: 'easy'
  },
  {
    id: 'fh-2',
    question: 'This queen risked her life to save her people from destruction. Who was she?',
    options: [
      { text: 'Ruth' },
      { text: 'Deborah' },
      { text: 'Esther' },
      { text: 'Miriam' }
    ],
    correctAnswer: 2,
    explanation: 'Queen Esther courageously approached the king to save the Jewish people (Esther 4:16). She shows us that God positions us "for such a time as this" to make a difference.',
    scripture: 'Esther 4:14',
    difficulty: 'medium'
  },
  {
    id: 'fh-3',
    question: 'This prophet was thrown into a den of lions but God protected him. Who was he?',
    options: [
      { text: 'Daniel' },
      { text: 'Jeremiah' },
      { text: 'Ezekiel' },
      { text: 'Isaiah' }
    ],
    correctAnswer: 0,
    explanation: 'Daniel refused to stop praying to God even when it meant facing lions (Daniel 6:10). His faithfulness shows us that staying true to God is worth any cost.',
    scripture: 'Daniel 6:22',
    difficulty: 'easy'
  },
  {
    id: 'fh-4',
    question: 'This woman showed great faith by leaving her homeland to follow her mother-in-law and serve God. Who was she?',
    options: [
      { text: 'Naomi' },
      { text: 'Ruth' },
      { text: 'Rachel' },
      { text: 'Rebecca' }
    ],
    correctAnswer: 1,
    explanation: 'Ruth chose loyalty and faith over comfort (Ruth 1:16). Her story shows how God blesses those who choose faithfulness over convenience.',
    scripture: 'Ruth 1:16',
    difficulty: 'medium'
  },
  {
    id: 'fh-5',
    question: 'This man built an ark to save his family and animals from the flood. Who was he?',
    options: [
      { text: 'Abraham' },
      { text: 'Moses' },
      { text: 'Noah' },
      { text: 'Jacob' }
    ],
    correctAnswer: 2,
    explanation: 'Noah obeyed God even when it seemed crazy to others (Genesis 6:19). His obedience saved his family and shows us the importance of trusting God\'s plan.',
    scripture: 'Genesis 6:19',
    difficulty: 'easy'
  },
  {
    id: 'fh-6',
    question: 'This apostle was called "the rock" and became a leader of the early church, despite denying Jesus three times. Who was he?',
    options: [
      { text: 'Paul' },
      { text: 'John' },
      { text: 'Peter' },
      { text: 'James' }
    ],
    correctAnswer: 2,
    explanation: 'Peter\'s story shows that failure isn\'t final with God (John 21:17). After denying Jesus, he was restored and became a bold leader, proving God can use our failures for His glory.',
    scripture: 'John 21:17',
    difficulty: 'medium'
  },
  {
    id: 'fh-7',
    question: 'This young woman said "Let it be unto me according to your word" when told she would give birth to the Messiah. Who was she?',
    options: [
      { text: 'Mary' },
      { text: 'Martha' },
      { text: 'Elizabeth' },
      { text: 'Anna' }
    ],
    correctAnswer: 0,
    explanation: 'Mary\'s response shows complete surrender to God\'s will (Luke 1:38). Her faith teaches us to trust God\'s plan even when we don\'t understand it.',
    scripture: 'Luke 1:38',
    difficulty: 'easy'
  }
];