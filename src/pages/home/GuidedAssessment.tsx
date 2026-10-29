import React, { useCallback, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { SECTION_TITLES } from '../../lib/evidence';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';
import { useScrollProgress } from './motion';

/* ──────────────────────────────────────────────────────────────────────────
   Step one, shown: the assessment as the rail an assessor works down.

   The marks fill as the section scrolls past, hairline ring to filled check,
   which is the product's own state vocabulary run at the speed of reading.
   The titles come from the same list the workspace rail renders, so the page
   never states a count that the product could outgrow.
   ────────────────────────────────────────────────────────────────────────── */

const TOTAL = SECTION_TITLES.length;

/** Reduced motion shows an assessment part-way through, so every mark state is seen. */
const AT_REST = Math.ceil(TOTAL * 0.6);

const BENEFITS = [
  {
    title: 'Nothing lost if a visit is cut short',
    detail: 'Each section is saved as the assessor moves on, so an interrupted visit keeps everything recorded so far.',
  },
  {
    title: 'Made for a kitchen table',
    detail: 'Large controls, readable in daylight or lamplight, with NHS numbers, dates and phone numbers lined up in columns.',
  },
  {
    title: 'Checked as it is typed',
    detail: 'NHS numbers are checked against their check digit as they are entered, so a mistyped number is caught at the visit.',
  },
] as const;

interface GuidedAssessmentProps {
  reducedMotion: boolean;
}

export const GuidedAssessment: React.FC<GuidedAssessmentProps> = ({ reducedMotion }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [done, setDone] = useState(reducedMotion ? AT_REST : 0);

  const onProgress = useCallback((p: number) => {
    // Finish a little before the section leaves, so the last mark is seen.
    const next = Math.min(TOTAL, Math.floor(p * 1.15 * TOTAL));
    setDone((prev) => (prev === next ? prev : next));
  }, []);

  useScrollProgress(sectionRef, onProgress, { mode: 'pass', enabled: !reducedMotion });

  const shown = reducedMotion ? AT_REST : done;
  const percent = Math.round((shown / TOTAL) * 100);

  return (
    <section ref={sectionRef} id="visit" aria-labelledby="visit-title" className={RULED_SECTION}>
      <Container className={cn(RULED, 'grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center')}>
        {/* On a phone the heading leads and the rail follows it. */}
        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <h2 id="visit-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            Guided from start to finish.
          </h2>
          <p className={cn(LEDE, 'mt-6 max-w-[36rem]')}>
            The assessment follows the person through every part of life that care touches, from health and
            daily living to risks, home and what matters to them.
          </p>

          <ul className="mt-10 divide-y divide-oat-200 border-y border-oat-200">
            {BENEFITS.map((benefit) => (
              <li key={benefit.title} className="py-6">
                <h3 className="text-lg font-semibold text-teal-800">{benefit.title}</h3>
                <p className="mt-1.5 max-w-[36rem] text-md leading-relaxed text-oat-800">{benefit.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* The rail, as the workspace draws it: Sea Mist tint, inset rows. */}
        <div className="min-w-0 lg:order-first lg:col-span-5 lg:col-start-1 lg:row-start-1" data-ui>
          <div className="rounded-xl bg-teal-100 p-3 ring-1 ring-teal-200 sm:p-4">
            <p className="px-3 pb-3 pt-2 text-2xs font-semibold uppercase text-teal-700">Assessment</p>
            <ol className="flex flex-col gap-0.5">
              {SECTION_TITLES.map((title, i) => {
                const isDone = i < shown;
                const isCurrent = i === shown && shown < TOTAL;
                return (
                  <li
                    key={title}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-colors duration-slow ease-out',
                      isCurrent ? 'bg-teal-600 font-semibold text-white shadow-[0_1px_2px_rgb(31_74_76/0.25)]' : 'text-teal-900/85',
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    <span
                      className={cn(
                        'cfh-mark inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border',
                        isDone && 'border-teal-500 bg-teal-500 text-white',
                        isCurrent && 'border-white/80',
                        !isDone && !isCurrent && 'border-teal-300',
                      )}
                      data-done={isDone}
                      aria-hidden="true"
                    >
                      {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
                      {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                    <span>{title}</span>
                    <span className="sr-only">{isDone ? ', complete' : isCurrent ? ', in progress' : ''}</span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 rounded-xl bg-white/70 p-4 ring-1 ring-teal-200">
              <p className="text-sm text-teal-800">Assessment progress</p>
              <div
                className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white ring-1 ring-inset ring-teal-200"
                role="progressbar"
                aria-label="Assessment progress"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full rounded-full bg-teal-500 transition-[width] duration-slow ease-out" style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
