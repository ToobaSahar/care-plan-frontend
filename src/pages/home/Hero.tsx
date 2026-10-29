import React, { useEffect, useRef, useState } from 'react';
import { PenLine, RotateCcw } from 'lucide-react';
import { Avatar, Button, RiskBadge } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Container, LEDE, START_LABEL, goToSection, useStartAssessment } from './layout';
import { PERSON } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The first screen. The headline says what a care provider gets; the sheet
   beside it shows how: a sample record, read three times while the visitor
   watches.

   The reading runs on a fixed CSS timeline (see home.css), so it starts on
   first paint and needs no script. Replay remounts the sheet to run it again,
   which is the control a presenter reaches for.
   ────────────────────────────────────────────────────────────────────────── */

interface HeroField {
  label: string;
  value: string;
}

const FIELDS: readonly HeroField[] = [
  { label: 'Risk of falls', value: 'Yes — two falls since March, both at night' },
  { label: 'Choking risk', value: 'No' },
  { label: 'Pressure sores / skin', value: 'Yes — redness on the left heel' },
  { label: 'Personal evacuation plan', value: 'Yes — frame kept by the back door' },
  { label: 'Mental capacity / DoLS', value: 'Has capacity; no DoLS' },
];

/** When each reader's pass starts, in ms from first paint. Mirrors home.css. */
const PASSES = [
  { id: 'a', channel: 'var(--read-a)', start: 1700 },
  { id: 'p', channel: 'var(--read-p)', start: 2950 },
  { id: 'r', channel: 'var(--read-r)', start: 4200 },
] as const;

const NOTES = [
  { reader: 'Analyser', channel: 'var(--read-a)', text: 'Falls at night are the leading risk.', at: 2900 },
  { reader: 'Planner', channel: 'var(--read-p)', text: 'Night check at 02:00; sensor mat by the bed.', at: 4150 },
  { reader: 'Reviewer', channel: 'var(--read-r)', text: 'Checked against every criterion. Approved.', at: 5400 },
] as const;

const VERDICT_AT = 5500;

/** CSS custom properties, typed for React's style prop. */
const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

interface ReadingSheetProps {
  /** Absent under reduced motion: there is nothing to replay. */
  onReplay?: () => void;
  /** After a replay the sheet is a new element; focus returns to its control. */
  focusReplay: boolean;
}

