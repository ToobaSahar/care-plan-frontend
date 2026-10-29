import React, { useCallback, useRef } from 'react';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, START_LABEL, goToSection, sectionHeadingProps, useStartAssessment } from './layout';
import { useScrollProgress } from './motion';

/* ──────────────────────────────────────────────────────────────────────────
   The plan: three steps a manager can hold in their head, in the order the
   product actually runs them. Each links to the part of the page that shows
   it working.

   The track between the steps fills with the scroll. It is drawn complete by
   default (the CSS variable defaults to 1), so with reduced motion, or before
   any script runs, the whole sequence is simply there.
   ────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    title: 'Assess and sign',
    detail:
      'A guided assessment on a tablet, saved as it goes, and signed by the assessor and the person before anything is planned.',
    link: { id: 'visit', label: 'See the assessment' },
  },
  {
    title: 'Three readers draft',
    detail:
      'AI agents analyse the record, write the care plan and review it against set criteria, in the same order every time.',
    link: { id: 'readers', label: 'Watch the readers' },
  },
  {
    title: 'Share the plan and pack',
    detail:
      'A care plan in the same shape for every person, and an Emergency Admission Pack ready to print.',
    link: { id: 'plan', label: 'See a plan' },
  },
] as const;

interface HowItWorksProps {
  reducedMotion: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ reducedMotion }) => {
  const startAssessment = useStartAssessment();
  const listRef = useRef<HTMLOListElement>(null);

  // Writes straight to the DOM: the fill is a custom property and each step's
  // mark an attribute, so scrolling never re-renders React.
  const onProgress = useCallback((p: number) => {
    const list = listRef.current;
    if (!list) return;
    list.style.setProperty('--how', p.toFixed(4));
    list.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
      // Marks sit a column apart along the track, so step i is reached at i/3.
      step.dataset.reached = String(p >= Number(step.dataset.step) / STEPS.length);
    });
  }, []);

  useScrollProgress(listRef, onProgress, { mode: 'pass', enabled: !reducedMotion });

  return (
    <section id="how" aria-labelledby="how-title" className={RULED_SECTION}>
      <Container className={RULED}>
        <div className="max-w-[40rem]">
          <h2 id="how-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            From visit to plan, in three steps.
          </h2>
          <p className={cn(LEDE, 'mt-6')}>
            The assessment is captured once, at the visit. Everything after it is drafted, checked and laid
            out for your team.
          </p>
        </div>

        <ol ref={listRef} className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {/* The track: a hairline at rest, filling in teal as the steps are read. */}
          <span className="absolute left-[11px] right-0 top-3 hidden h-px bg-oat-300 md:block" aria-hidden="true">
            <span className="cfh-how-fill absolute inset-0 bg-teal-500" />
          </span>

          {STEPS.map((step, i) => (
            <li key={step.title} className="cfh-step relative" data-step={i}>
              {/* The rail's own marks: a hairline ring until reached, then filled with a check. */}
              <span
                className="cfh-step-mark relative z-[1] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-teal-500 ring-4 ring-oat-100"
                aria-hidden="true"
              >
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-white">
                  <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="mt-6 text-2xl font-semibold leading-tight text-teal-900">{step.title}</h3>
              <p className="mt-3 max-w-[24rem] text-md leading-relaxed text-oat-800">{step.detail}</p>
              <a
                href={`#${step.link.id}`}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  goToSection(step.link.id, reducedMotion);
                }}
                className="mt-4 inline-block rounded-sm text-md font-medium text-teal-700 underline decoration-teal-300 underline-offset-[5px] transition-colors duration-fast hover:text-teal-900 hover:decoration-teal-600"
              >
                {step.link.label}
              </a>
            </li>
          ))}
        </ol>

        <div className="mt-16 flex flex-wrap items-center gap-3">
          <Button size="lg" className="cfh-press" onClick={startAssessment}>
            {START_LABEL}
          </Button>
          <Button size="lg" variant="secondary" className="cfh-press" onClick={() => goToSection('record', reducedMotion)}>
            Try a sample record
          </Button>
        </div>
      </Container>
    </section>
  );
};
