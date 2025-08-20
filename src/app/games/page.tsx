/* eslint-disable */
// @ts-nocheck

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  Brain,
  Heart,
  Users,
  Shield,
  Crown,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  MessageCircle,
  Search,
  Compass,
  ScrollText,
  Crosshair,
} from 'lucide-react';
import { FaPrayingHands } from 'react-icons/fa';
import { getProfile, verifyPasscode, clearProfile } from '@/lib/client-auth';

// ---------------------------
// Types
// ---------------------------
interface Option {
  text: string;
  isCorrect: boolean;
}

interface GameTemplate {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  borderColor: string;
}

interface Game extends GameTemplate {
  question: string;
  options: Option[];
  explanation: string;
  isAIGenerated: boolean;
}

type PersistedGameState = {
  dateKey: string;
  xp: number;
  gamesPlayed: string[];
  testMode: boolean;
};

// ---------------------------
// Storage helpers
// ---------------------------
const STORAGE_KEYS = {
  GAME_STATE: 'gabeGameState',
  USER_NAME: 'gabeUserName',
  AGE_GROUP: 'gabeAgeGroup',
};

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function lsGet<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: any) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ---------------------------
// UI Components
// ---------------------------
function SafeBackButton() {
  const onClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/chat';
    }
  };
  
  return (
    <button
      aria-label="Back to GABE"
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: '#ffffff80',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      <ArrowLeft size={22} />
    </button>
  );
}

function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function AnimatedSheet({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false);
  
  React.useEffect(() => {
    const r = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(r);
  }, []);
  
  return (
    <div
      style={{
        transform: show ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
        opacity: show ? 1 : 0,
        transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease',
      }}
    >
      {children}
    </div>
  );
}

