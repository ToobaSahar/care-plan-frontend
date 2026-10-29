import React from 'react';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';

/* ──────────────────────────────────────────────────────────────────────────
   The problem, in a care provider manager's terms, before any solution.

   The four pains are the ones the product's design answers, and they return
   resolved further down the page (see Outcomes), so a reader sees their own
   week described, then sees it change. Kept to what any manager would
   recognise; nothing here is a statistic.
   ────────────────────────────────────────────────────────────────────────── */

export const PAINS = [
  {
    id: 'twice',
    title: 'Written twice',
    detail: 'Notes taken at the visit are typed up again as a care plan, often after the working day has ended.',
  },
  {
    id: 'author',
    title: 'Different by author',
    detail: 'Two assessors write two kinds of plan, so reviewing them, and comparing them, takes longer than it should.',
  },
  {
    id: 'slip',
    title: 'Risks that slip',
    detail: 'A risk recorded at the visit does not always reach the plan that carers follow.',
  },
  {
    id: 'scattered',
    title: 'Scattered in an emergency',
    detail: 'When someone is admitted to hospital, the facts a crew needs are spread across the file.',
  },
] as const;

export const Problem: React.FC = () => (
  <section id="problem" aria-labelledby="problem-title" className={RULED_SECTION}>
    <Container className={cn(RULED, 'grid gap-x-12 gap-y-12 lg:grid-cols-12')}>
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2 id="problem-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            Visits end. Plans pile up.
          </h2>
          <p className={cn(LEDE, 'mt-6 max-w-[30rem]')}>
            An assessment is only as good as the plan it becomes. Between the living room and the office,
            too much of it is retyped, reworded or lost.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-oat-200 border-y border-oat-200 lg:col-span-7">
        {PAINS.map((pain) => (
          <li key={pain.id} className="grid gap-2 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8">
            <h3 className="text-2xl font-semibold leading-tight text-teal-900">{pain.title}</h3>
            <p className="text-md leading-relaxed text-oat-800">{pain.detail}</p>
          </li>
        ))}
      </ul>
    </Container>
  </section>
);