const ReadingSheet: React.FC<ReadingSheetProps> = ({ onReplay, focusReplay }) => {
  const replayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusReplay) replayRef.current?.focus();
  }, [focusReplay]);

  return (
    <div data-ui>
      <div className="min-w-0 rounded-xl border border-oat-200 bg-white p-5 shadow-sheet sm:p-7">
        {/* Whose record: the person header, as the workspace sets it. */}
        <div className="flex items-center gap-3.5 border-b border-oat-200 pb-5">
          <Avatar name={PERSON.name} size="xl" className="ring-4 ring-mulberry-50" />
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold text-teal-900">{PERSON.name}</p>
            <p className="text-xs text-oat-500">
              Sample record · NHS {PERSON.nhs} · {PERSON.age} years
            </p>
          </div>
          <span className="cfh-settle hidden sm:inline-flex" style={vars({ '--d': `${VERDICT_AT}ms` })}>
            <RiskBadge level="high" prefix="Risk" />
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          {/* A depiction of the product, so its section title is not a heading of this page. */}
          <p className="text-2xl font-semibold text-teal-800">Risks &amp; Safeguarding</p>
          <div className="flex flex-none items-center gap-2">
            <span
              className="cfh-settle inline-flex items-center gap-1.5 text-xs font-medium text-teal-700"
              style={vars({ '--d': `${VERDICT_AT}ms` })}
            >
              <svg viewBox="0 0 16 16" className="cfh-tick h-4 w-4" aria-hidden="true" style={vars({ '--d': `${VERDICT_AT + 120}ms` })}>
                <path
                  d="M3 8.5l3.2 3L13 4.5"
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Read three times
            </span>
            {onReplay && (
              <Button
                ref={replayRef}
                variant="ghost"
                size="sm"
                icon={<RotateCcw />}
                onClick={onReplay}
                aria-label="Replay the three readers"
                title="Replay"
              />
            )}
          </div>
        </div>

        {/* The fields, with the reading passes running over them. */}
        <div className="relative mt-4">
          <div className="cfh-track" aria-hidden="true">
            {PASSES.map((pass) => (
              <span key={pass.id} className="cfh-band" style={vars({ '--c': pass.channel, '--start': `${pass.start}ms` })} />
            ))}
          </div>

          <dl className="relative flex flex-col gap-3.5">
            {FIELDS.map((field, i) => (
              <div key={field.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                <div className="min-w-0">
                  <dt className="text-sm font-medium text-oat-800">{field.label}</dt>
                  <dd
                    className={cn(
                      'mt-1.5 rounded-md border border-oat-300 bg-white px-3.5 py-2.5 text-md text-oat-900',
                      i === 0 && 'cfh-typing',
                    )}
                  >
                    {i === 0 ? (
                      <span className="cfh-type inline-block" style={vars({ '--chars': field.value.length })}>
                        {field.value}
                      </span>
                    ) : (
                      field.value
                    )}
                  </dd>
                </div>
                {/* Each reader initials the margin as its pass crosses the row. */}
                <span className="mb-4 flex gap-1" aria-hidden="true">
                  {PASSES.map((pass) => (
                    <span key={pass.id} className="cfh-dot" style={vars({ '--c': pass.channel, '--start': `${pass.start}ms`, '--i': i })} />
                  ))}
                </span>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* What each reader left. Each slot is there from the start, so nothing
          appears from empty space; its note lands when that reader finishes. */}
      <ul className="mt-5 grid gap-x-6 gap-y-4 px-1 sm:grid-cols-3">
        {NOTES.map((note) => (
          <li key={note.reader}>
            <span className="block h-[3px] w-7 rounded-full" style={{ background: `rgb(${note.channel})` }} aria-hidden="true" />
            <p className="mt-2.5 text-sm font-semibold text-teal-800">{note.reader}</p>
            <div className="relative mt-1">
              <p className="cfh-settle text-base text-oat-800" style={vars({ '--d': `${note.at}ms` })}>
                {note.text}
              </p>
              <p className="cfh-slot absolute inset-0 text-base italic text-oat-500" style={vars({ '--d': `${note.at}ms` })} aria-hidden="true">
                Reading the record…
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface HeroProps {
  reducedMotion: boolean;
}

export const Hero: React.FC<HeroProps> = ({ reducedMotion }) => {
  const startAssessment = useStartAssessment();
  // Bumping the key remounts the sheet, which restarts its CSS timeline.
  const [run, setRun] = useState(0);

  return (
    <section id="top" aria-labelledby="home-title" className="relative overflow-x-clip pb-[clamp(72px,8vw,120px)] pt-[clamp(40px,6vw,88px)]">
      <Container className="grid items-start gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center">
        <div className="min-w-0 lg:col-span-6 lg:pb-16">
          <h1
            id="home-title"
            className="text-[clamp(2.75rem,5.2vw,5.375rem)] font-[650] leading-[0.98] tracking-[-0.04em] text-teal-800 lg:[&_.cfh-line>span]:whitespace-nowrap"
          >
            <span className="cfh-line">
              <span style={vars({ '--i': 0 })}>Less writing.</span>
            </span>
            <span className="cfh-line">
              <span style={vars({ '--i': 1 })}>Safer care plans.</span>
            </span>
          </h1>

          <p className={cn(LEDE, 'cfh-load mt-7 max-w-[32rem]')} style={vars({ '--d': '420ms' })}>
            CareFrame turns one home assessment into a care plan that three AI agents analyse, write and
            check, so your assessors spend the visit with the person, not the paperwork.
          </p>

          <div id="hero-actions" className="cfh-load mt-9 flex flex-wrap items-center gap-3" style={vars({ '--d': '500ms' })}>
            <Button size="lg" className="cfh-press" onClick={startAssessment}>
              {START_LABEL}
            </Button>
            <Button size="lg" variant="secondary" className="cfh-press" onClick={() => goToSection('how', reducedMotion)}>
              See how it works
            </Button>
          </div>

          <p className="cfh-load mt-6 flex items-center gap-2 text-sm text-oat-700" style={vars({ '--d': '580ms' })}>
            <PenLine className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
            Signed by the assessor and the person before anything is planned.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-6">
          <ReadingSheet key={run} onReplay={reducedMotion ? undefined : () => setRun((n) => n + 1)} focusReplay={run > 0} />
        </div>
      </Container>
    </section>
  );
};