function ModalPortal({
  open,
  onClose,
  children,
  ariaLabel,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  const mounted = useIsMounted();
  const lastOverflow = useRef('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (open) {
      lastOverflow.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (open) document.body.style.overflow = lastOverflow.current || '';
    };
  }, [open, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const r = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(r);
    } else {
      setVisible(false);
    }
  }, [open, mounted]);

  useEffect(() => {
    if (!open || !mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, mounted, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 180ms ease',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <AnimatedSheet>{children}</AnimatedSheet>
    </div>,
    document.body
  );
}

// ---------------------------
// Game Data with Mobile-Friendly Icons
// ---------------------------
const gameTemplates: GameTemplate[] = [
  {
    id: 'scripture-detective',
    title: 'Scripture Detective',
    description: 'Spot the real verse',
    icon: Search,
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderColor: '#bfdbfe',
  },
  {
    id: 'moral-compass',
    title: 'Moral Compass',
    description: 'Navigate ethics',
    icon: Compass,
    color: 'linear-gradient(135deg, #10b981, #047857)',
    borderColor: '#bbf7d0',
  },
  {
    id: 'faith-heroes',
    title: 'Faith Heroes',
    description: 'Biblical characters',
    icon: Crosshair,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    borderColor: '#fed7aa',
  },
  {
    id: 'love-language',
    title: 'Love Language',
    description: 'Practice love',
    icon: Heart,
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    borderColor: '#fbcfe8',
  },
  {
    id: 'wisdom-warrior',
    title: 'Wisdom Warrior',
    description: 'Counter lies',
    icon: ScrollText,
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    borderColor: '#ddd6fe',
  },
  {
    id: 'prayer-powerup',
    title: 'Prayer Power',
    description: 'Prayer styles',
    icon: FaPrayingHands,
    color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    borderColor: '#a5f3fc',
  },
];

const QUESTIONS: Record<string, { question: string; options: Option[]; explanation: string }> = {
  'scripture-detective': {
    question: 'Which of these is a REAL Bible verse?',
    options: [
      {
        text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
        isCorrect: true,
      },
      {
        text: 'God helps those who help themselves and never give up on their dreams.',
        isCorrect: false,
      },
      {
        text: "The universe will align to help you achieve your heart's desires if you believe.",
        isCorrect: false,
      },
      {
        text: 'Your destiny is in your hands, so take control and make it happen.',
        isCorrect: false,
      },
    ],
    explanation: 'This is Joshua 1:9. The other quotes promote self-reliance, not biblical dependence on God.',
  },
  'moral-compass': {
    question: 'Your classmate is cheating on a test and asks you not to tell. What should you do?',
    options: [
      { text: 'Stay silent to keep the friendship', isCorrect: false },
      {
        text: 'Encourage them to confess and offer to help them study',
        isCorrect: true,
      },
      { text: 'Report them immediately to the teacher', isCorrect: false },
      { text: "Help them cheat so they don't fail", isCorrect: false },
    ],
    explanation: "Galatians 6:1 teaches restoring gently. Help them do what's right, not enable wrong choices.",
  },
  'faith-heroes': {
    question: 'Who continued to pray to God even when it was made illegal?',
    options: [
      { text: 'David', isCorrect: false },
      { text: 'Daniel', isCorrect: true },
      { text: 'Moses', isCorrect: false },
      { text: 'Joshua', isCorrect: false },
    ],
    explanation: "Daniel prayed despite the edict (Daniel 6). God protected him in the lions' den.",
  },
  'love-language': {
    question: "Someone at school constantly makes fun of you. How can you show Christ's love?",
    options: [
      { text: 'Make fun of them back to teach them a lesson', isCorrect: false },
      { text: 'Ignore them and tell everyone how mean they are', isCorrect: false },
      {
        text: 'Pray for them and respond with kindness when possible',
        isCorrect: true,
      },
      { text: 'Get your friends to exclude them from everything', isCorrect: false },
    ],
    explanation: 'Romans 12:20-21: overcome evil with good. Kindness reflects Christ and may soften hearts.',
  },
  'wisdom-warrior': {
    question: "The world says 'You do you - live your truth.' What does the Bible say?",
    options: [
      {
        text: 'There is a way that appears to be right, but in the end it leads to death',
        isCorrect: true,
      },
      { text: "Follow your heart and you'll find happiness", isCorrect: false },
      { text: 'Your personal truth is what matters most', isCorrect: false },
      { text: 'Everyone should define their own morality', isCorrect: false },
    ],
    explanation: "Proverbs 14:12 warns our own way can mislead. God's truth guides decisions.",
  },
  'prayer-powerup': {
    question: "What's the best way to start your daily prayer time?",
    options: [
      { text: 'Immediately ask God for everything you need', isCorrect: false },
      { text: 'Begin by praising God for who He is', isCorrect: true },
      { text: 'Start by telling God about your problems', isCorrect: false },
      { text: "List all the things you're thankful for", isCorrect: false },
    ],
    explanation: "Matthew 6:9 - The Lord's Prayer begins with worship ('hallowed be your name').",
  },
};

// ---------------------------
// Leveling System
// ---------------------------
const XP_PER_CORRECT = 25;

const levels = [
  { name: "Seedling", xp: 0, icon: "🌱" },
  { name: "Disciple", xp: 25, icon: "🌿" },
  { name: "Messenger", xp: 75, icon: "📨" },
  { name: "Guardian", xp: 150, icon: "🛡️" },
  { name: "Kingdom Builder", xp: 300, icon: "👑" },
];

function levelFromXP(xp: number): { level: string; icon: string } {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      return { level: levels[i].name, icon: levels[i].icon };
    }
  }
  return { level: levels[0].name, icon: levels[0].icon };
}

