// /lib/ai-service.ts

// ================================
// Types
// ================================
interface PersonalityProfile {
  tone: string;
  vocabulary: string;
  examples: string;
  biblical_approach: string;
  prayer_style: string;
}
interface AgeGroupProfiles {
  [key: string]: PersonalityProfile;
}

type LearningMode =
  | 'gentle'
  | 'socratic'
  | 'reflective'
  | 'practical'
  | 'critical'
  | 'gratitude'
  | 'hope'
  | 'story';

type ConversationMode = 'spiritual' | 'casual';

// ================================
// Age Group Personality Profiles
// ================================
const PERSONALITY_PROFILES: AgeGroupProfiles = {
  'Kid/Teen': {
    tone: 'friendly, encouraging, relatable',
    vocabulary: 'simple, modern, emoji-friendly',
    examples: 'school life, friends, heroes, faith questions',
    biblical_approach: 'fun parables, relatable stories, clear lessons',
    prayer_style: 'simple, heartfelt, about daily struggles and dreams',
  },
  Student: {
    tone: 'understanding, supportive, wise but not preachy',
    vocabulary: 'conversational, thoughtful, inclusive',
    examples: 'study stress, future choices, friendships, doubts',
    biblical_approach: 'wisdom in decisions, courage in challenges',
    prayer_style: 'focused on guidance, wisdom, and peace in studies and life',
  },
  'Young Adult': {
    tone: 'authentic, real, empathetic',
    vocabulary: 'genuine, contemporary, emotionally intelligent',
    examples: 'career, relationships, faith journey, transitions',
    biblical_approach: 'practical wisdom, spiritual growth, real-life application',
    prayer_style: 'deep and personal, touching life and maturity',
  },
  Adult: {
    tone: 'thoughtful, compassionate, steady',
    vocabulary: 'mature, nuanced, grounded',
    examples: 'family, work, responsibility, faith challenges',
    biblical_approach: 'life application, spiritual leadership, encouragement',
    prayer_style: 'covering family, work, spiritual growth, and service',
  },
  Senior: {
    tone: 'warm, honoring, respectful',
    vocabulary: 'reflective, wise, acknowledging life experience',
    examples: 'legacy, health, purpose, family blessings',
    biblical_approach: 'wisdom literature, eternal hope, legacy building',
    prayer_style: 'grateful, reflective, focused on peace and purpose',
  },
  Auto: {
    tone: 'adaptive, warm, natural',
    vocabulary: 'clear, human, emotionally intelligent',
    examples: 'everyday struggles and faith encouragement',
    biblical_approach: 'timeless truths, natural parables, relatable wisdom',
    prayer_style: 'balanced, natural, covering daily needs and hope',
  },
};

// ================================
// Emotion → tone hints & scheduler
// ================================
const EMOTION_HINTS: Record<
  string,
  { tone: string; nudge: string; verseHint: string; defaultMode: LearningMode }
> = {
  sad: { tone: 'warm, reassuring', nudge: 'comfort → hope', verseHint: 'comfort, presence', defaultMode: 'gentle' },
  anxious: { tone: 'calming, steady', nudge: 'peace → trust', verseHint: 'peace, care', defaultMode: 'practical' },
  angry: { tone: 'calm, respectful', nudge: 'pause → perspective', verseHint: 'patience', defaultMode: 'reflective' },
  lonely: { tone: 'close, present', nudge: 'presence → connection', verseHint: 'God near', defaultMode: 'gentle' },
  happy: { tone: 'joyful, grounded', nudge: 'gratitude', verseHint: 'praise', defaultMode: 'gratitude' },
  confused: { tone: 'clear, guiding', nudge: 'wisdom', verseHint: 'guidance', defaultMode: 'socratic' },
  neutral: { tone: 'balanced, kind', nudge: 'gentle guidance', verseHint: 'hope', defaultMode: 'gentle' },
};

function pickLearningMode(emotion: string, turnsSoFar: number): LearningMode {
  if (turnsSoFar < 2) return 'gentle';
  if (Math.random() < 0.65) return 'gentle';
  const pools: Record<string, LearningMode[]> = {
    sad: ['hope', 'reflective', 'story'],
    anxious: ['practical', 'hope', 'reflective'],
    angry: ['reflective', 'critical', 'story'],
    lonely: ['hope', 'story', 'reflective'],
    happy: ['gratitude', 'hope', 'story'],
    confused: ['socratic', 'practical', 'reflective'],
    neutral: ['gentle', 'reflective', 'story'],
  };
  const pool = pools[emotion] || pools.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ================================
/** Utilities */
// ================================
function stripCodeFences(s: string): string {
  const m = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return m ? m[1].trim() : s.trim().replace(/^\s*json\s*/i, '');
}
function safeExtractTextFromGemini(data: any): string {
  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return String(data.candidates[0].content.parts[0].text);
  }
  const parts = data?.candidates?.[0]?.content?.parts;
  if (Array.isArray(parts)) {
    const t = parts.map((p: any) => p?.text).filter(Boolean).join('\n').trim();
    if (t) return t;
  }
  if (data?.text) return String(data.text);
  return '';
}
function tryParseJSON<T = any>(raw: string): T | null {
  try {
    const stripped = stripCodeFences(raw);
    return JSON.parse(stripped) as T;
  } catch {
    return null;
  }
}

