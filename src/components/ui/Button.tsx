import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'onDark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction. Keeps the button's width stable. */
  loading?: boolean;
  /** Rendered before the label at the icon size for this button size. */
  icon?: React.ReactNode;
  /** Rendered after the label. */
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-teal-600 text-white border-transparent hover:bg-teal-700 active:bg-teal-800 shadow-xs',
  secondary:
    'bg-white text-teal-700 border-teal-600 hover:bg-teal-50 active:bg-teal-100',
  ghost:
    'bg-transparent text-oat-700 border-transparent hover:bg-oat-100 active:bg-oat-200',
  danger:
    'bg-red-700 text-white border-transparent hover:bg-red-800 active:bg-red-900 shadow-xs',
  onDark:
    'bg-teal-600 text-white border-transparent hover:bg-teal-500 active:bg-teal-700',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded',
  md: 'h-10 px-4 text-base gap-2 rounded-md',
  lg: 'h-11 px-5 text-base gap-2 rounded-md',
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-[18px] w-[18px]',
};

// lucide renders at 24px by default, which overflows the slot and collides with
// the label. Constrain whatever is passed in to the slot itself.
const ICON_SLOT = 'inline-flex flex-none items-center justify-center [&>svg]:h-full [&>svg]:w-full';

/**
 * The product's only button. Every action across the three surfaces uses this;
 * if a control looks like a button and is not one of these, it is a bug.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center border font-medium whitespace-nowrap',
        'transition-colors duration-fast ease-out',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className={cn(ICON_SIZE[size], 'animate-spin')} aria-hidden="true" />
      ) : (
        icon && (
          <span className={cn(ICON_SIZE[size], ICON_SLOT)} aria-hidden="true">
            {icon}
          </span>
        )
      )}
      {children}
      {iconRight && !loading && (
        <span className={cn(ICON_SIZE[size], ICON_SLOT)} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
});
