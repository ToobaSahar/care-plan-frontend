import React, { useCallback, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2_BASE, SECTION_Y, sectionHeadingProps } from './layout';
import { useMediaQueryMatch, useScrollProgress } from './motion';
import { PERSON, READERS, READ_ROWS, type Reader } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The signature: one record, read three times, in the order the backend
   runs its agents. Analyse, plan, review is fixed in code, so the stage holds
   it fixed too; the visitor scrolls, the reading line moves.

   On a large screen the section pins and the scroll scrubs the reading. On a
   phone, a short screen, or with reduced motion, the same content is set out
   in full, with every reader's work finished, because a pinned stage there
   costs more than it shows.
   ────────────────────────────────────────────────────────────────────────── */

const ROWS = READ_ROWS.length;
const CHANNELS = ['var(--read-a)', 'var(--read-p)', 'var(--read-r)'] as const;
const STEP_NAMES = ['Analyse', 'Plan', 'Review'] as const;

const REVIEW_SUMMARY = 'Approved. Every risk recorded at the visit has a plan, and each plan can be measured.';

const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

/** Where the reading is. `rowsRead` counts rows the current reader has passed. */
interface Position {
  stage: number;
  rowsRead: number;
  complete: boolean;
}

const FINISHED: Position = { stage: 2, rowsRead: ROWS, complete: true };

/** How many rows reader `k` has initialled at this position. */
function initialled(k: number, pos: Position): number {
  if (pos.complete || k < pos.stage) return ROWS;
  return k === pos.stage ? pos.rowsRead : 0;
}

const Heading: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div className={cn('grid gap-x-12 gap-y-5 lg:grid-cols-12 lg:items-end', compact && 'lg:gap-y-3')}>
    <h2 id="readers-title" className={cn(DISPLAY_H2_BASE, 'text-white lg:col-span-6')} {...sectionHeadingProps}>
      Analyse. Plan. Review.
    </h2>
    <p className="max-w-[34rem] text-lg leading-[1.6] text-teal-100 lg:col-span-5 lg:col-start-8">
      The three agents run in a fixed order, set in code rather than left to a model to decide, so every
      plan takes the same path and can be audited the same way.
    </p>
  </div>
);

