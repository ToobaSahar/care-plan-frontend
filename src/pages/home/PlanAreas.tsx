import React, { useId, useMemo, useRef, useState } from 'react';
import type { Evidence } from '../../lib/evidence';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';
import { PLAN_AREAS, RISK_QUESTIONS, levelOfNeed, type PlanArea, type RiskAnswers } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The plan, in the areas and fields the backend validates every draft
   against. The other areas are written for the sample; Risks & Safeguarding
   is written here from the visitor's own answers, so changing the record
   above changes this plan.
   ────────────────────────────────────────────────────────────────────────── */

const RISKS_ID = 'risks';
const NEXT_REVIEW = 'Three months from the date of the plan';

/** The Risks & Safeguarding area, from what the record currently raises. */
function riskArea(answers: RiskAnswers, evidence: Evidence): PlanArea {
  const raised = RISK_QUESTIONS.filter((q) => answers[q.key] === 'yes');

  if (raised.length === 0) {
    return {
      id: RISKS_ID,
      title: 'Risks & Safeguarding',
      need: 'No risks were recorded at the visit.',
      outcomes: 'She stays as safe as she is now.',
      how: 'Risks are looked at again at every call and at the next review.',
      level: 'Low',
    };
  }

  return {
    id: RISKS_ID,
    title: 'Risks & Safeguarding',
    need: `Recorded at the visit: ${raised.map((q) => q.label.toLowerCase()).join(', ')}.`,
    outcomes: 'No avoidable harm from any risk recorded at the visit.',
    how: raised.map((q) => q.action).join(' '),
    level: levelOfNeed(evidence.overall),
  };
}

const LEVEL_TONE: Record<PlanArea['level'], string> = {
  High: 'text-orange-800',
  Medium: 'text-orange-700',
  Low: 'text-oat-700',
};

interface PlanAreasProps {
  answers: RiskAnswers;
  evidence: Evidence;
}

export const PlanAreas: React.FC<PlanAreasProps> = ({ answers, evidence }) => {
  const areas = useMemo(() => {
    const live = riskArea(answers, evidence);
    // The order the plan is written in: Risks sits third, after daily living.
    return [PLAN_AREAS[0], PLAN_AREAS[1], live, ...PLAN_AREAS.slice(2)];
  }, [answers, evidence]);

  const [selected, setSelected] = useState(RISKS_ID);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const area = areas.find((a) => a.id === selected) ?? areas[0];

  // Arrow keys move between tabs, as a tab list should; Tab moves into the panel.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = areas.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? index === last ? 0 : index + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
        ? index === 0 ? last : index - 1
        : e.key === 'Home'
        ? 0
        : e.key === 'End'
        ? last
        : null;
    if (next === null) return;
    e.preventDefault();
    setSelected(areas[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="plan" aria-labelledby="plan-title" className={RULED_SECTION}>
      <Container className={RULED}>
        <div className="max-w-[40rem]">
          <h2 id="plan-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            The same shape, every plan.
          </h2>
          <p className={cn(LEDE, 'mt-6')}>
            Each area of the plan states the need, the outcome to aim for, how to reach it and the level of
            support, so every plan reads the same way at review and at inspection.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div
            role="tablist"
            aria-label="Care plan areas"
            aria-orientation="vertical"
            className="flex flex-wrap gap-2 lg:col-span-4 lg:flex-col lg:flex-nowrap lg:gap-0"
          >
            {areas.map((a, i) => {
              const active = a.id === selected;
              return (
                <button
                  key={a.id}
                  ref={(el) => (tabRefs.current[i] = el)}
                  role="tab"
                  id={`${baseId}-tab-${a.id}`}
                  aria-selected={active}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(a.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    'group flex flex-none items-center justify-between gap-4 rounded-lg px-4 py-3 text-left transition-colors duration-fast ease-out lg:rounded-none lg:border-b lg:border-oat-200 lg:px-1 lg:py-4',
                    active
                      ? 'bg-white text-teal-800 shadow-xs ring-1 ring-oat-200 lg:bg-transparent lg:shadow-none lg:ring-0'
                      : 'text-oat-700 hover:text-teal-800',
                  )}
                >
                  <span className={cn('text-md', active && 'font-semibold')}>
                    {a.title}
                  </span>
                  <span
                    className={cn(
                      'hidden h-2 w-2 flex-none rounded-full transition-colors duration-fast lg:block',
                      active ? 'bg-teal-600' : 'bg-transparent group-hover:bg-oat-300',
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${area.id}`}
            tabIndex={0}
            className="min-w-0 rounded-xl border border-oat-200 bg-white shadow-sheet lg:col-span-8"
          >
            {/* Keyed by area so the content settles in on every change. */}
            <div key={`${area.id}:${area.need}`} className="cfh-arrive grid gap-8 p-6 sm:p-9 md:grid-cols-[minmax(0,1fr)_14rem]">
              <div>
                <h3 className="text-2xl font-semibold text-teal-800">{area.title}</h3>
                {area.id === RISKS_ID && (
                  <p className="mt-1 text-sm text-teal-700">Written from your answers in the record above.</p>
                )}
                <dl className="mt-6 flex max-w-prose flex-col gap-5">
                  {[
                    ['Identified need', area.need],
                    ['Planned outcomes', area.outcomes],
                    ['How to achieve outcomes', area.how],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-sm font-medium text-oat-500">{label}</dt>
                      <dd className="mt-1 text-md leading-relaxed text-oat-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <dl className="flex flex-col gap-4 self-start rounded-xl bg-oat-100 p-5">
                <div>
                  <dt className="text-sm font-medium text-oat-500">Level of need</dt>
                  <dd className={cn('mt-1 text-lg font-semibold', LEVEL_TONE[area.level])}>{area.level}</dd>
                </div>
                <div className="border-t border-oat-200 pt-4">
                  <dt className="text-sm font-medium text-oat-500">Next review</dt>
                  <dd className="mt-1 text-base font-medium text-oat-900">{NEXT_REVIEW}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
