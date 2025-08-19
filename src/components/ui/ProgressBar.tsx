// src/components/ui/ProgressBar.tsx - Reusable Progress Bar

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = false,
  color = 'blue',
  size = 'md',
  animated = true
}: ProgressBarProps) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    pink: 'bg-pink-600',
    cyan: 'bg-cyan-600'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div 
          className={cn(
            'rounded-full transition-all duration-500 ease-out',
            colors[color],
            sizes[size],
            animated && 'animate-pulse'
          )}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(safeProgress)}%
        </div>
      )}
    </div>
  );
}

// Specialized progress bars
export function XPProgressBar({ 
  currentXP, 
  nextLevelXP, 
  className 
}: { 
  currentXP: number; 
  nextLevelXP: number; 
  className?: string;
}) {
  const progress = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;
  
  return (
    <div className={className}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{currentXP} XP</span>
        <span>{nextLevelXP} XP</span>
      </div>
      <ProgressBar 
        progress={progress} 
        color="green" 
        size="lg" 
        showPercentage 
      />
    </div>
  );
}

export function LevelProgressBar({ 
  levelProgress, 
  levelName,
  className 
}: { 
  levelProgress: number; 
  levelName: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress to next level</span>
        <span>{levelName}</span>
      </div>
      <ProgressBar 
        progress={levelProgress} 
        color="purple" 
        size="md" 
        showPercentage 
      />
    </div>
  );
}

// Loading progress bar
export function LoadingProgressBar({ 
  isLoading, 
  message = "Loading...",
  className 
}: { 
  isLoading: boolean; 
  message?: string;
  className?: string;
}) {
  if (!isLoading) return null;

  return (
    <div className={cn('text-center', className)}>
      <p className="text-sm text-gray-600 mb-2">{message}</p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div className="h-2 bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }} />
      </div>
    </div>
  );
}