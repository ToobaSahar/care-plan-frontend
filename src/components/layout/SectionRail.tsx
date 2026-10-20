import React from 'react';
import { Check, Minus } from 'lucide-react';
import { Logo, Progress } from '../ui';
import { cn } from '../../lib/cn';

export interface SectionRailProps {
  titles: readonly string[];
  /** 1-indexed, matching the assessment store. */
  current: number;
  completed: boolean[];
  onSelect: (sectionNumber: number) => void;
  footer?: React.ReactNode;
}

/**
 * The assessment's left rail.
 *
 * Section state is a printed mark on a hairline, not a filled pill: hairline
 * at rest, filled when done, struck when skipped. The rail is a full-height
 * field of Slate Teal rather than a tinted sidebar — the colour does a job.
 */
export const SectionRail: React.FC<SectionRailProps> = ({
  titles,
  current,
  completed,
  onSelect,
  footer,
}) => {
  const done = completed.filter(Boolean).length;

  return (
    <nav
      aria-label="Assessment sections"
      className="cf-rail flex h-full w-full flex-col overflow-y-auto bg-teal-800 py-5"
    >
      <div className="px-5 pb-6">
        <Logo onDark size="md" />
      </div>

      <p className="px-5 pb-2 text-2xs font-semibold uppercase text-teal-400">Assessment</p>

      <ul className="flex flex-col">
        {titles.map((title, i) => {
          const n = i + 1;
          const isCurrent = n === current;
          const isDone = completed[i];
          // Skipped: an earlier section left empty while work has moved past it.
          const isSkipped = !isDone && n < current;

          return (
            <li key={title}>
              <button
                type="button"
                onClick={() => onSelect(n)}
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 px-5 py-2.5 text-left text-base transition-colors duration-fast ease-out',
                  isCurrent
                    ? 'bg-teal-600 font-semibold text-white shadow-[inset_3px_0_0_#78BDB5]'
                    : 'text-teal-100/80 hover:bg-teal-700/60 hover:text-white',
                )}
              >
                <span
                  className={cn(
                    'cf-mark',
                    isDone
                      ? 'border-teal-400 bg-teal-400 text-teal-900'
                      : isSkipped
                      ? 'border-teal-500 text-teal-400 line-through'
                      : 'border-teal-500/70 text-teal-300',
                  )}
                >
                  {isDone ? (
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  ) : isSkipped ? (
                    <Minus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  ) : (
                    n
                  )}
                </span>
                <span className="min-w-0 truncate">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-teal-600/60 px-5 pt-4">
        <p className="text-xs text-teal-100/80">
          {done} of {titles.length} sections started
        </p>
        <Progress value={done} max={titles.length} onDark className="mt-2" />
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </nav>
  );
};
