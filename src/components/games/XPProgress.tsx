// src/components/games/XPProgress.tsx - XP Progress Display

import { UserStats } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Trophy, Target, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPProgressProps {
  stats: UserStats;
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
}

export function XPProgress({ 
  stats, 
  className = '',
  variant = 'full'
}: XPProgressProps) {
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center space-x-3', className)}>
        <span 
          className="text-2xl"
          style={{ fontSize: 'clamp(20px, 4vw, 32px)' }}
        >
          {stats.levelIcon}
        </span>
        <div>
          <h3 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(14px, 3vw, 18px)' }}
          >
            {stats.levelName}
          </h3>
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            {stats.xp} XP
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('bg-white rounded-lg p-4 shadow-sm', className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span 
              className="text-2xl"
              style={{ fontSize: 'clamp(24px, 4vw, 32px)' }}
            >
              {stats.levelIcon}
            </span>
            <div>
              <h3 
                className="font-bold text-gray-900"
                style={{ fontSize: 'clamp(16px, 3vw, 20px)' }}
              >
                {stats.levelName}
              </h3>
              <p 
                className="text-gray-600"
                style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
              >
                {stats.xp} XP
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p 
              className="text-gray-600"
              style={{ fontSize: 'clamp(11px, 2vw, 12px)' }}
            >
              Games Today
            </p>
            <p 
              className="font-bold text-gray-900"
              style={{ fontSize: 'clamp(14px, 3vw, 18px)' }}
            >
              {stats.gamesPlayedToday.length}/6
            </p>
          </div>
        </div>

        <ProgressBar 
          progress={stats.progress} 
          color="green"
          showPercentage 
        />
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={cn('bg-white rounded-lg shadow-sm', className)}
         style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
      
      {/* Header with Level Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span 
            style={{ fontSize: 'clamp(32px, 6vw, 48px)' }}
          >
            {stats.levelIcon}
          </span>
          <div>
            <h3 
              className="font-bold text-gray-900"
              style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}
            >
              {stats.levelName}
            </h3>
            <p 
              className="text-gray-600"
              style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}
            >
              {stats.xp.toLocaleString()} XP
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            Games Today
          </p>
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(16px, 3.5vw, 20px)' }}
          >
            {stats.gamesPlayedToday.length}/6
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600"
             style={{ fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
          <span>Progress to next level</span>
          <span>{stats.nextLevelXP - stats.xp} XP needed</span>
        </div>
        <ProgressBar 
          progress={stats.progress} 
          color="green"
          size="lg"
          showPercentage 
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Trophy 
              className="text-yellow-500"
              style={{ 
                width: 'clamp(16px, 3vw, 20px)', 
                height: 'clamp(16px, 3vw, 20px)' 
              }}
            />
          </div>
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            {stats.totalGamesPlayed}
          </p>
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(10px, 2vw, 11px)' }}
          >
            Total Games
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Target 
              className="text-green-500"
              style={{ 
                width: 'clamp(16px, 3vw, 20px)', 
                height: 'clamp(16px, 3vw, 20px)' 
              }}
            />
          </div>
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            {stats.averageScore}%
          </p>
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(10px, 2vw, 11px)' }}
          >
            Accuracy
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Zap 
              className="text-orange-500"
              style={{ 
                width: 'clamp(16px, 3vw, 20px)', 
                height: 'clamp(16px, 3vw, 20px)' 
              }}
            />
          </div>
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            {stats.streak}
          </p>
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(10px, 2vw, 11px)' }}
          >
            Streak
          </p>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-1">
            <Calendar 
              className="text-blue-500"
              style={{ 
                width: 'clamp(16px, 3vw, 20px)', 
                height: 'clamp(16px, 3vw, 20px)' 
              }}
            />
          </div>
          <p 
            className="font-bold text-gray-900"
            style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          >
            {stats.gamesPlayedToday.length}
          </p>
          <p 
            className="text-gray-600"
            style={{ fontSize: 'clamp(10px, 2vw, 11px)' }}
          >
            Today
          </p>
        </div>
      </div>
    </div>
  );
}

// Level up celebration component
export function LevelUpCelebration({ 
  newLevel, 
  onClose 
}: { 
  newLevel: { name: string; icon: string; description: string };
  onClose: () => void;
}) {
  return (
    <div className="text-center p-6">
      <div className="text-6xl mb-4 animate-bounce">🎉</div>
      
      <h2 className="text-3xl font-bold text-purple-600 mb-2">
        Level Up!
      </h2>
      
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 mb-4">
        <div className="text-4xl mb-2">{newLevel.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{newLevel.name}</h3>
        <p className="text-purple-100">{newLevel.description}</p>
      </div>
      
      <button
        onClick={onClose}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
      >
        Continue Your Journey! 🚀
      </button>
    </div>
  );
}