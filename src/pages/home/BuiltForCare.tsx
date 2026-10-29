import React from 'react';
import { Badge } from '../../components/ui';
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_ORDER } from '../../auth/permissions';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';

/* ──────────────────────────────────────────────────────────────────────────
   Authority: what makes it safe to put a person's record in. Each statement
   is what the code does today, not an ambition:

     · staff-only access is row-level security in the database migrations;
     · the roles and their descriptions are the product's own permission map;
     · the fixed order and the validated output are the backend's agent code.
   ────────────────────────────────────────────────────────────────────────── */

const PRINCIPLES = [
  {
    term: 'Staff only, enforced in the database',
    detail:
      'Every record is closed to anyone who is not active staff. The rule lives in the database itself, so it holds whatever screen or script asks.',
  },
  {
    term: 'The same path for every plan',
    detail:
      'Analyse, plan, review runs in that order in code. Nothing is left to a model to decide, so every plan can be audited the same way.',
  },
  {
    term: 'Checked, never filled in',
    detail:
      'A draft that does not fit the plan’s required shape is sent back to be corrected. If it still does not fit, the run stops rather than guessing.',
  },
] as const;

const ROW = 'grid gap-2 py-7 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8';

export const BuiltForCare: React.FC = () => (
  <section id="trust" aria-labelledby="trust-title" className={RULED_SECTION}>
    <Container className={cn(RULED, 'grid gap-x-12 gap-y-14 lg:grid-cols-12')}>
      <div className="lg:col-span-5">
        <h2 id="trust-title" className={DISPLAY_H2} {...sectionHeadingProps}>
          Built for records about people.
        </h2>
        <p className={cn(LEDE, 'mt-6 max-w-[30rem]')}>
          Diagnoses, continence, safeguarding and end-of-life wishes are written into these records. The
          system is built around who may read them, and how a plan is made from them.
        </p>
      </div>

      <ul className="divide-y divide-oat-200 border-y border-oat-200 lg:col-span-7">
        {PRINCIPLES.map((item) => (
          <li key={item.term} className={ROW}>
            <h3 className="text-lg font-semibold leading-snug text-teal-800">{item.term}</h3>
            <p className="text-md leading-relaxed text-oat-800">{item.detail}</p>
          </li>
        ))}

        {/* The roles, as the product names and describes them. */}
        <li className={ROW}>
          <h3 className="text-lg font-semibold leading-snug text-teal-800">Roles with clear limits</h3>
          <ul className="flex flex-col gap-3.5">
            {ROLE_ORDER.map((role) => (
              <li key={role} className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:items-baseline sm:gap-3">
                {/* A role is a permission, not a person: teal for admin, neutral otherwise. */}
                <Badge tone={role === 'admin' ? 'brand' : 'neutral'} className="self-start justify-self-start">
                  {ROLE_LABELS[role]}
                </Badge>
                <span className="text-md leading-relaxed text-oat-800">{ROLE_DESCRIPTIONS[role]}</span>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </Container>
  </section>
);
