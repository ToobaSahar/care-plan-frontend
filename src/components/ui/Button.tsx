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
  // A neutral edge that commits to teal only on hover: a list of twelve rows
  // each carrying a teal outline reads as twelve calls to action.
  secondary:
    'bg-white text-teal-700 border-oat-300 shadow-xs hover:border-teal-600 hover:bg-teal-50 active:bg-teal-100',
  ghost:
    'bg-transparent text-oat-700 border-transparent hover:bg-oat-100 hover:text-oat-900 active:bg-oat-200',
  danger:
    'bg-red-700 text-white border-transparent hover:bg-red-800 active:bg-red-900 shadow-xs',
  onDark:
    'bg-teal-600 text-white border-transparent hover:bg-teal-500 active:bg-teal-700',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 text-xs gap-1.5 rounded',
  md: 'h-10 text-base gap-2 rounded-md',
  lg: 'h-11 text-base gap-2 rounded-md',
};

// A labelled button is padded; an icon-only one is square at the same height.
const INSET: Record<ButtonSize, string> = {
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
};

const SQUARE: Record<ButtonSize, string> = {
  sm: 'w-8',
  md: 'w-10',
  lg: 'w-11',
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
 *
 * Passing an `icon` and no children renders it square. An icon-only button has
 * no visible name, so it must be given an `aria-label`.
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
  const iconOnly = Boolean(icon) && React.Children.toArray(children).length === 0;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center border font-medium whitespace-nowrap select-none',
        'transition-[color,background-color,border-color,box-shadow] duration-fast ease-out',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        iconOnly ? SQUARE[size] : INSET[size],
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
