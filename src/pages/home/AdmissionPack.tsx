import React, { useMemo } from 'react';
import { AlertTriangle, Heart, Phone, Shield, Users, Utensils } from 'lucide-react';
import { Avatar, Logo } from '../../components/ui';
import { deriveCriticalInformation, type PackEntry } from '../../lib/criticalInformation';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';
import { PERSON, dailyLiving, healthWellbeing, personalDetails, risksSection, type RiskAnswers } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The Emergency Admission Pack, written from the sample record by the same
   function that writes every real one. The High Risk entry follows the
   visitor's answers above, because in the product it would too.
   ────────────────────────────────────────────────────────────────────────── */

const CONTENTS = [
  'Allergies and medical conditions',
  'The risks a crew needs to know first',
  'Mobility, personal care and diet',
  'Who to call, and the evacuation plan',
] as const;

const Entry: React.FC<{ entry: PackEntry }> = ({ entry }) => (
  <span className={entry.placeholder ? 'italic text-oat-500' : 'whitespace-pre-line text-oat-800'}>
    {entry.text}
  </span>
);

const Tile: React.FC<{ title: string; icon: React.ReactNode; entry: PackEntry; wide?: boolean }> = ({
  title,
  icon,
  entry,
  wide,
}) => (
  <div className={cn('bg-white p-4 sm:p-5', wide && 'sm:col-span-2')}>
    <p className="flex items-center gap-2 text-base font-semibold text-oat-900">
      <span className="text-teal-600 [&>svg]:h-[18px] [&>svg]:w-[18px]" aria-hidden="true">
        {icon}
      </span>
      {title}
    </p>
    {/* Keyed by its text so a change settles in rather than snapping. */}
    <p key={entry.text} className="cfh-arrive mt-1.5 text-sm leading-relaxed">
      <Entry entry={entry} />
    </p>
  </div>
);

export const AdmissionPack: React.FC<{ answers: RiskAnswers }> = ({ answers }) => {
  const pack = useMemo(
    () =>
      deriveCriticalInformation({
        personal: personalDetails,
        healthWellbeing,
        dailyLiving,
        risksSafeguarding: risksSection(answers),
      }),
    [answers],
  );

  return (
    <section id="pack" aria-labelledby="pack-title" className={cn('overflow-x-clip', RULED_SECTION)}>
      <Container className={cn(RULED, 'grid gap-x-12 gap-y-16 lg:grid-cols-12 lg:items-center')}>
        <div className="lg:col-span-5">
          <h2 id="pack-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            One page for the worst day.
          </h2>
          <p className={cn(LEDE, 'mt-6 max-w-[32rem]')}>
            If someone is admitted to hospital, the Emergency Admission Pack puts what a crew needs on one
            printable page, written from the same record as the plan.
          </p>
          <ul className="mt-10 divide-y divide-oat-200 border-y border-oat-200">
            {CONTENTS.map((item) => (
              <li key={item} className="py-4 text-md text-oat-900">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base text-oat-700">Downloaded as a PDF from any record.</p>
        </div>

        {/* The sheet itself, put down on the table at a slight turn. */}
        <div className="lg:col-span-7 lg:pl-4">
          <article
            aria-label={`Sample Emergency Admission Pack for ${PERSON.name}`}
            className="mx-auto max-w-[640px] rounded-2xl border border-oat-200 bg-white p-6 shadow-sheet sm:p-9"
            data-reveal="land"
            data-ui
          >
            <header className="flex items-start justify-between gap-4 text-xs text-oat-500">
              <Logo size="sm" />
              <span>Sample pack</span>
            </header>

            <div className="mt-7 flex items-center gap-4">
              <Avatar name={PERSON.name} size="xl" className="ring-4 ring-mulberry-50" />
              <div className="min-w-0">
                <p className="text-sm text-oat-500">Emergency Admission Pack</p>
                <p className="text-2xl font-semibold tracking-tight text-teal-900">{PERSON.name}</p>
              </div>
            </div>

            <p className="mt-8 border-b border-oat-200 pb-2.5 text-lg font-semibold text-teal-800">
              Critical information
            </p>
            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-oat-200 bg-oat-200 sm:grid-cols-2">
              <Tile title="Allergies" icon={<AlertTriangle />} entry={pack.critical.allergies} />
              <Tile title="High risk" icon={<Shield />} entry={pack.critical.highRisk} />
              <Tile title="Medical conditions" icon={<Heart />} entry={pack.critical.medicalConditions} />
              <Tile title="Diet" icon={<Utensils />} entry={pack.critical.diet} />
              <Tile title="Abilities" icon={<Users />} entry={pack.critical.abilities} wide />
            </div>

            <p className="mt-8 border-b border-oat-200 pb-2.5 text-lg font-semibold text-teal-800">
              Emergency information
            </p>
            <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-oat-200 bg-oat-200 sm:grid-cols-2">
              <Tile title="Emergency contacts" icon={<Phone />} entry={pack.emergency.emergencyContacts} />
              <Tile title="Evacuation plan" icon={<Shield />} entry={pack.emergency.evacuationPlan} />
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};
