

/* eslint-disable */
// @ts-nocheck

// ... rest of your imports and code



'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AI from '@/lib/ai-service';
import { getProfile, verifyPasscode, clearProfile } from '@/lib/client-auth';

// ================================
// Helpers (SSR-safe)
// ================================
function clampSentences(text: string, max = 3) {
  const parts = (text || '').split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, max).join(' ').trim();
}

function ensureOpenCue(text: string) {
  if (!text) return text;
  const hasCue = /(Would you|Want|If you'd like|Can I)\b|[?]$/.test(text);
  return hasCue ? text : text + " If you'd like, I can share a short prayer or another verse.";
}

function todayKey(prefix: string, extra = '') {
  const d = new Date();
  const k = d.toISOString().slice(0, 10);
  return `${prefix}:${k}${extra ? ':' + extra : ''}`;
}

function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(key); } catch { return null; }
}
function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, value); } catch {}
}

function getCurrentSentiment(messages: any[]): string {
  const lastUser = [...messages].reverse().find((m) => m.sender === 'user');
  const guess = lastUser ? AI.detectEmotion(String(lastUser.text)) : null;
  return (guess || 'neutral').toLowerCase();
}

// ================================
// Types
// ================================
type Feature = 'promise' | 'heroes' | 'prayers';

// ================================
// Component
// ================================
export default function ChatPage() {
  const router = useRouter();

  // Core state
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [needsPass, setNeedsPass] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [ageGroup, setAgeGroup] = useState('Auto');
  const [userName, setUserName] = useState<string>('friend');

  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiContent, setAiContent] = useState<any>({});
  const [shortPrayer, setShortPrayer] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load profile and decide if we need passcode
  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }

    setUserName(p.name || 'friend');
    setAgeGroup(p.ageGroup || 'Auto');

    try { localStorage.setItem('gabeAgeGroup', p.ageGroup); } catch {}

    if (!p.remember) {
      setNeedsPass(true);
      setVerified(false);
    } else {
      setVerified(true);
      // If remembered, hydrate chat immediately
      try {
        const raw = localStorage.getItem('gabeChat');
        if (raw) setMessages(JSON.parse(raw));
        else {
          setMessages([{
            id: 'greet-1',
            text: `Hey ${p.name || 'friend'} 🌿 I'm here. What's on your heart today?`,
            sender: 'gabe',
            timestamp: new Date(),
          }]);
        }
      } catch {
        setMessages([{
          id: 'greet-1',
          text: `Hey ${p.name || 'friend'} 🌿 I'm here. What's on your heart today?`,
          sender: 'gabe',
          timestamp: new Date(),
        }]);
      }
    }

    setMounted(true);
  }, [router]);

  // Save chat history (only when verified)
  useEffect(() => {
    if (!mounted || !verified) return;
    try { localStorage.setItem('gabeChat', JSON.stringify(messages)); } catch {}
  }, [messages, mounted, verified]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!mounted || !verified) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mounted, verified]);

  // Prefetch neutral feature content after verification
  useEffect(() => {
    if (!mounted || !verified) return;
    (async () => {
      const sentiment: string = 'neutral';
      const features: Feature[] = ['promise', 'heroes', 'prayers'];
      for (const f of features) {
        try {
          const content = await fetchDailyAISection(f, sentiment);
          if (content) setAiContent((prev: any) => ({ ...prev, [f]: content }));
        } catch (error) {
          console.error(`Error prefetching ${f}:`, error);
        }
      }
    })();
  }, [mounted, verified, ageGroup]);

  // Verify passcode handler
  async function verifyNow() {
    setAuthError(null);
    const ok = verifyPasscode(passInput.trim());
    if (!ok) {
      setAuthError('Passcode is incorrect. Please try again.');
      return;
    }
    setVerified(true);
    setNeedsPass(false);

    // Now load chat history + greet
    const p = getProfile();
    if (p) {
      try {
        const raw = localStorage.getItem('gabeChat');
        if (raw) setMessages(JSON.parse(raw));
        else {
          setMessages([{
            id: 'greet-1',
            text: `Hey ${p.name || 'friend'} 🌿 I'm here. What's on your heart today?`,
            sender: 'gabe',
            timestamp: new Date(),
          }]);
        }
      } catch {
        setMessages([{
          id: 'greet-1',
          text: `Hey ${p.name || 'friend'} 🌿 I'm here. What's on your heart today?`,
          sender: 'gabe',
          timestamp: new Date(),
        }]);
      }
    }
  }

  // Feature content fetcher
  async function fetchDailyAISection(feature: Feature, sentiment: string) {
    const key = todayKey(feature, `${ageGroup}:${sentiment}`);
    let cached = getStorageItem(key);

    if (!cached) {
      try {
        let raw: any;
        if (feature === 'promise') raw = await AI.generateDailyPromise(ageGroup, sentiment);
        else if (feature === 'heroes') raw = await AI.generateWeeklyHero(ageGroup, sentiment);
        else raw = await AI.generateWeeklyPrayer(ageGroup, sentiment);

        cached = JSON.stringify(raw);
        setStorageItem(key, cached);
      } catch (error) {
        console.error(`❌ AI section error for ${feature}:`, error);
        return getFallbackContent(feature);
      }
    }

    let data: any = null;
    try { data = JSON.parse(cached!); } catch {
      console.warn(`⚠️ Failed to parse cached data for ${feature}`);
      return getFallbackContent(feature);
    }
    if (!data) return getFallbackContent(feature);

    if (feature === 'heroes') {
      return {
        name: data?.name || data?.title?.split(':')?.[0] || "Today's Hero",
        subtitle: data?.subtitle || 'Biblical Hero',
        motivation: data?.motivation || data?.content || 'God has great plans for you!',
        keyVerse: data?.keyVerse?.ref || data?.keyVerse || 'Philippians 4:13',
        verseText: data?.keyVerse?.text || data?.verseText || 'I can do all things through Christ who strengthens me.',
        application: data?.application || "Trust in God's strength for today's challenges.",
      };
    }

    if (feature === 'promise') {
      return {
        title: data?.title || "Today's Promise",
        verse: {
          ref: data?.verse?.ref || 'Jeremiah 29:11',
          text: data?.verse?.text || 'For I know the plans I have for you, declares the Lord…',
        },
        application: data?.application || 'God has good plans for your life.',
      };
    }

    return {
      title: data?.title || "Today's Prayer",
      preview: data?.preview || 'A prayer for your heart',
      prayer: data?.prayer || 'Lord, guide me today and fill me with Your peace. Amen.',
    };
  }

  // Fallbacks
  function getFallbackContent(feature: Feature) {
    if (feature === 'heroes') {
      return {
        name: 'David',
        subtitle: 'Biblical Hero',
        motivation:
          'When everyone doubts you, God sees your potential. David was just a young shepherd when he faced Goliath, but he trusted God over fear!',
        keyVerse: '1 Samuel 17:47',
        verseText: "The battle is the Lord's!",
        application: "That challenge you're facing? God's got bigger plans than your problems!",
      };
    }
    if (feature === 'promise') {
      return {
        title: "God's Plan for You",
        verse: {
          ref: 'Jeremiah 29:11',
          text:
            'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.',
        },
        application: "God has good plans for your life, even when you can't see them yet.",
      };
    }
    return {
      title: 'Prayer for Today',
      preview: 'A prayer for your heart',
      prayer:
        'Lord, thank You for this day and for Your presence with me. Guide my steps, calm my worries, and help me trust in Your perfect plan. Fill me with Your peace and strength. Amen.',
    };
  }

  // Chat send
  async function sendMessage() {
    if (!verified || !inputMessage.trim() || isLoadingAI || !mounted) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = inputMessage.trim();
    setInputMessage('');
    setIsLoadingAI(true);

    try {
      const sentiment = AI.detectEmotion(currentInput) || 'neutral';
      const conversationHistory = messages
        .slice(-6)
        .map((msg) => `${msg.sender === 'user' ? 'User' : 'GABE'}: ${msg.text}`);

      const aiText = await AI.generateChatResponse(
        currentInput,
        ageGroup,
        conversationHistory,
        sentiment,
        undefined,
        userName
      );

      const reply = ensureOpenCue(clampSentences(aiText, 4));
      const gabeMessage = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: 'gabe',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, gabeMessage]);

      // Prefetch Promise/Hero/Prayer for this emotion
      const features: Feature[] = ['promise', 'heroes', 'prayers'];
      for (const f of features) {
        try {
          const content = await fetchDailyAISection(f, sentiment);
          if (content) setAiContent((prev: any) => ({ ...prev, [f]: content }));
        } catch (error) {
          console.error(`Error prefetching ${f}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now. Let me try again in a moment.",
          sender: 'gabe',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoadingAI(false);
    }
  }

  // Feature button
  async function handleFeatureClick(feature: Feature) {
    if (!mounted || !verified) return;
    setActiveFeature(feature);
    setIsLoadingAI(true);
    try {
      const sentiment = getCurrentSentiment(messages);
      const content = await fetchDailyAISection(feature, sentiment);
      if (content) setAiContent((prev: any) => ({ ...prev, [feature]: content }));
    } catch (error) {
      console.error(`Error in handleFeatureClick for ${feature}:`, error);
    } finally {
      setIsLoadingAI(false);
    }
  }

  // Enhanced Modal renderer
  function renderFeatureModal() {
    if (!activeFeature) return null;
    const content = aiContent[activeFeature];

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(135,206,235,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #87CEEB',
            boxShadow: '0 40px 120px rgba(0,0,0,.4), 0 16px 64px rgba(135,206,235,.5)',
          }}
        >
          {/* Enhanced Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '32px 32px 24px 32px',
              borderBottom: '1px solid #f1f5f9',
              background: 'linear-gradient(135deg, #fafbff 0%, #f8fafc 100%)',
              borderRadius: '32px 32px 0 0',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#0b1b4f',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              {activeFeature === 'heroes' && (
                <>
                  <span style={{
                    background: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>📖</span>
                  Today's Hero
                </>
              )}
              {activeFeature === 'promise' && (
                <>
                  <span style={{
                    background: 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>✨</span>
                  Today's Promise
                </>
              )}
              {activeFeature === 'prayers' && (
                <>
                  <span style={{
                    background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>🙏</span>
                  Today's Prayer
                </>
              )}
            </h2>
            <button
              onClick={() => setActiveFeature(null)}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#64748b',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              ✕
            </button>
          </div>

          {/* Enhanced Content */}
          <div style={{ padding: '32px' }}>
            {isLoadingAI && !content && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div 
                  style={{ 
                    fontSize: '32px', 
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🤔
                </div>
                <p style={{ 
                  color: '#64748b', 
                  margin: 0, 
                  fontSize: '16px',
                  fontWeight: 500 
                }}>
                  {activeFeature === 'promise' && 'Crafting your personalized promise...'}
                  {activeFeature === 'heroes' && 'Finding an inspiring biblical hero...'}
                  {activeFeature === 'prayers' && 'Preparing a heartfelt prayer...'}
                </p>
              </div>
            )}

            {/* ENHANCED HERO */}
            {activeFeature === 'heroes' && content && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 50%, #fdba74 100%)',
                      border: '4px solid #fed7aa',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: '#9a3412',
                      fontSize: '36px',
                      boxShadow: '0 8px 25px rgba(251,191,36,0.3)',
                    }}
                  >
                    👤
                  </div>
                  <h2
                    style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      color: '#0b1b4f',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {content.name}
                  </h2>
                  <p style={{ 
                    color: '#d97706', 
                    fontWeight: 600, 
                    margin: 0,
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {content.subtitle}
                  </p>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #fefbf3 0%, #fef7ed 100%)',
                    border: '2px solid #fed7aa',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(251,191,36,0.1)',
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      color: '#9a3412',
                      marginBottom: '16px',
                      fontSize: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    🔥 Motivation for You
                  </h3>
                  <p style={{ 
                    color: '#78716c', 
                    lineHeight: 1.7, 
                    margin: 0, 
                    fontSize: '16px',
                    fontWeight: 400 
                  }}>
                    {content.motivation}
                  </p>
                </div>



                {content.application && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '24px',
                      boxShadow: '0 4px 15px rgba(148,163,184,0.1)',
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 700,
                        color: '#475569',
                        marginBottom: '16px',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      ✨ For Your Life
                    </h3>
                    <p style={{ 
                      color: '#64748b', 
                      lineHeight: 1.7, 
                      margin: 0, 
                      fontSize: '16px',
                      fontWeight: 400 
                    }}>
                      {content.application}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ENHANCED PROMISE */}
            {activeFeature === 'promise' && content && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 50%, #7dd3fc 100%)',
                      border: '4px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '28px',
                      boxShadow: '0 8px 25px rgba(56,189,248,0.3)',
                    }}
                  >
                    ✨
                  </div>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: '#0b1b4f', 
                    marginBottom: '8px' 
                  }}>
                    {content.title}
                  </h3>
                  <p style={{ 
                    color: '#64748b', 
                    fontSize: '16px', 
                    margin: 0,
                    fontWeight: 500 
                  }}>
                    Personalized to your heart
                  </p>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    border: '2px solid #bae6fd',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 15px rgba(56,189,248,0.1)',
                  }}
                >
                  <h4 style={{ 
                    fontWeight: 700, 
                    color: '#0c4a6e', 
                    marginBottom: '16px',
                    fontSize: '18px'
                  }}>
                    {content.title}
                  </h4>
                  <div style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '16px',
                    padding: '20px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #bae6fd',
                  }}>
                    <p style={{ 
                      color: '#0369a1', 
                      marginBottom: '12px',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontStyle: 'italic',
                      lineHeight: 1.6
                    }}>
                      "{content.verse?.text}"
                    </p>
                    <p style={{ 
                      color: '#0891b2', 
                      fontSize: '14px', 
                      margin: 0,
                      fontWeight: 600,
                      textAlign: 'right'
                    }}>
                      — {content.verse?.ref}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    border: '2px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: '0 4px 15px rgba(148,163,184,0.1)',
                  }}
                >
                  <h4 style={{ 
                    fontWeight: 700, 
                    color: '#475569', 
                    marginBottom: '16px',
                    fontSize: '18px'
                  }}>
                    How this speaks to you
                  </h4>
                  <p style={{ 
                    color: '#64748b', 
                    lineHeight: 1.7, 
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 400
                  }}>
                    {content.application}
                  </p>
                </div>
              </div>
            )}

            {/* ENHANCED PRAYER */}
            {activeFeature === 'prayers' && content && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #d8b4fe 100%)',
                      border: '4px solid #e9d5ff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '28px',
                      boxShadow: '0 8px 25px rgba(168,85,247,0.3)',
                    }}
                  >
                    🙏
                  </div>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: 700, 
                    color: '#0b1b4f', 
                    margin: 0 
                  }}>
                    {content.title}
                  </h3>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                    border: '2px solid #e9d5ff',
                    borderRadius: '20px',
                    padding: '24px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 15px rgba(168,85,247,0.1)',
                  }}
                >
                  <p style={{ 
                    color: '#374151', 
                    lineHeight: 1.7, 
                    fontSize: '16px', 
                    margin: 0,
                    fontWeight: 400
                  }}>
                    {shortPrayer ? clampSentences(content.prayer, 3) : content.prayer}
                  </p>
                </div>

                <div style={{ marginBottom: '24px', textAlign: 'right' }}>
                  <button
                    onClick={() => setShortPrayer((s) => !s)}
                    style={{
                      border: '2px solid #e9d5ff',
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      color: '#7c3aed',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {shortPrayer ? 'Read Full Prayer' : 'Shorten Prayer'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={() => {
                      alert('🙏 Beautiful! God heard your heart.');
                      setActiveFeature(null);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '14px 24px',
                      borderRadius: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '16px',
                      boxShadow: '0 6px 20px rgba(124,58,237,0.3)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    🙏 Pray This
                  </button>
                  <button
                    onClick={() => alert('💾 Prayer saved to your heart!')}
                    style={{
                      padding: '14px 24px',
                      border: '2px solid #e9d5ff',
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      color: '#7c3aed',
                      borderRadius: '16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '16px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            )}

            {activeFeature && !isLoadingAI && !content && (
              <div style={{ 
                textAlign: 'center', 
                color: '#94a3b8',
                padding: '40px 20px',
                fontSize: '16px'
              }}>
                Preparing your spiritual content...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Loading (pre-profile)
  if (!mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg,#87CEEB,#B0E0E6,#E6F3FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#6b7280' }}>Loading...</div>
      </div>
    );
  }

  // Passcode gate
  if (needsPass && !verified) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg,#87CEEB,#B0E0E6,#E6F3FF)',
          padding: 24,
          fontFamily:
            "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',Segoe UI,Roboto,system-ui,sans-serif",
        }}
      >
        <div
          style={{
            width: 'min(420px, 94vw)',
            background: '#fff',
            borderRadius: 24,
            border: '1px solid #87CEEB',
            boxShadow: '0 24px 64px rgba(135,206,235,.4)',
            padding: 24,
          }}
        >
          <h2 style={{ margin: '0 0 8px 0', color: '#0b1b4f' }}>Welcome back, {userName}!</h2>
          <p style={{ marginTop: 0, color: '#6b7280' }}>Enter your passcode to unlock this session.</p>

          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Passcode"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid #d1d5db',
              margin: '12px 0 8px 0',
              fontSize: 15,
              background: '#f9fafb',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') verifyNow();
            }}
          />

          {authError && <div style={{ color: '#b91c1c', fontSize: 13, marginBottom: 8 }}>{authError}</div>}

          <button
            onClick={verifyNow}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg,#243b90,#2849c7)',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '12px 16px',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(36,59,144,.3)',
            }}
          >
            Unlock
          </button>

          <button
            onClick={() => {
              clearProfile();
              localStorage.removeItem('gabeChat');
              window.location.href = '/';
            }}
            style={{
              width: '100%',
              background: 'none',
              color: '#6b7280',
              border: 'none',
              marginTop: 10,
              padding: 8,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Not you? Sign in again
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // Render
  // ================================
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#87CEEB,#B0E0E6,#E6F3FF)',
        fontFamily:
          "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',Segoe UI,Roboto,system-ui,sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: '#fff',
          borderBottom: '1px solid #87CEEB',
          boxShadow: '0 4px 16px rgba(135,206,235,.2)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Back arrow now goes to /games */}
            <button
              onClick={() => router.push('/games')}
              aria-label="Games"
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ←
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle at 35% 30%, #eef4ff 0%, #dceaff 45%, #cfe0ff 100%)',
                  boxShadow: 'inset 0 0 0 4px #f5f8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0b1b4f',
                  fontWeight: 900,
                  fontSize: '16px',
                }}
              >
                G
              </div>
              <span
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  lineHeight: 1,
                }}
              >
                where every prayer begins with a conversation
              </span>
            </div>
          </div>

          {/* Grouped navigation with tighter spacing */}
          <nav style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleFeatureClick('promise')}
                disabled={isLoadingAI}
                style={{
                  background: 'linear-gradient(90deg,#243b90,#2849c7)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isLoadingAI ? 'not-allowed' : 'pointer',
                  opacity: isLoadingAI ? 0.6 : 1,
                }}
              >
                ⭐ Promise
              </button>
              <button
                onClick={() => handleFeatureClick('heroes')}
                disabled={isLoadingAI}
                style={{
                  background: 'linear-gradient(90deg,#2b74c8,#58a1e6)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isLoadingAI ? 'not-allowed' : 'pointer',
                  opacity: isLoadingAI ? 0.6 : 1,
                }}
              >
                ⚖️ Hero
              </button>
              <button
                onClick={() => handleFeatureClick('prayers')}
                disabled={isLoadingAI}
                style={{
                  background: 'linear-gradient(90deg,#243b90,#2849c7)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isLoadingAI ? 'not-allowed' : 'pointer',
                  opacity: isLoadingAI ? 0.6 : 1,
                }}
              >
                💜 Prayer
              </button>
            </div>
            {/* Sign out with subtle styling */}
            <button
              onClick={() => {
                clearProfile?.();
                try { localStorage.removeItem('gabeChat'); } catch {}
                window.location.href = '/';
              }}
              style={{
                marginLeft: 'auto',
                border: '1px solid #e5e7eb',
                background: 'white',
                color: '#8a93a3',
                borderRadius: '999px',
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      {/* Chat Area */}
      <main
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '24px',
          paddingBottom: '120px',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '32px',
            border: '1px solid #87CEEB',
            boxShadow: '0 40px 120px rgba(0,0,0,.4), 0 16px 64px rgba(135,206,235,.5)',
            padding: '32px',
            minHeight: '500px',
          }}
        >
          {/* Better chat flow with speaker changes and softer timestamps */}
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const topGap = !prev || prev.sender !== m.sender ? 20 : 8;
            return (
              <div key={m.id} style={{ marginBottom: '16px', marginTop: topGap }}>
                <div
                  style={{
                    display: 'inline-block',
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    ...(m.sender === 'user'
                      ? {
                          background: 'linear-gradient(90deg,#243b90,#2849c7)',
                          boxShadow: '0 6px 18px rgba(36,59,144,.25)',
                          color: 'white',
                          float: 'right' as const,
                          clear: 'both' as const,
                        }
                      : {
                          background: '#f8fafc',
                          color: '#374151',
                          border: '1px solid #d7e6ff',
                          float: 'left' as const,
                          clear: 'both' as const,
                        }),
                  }}
                >
                  <div style={{ fontSize: '15px', lineHeight: 1.5 }}>{m.text}</div>
                </div>
                <div
                  style={{
                    clear: 'both',
                    fontSize: '11px',
                    color: '#cbd5e1',
                    textAlign: m.sender === 'user' ? 'right' : 'left',
                    marginTop: '4px',
                    paddingLeft: m.sender === 'user' ? 0 : '8px',
                    paddingRight: m.sender === 'user' ? '8px' : 0,
                  }}
                >
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })}

          {isLoadingAI && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'inline-block',
                  maxWidth: '200px',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: '#f8fafc',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  float: 'left',
                  clear: 'both',
                }}
              >
                <div style={{ fontSize: '15px', lineHeight: 1.5 }}>GABE is thinking… 🤔</div>
              </div>
              <div style={{ clear: 'both' }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          background: '#fff',
          borderTop: '1px solid #87CEEB',
          boxShadow: '0 -4px 16px rgba(135,206,235,.2)',
        }}
      >
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '16px 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#f8fafc',
              borderRadius: '999px',
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
            }}
          >
            <button
              aria-label="mic"
              style={{
                padding: '8px',
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              🎤
            </button>

            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={`Type anything that's on your heart, ${userName}...`}
              disabled={isLoadingAI}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#374151',
                opacity: isLoadingAI ? 0.6 : 1,
              }}
            />

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoadingAI}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: inputMessage.trim() && !isLoadingAI
                  ? 'linear-gradient(90deg,#243b90,#2849c7)'
                  : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: inputMessage.trim() && !isLoadingAI ? 'pointer' : 'not-allowed',
                transition: 'all .2s ease',
              }}
            >
              ➤ Send
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Feature Modal */}
      {renderFeatureModal()}
    </div>
  );
}