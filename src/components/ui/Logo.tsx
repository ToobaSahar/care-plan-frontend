import React from 'react';
import { cn } from '../../lib/cn';

export interface LogoProps {
  /** `mark` is the symbol alone; `lockup` adds the CentiCare wordmark beside it. */
  variant?: 'mark' | 'lockup';
  size?: 'sm' | 'md' | 'lg';
  /** Renders the wordmark light, for the teal rail. */
  onDark?: boolean;
  className?: string;
}

const MARK_SIZE = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

const WORD_SIZE = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

/**
 * The CentiCare mark. Uses the transparent symbol rather than the full lockup
 * PNG, which carries a baked-in white background and would show as a white
 * block on the oat ground.
 */
export const Logo: React.FC<LogoProps> = ({
  variant = 'lockup',
  size = 'md',
  onDark = false,
  className,
}) => (
  <span className={cn('inline-flex items-center gap-2.5', className)}>
    {/* The mark's outer frame is Slate Teal — the same colour as the rail it
        sits on — so a dark-ground variant with a pale frame is used there.
        Both files are transparent; neither carries a background plate. */}
    <img
      src={onDark ? '/brand/centicare-mark-light.png' : '/brand/centicare-mark.png'}
      alt={variant === 'mark' ? 'CentiCare' : ''}
      aria-hidden={variant === 'lockup' ? true : undefined}
      className={cn(MARK_SIZE[size], 'flex-none select-none')}
      draggable={false}
    />
    {variant === 'lockup' && (
      <span
        className={cn(
          'font-semibold tracking-[-0.015em]',
          WORD_SIZE[size],
          onDark ? 'text-white' : 'text-teal-800',
        )}
      >
        CentiCare
      </span>
    )}
  </span>
);
