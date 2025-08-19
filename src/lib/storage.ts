// src/lib/storage.ts - localStorage Management

import { UserStats, ChatMessage, StorageKeys } from '@/types';

const STORAGE_KEYS: StorageKeys = {
  USER_STATS: 'gabe_user_stats',
  CHAT_HISTORY: 'gabe_chat_history', 
  GAMES_PLAYED_TODAY: 'gabe_games_today',
  TEST_MODE: 'gabe_test_mode',
  LAST_VISIT: 'gabe_last_visit'
};

export class StorageService {
  // Check if we're in browser environment
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // User Stats Management
  static saveUserStats(stats: UserStats): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save user stats:', error);
    }
  }

  static loadUserStats(): UserStats | null {
    if (!this.isBrowser()) return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load user stats:', error);
      return null;
    }
  }

  // Chat History Management
  static saveChatHistory(messages: ChatMessage[]): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  static loadChatHistory(): ChatMessage[] {
    if (!this.isBrowser()) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return [];
      
      const messages = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  // Test Mode Management
  static saveTestMode(isTestMode: boolean): void {
    if (!this.isBrowser()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.TEST_MODE, JSON.stringify(isTestMode));
    } catch (error) {
      console.error('Failed to save test mode:', error);
    }
  }

  static loadTestMode(): boolean {
    if (!this.isBrowser()) return false;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TEST_MODE);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.error('Failed to load test mode:', error);
      return false;
    }
  }

  // Last Visit Tracking
  static saveLastVisit(): void {
    if (!this.isBrowser()) return;
    
    try {
      const now = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LAST_VISIT, now);
    } catch (error) {
      console.error('Failed to save last visit:', error);
    }
  }

  static getLastVisit(): Date | null {
    if (!this.isBrowser()) return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
      return stored ? new Date(stored) : null;
    } catch (error) {
      console.error('Failed to get last visit:', error);
      return null;
    }
  }

  // Daily Games Tracking (separate from UserStats for flexibility)
  static saveGamesPlayedToday(gameIds: string[]): void {
    if (!this.isBrowser()) return;
    
    try {
      const data = {
        date: new Date().toDateString(),
        games: gameIds
      };
      localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED_TODAY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save games played today:', error);
    }
  }

  static loadGamesPlayedToday(): string[] {
    if (!this.isBrowser()) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED_TODAY);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      
      // Reset if it's a new day
      if (data.date !== today) {
        this.saveGamesPlayedToday([]);
        return [];
      }
      
      return data.games || [];
    } catch (error) {
      console.error('Failed to load games played today:', error);
      return [];
    }
  }

  // Clear all data (for reset/logout)
  static clearAllData(): void {
    if (!this.isBrowser()) return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // Export/Import data (for backup/restore)
  static exportData(): string | null {
    if (!this.isBrowser()) return null;
    
    try {
      const data: Record<string, any> = {};
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = JSON.parse(value);
        }
      });
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  static importData(jsonData: string): boolean {
    if (!this.isBrowser()) return false;
    
    try {
      const data = JSON.parse(jsonData);
      
      Object.entries(data).forEach(([key, value]) => {
        if (Object.values(STORAGE_KEYS).includes(key as any)) {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Get storage usage info
  static getStorageInfo(): { used: number; available: number; keys: string[] } {
    if (!this.isBrowser()) {
      return { used: 0, available: 0, keys: [] };
    }
    
    try {
      let used = 0;
      const keys: string[] = [];
      
      Object.values(STORAGE_KEYS).forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          used += new Blob([item]).size;
          keys.push(key);
        }
      });
      
      // Most browsers have 5-10MB localStorage limit
      const estimated_limit = 5 * 1024 * 1024; // 5MB
      
      return {
        used,
        available: estimated_limit - used,
        keys
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, keys: [] };
    }
  }
}