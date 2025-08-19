// src/components/games/GameCard.tsx - Individual Game Card

import { SpiritualGame } from '@/types';
import { CheckCircle, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: SpiritualGame;
  isCompleted: boolean;
  canPlay: boolean;
  isAIGenerated?: boolean;
  onClick: () => void;
  className?: string;
}

export function GameCard({ 
  game, 
  isCompleted, 
  canPlay, 
  isAIGenerated = false,
  onClick,
  className = ''
}: GameCardProps) {
  const IconComponent = game.icon;

  return (
    <button
      onClick={onClick}
      disabled={!canPlay}
      className={cn(
        'group relative w-full rounded-xl border-2 text-left transition-all duration-200',
        'hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
        canPlay 
          ? 'border-transparent bg-gradient-to-br hover:shadow-xl cursor-pointer' 
          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60',
        game.color,
        className
      )}
      style={{
        padding: 'clamp(16px, 4vw, 48px)',
        minHeight: 'clamp(120px, 20vw, 200px)'
      }}
    >
      {/* AI Badge */}
      {isAIGenerated && canPlay && (
        <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>AI</span>
        </div>
      )}

      {/* Status Icons */}
      <div className="absolute top-4 left-4">
        {isCompleted ? (
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        ) : !canPlay ? (
          <div className="bg-gray-400 rounded-full p-1">
            <Lock className="w-5 h-5 text-white" />
          </div>
        ) : null}
      </div>

      {/* Game Content */}
      <div className="flex flex-col items-center text-center space-y-3 pt-12">
        {/* Icon */}
        <div 
          className="flex items-center justify-center"
          style={{
            width: 'clamp(32px, 8vw, 64px)',
            height: 'clamp(32px, 8vw, 64px)'
          }}
        >
          <IconComponent 
            className="text-white"
            style={{
              width: 'clamp(24px, 6vw, 48px)',
              height: 'clamp(24px, 6vw, 48px)'
            }}
          />
        </div>
        
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 
            className="font-bold text-white leading-tight"
            style={{
              fontSize: 'clamp(14px, 3.5vw, 20px)'
            }}
          >
            {game.title}
          </h3>
          <p 
            className="text-white/80 mt-1 leading-tight"
            style={{
              fontSize: 'clamp(11px, 2.5vw, 14px)'
            }}
          >
            {game.description}
          </p>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Completion Indicator */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-xl bg-green-500/20 border-2 border-green-400">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Completed Today!
            </div>
          </div>
        </div>
      )}

      {/* Disabled Overlay */}
      {!canPlay && !isCompleted && (
        <div className="absolute inset-0 rounded-xl bg-gray-500/50 flex items-center justify-center">
          <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Play Tomorrow</span>
          </div>
        </div>
      )}
    </button>
  );
}

// Specialized card variants
export function CompactGameCard({ 
  game, 
  isCompleted, 
  canPlay, 
  onClick 
}: Omit<GameCardProps, 'isAIGenerated' | 'className'>) {
  const IconComponent = game.icon;

  return (
    <button
      onClick={onClick}
      disabled={!canPlay}
      className={cn(
        'w-full p-4 rounded-lg border text-left transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
        canPlay 
          ? 'border-gray-200 bg-white hover:border-blue-300 cursor-pointer' 
          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-center space-x-3">
        <div className={cn('p-2 rounded-lg bg-gradient-to-br', game.color)}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{game.title}</h3>
          <p className="text-sm text-gray-600">{game.description}</p>
        </div>

        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        
        {!canPlay && !isCompleted && (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </button>
  );
}

export function GridGameCard({ 
  game, 
  isCompleted, 
  canPlay, 
  isAIGenerated,
  onClick 
}: Omit<GameCardProps, 'className'>) {
  return (
    <GameCard
      game={game}
      isCompleted={isCompleted}
      canPlay={canPlay}
      isAIGenerated={isAIGenerated}
      onClick={onClick}
      className="aspect-square"
    />
  );
}