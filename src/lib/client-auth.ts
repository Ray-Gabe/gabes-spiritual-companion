// /lib/client-auth.ts
// Small client-only "auth" + per-user game state (localStorage). No SSR.

export type GabeProfile = {
  name: string;
  ageGroup: 'Kid/Teen' | 'Student' | 'Young Adult' | 'Adult' | 'Senior' | 'Auto';
  passcode: string;           // simple passcode/pin
  remember: boolean;          // if false, we could clear on tab close (optional)
  createdAt: string;          // ISO date
};

const KEYS = {
  PROFILE: 'gabeProfile',
  AGE_LEGACY: 'gabeAgeGroup', // legacy key some existing code reads
  GAME_STATE: 'gabeGameState',
};

function safeLS() {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

// ---------- Profile ----------
export function setProfile(p: GabeProfile) {
  const ls = safeLS(); if (!ls) return;
  ls.setItem(KEYS.PROFILE, JSON.stringify(p));
  // also keep existing legacy key your chat may read
  ls.setItem(KEYS.AGE_LEGACY, p.ageGroup);
}

export function getProfile(): GabeProfile | null {
  const ls = safeLS(); if (!ls) return null;
  try {
    const raw = ls.getItem(KEYS.PROFILE);
    return raw ? (JSON.parse(raw) as GabeProfile) : null;
  } catch {
    return null;
  }
}

export function clearProfile() {
  const ls = safeLS(); if (!ls) return;
  ls.removeItem(KEYS.PROFILE);
  ls.removeItem(KEYS.AGE_LEGACY);
}

export function isSignedIn(): boolean {
  return !!getProfile();
}

export function verifyPasscode(pass: string): boolean {
  const p = getProfile();
  if (!p) return false;
  return p.passcode === pass;
}

// ---------- Simple game-state helpers ----------
type PersistedGameState = {
  dateKey: string;     // e.g. "2025-08-18"
  xp: number;
  gamesPlayed: string[];
  testMode: boolean;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function loadGameState(): PersistedGameState | null {
  const ls = safeLS(); if (!ls) return null;
  try {
    const raw = ls.getItem(KEYS.GAME_STATE);
    return raw ? (JSON.parse(raw) as PersistedGameState) : null;
  } catch {
    return null;
  }
}

export function saveGameState(state: PersistedGameState) {
  const ls = safeLS(); if (!ls) return;
  ls.setItem(KEYS.GAME_STATE, JSON.stringify(state));
}

// Convenience getters/setters for simple values keyed by name
export function loadUserGameState<T = any>(key: string): T | null {
  const state = loadGameState();
  if (!state) return null;
  if (key === 'xp') return (state.xp as unknown as T) ?? null;
  if (key === 'gamesPlayed:today') {
    return state.dateKey === todayKey() ? (state.gamesPlayed as unknown as T) : ([] as unknown as T);
  }
  if (key === 'testMode') return (state.testMode as unknown as T) ?? null;
  return null;
}

export function saveUserGameState(key: string, value: any) {
  const current = loadGameState() || { dateKey: todayKey(), xp: 0, gamesPlayed: [], testMode: false };
  const next: PersistedGameState = { ...current };

  // reset daily list if the day has changed
  if (current.dateKey !== todayKey()) {
    next.dateKey = todayKey();
    next.gamesPlayed = [];
  }

  if (key === 'xp') next.xp = Number(value) || 0;
  if (key === 'gamesPlayed:today') next.gamesPlayed = Array.isArray(value) ? value : [];
  if (key === 'testMode') next.testMode = !!value;

  saveGameState(next);
}
