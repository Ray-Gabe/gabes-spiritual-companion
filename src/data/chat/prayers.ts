// src/data/chat/prayers.ts

import { Prayer } from '@/types';

export const TOP_PRAYERS: Prayer[] = [
  {
    id: 'anxiety',
    title: 'Prayer for Anxiety',
    category: 'Mental Health',
    situation: 'When you\'re feeling overwhelmed, stressed, or anxious about the future',
    prayerText: 'God, my mind is racing and my heart feels heavy with worry. I bring all my anxieties to You and ask for Your peace that surpasses understanding. Help me focus on today instead of worrying about tomorrow. Remind me that You are in control and that You care for me more than I can imagine. Replace my fear with faith, my worry with worship. Give me strength for today and hope for tomorrow. In Jesus\' name, Amen.',
    bibleVerse: 'Cast all your anxiety on him because he cares for you. - 1 Peter 5:7',
    personalNote: 'It\'s okay to feel anxious - even Jesus felt troubled. God doesn\'t shame you for your worries; He invites you to give them to Him.'
  },
  {
    id: 'relationships',
    title: 'Prayer for Relationships',
    category: 'Relationships',
    situation: 'When dealing with friend drama, family conflict, or feeling lonely',
    prayerText: 'Father, relationships are hard sometimes. Help me to love others the way You love me - with patience, kindness, and forgiveness. When I\'m hurt, help me to respond with grace instead of revenge. When I\'m lonely, remind me that You are always with me. Show me how to be a good friend and family member. Help me to see others through Your eyes and love them with Your heart. Give me wisdom in my words and actions. In Jesus\' name, Amen.',
    bibleVerse: 'Above all, love each other deeply, because love covers over a multitude of sins. - 1 Peter 4:8',
    personalNote: 'God designed us for relationship - both with Him and others. It\'s normal to struggle sometimes; what matters is how we choose to love.'
  },
  {
    id: 'purpose',
    title: 'Prayer for Purpose',
    category: 'Identity',
    situation: 'When you\'re confused about your future, feeling lost, or questioning your worth',
    prayerText: 'Lord, sometimes I feel lost and unsure about who I am or what I\'m supposed to do with my life. Help me remember that You created me on purpose, for a purpose. Show me the gifts and talents You\'ve given me, and help me use them to serve You and others. When I compare myself to others, remind me that You have a unique plan for my life. Guide my steps and give me wisdom for the decisions ahead. Help me trust Your timing and Your plan. In Jesus\' name, Amen.',
    bibleVerse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future. - Jeremiah 29:11',
    personalNote: 'You don\'t have to have it all figured out right now. God reveals His plan step by step as you walk with Him.'
  },
  {
    id: 'strength',
    title: 'Prayer for Strength',
    category: 'Personal Growth',
    situation: 'When you\'re facing a difficult challenge or feel like giving up',
    prayerText: 'God, I feel weak and overwhelmed by what I\'m facing. I don\'t think I have the strength to get through this on my own. Please be my strength when I feel weak, my hope when I feel discouraged, and my courage when I feel afraid. Help me take one step at a time and trust You with the outcome. Remind me that Your power is made perfect in my weakness. Give me endurance to keep going and faith to believe that You\'re working all things together for good. In Jesus\' name, Amen.',
    bibleVerse: 'I can do all things through Christ who strengthens me. - Philippians 4:13',
    personalNote: 'Strength doesn\'t mean never struggling - it means continuing to trust God even when things are hard.'
  },
  {
    id: 'forgiveness',
    title: 'Prayer for Forgiveness',
    category: 'Healing',
    situation: 'When you\'ve messed up and need God\'s forgiveness, or when you need to forgive someone else',
    prayerText: 'Father, I come to You with a heavy heart. I know I\'ve messed up and fallen short of who You\'ve called me to be. Thank You that Your love doesn\'t depend on my performance. Please forgive me and help me learn from my mistakes. If I\'m struggling to forgive someone else, please help me release that hurt and choose forgiveness like You have forgiven me. Create in me a clean heart and renew a right spirit within me. Help me walk in freedom from guilt and shame. In Jesus\' name, Amen.',
    bibleVerse: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness. - 1 John 1:9',
    personalNote: 'God\'s forgiveness is complete and immediate. He doesn\'t hold grudges or keep score - His mercy is new every morning.'
  }
];

// Additional prayers for specific situations
export const ADDITIONAL_PRAYERS: Prayer[] = [
  {
    id: 'school',
    title: 'Prayer for School/Work',
    category: 'Daily Life',
    situation: 'When facing tests, difficult projects, or stressful deadlines',
    prayerText: 'Lord, I feel stressed about [specific challenge]. Help me to do my best and trust You with the results. Give me wisdom to study well, focus during tests, and manage my time wisely. When I feel overwhelmed, remind me that my worth isn\'t determined by my grades or performance. Help me be a light to others and honor You in everything I do. In Jesus\' name, Amen.',
    bibleVerse: 'Whatever you do, work at it with all your heart, as working for the Lord. - Colossians 3:23',
    personalNote: 'God cares about every part of your life, including school and work. He wants to be involved in your daily challenges.'
  },
  {
    id: 'decisions',
    title: 'Prayer for Difficult Decisions',
    category: 'Guidance',
    situation: 'When facing important choices or unclear direction',
    prayerText: 'God, I need Your wisdom for this decision. I don\'t want to rely on my own understanding but trust in Your guidance. Show me clearly which path to take. Help me seek godly counsel and listen for Your voice. Give me peace about the right choice and courage to follow through. I trust that You will direct my steps as I commit my way to You. In Jesus\' name, Amen.',
    bibleVerse: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight. - Proverbs 3:5-6',
    personalNote: 'God promises to guide you when you seek Him. Sometimes His guidance comes through peace, circumstances, wise counsel, or His Word.'
  },
  {
    id: 'fear',
    title: 'Prayer for Fear and Worry',
    category: 'Emotional Healing',
    situation: 'When facing fears about the future, health, safety, or unknown outcomes',
    prayerText: 'Father, You know the fears that keep me awake at night and the worries that fill my mind. I choose to trust You instead of giving in to fear. Remind me that You are in control and that nothing surprises You. Help me to live one day at a time and trust You with tomorrow. Fill me with Your perfect love that casts out fear. Replace my anxiety with Your peace and my worry with worship. In Jesus\' name, Amen.',
    bibleVerse: 'There is no fear in love. But perfect love drives out fear. - 1 John 4:18',
    personalNote: 'Fear is often about things that might happen. God wants us to focus on His love and faithfulness that never change.'
  }
];

// Helper functions
export function getAllPrayers(): Prayer[] {
  return [...TOP_PRAYERS, ...ADDITIONAL_PRAYERS];
}

export function getPrayerById(id: string): Prayer | undefined {
  return getAllPrayers().find(prayer => prayer.id === id);
}

export function getPrayersByCategory(category: string): Prayer[] {
  return getAllPrayers().filter(prayer => prayer.category === category);
}

export function searchPrayers(searchTerm: string): Prayer[] {
  const term = searchTerm.toLowerCase();
  return getAllPrayers().filter(prayer => 
    prayer.title.toLowerCase().includes(term) ||
    prayer.situation.toLowerCase().includes(term) ||
    prayer.category.toLowerCase().includes(term)
  );
}

export function getRandomPrayer(): Prayer {
  const allPrayers = getAllPrayers();
  return allPrayers[Math.floor(Math.random() * allPrayers.length)];
}