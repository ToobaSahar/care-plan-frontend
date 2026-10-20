import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

/* ── Card ────────────────────────────────────────────────────────────────── */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flush removes padding so the card can hold a table or list to its edges. */
  flush?: boolean;
}

export const Card: React.FC<CardProps> = ({ flush, className, children, ...rest }) => (
  <div
    className={cn(
      'rounded-xl border border-oat-200 bg-white shadow-xs',
      !flush && 'p-6',
      className,
    )}
    {...rest}
  >
    {children}
  </div>
);

/** A titled group of fields inside a section. Icon is optional and decorative. */
export const CardHeading: React.FC<{
  icon?: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}> = ({ icon, children, description }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2.5">
      {icon && (
        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-teal-50 text-teal-700 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      )}
      <h3 className="text-lg font-semibold text-teal-800">{children}</h3>
    </div>
    {description && <p className="mt-1.5 text-base text-oat-600">{description}</p>}
  </div>
);

/* ── Alert ───────────────────────────────────────────────────────────────── */

export type AlertTone = 'info' | 'success' | 'warning' | 'error' | 'working';

const ALERT: Record<AlertTone, { cls: string; Icon: React.ElementType; spin?: boolean }> = {
  info: { cls: 'border-blue-200 bg-blue-50 text-blue-900', Icon: Info },
  success: { cls: 'border-green-200 bg-green-50 text-green-900', Icon: CheckCircle2 },
  warning: { cls: 'border-orange-200 bg-orange-50 text-orange-900', Icon: AlertTriangle },
  error: { cls: 'border-red-200 bg-red-50 text-red-900', Icon: XCircle },
  working: { cls: 'border-teal-200 bg-teal-50 text-teal-900', Icon: Loader2, spin: true },
};

export const Alert: React.FC<{
  tone?: AlertTone;
  title: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ tone = 'info', title, children, className }) => {
  const { cls, Icon, spin } = ALERT[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg border px-4 py-3.5', cls, className)}
    >
      <Icon className={cn('mt-0.5 h-[18px] w-[18px] flex-none', spin && 'animate-spin')} aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-base font-semibold">{title}</p>
        {children && <div className="mt-1 text-base opacity-90">{children}</div>}
      </div>
    </div>
  );
};

/* ── Progress ────────────────────────────────────────────────────────────── */

export const Progress: React.FC<{
  value: number;
  max?: number;
  /** Renders light-on-dark, for use inside the teal rail. */
  onDark?: boolean;
  className?: string;
}> = ({ value, max = 100, onDark, className }) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'h-1.5 w-full overflow-hidden rounded-full',
        onDark ? 'bg-teal-950' : 'bg-oat-200',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-teal-400 transition-[width] duration-slow ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ── Avatar ──────────────────────────────────────────────────────────────── */

/** Mulberry by rule: this is a person, and people are the only thing that colour marks. */
export const Avatar: React.FC<{ name?: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  name,
  size = 'md',
  className,
}) => {
  const initials = (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const sizes = {
    sm: 'h-7 w-7 text-2xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex flex-none items-center justify-center rounded-full bg-mulberry-600 font-semibold text-white',
        sizes[size],
        className,
      )}
    >
      {initials || '—'}
    </span>
  );
};

/* ── Loading and empty ───────────────────────────────────────────────────── */

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse-soft rounded-md bg-oat-200', className)} />
);

/** Skeleton rows, not a spinner in the middle of content. */
export const SkeletonRows: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className,
}) => (
  <div className={cn('flex flex-col gap-2.5', className)} aria-hidden="true">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-xl" />
    ))}
  </div>
);

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
    {icon && (
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </span>
    )}
    <h3 className="text-lg font-semibold text-oat-900">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-base text-oat-600">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
