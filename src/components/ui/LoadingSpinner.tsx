// src/components/ui/LoadingSpinner.tsx - Loading Spinner Component

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  color?: 'blue' | 'green' | 'purple' | 'white' | 'gray';
  variant?: 'spin' | 'pulse' | 'bounce';
}

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '',
  color = 'blue',
  variant = 'spin'
}: LoadingSpinnerProps) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className={cn('animate-pulse rounded-full bg-current', sizes[size], colors[color])} />
        {text && (
          <p className={cn('mt-2 font-medium', colors[color], textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex space-x-1">
          <div className={cn('animate-bounce rounded-full bg-current', sizes[size], colors[color])} style={{ animationDelay: '0ms' }} />
          <div className={cn('animate-bounce rounded-full bg-current', sizes[size], colors[color])} style={{ animationDelay: '150ms' }} />
          <div className={cn('animate-bounce rounded-full bg-current', sizes[size], colors[color])} style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <p className={cn('mt-2 font-medium', colors[color], textSizes[size])}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default spin variant
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('animate-spin', sizes[size], colors[color])}>
        <svg fill="none" viewBox="0 0 24 24">
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {text && (
        <p className={cn('mt-2 font-medium', colors[color], textSizes[size])}>
          {text}
        </p>
      )}
    </div>
  );
}

// Specialized loading components
export function AIGeneratingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('text-center', className)}>
      <LoadingSpinner 
        size="xl" 
        color="purple" 
        text="AI Generating Your Spiritual Challenges"
        className="mb-4"
      />
      <p className="text-lg text-purple-600 font-medium">
        Creating fresh biblical content just for you...
      </p>
    </div>
  );
}

export function ChatTypingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-start', className)}>
      <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
        <LoadingSpinner variant="bounce" size="xs" color="gray" />
      </div>
    </div>
  );
}

export function GameLoadingSpinner({ className }: { className?: string }) {
  return (
    <LoadingSpinner 
      size="lg" 
      color="blue" 
      text="Loading your spiritual challenge..."
      className={className}
    />
  );
}

export function FullPageLoader({ 
  message = "Loading...", 
  className 
}: { 
  message?: string; 
  className?: string;
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50',
      className
    )}>
      <LoadingSpinner 
        size="xl" 
        color="blue" 
        text={message}
      />
    </div>
  );
}

// Inline loader for buttons
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <LoadingSpinner 
      size="sm" 
      color="white" 
      className={cn('mr-2', className)}
    />
  );
}