// src/data/chat/index.ts - Export all chat content

// Export all chat data
export { BIBLE_HEROES } from './bible-heroes';
export { DAILY_PROMISES, getRandomPromise, getPromiseById, getPromiseByTopic } from './daily-promises';
export { 
  TOP_PRAYERS, 
  ADDITIONAL_PRAYERS, 
  getAllPrayers, 
  getPrayerById, 
  getPrayersByCategory, 
  searchPrayers, 
  getRandomPrayer 
} from './prayers';

// Re-export types for convenience
export type { BibleHero, DailyPromise, Prayer } from '@/types';

// Chat conversation flows and responses
export const GABE_PERSONALITY = {
  greeting: "Yooo! 😊 How's your heart today? What's been on your mind lately?",
  
  responses: {
    anxiety: [
      "I totally get that! 😔 Anxiety is like that unwelcome guest that just shows up uninvited. But remember, God's got you covered! 💙",
      "Oof, anxiety hits different sometimes, right? 😰 But here's the thing - God's peace is literally available 24/7. No cap! ✨",
      "Anxiety can be so overwhelming! 😮‍💨 But remember what Jesus said - don't worry about tomorrow. He's already there waiting for you! 🙌"
    ],
    
    relationships: [
      "Relationships can be SO messy sometimes! 😅 But God's love shows us how to love others well, even when it's hard 💕",
      "Friend drama is the worst! 😤 But remember, we're called to love like Jesus - and that's a superpower, not weakness! 💪",
      "People can be complicated, but that's where God's wisdom comes in clutch! 🧠✨"
    ],
    
    purpose: [
      "Feeling lost about your purpose? You're definitely not alone in that! 🤗 God's got amazing plans for you, even if you can't see them yet! 🌟",
      "The purpose question is such a big one! 🤔 But here's the beautiful thing - God created you specifically for this time and place! 🎯",
      "Purpose can feel so elusive sometimes! But remember, God's plans for you are good - He's not trying to keep them secret! 😊"
    ],
    
    encouragement: [
      "You're doing better than you think! 🌟 God sees your heart and He's so proud of how you're growing! 💚",
      "Hey, just wanted to remind you that you're loved beyond measure! 💕 Like, seriously - God's love for you is off the charts! 📈",
      "You're stronger than you realize! 💪 God's strength is literally working through you right now! ⚡"
    ],
    
    faith: [
      "Faith can feel complicated sometimes, but it's really just trusting that God's got your back! 🛡️ And spoiler alert - He totally does! 😊",
      "Growing in faith is like building muscle - it takes time and practice! 💪 You're doing great! 🌱",
      "Faith isn't about having all the answers - it's about trusting the One who does! 🙌 And that takes courage! 🦁"
    ]
  },
  
  keywords: {
    anxiety: ['anxious', 'worried', 'stress', 'overwhelmed', 'panic', 'nervous'],
    relationships: ['friend', 'family', 'drama', 'conflict', 'lonely', 'relationship'],
    purpose: ['purpose', 'future', 'direction', 'lost', 'calling', 'plan'],
    faith: ['faith', 'believe', 'trust', 'doubt', 'prayer', 'God'],
    encouragement: ['sad', 'down', 'discouraged', 'defeated', 'tired', 'struggling']
  }
};

// Conversation starters
export const CONVERSATION_STARTERS = [
  "What's been weighing on your heart lately? 💙",
  "How can I pray for you today? 🙏",
  "What's one thing you're grateful for right now? ✨",
  "Is there anything you're struggling with that we can talk through? 🤗",
  "What's God been teaching you recently? 📚",
  "How's your relationship with God feeling these days? 💕"
];

// Helper functions for chat interactions
export function getResponseByKeyword(message: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Check for anxiety keywords
  if (GABE_PERSONALITY.keywords.anxiety.some(keyword => lowercaseMessage.includes(keyword))) {
    return getRandomResponse(GABE_PERSONALITY.responses.anxiety);
  }
  
  // Check for relationship keywords
  if (GABE_PERSONALITY.keywords.relationships.some(keyword => lowercaseMessage.includes(keyword))) {
    return getRandomResponse(GABE_PERSONALITY.responses.relationships);
  }
  
  // Check for purpose keywords
  if (GABE_PERSONALITY.keywords.purpose.some(keyword => lowercaseMessage.includes(keyword))) {
    return getRandomResponse(GABE_PERSONALITY.responses.purpose);
  }
  
  // Check for faith keywords
  if (GABE_PERSONALITY.keywords.faith.some(keyword => lowercaseMessage.includes(keyword))) {
    return getRandomResponse(GABE_PERSONALITY.responses.faith);
  }
  
  // Check for encouragement keywords
  if (GABE_PERSONALITY.keywords.encouragement.some(keyword => lowercaseMessage.includes(keyword))) {
    return getRandomResponse(GABE_PERSONALITY.responses.encouragement);
  }
  
  // Default responses
  return getRandomResponse([
    "That's really thoughtful! 🤔 Tell me more about what you're thinking...",
    "I hear you! 👂 How does that make you feel?",
    "Interesting perspective! 🧠 What do you think God might be saying about that?",
    "Thanks for sharing that with me! 💙 Want to talk more about it?",
    "That sounds important to you! ✨ How can I help you process that?"
  ]);
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getRandomConversationStarter(): string {
  return CONVERSATION_STARTERS[Math.floor(Math.random() * CONVERSATION_STARTERS.length)];
}

// Emoji reactions for different message types
export const EMOJI_REACTIONS = {
  prayer: ['🙏', '❤️', '✨', '🌟'],
  praise: ['🙌', '💕', '🎉', '✨'],
  struggle: ['💙', '🤗', '💪', '🛡️'],
  gratitude: ['🙏', '✨', '💚', '☀️'],
  question: ['🤔', '💭', '🧠', '💡']
};

export function getReactionEmoji(messageType: keyof typeof EMOJI_REACTIONS): string {
  const emojis = EMOJI_REACTIONS[messageType];
  return emojis[Math.floor(Math.random() * emojis.length)];
}