// ================================
// Low-level API helpers
// Gemini + OpenAI fallback
// ================================
async function callGeminiAPI(prompt: string, retries: number = 2): Promise<string> {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  if (!GEMINI_API_KEY) throw new Error('Gemini API key not found (NEXT_PUBLIC_GEMINI_API_KEY)');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          temperature: 0.7, 
          topK: 40, 
          topP: 0.8, 
          maxOutputTokens: 256  // Reduced from 1024 for faster responses
        },
      }),
    });

    if (!response.ok) {
      let body = '';
      try { body = JSON.stringify(await response.json()); } catch {}
      throw new Error(`Gemini API error: ${response.status} ${body}`);
    }

    const data = await response.json();
    const text = safeExtractTextFromGemini(data);
    if (!text) throw new Error('Gemini returned empty response');
    return text;
  } catch (error: any) {
    if (retries > 0 && /429/.test(String(error))) {
      await new Promise(r => setTimeout(r, 900));
      return callGeminiAPI(prompt, retries - 1);
    }
    throw error;
  }
}

async function callOpenAIAPI(prompt: string): Promise<string> {
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key not found (NEXT_PUBLIC_OPENAI_API_KEY)');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: "You are GABE, a warm companion. Be natural, caring, and human.",
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 256,  // Reduced from 1024 for faster responses
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    let body = '';
    try { body = JSON.stringify(await response.json()); } catch {}
    throw new Error(`OpenAI API error: ${response.status} ${body}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('OpenAI returned empty response');
  return text;
}

// Master switch: try Gemini, fall back to OpenAI
async function callAIService(prompt: string): Promise<string> {
  try {
    return await callGeminiAPI(prompt);
  } catch (err) {
    console.warn('⚠️ Gemini failed, falling back to OpenAI…', err);
    return await callOpenAIAPI(prompt);
  }
}

// ================================
// Simple NLP helpers
// ================================
export function detectEmotion(text: string): string | null {
  const emotionWords: Record<string, string[]> = {
    sad: ['sad', 'depressed', 'down', 'upset', 'crying', 'hurt', 'broken', 'lost', 'heartbroken'],
    anxious: ['anxious', 'worried', 'stressed', 'nervous', 'scared', 'afraid', 'overwhelmed', 'panic'],
    angry: ['angry', 'mad', 'frustrated', 'irritated', 'annoyed', 'furious', 'pissed'],
    happy: ['happy', 'joyful', 'excited', 'grateful', 'blessed', 'wonderful', 'amazing', 'great'],
    lonely: ['lonely', 'alone', 'isolated', 'disconnected', 'empty', 'missing'],
    confused: ['confused', 'uncertain', 'questioning', 'doubting', 'lost', 'unsure'],
  };

  const lower = (text || '').toLowerCase();
  for (const [emotion, words] of Object.entries(emotionWords)) {
    if (words.some((w) => lower.includes(w))) return emotion;
  }
  return null;
}

export function detectConversationMode(text: string, history: string[] = []): ConversationMode {
  const lower = text.toLowerCase();
  const recentHistory = history.slice(-3).join(' ').toLowerCase();
  
  // Check for explicit mode requests
  if (/\b(just talk|casual|normal chat|regular talk|no bible|no verse|no prayer|no scripture|no god)\b/.test(lower)) {
    return 'casual';
  }
  
  if (/\b(pray|bible|verse|scripture|god|jesus|faith|spiritual|blessed|amen|lord)\b/.test(lower)) {
    return 'spiritual';
  }
  
  // Check recent conversation context
  if (/\b(no bible|no verse|no prayer|casual|just talk)\b/.test(recentHistory)) {
    return 'casual';
  }
  
  // Default to spiritual since GABE is a spiritual companion
  return 'spiritual';
}

function looksLikeCrisis(text: string): boolean {
  const t = (text || '').toLowerCase();
  return /\b(kill myself|suicide|end my life|want to die|self harm|cutting)\b/.test(t);
}

function guessNameFromMessage(text: string | undefined): string | null {
  if (!text) return null;
  const m = text.match(/\b(i am|i'm)\s+([A-Z][a-z]{1,20})\b/);
  return m ? m[2] : null;
}

// ================================
// Public API — used by your UI
// ================================

// Chat: concise, human, emotion-aware, with gentle growth nudges
export async function generateChatResponse(
  userMessage: string,
  ageGroup: string = 'Auto',
  conversationHistory: string[] = [],
  detectedEmotionArg?: string,
  learningMode?: LearningMode,
  userName?: string
): Promise<string> {
  // Crisis guard
  if (looksLikeCrisis(userMessage)) {
    return [
      "I'm really glad you shared that. Your life matters deeply.",
      "If you're in immediate danger, please call emergency services.",
      "In the U.S., dial 988 for crisis support. In other places, search your local hotline.",
      "Would you like me to pray for you right now?"
    ].join(' ');
  }

  const profile = PERSONALITY_PROFILES[ageGroup] || PERSONALITY_PROFILES.Auto;
  const historyContext = conversationHistory.slice(-4).join('\n'); // Reduced from 6 to 4
  
  // Quick mode check - simplified
  const lower = userMessage.toLowerCase();
  const wantsCasual = /\b(just talk|casual|no bible|no verse|no prayer)\b/.test(lower);

  const emotion = detectEmotion(userMessage) || 'neutral';
  const hints = EMOTION_HINTS[emotion] || EMOTION_HINTS.neutral;

  const mode: LearningMode = learningMode ?? 
    pickLearningMode(emotion, conversationHistory.length) ?? 'gentle';

  const inferredName = userName || 'friend';

  // Single, optimized prompt
  const prompt = `
You are GABE, a warm ${wantsCasual ? 'friend' : 'spiritual companion'}.

MODE: ${wantsCasual ? 'CASUAL - No spiritual content, just be a friend' : 'SPIRITUAL - Share faith naturally'}
Tone: ${hints.tone}
Age: ${ageGroup}

User: "${userMessage}"

${wantsCasual ? 
  'Be a regular friend. Talk about life, feelings, everyday things. NO Bible/prayer/God talk.' : 
  'Share faith warmly when it fits. Bible verses OK (with reference). Vary endings.'}

2-4 sentences. Natural, human, caring.`.trim();

  return await callAIService(prompt);
}

// Strict-JSON: Promise (object out)
export async function generateDailyPromise(
  ageGroup: string = 'Auto',
  sentiment: string = 'neutral'
): Promise<{ title: string; verse: { ref: string; text: string }; application: string }> {
  const p = PERSONALITY_PROFILES[ageGroup] || PERSONALITY_PROFILES.Auto;

  const prompt = `
Return ONLY valid JSON for a Daily Promise that feels human and conversational.

Format: {"title":"string","verse":{"ref":"string","text":"string"},"application":"string"}

Make it feel like a friend sharing wisdom:
- Title: Warm, inviting (e.g., "When the Waves Keep Coming" not "God's Peace")
- Verse text: Full verse, naturally quoted
- Application: 2-3 sentences, conversational like "Sometimes life feels like... But Jesus promised... It's like..."
- Use metaphors and everyday language
- End with gentle invitation or reflection question

Context:
AgeGroup: ${ageGroup}
Sentiment: ${sentiment} (sad→comfort metaphors, anxious→peace imagery, angry→cooling wisdom)
Tone: ${p.tone}

Example style: "Sometimes life feels like waves crashing. But Jesus once promised, 'Peace I leave with you...' (John 14:27). It's like being held steady in the storm."

Output: Valid JSON only, no code fences.
`.trim();

  const raw = await callAIService(prompt);
  const parsed = tryParseJSON(raw);
  if (parsed) return parsed as any;

  return {
    title: "When Peace Feels Far Away",
    verse: { 
      ref: 'John 14:27', 
      text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.' 
    },
    application: "Sometimes life feels like waves crashing around you. But Jesus promised a different kind of peace - not the absence of storms, but His presence in them. Want to rest in that today?",
  };
}

// Strict-JSON: Hero (object out)
export async function generateWeeklyHero(
  ageGroup: string = 'Auto',
  sentiment: string = 'neutral'
): Promise<{
  name: string;
  subtitle: string;
  motivation: string;
  keyVerse: { ref: string; text: string };
  application: string;
}> {
  const p = PERSONALITY_PROFILES[ageGroup] || PERSONALITY_PROFILES.Auto;

  const prompt = `
Return ONLY valid JSON for a Bible Hero story that feels like a friend sharing wisdom.

Format: {"name":"string","subtitle":"string","motivation":"string","keyVerse":{"ref":"string","text":"string"},"application":"string"}

Make it conversational and relatable:
- Name: The hero's name
- Subtitle: Their human struggle (e.g., "The boy who faced giants" not "Giant Slayer")
- Motivation: 2-3 sentences with a parable-style story. Start with "Think of..." or "Picture..." 
- KeyVerse: Full verse text, not abbreviated
- Application: 1-2 sentences connecting to today, like "It's a reminder that..."

Context:
AgeGroup: ${ageGroup}
Sentiment: ${sentiment} (match hero to emotion - sad→Job, anxious→Peter on water, etc.)
Tone: ${p.tone}

Example style: "Think of a boy with only a sling standing before a giant—most people saw weakness, but God saw courage. That's David's story."

Output: Valid JSON only, no code fences.
`.trim();

  const raw = await callAIService(prompt);
  const parsed = tryParseJSON(raw);
  if (parsed) return parsed as any;

  const fallback = stripCodeFences(raw);
  return {
    name: "David",
    subtitle: 'The boy who faced giants',
    motivation: "Think of a young shepherd with just a sling, standing before a warrior giant. Everyone saw an impossible mismatch, but David saw God's faithfulness. Sometimes the smallest faith can topple the biggest fears.",
    keyVerse: { 
      ref: '1 Samuel 17:45', 
      text: 'David said to the Philistine, "You come against me with sword and spear and javelin, but I come against you in the name of the Lord Almighty."' 
    },
    application: "The size of your faith matters more than the size of your problem.",
  };
}

// Strict-JSON: Prayer (object out)
export async function generateWeeklyPrayer(
  ageGroup: string = 'Auto',
  sentiment: string = 'neutral'
): Promise<{ title: string; preview: string; prayer: string }> {
  const p = PERSONALITY_PROFILES[ageGroup] || PERSONALITY_PROFILES.Auto;

  const prompt = `
Return ONLY valid JSON for a conversational prayer that feels like talking with a friend.

Format: {"title":"string","preview":"string","prayer":"string"}

Make it natural and human:
- Title: Inviting, warm (e.g., "When Words Feel Heavy" not "Prayer for Peace")
- Preview: One line that draws you in (e.g., "Let's whisper this together")
- Prayer: 3-5 sentences, conversational style starting with "Lord..." or "Father..."
  Include natural pauses, everyday language, end with simple "Amen"
  Feel free to use "Help me..." "Thank You for..." "I'm feeling..."

Context:
AgeGroup: ${ageGroup}
Sentiment: ${sentiment} (sad→comfort prayer, anxious→peace prayer, happy→gratitude)
Prayer Style: ${p.prayer_style}

Example style: "Lord, in this noisy day, help me breathe in Your peace and remember I'm not alone. When my thoughts race, be my quiet center. Amen."

Output: Valid JSON only, no code fences.
`.trim();

  const raw = await callAIService(prompt);
  const parsed = tryParseJSON(raw);
  if (parsed) return parsed as any;

  const fallback = stripCodeFences(raw);
  return {
    title: "When the Day Feels Heavy",
    preview: "Let's whisper this together",
    prayer: "Lord, in this noisy day, help me breathe in Your peace and remember I'm not alone. When everything feels urgent, remind me what's eternal. Give me grace for myself and others today. Amen.",
  };
}

// Optional game generator (kept)
export async function generateGameQuestions(
  ageGroup: string = 'Auto',
  gameType: string
): Promise<{ question: string; options: string[]; correct: number; explanation: string }> {
  const p = PERSONALITY_PROFILES[ageGroup] || PERSONALITY_PROFILES.Auto;

  const prompt = `
As GABE, create a biblical trivia question for the "${gameType}" game, suitable for "${ageGroup}" demographic.

Personality Guide:
- Vocabulary: ${p.vocabulary}
- Biblical Approach: ${p.biblical_approach}

Create a question with:
1. Clear, engaging question
2. 4 multiple choice options
3. Correct answer index (0-3)
4. Educational explanation

Format as JSON:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 2,
  "explanation": "Why this is correct and what it teaches us"
}
`;

  const response = await callAIService(prompt);
  try {
    return JSON.parse(stripCodeFences(response));
  } catch {
    return {
      question: 'Which apostle walked on water with Jesus?',
      options: ['John', 'James', 'Peter', 'Andrew'],
      correct: 2,
      explanation:
        "Peter stepped out of the boat and walked on water toward Jesus, showing faith and trust in Christ's power.",
    };
  }
}

// ================================
// Default export for robust importing
// ================================
const AI = {
  generateChatResponse,
  generateDailyPromise,
  generateWeeklyHero,
  generateWeeklyPrayer,
  generateGameQuestions,
  detectEmotion,
  detectConversationMode,
};

export default AI;