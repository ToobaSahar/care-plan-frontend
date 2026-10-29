import React from 'react';
import { Button } from '../../components/ui';
import { cn } from '../../lib/cn';
import {
  Container,
  DISPLAY_H2,
  LEDE,
  RULED,
  RULED_SECTION,
  START_LABEL,
  goToSection,
  sectionHeadingProps,
  useStartAssessment,
} from './layout';
import { PAINS } from './Problem';

/* ──────────────────────────────────────────────────────────────────────────
   The problems the page opened with, resolved: each pain, struck through in
   the rail's own "struck" mark, beside what replaces it.

   Keyed to the same list as the Problem section, so the two cannot drift.
   Every resolution is what the product does, stated without a figure.

   This is the page's decision point: the problems are resolved and the proof
   has been seen, so the action is offered here, not only at the close.
   ────────────────────────────────────────────────────────────────────────── */

const RESOLUTIONS: Record<(typeof PAINS)[number]['id'], { title: string; detail: string }> = {
  twice: {
    title: 'Written once',
    detail: 'The care plan is drafted from the assessment itself, so nobody types the visit up again.',
  },
  author: {
    title: 'One shape for every plan',
    detail: 'Every plan states the need, the outcome, the steps and the level of support, in the same order.',
  },
  slip: {
    title: 'Risks carried into the plan',
    detail:
      'Each risk is raised from the question that recorded it, and the draft is checked for completeness and safety before it is approved.',
  },
  scattered: {
    title: 'Ready before it is needed',
    detail: 'An Emergency Admission Pack is written from the same record, on one printable page.',
  },
};

interface OutcomesProps {
  reducedMotion: boolean;
}

export const Outcomes: React.FC<OutcomesProps> = ({ reducedMotion }) => {
  const startAssessment = useStartAssessment();

  return (
    <section id="outcomes" aria-labelledby="outcomes-title" className={RULED_SECTION}>
      <Container className={RULED}>
        <div className="max-w-[40rem]">
          <h2 id="outcomes-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            What changes for your service.
          </h2>
          <p className={cn(LEDE, 'mt-6')}>
            Your assessors stop writing each visit twice, and your office stops reconciling plans that read
            differently. This is what takes their place.
          </p>
        </div>

        <ul className="mt-14 divide-y divide-oat-200 border-y border-oat-200">
          {PAINS.map((pain, i) => {
            const fix = RESOLUTIONS[pain.id];
            return (
              <li
                key={pain.id}
                className="grid gap-x-12 gap-y-3 py-8 md:grid-cols-12 md:items-baseline"
                data-reveal="strike"
                style={{ '--d': `${i * 120}ms` } as React.CSSProperties}
              >
                {/* What it was: struck through. The words stay readable under the line. */}
                <p className="relative self-start justify-self-start text-xl text-oat-500 md:col-span-4">
                  <span className="sr-only">Before: </span>
                  {pain.title}
                  {/* Positioned without a transform: the strike's own scale is the animated one. */}
                  <span className="cfh-strike absolute inset-x-0 top-[55%] h-[1.5px] bg-oat-500" aria-hidden="true" />
                </p>
                <div className="md:col-span-8">
                  <h3 className="text-2xl font-semibold leading-tight text-teal-900">{fix.title}</h3>
                  <p className="mt-2 max-w-[40rem] text-md leading-relaxed text-oat-800">{fix.detail}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <Button size="lg" className="cfh-press" onClick={startAssessment}>
            {START_LABEL}
          </Button>
          <Button size="lg" variant="secondary" className="cfh-press" onClick={() => goToSection('questions', reducedMotion)}>
            Read the common questions
          </Button>
        </div>
      </Container>
    </section>
  );
};