/** The condensed record being read. Rows carry three initials in the margin. */
const Sheet: React.FC<{ pos: Position; band?: boolean }> = ({ pos, band }) => (
  <div className="rounded-xl border border-white/10 bg-white p-5 text-oat-900 shadow-xl sm:p-6" data-ui>
    <div className="flex items-center justify-between gap-4 border-b border-oat-200 pb-4">
      <div>
        <p className="text-lg font-semibold text-teal-900">{PERSON.name}</p>
        <p className="text-xs text-oat-500">Sample record, condensed</p>
      </div>
      <div className="flex gap-3 text-2xs font-semibold uppercase text-oat-500" aria-hidden="true">
        {STEP_NAMES.map((name, k) => (
          <span key={name} className="flex items-center gap-1.5">
            <span className="cfh-dot !animate-none" style={vars({ '--c': CHANNELS[k] })} />
            {name.slice(0, 1)}
          </span>
        ))}
      </div>
    </div>

    <div className="relative mt-2">
      {band && (
        <div className="cfh-stage-track" aria-hidden="true">
          <span className="cfh-stage-band" style={vars({ '--c': CHANNELS[pos.stage] })} />
        </div>
      )}
      <ol className="relative">
        {READ_ROWS.map((row, i) => (
          <li key={row.label} className="flex items-center gap-4 border-b border-oat-100 py-3 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-oat-500">
                <span className="font-medium text-oat-800">{row.label}</span> · {row.section}
              </p>
              <p className="mt-0.5 text-md text-oat-900">{row.value}</p>
            </div>
            <span className="flex flex-none gap-1.5" aria-hidden="true">
              {CHANNELS.map((channel, k) => (
                <span
                  key={channel}
                  className="h-2.5 w-2.5 rounded-full transition-[background-color,box-shadow,transform] duration-slow ease-out"
                  style={
                    i < initialled(k, pos)
                      ? { background: `rgb(${channel})`, boxShadow: `inset 0 0 0 1px rgb(${channel})` }
                      : { background: 'transparent', boxShadow: 'inset 0 0 0 1px #D4CCBD', transform: 'scale(0.7)' }
                  }
                />
              ))}
            </span>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/** One reader's job and what it produced. */
const ReaderPanel: React.FC<{ reader: Reader; k: number; pos: Position; stacked?: boolean }> = ({
  reader,
  k,
  pos,
  stacked,
}) => {
  const read = initialled(k, pos);
  const isReviewer = reader.id === 'reviewer';

  return (
    <div>
      <h3 className="flex items-center gap-3 text-2xl font-[650] leading-tight tracking-[-0.025em] text-white">
        <span
          className="h-3 w-3 flex-none rounded-[4px] ring-1 ring-white/60"
          style={{ background: `rgb(${CHANNELS[k]})` }}
          aria-hidden="true"
        />
        {reader.name}
      </h3>
      <p className="mt-3 max-w-[30rem] text-md leading-relaxed text-teal-100">{reader.job}</p>

      <p className="mt-6 text-sm font-semibold text-teal-200">{reader.outputTitle}</p>
      <ul className={cn('mt-3 flex flex-col', isReviewer ? 'gap-2' : 'gap-2.5')}>
        {reader.outputs.map((out) => {
          const on = stacked || out.row < read;
          return (
            <li
              key={out.text}
              className={cn(
                'cfh-out flex items-start gap-2.5 text-lg leading-snug text-white',
                !isReviewer && 'border-l border-white/20 pl-3.5',
              )}
              data-on={on}
            >
              {isReviewer && (
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] flex-none text-teal-300" aria-hidden="true" />
              )}
              {out.text}
            </li>
          );
        })}
      </ul>

      {isReviewer && (
        <div className="cfh-out mt-6" data-on={stacked || pos.complete}>
          <Badge tone="success" icon={<CheckCircle2 />}>
            Approved
          </Badge>
          <p className="mt-2.5 max-w-[30rem] text-base leading-relaxed text-teal-100">{REVIEW_SUMMARY}</p>
        </div>
      )}
    </div>
  );
};

/** Large screens: the section pins and the scroll scrubs the reading. */
const PinnedStage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Position>({ stage: 0, rowsRead: 0, complete: false });

  const onProgress = useCallback((p: number) => {
    // A short lead-in and hold at each end, so the first row and the verdict are both seen.
    const e = Math.min(1, Math.max(0, (p - 0.04) / 0.88));
    const scaled = e * 3;
    const stage = Math.min(2, Math.floor(scaled));
    const local = Math.min(1, scaled - stage);

    stageRef.current?.style.setProperty('--band', local.toFixed(4));

    const rowsRead = Math.min(ROWS, Math.floor(local * ROWS + 0.4));
    const complete = e >= 0.999;
    setPos((prev) =>
      prev.stage === stage && prev.rowsRead === rowsRead && prev.complete === complete
        ? prev
        : { stage, rowsRead, complete },
    );
  }, []);

  useScrollProgress(sectionRef, onProgress, { mode: 'pinned' });

  return (
    <section
      ref={sectionRef}
      id="readers"
      aria-labelledby="readers-title"
      className="relative bg-teal-800"
      // About one screen per reader, plus the lead-in and the hold on the verdict.
      style={{ height: '300vh' }}
    >
      <div ref={stageRef} className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden">
        <Container>
          <Heading compact />

          <div className="mt-[clamp(24px,4vh,48px)] grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="min-w-0 lg:col-span-6">
              <Sheet pos={pos} band={!pos.complete} />
            </div>

            <div className="min-w-0 lg:col-span-5 lg:col-start-8">
              {/* Where the reading is: three steps, in their fixed order. */}
              <ol className="grid grid-cols-3 gap-2" aria-label="Reading progress">
                {STEP_NAMES.map((name, k) => {
                  const fill = pos.complete || k < pos.stage ? '1' : k > pos.stage ? '0' : 'var(--band, 0)';
                  return (
                    <li key={name} aria-current={k === pos.stage && !pos.complete ? 'step' : undefined}>
                      <span className="block h-1 overflow-hidden rounded-full bg-white/15">
                        <span
                          className="block h-full origin-left rounded-full bg-white/90"
                          style={{ transform: `scaleX(${fill})` }}
                        />
                      </span>
                      <span
                        className={cn(
                          'mt-2 block text-sm transition-colors duration-slow',
                          k === pos.stage || pos.complete ? 'font-semibold text-white' : 'text-teal-200',
                        )}
                      >
                        {name}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* The three readers share one place and hand over to each other. */}
              <div className="mt-8 grid [&>*]:col-start-1 [&>*]:row-start-1">
                {READERS.map((reader, k) => (
                  <div key={reader.id} className="cfh-swap" data-active={k === pos.stage} aria-hidden={k !== pos.stage}>
                    <ReaderPanel reader={reader} k={k} pos={pos} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

/** Phones, short screens and reduced motion: the finished reading, in full. */
const StaticReaders: React.FC = () => (
  <section id="readers" aria-labelledby="readers-title" className={cn('bg-teal-800', SECTION_Y)}>
    <Container>
      <Heading />
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* The record stays in view beside the readers' work on a wide screen. */}
        <div className="min-w-0 self-start lg:sticky lg:top-24 lg:col-span-6">
          <Sheet pos={FINISHED} />
        </div>
        <ol className="flex min-w-0 flex-col gap-12 lg:col-span-5 lg:col-start-8">
          {READERS.map((reader, k) => (
            <li key={reader.id}>
              <ReaderPanel reader={reader} k={k} pos={FINISHED} stacked />
            </li>
          ))}
        </ol>
      </div>
    </Container>
  </section>
);

export const ThreeReaders: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const roomy = useMediaQueryMatch('(min-width: 1024px) and (min-height: 680px)');
  return roomy && !reducedMotion ? <PinnedStage /> : <StaticReaders />;
};
