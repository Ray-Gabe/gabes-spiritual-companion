// src/data/chat/daily-promises.ts

import { DailyPromise } from '@/types';

export const DAILY_PROMISES: DailyPromise[] = [
  {
    id: 'strength',
    title: 'Promise of Strength',
    promise: 'I can do all things through Christ who strengthens me.',
    scripture: 'Philippians 4:13',
    personalApplication: 'Whatever you\'re facing today - a difficult test, a challenging conversation, or just getting through the day - God\'s strength is available to you. You don\'t have to rely on your own power.',
    prayerStarter: 'God, I feel overwhelmed by [specific situation]. Help me remember that Your strength is perfect in my weakness...'
  },
  {
    id: 'peace',
    title: 'Promise of Peace',
    promise: 'Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.',
    scripture: 'John 14:27',
    personalApplication: 'When anxiety tries to take over, when you\'re stressed about the future, or when everything feels chaotic, Jesus offers His perfect peace that surpasses understanding.',
    prayerStarter: 'Jesus, my mind is racing with worry about [specific concern]. Please fill me with Your peace that passes understanding...'
  },
  {
    id: 'love',
    title: 'Promise of Love',
    promise: 'For I am convinced that nothing can separate us from the love of God that is in Christ Jesus our Lord.',
    scripture: 'Romans 8:38-39',
    personalApplication: 'No matter what mistakes you\'ve made, how you\'re feeling about yourself, or what others think of you, God\'s love for you is unshakeable and eternal.',
    prayerStarter: 'Father, sometimes I don\'t feel lovable because of [specific struggle]. Help me understand how deep and unchanging Your love is for me...'
  },
  {
    id: 'guidance',
    title: 'Promise of Guidance',
    promise: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    scripture: 'Proverbs 3:5-6',
    personalApplication: 'When you\'re unsure about decisions big or small, when the future feels unclear, God promises to guide you. You don\'t have to figure everything out on your own.',
    prayerStarter: 'Lord, I need Your wisdom for [specific decision]. Help me trust Your guidance over my own understanding...'
  },
  {
    id: 'provision',
    title: 'Promise of Provision',
    promise: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    scripture: 'Philippians 4:19',
    personalApplication: 'Whether you\'re worried about money, relationships, your future, or daily needs, God sees what you need and promises to provide for you.',
    prayerStarter: 'God, I\'m worried about [specific need]. Help me trust that You see my situation and will provide what I truly need...'
  },
  {
    id: 'forgiveness',
    title: 'Promise of Forgiveness',
    promise: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
    scripture: '1 John 1:9',
    personalApplication: 'When guilt and shame try to convince you that you\'re too far gone, remember that God\'s forgiveness is complete and immediate for those who come to Him.',
    prayerStarter: 'Father, I\'ve messed up with [specific sin]. Thank You that Your forgiveness is bigger than my mistakes...'
  },
  {
    id: 'hope',
    title: 'Promise of Hope',
    promise: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.',
    scripture: 'Jeremiah 29:11',
    personalApplication: 'When life feels hopeless or you can\'t see how things will work out, God has good plans for your life. Your story isn\'t over.',
    prayerStarter: 'Lord, I can\'t see how [difficult situation] will work out for good. Help me trust in Your plans for my future...'
  },
  {
    id: 'presence',
    title: 'Promise of Presence',
    promise: 'Never will I leave you; never will I forsake you.',
    scripture: 'Hebrews 13:5',
    personalApplication: 'When you feel alone, abandoned, or like no one understands, God promises to never leave your side. You\'re never truly alone.',
    prayerStarter: 'God, I feel so alone in [specific situation]. Help me sense Your presence and remember that You\'re always with me...'
  },
  {
    id: 'renewal',
    title: 'Promise of Renewal',
    promise: 'He gives strength to the weary and increases the power of the weak. But those who hope in the Lord will renew their strength.',
    scripture: 'Isaiah 40:29,31',
    personalApplication: 'When you\'re exhausted physically, emotionally, or spiritually, God promises to renew your strength. Rest in Him and let Him restore you.',
    prayerStarter: 'Father, I\'m feeling drained by [specific challenge]. Please renew my strength and help me soar like an eagle...'
  },
  {
    id: 'victory',
    title: 'Promise of Victory',
    promise: 'But thanks be to God! He gives us the victory through our Lord Jesus Christ.',
    scripture: '1 Corinthians 15:57',
    personalApplication: 'Whatever battle you\'re fighting - with sin, addiction, fear, or difficult circumstances - the victory is already won through Jesus.',
    prayerStarter: 'Lord Jesus, I\'m struggling with [specific battle]. Help me walk in the victory You\'ve already won for me...'
  }
];

// Helper functions
export function getRandomPromise(): DailyPromise {
  return DAILY_PROMISES[Math.floor(Math.random() * DAILY_PROMISES.length)];
}

export function getPromiseById(id: string): DailyPromise | undefined {
  return DAILY_PROMISES.find(promise => promise.id === id);
}

export function getPromiseByTopic(topic: string): DailyPromise[] {
  return DAILY_PROMISES.filter(promise => 
    promise.title.toLowerCase().includes(topic.toLowerCase()) ||
    promise.promise.toLowerCase().includes(topic.toLowerCase())
  );
}