// ---------------------------
// Main Component with Mobile Design
// ---------------------------
export default function GamesPage() {
  const router = useRouter();

  // Core state
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(false);
  const [needsPass, setNeedsPass] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);

  // Game state
  const [xp, setXP] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState<string[]>([]);
  const [testMode, setTestMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // UI state
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    message: string;
    isCorrect: boolean;
  }>({ show: false, message: '', isCorrect: false });

  // Calculate current level
  const currentLevelIndex = levels.findIndex(
    (lvl, i) => xp >= lvl.xp && (i === levels.length - 1 || xp < levels[i + 1].xp)
  );
  const currentLevel = levels[currentLevelIndex] || levels[0];
  const progress = (xp / levels[levels.length - 1].xp) * 100;

  // Welcome animation
  useEffect(() => {
    if (!verified) return;
    const sessionFlag = sessionStorage.getItem("welcomeShown");
    if (!sessionFlag) {
      setShowWelcome(true);
      sessionStorage.setItem("welcomeShown", "true");
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verified]);

  // Initialize with Authentication
  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    
    setUserName(p.name || null);
    setAgeGroup(p.ageGroup || null);

    if (!p.remember) {
      setNeedsPass(true);
      setVerified(false);
    } else {
      setVerified(true);
    }
    
    try {
      localStorage.setItem(STORAGE_KEYS.AGE_GROUP, p.ageGroup);
      if (p.name) localStorage.setItem(STORAGE_KEYS.USER_NAME, JSON.stringify(p.name));
    } catch {}

    if (p.remember) {
      loadGameState();
    }

    setMounted(true);
  }, [router]);

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
    loadGameState();
  }

  function loadGameState() {
    const persisted = lsGet<PersistedGameState>(STORAGE_KEYS.GAME_STATE);
    const today = todayKey();
    
    if (persisted && persisted.dateKey === today) {
      setXP(persisted.xp || 0);
      setGamesPlayed(Array.isArray(persisted.gamesPlayed) ? persisted.gamesPlayed : []);
      setTestMode(!!persisted.testMode);
    } else {
      const carryXP = persisted?.xp ?? 0;
      setXP(carryXP);
      setGamesPlayed([]);
      setTestMode(persisted?.testMode ?? false);
      
      lsSet(STORAGE_KEYS.GAME_STATE, {
        dateKey: today,
        xp: carryXP,
        gamesPlayed: [],
        testMode: persisted?.testMode ?? false,
      } as PersistedGameState);
    }
  }

  // Persist game state
  useEffect(() => {
    if (!mounted || !verified) return;
    const today = todayKey();
    const next: PersistedGameState = {
      dateKey: today,
      xp,
      gamesPlayed,
      testMode,
    };
    lsSet(STORAGE_KEYS.GAME_STATE, next);
  }, [mounted, verified, xp, gamesPlayed, testMode]);

  // Load games
  useEffect(() => {
    if (!verified) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const newGames: Game[] = gameTemplates.map((t) => ({
        ...t,
        ...QUESTIONS[t.id],
        isAIGenerated: true,
      }));
      setGames(newGames);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [verified]);

  const activeGameData = activeGame ? games.find((g) => g.id === activeGame) : null;

  function handleGameClick(gameId: string) {
    if (!verified) return;
    
    if (!testMode && gamesPlayed.includes(gameId)) {
      setResultModal({
        show: true,
        message: 'You already played this game today! Turn on test mode or come back tomorrow. 😊',
        isCorrect: false,
      });
      return;
    }
    setActiveGame(gameId);
    setSelectedAnswer(null);
    setShowResult(false);
  }

  function selectAnswer(selected: number, correctIndex: number) {
    if (!verified) return;
    
    const currentGameId = activeGame;
    setSelectedAnswer(selected);
    setShowResult(true);
    
    setTimeout(() => {
      if (selected === correctIndex) {
        const newXP = xp + XP_PER_CORRECT;
        setXP(newXP);
        if (currentGameId && !gamesPlayed.includes(currentGameId)) {
          setGamesPlayed((prev) => [...prev, currentGameId]);
        }
        setResultModal({
          show: true,
          message: `✅ Correct! +${XP_PER_CORRECT} XP earned!`,
          isCorrect: true,
        });
      } else {
        const game = currentGameId ? games.find((g) => g.id === currentGameId) : null;
        if (game) {
          const correctAnswer = game.options[correctIndex]?.text || 'Unknown';
          const explanation = game.explanation || 'No explanation available';
          setResultModal({
            show: true,
            message: `❌ Incorrect!\n\n✅ Correct Answer: "${correctAnswer}"\n\n💡 Why: ${explanation}`,
            isCorrect: false,
          });
        }
      }
      setActiveGame(null);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 550);
  }

  // Loading screen
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-500 flex items-center justify-center p-6">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Challenges</h2>
          <p className="text-blue-200">Creating personalized questions...</p>
        </div>
      </div>
    );
  }

  // Passcode gate
  if (needsPass && !verified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-500 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {userName}!</h2>
          <p className="text-gray-600 mb-6">Enter your passcode to access the games.</p>

          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Passcode"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/50 backdrop-blur text-gray-800 focus:outline-none focus:border-blue-500 mb-4"
            onKeyDown={(e) => {
              if (e.key === 'Enter') verifyNow();
            }}
          />

          {authError && <div className="text-red-500 text-sm mb-4">{authError}</div>}

          <button
            onClick={verifyNow}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Unlock Games
          </button>

          <button
            onClick={() => {
              clearProfile();
              window.location.href = '/';
            }}
            className="w-full mt-4 text-gray-600 underline text-sm"
          >
            Not you? Sign in again
          </button>
        </div>
      </div>
    );
  }

  // Main game interface with mobile design
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-800 to-blue-500 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400 opacity-30 rounded-full -top-20 -left-20 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-indigo-600 opacity-20 rounded-full -bottom-40 -right-32 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          {/* Chat Bubble */}
          <div className="flex items-center gap-3">
            <SafeBackButton />
            <button className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <MessageCircle className="w-5 h-5 text-blue-300" />
              <div className="absolute text-xs font-bold text-yellow-400 opacity-80">G</div>
            </button>
          </div>

          {/* Welcome message */}
          {showWelcome && (
            <p className="text-blue-200 text-base animate-bounce">
              Welcome {userName || 'friend'}!
            </p>
          )}

          <button 
            onClick={() => {
              clearProfile();
              window.location.href = '/';
            }}
            className="text-sm text-white/50 border border-white/20 rounded-full px-3 py-1 bg-white/10"
          >
            Sign out
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 drop-shadow-xl tracking-wide mb-2">
            GABEIFIED
          </h1>
          <p className="italic text-blue-100 text-xs tracking-wider font-semibold">
            where parables become playables
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="relative z-10 px-6 mb-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 border border-blue-200">
          {/* Progress Counter */}
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-gray-700 font-semibold text-sm">Played</h2>
              <p className="text-2xl font-extrabold text-blue-800">{gamesPlayed.length}/6</p>
            </div>

            {/* XP Timeline */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-blue-800">
                {currentLevel.icon} {currentLevel.name}
              </h2>
              <p className="text-sm text-gray-600 mb-3">{xp} XP Points</p>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full h-3 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-700 to-green-900 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              {/* Level Icons */}
              <div className="flex justify-between mt-3">
                {levels.map((lvl, idx) => (
                  <div key={idx} className="flex flex-col items-center relative group">
                    <div className="text-2xl">{lvl.icon}</div>
                    {xp >= lvl.xp && (
                      <div className="absolute -bottom-2 w-1 h-1 bg-green-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Mode Toggle */}
          <button
            onClick={() => setTestMode(!testMode)}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              testMode 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {testMode ? '🧪 TEST MODE ON' : '🔒 TEST MODE OFF'}
          </button>
        </div>
      </div>

      {/* Games Grid - Mobile Optimized 2 columns */}
      <div className="relative z-10 px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {games.map((game) => {
            const IconComponent = game.icon;
            const isCompleted = !testMode && gamesPlayed.includes(game.id);
            
            return (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                className={`bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transition-all cursor-pointer border border-blue-100 ${
                  isCompleted ? 'opacity-70' : 'hover:scale-105 hover:shadow-2xl'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3" style={{ background: game.color, borderRadius: '12px' }}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                <h3 className="font-bold text-gray-800 text-sm mb-1">
                  {game.title}
                </h3>

                {isCompleted ? (
                  <div className="flex items-center justify-center text-green-600 text-xs font-semibold">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Done
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">
                    {game.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question Modal */}
      <ModalPortal
        open={!!activeGame && !!activeGameData}
        onClose={() => setActiveGame(null)}
        ariaLabel="Game question dialog"
      >
        {activeGame && activeGameData && (
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {activeGameData.title}
            </h2>

            <p className="text-base text-gray-700 mb-4">
              {activeGameData.question}
            </p>

            <div className="space-y-3 mb-6">
              {activeGameData.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    !showResult &&
                    selectAnswer(index, activeGameData.options.findIndex((o) => o.isCorrect))
                  }
                  disabled={showResult}
                  className={`w-full text-left rounded-xl p-3 text-sm transition-all ${
                    showResult
                      ? option.isCorrect
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-500 hover:text-white'
                  }`}