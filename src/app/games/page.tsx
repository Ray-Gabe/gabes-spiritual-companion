'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
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
// Storage helpers using your client-auth system
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
        color: '#6b7280',
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
// Game Data
// ---------------------------
const gameTemplates: GameTemplate[] = [
  {
    id: 'scripture-detective',
    title: 'Scripture Detective',
    description: 'Can you spot the real Bible verse?',
    icon: Brain,
    color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    borderColor: '#bfdbfe',
  },
  {
    id: 'moral-compass',
    title: 'Moral Compass',
    description: 'Navigate ethical scenarios',
    icon: Heart,
    color: 'linear-gradient(135deg, #10b981, #047857)',
    borderColor: '#bbf7d0',
  },
  {
    id: 'faith-heroes',
    title: 'Faith Heroes',
    description: 'Learn from biblical characters',
    icon: Users,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    borderColor: '#fed7aa',
  },
  {
    id: 'love-language',
    title: 'Love Language Lab',
    description: 'Practice showing love',
    icon: Heart,
    color: 'linear-gradient(135deg, #ec4899, #be185d)',
    borderColor: '#fbcfe8',
  },
  {
    id: 'wisdom-warrior',
    title: 'Wisdom Warrior',
    description: 'Counter worldly lies',
    icon: Shield,
    color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    borderColor: '#ddd6fe',
  },
  {
    id: 'prayer-powerup',
    title: 'Prayer Power-Up',
    description: 'Learn prayer styles',
    icon: Crown,
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

function levelFromXP(xp: number): { level: string; icon: string } {
  if (xp >= 300) return { level: 'Kingdom Builder', icon: '👑' };
  if (xp >= 150) return { level: 'Guardian', icon: '🛡️' };
  if (xp >= 75) return { level: 'Messenger', icon: '💬' };
  if (xp >= 25) return { level: 'Disciple', icon: '👥' };
  return { level: 'Seedling', icon: '🌱' };
}

const LEVEL_SPECS: Array<{ name: string; min: number; max: number; icon: string }> = [
  { name: 'Seedling', min: 0, max: 24, icon: '🌱' },
  { name: 'Disciple', min: 25, max: 74, icon: '👥' },
  { name: 'Messenger', min: 75, max: 149, icon: '💬' },
  { name: 'Guardian', min: 150, max: 299, icon: '🛡️' },
  { name: 'Kingdom Builder', min: 300, max: Number.POSITIVE_INFINITY, icon: '👑' },
];

function formatRange(min: number, max: number) {
  return Number.isFinite(max) ? `${min}-${max} XP` : `${min}+ XP`;
}

function getNextLevelName(current: string) {
  const idx = LEVEL_SPECS.findIndex((l) => l.name === current);
  return idx >= 0 && idx < LEVEL_SPECS.length - 1 ? LEVEL_SPECS[idx + 1].name : 'Max Level';
}

// ---------------------------
// Main Component
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
  const [{ level, icon: levelIcon }, setLevelState] = useState(levelFromXP(0));
  const [gamesPlayed, setGamesPlayed] = useState<string[]>([]);
  const [testMode, setTestMode] = useState(false);

  // UI state
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [resultModal, setResultModal] = useState<{
    show: boolean;
    message: string;
    isCorrect: boolean;
  }>({ show: false, message: '', isCorrect: false });

  // Check for completion and show modal
  useEffect(() => {
    if (!testMode && gamesPlayed.length === 6 && verified) {
      // Small delay to let the user see the final game complete
      const timer = setTimeout(() => {
        setShowCompletionModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gamesPlayed.length, testMode, verified]);

  // Initialize with Authentication
  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.replace('/');
      return;
    }
    
    setUserName(p.name || null);
    setAgeGroup(p.ageGroup || null);

    // Check if authentication is needed
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

    // Load daily game state only if verified or remember is true
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
      setLevelState(levelFromXP(persisted.xp || 0));
      setGamesPlayed(Array.isArray(persisted.gamesPlayed) ? persisted.gamesPlayed : []);
      setTestMode(!!persisted.testMode);
    } else {
      const carryXP = persisted?.xp ?? 0;
      setXP(carryXP);
      setLevelState(levelFromXP(carryXP));
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

  // Persist game state (only when verified)
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

  // Load games (only when verified)
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

  // Progress calculation
  const progress = useMemo(() => {
    const idx = LEVEL_SPECS.findIndex((s) => s.name === level);
    if (idx === -1) return 0;
    const curr = LEVEL_SPECS[idx];
    const next = LEVEL_SPECS[idx + 1];
    if (!next) return 100;
    const gained = Math.max(0, xp - curr.min);
    const needed = Math.max(1, next.min - curr.min);
    return (gained / needed) * 100;
  }, [level, xp]);

  const activeGameData = activeGame ? games.find((g) => g.id === activeGame) : null;
  const nextLevelName = React.useMemo(() => getNextLevelName(level), [level]);
  const progressLabel = nextLevelName === 'Max Level' ? 'Max level achieved' : `Progress to ${nextLevelName}`;

  function updateLevel(newXP: number) {
    setLevelState(levelFromXP(newXP));
  }

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
        updateLevel(newXP);
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
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #87CEEB, #B0E0E6, #E6F3FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <RefreshCw
            style={{
              width: '64px',
              height: '64px',
              color: '#1e3a8a',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#374151',
              marginBottom: '8px',
            }}
          >
            Generating Your Spiritual Challenges
          </h2>
          <p style={{ fontSize: '20px', color: '#6b7280' }}>
            Creating personalized questions just for you...
          </p>
        </div>
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
          padding: '24px',
          fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',Segoe UI,Roboto,system-ui,sans-serif",
        }}
      >
        <div
          style={{
            width: 'min(420px, 94vw)',
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid #87CEEB',
            boxShadow: '0 24px 64px rgba(135,206,235,.4)',
            padding: '24px',
          }}
        >
          <h2 style={{ margin: '0 0 8px 0', color: '#0b1b4f' }}>Welcome back, {userName}!</h2>
          <p style={{ marginTop: 0, color: '#6b7280' }}>Enter your passcode to access the games.</p>

          <input
            type="password"
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Passcode"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              margin: '12px 0 8px 0',
              fontSize: '15px',
              background: '#f9fafb',
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') verifyNow();
            }}
          />

          {authError && <div style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '8px' }}>{authError}</div>}

          <button
            onClick={verifyNow}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg,#243b90,#2849c7)',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              padding: '12px 16px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(36,59,144,.3)',
            }}
          >
            Unlock Games
          </button>

          <button
            onClick={() => {
              clearProfile();
              window.location.href = '/';
            }}
            style={{
              width: '100%',
              background: 'none',
              color: '#6b7280',
              border: 'none',
              marginTop: '10px',
              padding: '8px',
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #87CEEB, #B0E0E6, #E6F3FF)',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display','SF Pro Text','Segoe UI', Roboto, system-ui, sans-serif",
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
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SafeBackButton />
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #eef4ff 0%, #dceaff 45%, #cfe0ff 100%)',
                boxShadow: 'inset 0 0 0 4px #f5f8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0b1b4f',
                fontWeight: 900,
                fontSize: '18px',
              }}
            >
              G
            </div>
            <span
              style={{
                fontSize: '16px',
                color: '#6b7280',
                fontStyle: 'italic',
                lineHeight: 1.2,
                fontWeight: 500,
              }}
            >
              where parables become playables
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                clearProfile();
                window.location.href = '/';
              }}
              style={{
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

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Hero Title */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#172554',
              margin: '0 0 16px 0',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}
          >
            GABEIFIED
          </h1>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#172554',
              margin: '0 0 16px 0',
            }}
          >
            Parables Just Became Playables
          </p>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            {userName ? `Welcome back, ${userName}!` : 'Welcome!'}{' '}
            {ageGroup && ageGroup !== 'Auto' ? `(${ageGroup})` : ''}
          </p>
        </div>

        {/* Level Card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            boxShadow: '0 12px 30px rgba(16,24,40,0.08)',
            padding: '48px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '48px',
                  fontWeight: 700,
                  color: '#374151',
                  margin: '0 0 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '56px' }}>{levelIcon}</span>
                {level}
              </h2>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#6b7280',
                  margin: 0,
                }}
              >
                {xp} XP
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontSize: '20px',
                  color: '#6b7280',
                  marginBottom: '8px',
                }}
              >
                Games Today
              </p>
              <p
                style={{
                  fontSize: '64px',
                  fontWeight: 700,
                  color: '#1e3a8a',
                  margin: '0 0 16px 0',
                }}
              >
                {gamesPlayed.length}/6
              </p>
              <button
                onClick={() => setTestMode(!testMode)}
                style={{
                  background: testMode ? '#ea580c' : '#e5e7eb',
                  color: testMode ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {testMode ? '🧪 TEST ON' : '🔒 TEST OFF'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '16px',
              background: '#e5e7eb',
              borderRadius: '999px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #1e3a8a, #1e40af)',
                borderRadius: '999px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#6b7280',
              fontWeight: 500,
            }}
          >
            <p style={{ fontSize: '20px', margin: 0 }}>{progressLabel}</p>
            <p style={{ fontSize: '20px', margin: 0 }}>{Math.round(progress)}%</p>
          </div>

          {/* Level Tiles */}
          <div
            style={{
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {LEVEL_SPECS.map((spec) => {
              const isCurrent = spec.name === level;
              const isUnlocked = xp >= spec.min;
              
              return (
                <div
                  key={spec.name}
                  style={{
                    background: isCurrent ? '#fff' : isUnlocked ? '#fff' : '#f3f4f6',
                    border: `1px solid ${isCurrent ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    opacity: isUnlocked ? 1 : 0.7,
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: isCurrent ? '#dbeafe' : '#f3f4f6',
                      border: `1px solid ${isCurrent ? '#3b82f6' : '#d1d5db'}`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    {spec.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: isCurrent ? '#1e3a8a' : '#374151',
                      }}
                    >
                      {spec.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {formatRange(spec.min, spec.max)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Mode Banner */}
        {testMode && (
          <div
            style={{
              background: '#fed7aa',
              border: '2px solid #ea580c',
              color: '#9a3412',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '48px',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 700,
                margin: '0 0 8px 0',
              }}
            >
              🧪 TEST MODE ACTIVE
            </h3>
            <p style={{ fontSize: '18px', margin: 0 }}>
              Daily limits disabled for testing. You can play all games multiple times!
            </p>
          </div>
        )}

        {/* Games Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '48px',
          }}
        >
          {games.map((game) => {
            const IconComponent = game.icon;
            const isCompleted = !testMode && gamesPlayed.includes(game.id);
            
            return (
              <div
                key={game.id}
                onClick={() => handleGameClick(game.id)}
                style={{
                  background: isCompleted ? '#f9fafb' : '#fff',
                  borderRadius: '24px',
                  border: `2px solid ${game.borderColor}`,
                  boxShadow: '0 12px 30px rgba(16,24,40,0.08)',
                  padding: '36px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isCompleted ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isCompleted) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(16,24,40,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(16,24,40,0.08)';
                }}
              >
                <div
                  style={{
                    width: '86px',
                    height: '86px',
                    background: game.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <IconComponent style={{ width: '42px', height: '42px', color: 'white' }} />
                </div>

                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#374151',
                    margin: '0 0 12px 0',
                  }}
                >
                  {game.title}
                </h3>

                {isCompleted ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669',
                      fontWeight: 600,
                      fontSize: '18px',
                    }}
                  >
                    <CheckCircle style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                    Completed
                  </div>
                ) : (
                  <p
                    style={{
                      fontSize: '18px',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {game.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Banner */}
        {!testMode && gamesPlayed.length === 6 && (
          <div
            style={{
              background: '#bbf7d0',
              border: '2px solid #059669',
              color: '#065f46',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 700,
                margin: '0 0 8px 0',
              }}
            >
              🎉 All Games Completed Today!
            </h3>
            <p style={{ fontSize: '18px', margin: 0 }}>
              You've completed all today's spiritual challenges. Come back tomorrow for new questions!
            </p>
          </div>
        )}
      </div>

      {/* Question Modal */}
      <ModalPortal
        open={!!activeGame && !!activeGameData}
        onClose={() => setActiveGame(null)}
        ariaLabel="Game question dialog"
      >
        {activeGame && activeGameData && (
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '48px',
              maxWidth: '600px',
              width: '90vw',
              border: '1px solid #e5e7eb',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '30px',
                  fontWeight: 700,
                  margin: 0,
                  color: '#374151',
                }}
              >
                {activeGameData.title}
              </h2>
            </div>

            <p
              style={{
                fontSize: '20px',
                marginBottom: '24px',
                lineHeight: 1.5,
                color: '#374151',
              }}
            >
              {activeGameData.question}
            </p>

            <div style={{ marginBottom: '32px' }}>
              {activeGameData.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    !showResult &&
                    selectAnswer(index, activeGameData.options.findIndex((o) => o.isCorrect))
                  }
                  disabled={showResult}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    borderRadius: '12px',
                    padding: '18px',
                    marginBottom: '12px',
                    fontSize: '18px',
                    border: 'none',
                    cursor: showResult ? 'default' : 'pointer',
                    background: showResult
                      ? option.isCorrect
                        ? '#059669'
                        : index === selectedAnswer
                        ? '#dc2626'
                        : '#e5e7eb'
                      : '#dbeafe',
                    color: showResult
                      ? option.isCorrect || index === selectedAnswer
                        ? 'white'
                        : '#374151'
                      : '#1e3a8a',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.background = '#3b82f6';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showResult) {
                      e.currentTarget.style.background = '#dbeafe';
                      e.currentTarget.style.color = '#1e3a8a';
                    }
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveGame(null)}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}
      </ModalPortal>

      {/* Result Modal */}
      <ModalPortal
        open={resultModal.show}
        onClose={() => setResultModal({ show: false, message: '', isCorrect: false })}
        ariaLabel="Result dialog"
      >
        <div
          style={{
            background: resultModal.isCorrect ? '#f0fdf4' : '#fef2f2',
            border: `2px solid ${resultModal.isCorrect ? '#059669' : '#dc2626'}`,
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '520px',
            width: '90vw',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '72px', marginBottom: '12px' }}>
            {resultModal.isCorrect ? '🎉' : '📚'}
          </div>
          <div
            style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: resultModal.isCorrect ? '#065f46' : '#991b1b',
              whiteSpace: 'pre-line',
              marginBottom: '20px',
            }}
          >
            {resultModal.message}
          </div>
          <button
            onClick={() => setResultModal({ show: false, message: '', isCorrect: false })}
            style={{
              background: resultModal.isCorrect ? '#059669' : '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {resultModal.isCorrect ? 'Awesome!' : 'Got it!'}
          </button>
        </div>
      </ModalPortal>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}