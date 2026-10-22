import React from 'react';
import { ArrowLeft, Check, Minus } from 'lucide-react';
import { Button, Logo, Progress, Tooltip } from '../ui';
import { cn } from '../../lib/cn';

export interface SectionRailProps {
  titles: readonly string[];
  /** 1-indexed, matching the assessment store. */
  current: number;
  completed: boolean[];
  onSelect: (sectionNumber: number) => void;
  /** Leaves the record for the service users list. */
  onBack?: () => void;
  /**
   * The icon strip: section marks without titles, each title given on hover
   * and keyboard focus. Every section stays one tap away while the fields and
   * evidence take the width.
   */
  collapsed?: boolean;
  id?: string;
}

type MarkState = 'resting' | 'current' | 'done' | 'done-current' | 'skipped';

const MARK_TONE: Record<MarkState, string> = {
  resting: 'border-teal-300 text-teal-700',
  current: 'border-white/80 text-white',
  done: 'border-teal-500 bg-teal-500 text-white',
  'done-current': 'border-white bg-white text-teal-700',
  skipped: 'border-oat-400 text-oat-500',
};

const SectionMark: React.FC<{ n: number; state: MarkState }> = ({ n, state }) => (
  <span className={cn('cf-mark', MARK_TONE[state])}>
    {state === 'done' || state === 'done-current' ? (
      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
    ) : state === 'skipped' ? (
      <Minus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
    ) : (
      n
    )}
  </span>
);

function markState(isDone: boolean, isCurrent: boolean, isSkipped: boolean): MarkState {
  if (isDone) return isCurrent ? 'done-current' : 'done';
  if (isCurrent) return 'current';
  return isSkipped ? 'skipped' : 'resting';
}

const ROW_CURRENT = 'bg-teal-600 font-semibold text-white shadow-[0_1px_2px_rgb(31_74_76/0.25)]';
// The rail is on the off-white ground, so a resting row lifts to white on hover.
const ROW_RESTING = 'text-oat-700 hover:bg-white hover:text-teal-800';

/**
 * The assessment's left rail.
 *
 * Section state is a printed mark on a hairline, not a filled pill: hairline
 * at rest, filled when done, struck when skipped. The rail shares the page's
 * oat ground; its host (RailFrame when docked, RailDrawer otherwise) draws the
 * edge and carries the collapse handle. The brand arrives as state — the
 * Deep Sea current row, teal marks, and the Slate Teal progress card.
 */
export const SectionRail: React.FC<SectionRailProps> = ({
  titles,
  current,
  completed,
  onSelect,
  onBack,
  collapsed = false,
  id,
}) => {
  const done = completed.filter(Boolean).length;
  const total = titles.length;

  const sections = titles.map((title, i) => {
    const n = i + 1;
    const isCurrent = n === current;
    const isDone = Boolean(completed[i]);
    // Skipped: an earlier section left empty while work has moved past it.
    const isSkipped = !isDone && n < current;
    return { title, n, isCurrent, state: markState(isDone, isCurrent, isSkipped) };
  });

  if (collapsed) {
    return (
      <nav
        id={id}
        aria-label="Assessment sections"
        className="cf-rail flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden bg-oat-100 py-5"
      >
        <div className="pb-4 pt-1">
          <Logo variant="mark" size="md" />
        </div>

        <div className="mb-3 h-px w-8 flex-none bg-oat-200" aria-hidden="true" />

        <ul className="flex flex-col items-center gap-1">
          {sections.map(({ title, n, isCurrent, state }) => (
            <li key={title}>
              <Tooltip label={title}>
                <button
                  type="button"
                  onClick={() => onSelect(n)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${n}. ${title}`}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-lg transition-colors duration-fast ease-out',
                    isCurrent ? ROW_CURRENT : ROW_RESTING,
                  )}
                >
                  <SectionMark n={n} state={state} />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col items-center gap-3 pt-6">
          <Tooltip label={`${done} of ${total} sections started`}>
            <div className="w-11 rounded-xl bg-teal-800 px-1.5 py-2.5 text-center shadow-sm">
              <p className="text-xs font-semibold leading-none tabular-nums text-white">
                <span className="sr-only">Sections started: </span>
                {done}
                <span className="text-2xs font-normal text-teal-300">/{total}</span>
              </p>
              <Progress value={done} max={total} onDark className="mt-2" />
            </div>
          </Tooltip>

          {onBack && (
            <Tooltip label="Back to service users">
              <Button
                variant="secondary"
                icon={<ArrowLeft />}
                aria-label="Back to service users"
                onClick={onBack}
              />
            </Tooltip>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav
      id={id}
      aria-label="Assessment sections"
      className="cf-rail flex h-full w-full flex-col overflow-y-auto bg-oat-100 py-5"
    >
      <div className="px-6 pb-7 pt-1">
        <Logo size="md" />
      </div>

      <p className="px-6 pb-2.5 text-2xs font-semibold uppercase text-teal-700">Assessment</p>

      <ul className="flex flex-col gap-0.5 px-3">
        {sections.map(({ title, n, isCurrent, state }) => (
          <li key={title}>
            <button
              type="button"
              onClick={() => onSelect(n)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-base leading-5',
                'transition-colors duration-fast ease-out',
                isCurrent ? ROW_CURRENT : ROW_RESTING,
              )}
            >
              <SectionMark n={n} state={state} />
              <span className="min-w-0 py-px">{title}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mx-3 mt-auto rounded-xl bg-teal-800 px-3.5 py-3.5 shadow-sm">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs text-teal-100/85">Sections started</p>
          <p className="text-xs font-semibold tabular-nums text-white">
            {done}
            <span className="font-normal text-teal-300"> / {total}</span>
          </p>
        </div>
        <Progress value={done} max={total} onDark className="mt-2.5" />
      </div>

      {onBack && (
        <div className="mt-3 px-3">
          <Button variant="secondary" size="sm" fullWidth icon={<ArrowLeft />} onClick={onBack}>
            Back to service users
          </Button>
        </div>
      )}
    </nav>
  );
};
