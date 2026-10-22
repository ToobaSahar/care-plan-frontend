import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RiskBadge, Skeleton } from '../ui';
import type { RiskSignal } from '../../lib/serviceUserSignals';
import { SECTION_COUNT } from '../../lib/serviceUserSignals';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   One person's signals, as the service users list shows them.

   "Still reading" renders a placeholder and "could not be read" renders a
   dash. Neither is ever shown as a zero or as "none", because "nothing
   saved" and "we do not know" are different statements about a record.
   ────────────────────────────────────────────────────────────────────────── */

const Unknown: React.FC = () => <span className="text-sm text-oat-400">—</span>;

/**
 * Sections saved, as ten printed ticks — the rail's own vocabulary at the
 * size of a table cell: hairline at rest, Sea Mist when done.
 */
export const SectionStrip: React.FC<{ saved: number | null | undefined; className?: string }> = ({
  saved,
  className,
}) => {
  if (saved === undefined) return <Skeleton className={cn('h-2 w-[104px]', className)} />;
  if (saved === null) return <Unknown />;

  const complete = saved >= SECTION_COUNT;
  return (
    <span
      role="img"
      aria-label={`${saved} of ${SECTION_COUNT} sections saved`}
      className={cn('inline-flex items-center gap-2', className)}
    >
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: SECTION_COUNT }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-2 w-[7px] rounded-[2px] transition-colors duration-slow ease-out',
              i < saved ? (complete ? 'bg-teal-500' : 'bg-teal-400') : 'bg-oat-200',
            )}
          />
        ))}
      </span>
      <span className="text-xs tabular-nums text-oat-600" aria-hidden="true">
        {saved}/{SECTION_COUNT}
      </span>
    </span>
  );
};

export type SignalStatus = 'loading' | 'ready' | 'unavailable';

/** Highest flagged risk, with what raised it. Low is not shown: it should not shout. */
export const RiskCell: React.FC<{
  status: SignalStatus;
  signal: RiskSignal | undefined;
  compact?: boolean;
}> = ({ status, signal, compact }) => {
  if (status === 'loading') return <Skeleton className="h-6 w-20 rounded-full" />;
  if (status === 'unavailable') return <Unknown />;
  if (!signal) return <span className="text-sm text-oat-500">None flagged</span>;

  const [first, ...rest] = signal.risks;
  const source = rest.length > 0 ? `${first.label} +${rest.length}` : first.label;
  const all = signal.risks.map((r) => r.label).join(', ');

  return compact ? (
    <RiskBadge level={signal.level} prefix={source} />
  ) : (
    <span className="flex min-w-0 flex-col items-start gap-1" title={all}>
      <RiskBadge level={signal.level} />
      <span className="max-w-full truncate text-xs text-oat-500">{source}</span>
    </span>
  );
};

/** Whether a generated care plan is on record. */
export const PlanCell: React.FC<{ status: SignalStatus; ready: boolean }> = ({
  status,
  ready,
}) => {
  if (status === 'loading') return <Skeleton className="h-4 w-14" />;
  if (status === 'unavailable') return <Unknown />;
  return ready ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
      <CheckCircle2 className="h-4 w-4 flex-none" aria-hidden="true" />
      Ready
    </span>
  ) : (
    <span className="text-sm text-oat-500">Not yet</span>
  );
};
