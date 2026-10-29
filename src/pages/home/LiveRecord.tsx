import React from 'react';
import { ShieldAlert, Users } from 'lucide-react';
import { Avatar, RiskBadge } from '../../components/ui';
import type { Evidence } from '../../lib/evidence';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, SECTION_Y, sectionHeadingProps } from './layout';
import { PERSON, RISK_QUESTIONS, RISK_NOTES, type Answer, type RiskAnswers, type RiskKey } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The one thing on the page a visitor can change.

   Six real questions from Risks & Safeguarding. Every answer runs through
   `deriveEvidence`, the function the workspace's evidence column uses, so
   what appears here is what an assessor would see, by the same rules: an
   explicit "no" clears a risk, a safeguarding concern is critical, and the
   record's overall risk is the highest one raised.
   ────────────────────────────────────────────────────────────────────────── */

const SECTION = 'Risks & Safeguarding';
const fieldId = (key: RiskKey) => `record-${key}`;

interface LiveRecordProps {
  answers: RiskAnswers;
  evidence: Evidence;
  onAnswer: (key: RiskKey, value: Answer) => void;
}

const YesNo: React.FC<{
  name: RiskKey;
  value: Answer;
  onChange: (value: Answer) => void;
}> = ({ name, value, onChange }) => (
  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-md border border-oat-300 bg-oat-100 p-1">
    {(['no', 'yes'] as const).map((option) => (
      <label key={option} className="relative cursor-pointer">
        <input
          type="radio"
          name={name}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          className="peer sr-only"
        />
        <span
          className={cn(
            'flex h-9 items-center justify-center rounded-[6px] text-base font-medium text-oat-600 transition-[background-color,color,box-shadow] duration-fast ease-out',
            'hover:text-oat-900',
            'peer-checked:bg-white peer-checked:text-teal-800 peer-checked:shadow-xs peer-checked:ring-1 peer-checked:ring-oat-200',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600',
          )}
        >
          {option === 'yes' ? 'Yes' : 'No'}
        </span>
      </label>
    ))}
  </div>
);

export const LiveRecord: React.FC<LiveRecordProps> = ({ answers, evidence, onAnswer }) => {
  // "Raised in…" proves the provenance: it takes you to the question that
  // raised the risk and marks it, rather than only naming the section.
  const focusQuestion = (key: string) => {
    const field = document.getElementById(fieldId(key as RiskKey));
    if (!field) return;
    field.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true });
    field.scrollIntoView({ block: 'center', behavior: 'smooth' });
    field.classList.remove('cfh-flash');
    void field.offsetWidth; // restart the mark if the same link is followed twice
    field.classList.add('cfh-flash');
  };

  return (
    <section id="record" aria-labelledby="record-title" className={cn('bg-oat-100', SECTION_Y)}>
      <Container>
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 id="record-title" className={DISPLAY_H2} {...sectionHeadingProps}>
              Every risk shows its source.
            </h2>
            <p className={cn(LEDE, 'mt-6 max-w-[38rem]')}>
              Answer as an assessor would. Each risk appears beside the question that raised it, by the same
              rules CareFrame applies to every assessment.
            </p>
          </div>
          <p className="text-md leading-relaxed text-oat-700 lg:col-span-4 lg:col-start-9">
            This is a sample record, so nothing you change here is saved. The plan and the emergency pack
            further down follow your answers.
          </p>
        </div>

        {/* The section sheet and its evidence, as the workspace sets them when
            evidence sits beside or beneath the fields: two panels, each ending
            at its own content, so neither stretches to the other's height. */}
        <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 rounded-2xl border border-oat-200 bg-white p-5 shadow-sheet sm:p-8" data-ui>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-oat-200 pb-5">
              <Avatar name={PERSON.name} size="xl" className="ring-4 ring-mulberry-50" />
              {/* Wide enough for the name on one line; the badge wraps beneath instead. */}
              <div className="min-w-0 flex-1 basis-48">
                <p className="text-xl font-semibold text-teal-900">{PERSON.name}</p>
                <p className="text-xs text-oat-500">
                  Sample record · NHS {PERSON.nhs} · {PERSON.age} years
                </p>
              </div>
              <span aria-live="polite" aria-atomic="true">
                <RiskBadge key={evidence.overall} level={evidence.overall} prefix="Risk" className="cfh-arrive" />
              </span>
            </div>

            <h3 className="mt-6 text-2xl font-semibold text-teal-800">{SECTION}</h3>

            <div className="mt-5 grid gap-x-5 gap-y-6 sm:grid-cols-2">
              {RISK_QUESTIONS.map((q) => {
                const yes = answers[q.key] === 'yes';
                return (
                  <fieldset key={q.key} id={fieldId(q.key)} className="min-w-0">
                    <legend className="text-sm font-medium text-oat-800">{q.label}</legend>
                    <YesNo name={q.key} value={answers[q.key]} onChange={(v) => onAnswer(q.key, v)} />
                    <p className={cn('mt-2 text-sm', yes ? 'text-oat-800' : 'italic text-oat-500')}>
                      {yes ? q.note : 'Not a concern at this visit'}
                    </p>
                  </fieldset>
                );
              })}
            </div>

            {/* The rest of the section, as recorded at the visit. Free text in
                the product, shown read-only here because it raises no risk. */}
            <dl className="mt-8 grid gap-x-5 gap-y-5 border-t border-oat-200 pt-6 sm:grid-cols-2">
              {RISK_NOTES.map((item) => (
                <div key={item.label} className="min-w-0">
                  <dt className="text-sm font-medium text-oat-800">{item.label}</dt>
                  <dd className="mt-1.5 text-base leading-relaxed text-oat-900">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside
            aria-label={`Evidence for ${SECTION}`}
            className="min-w-0 rounded-2xl border border-oat-200 bg-oat-100 p-5 sm:p-7"
            data-ui
          >
            <p className="text-2xs font-semibold uppercase text-oat-600">Evidence · {SECTION}</p>

            <div className="mt-5">
              <h4 className="flex items-center gap-2 text-2xs font-semibold uppercase text-oat-600">
                <ShieldAlert className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                Raised by this record
                {evidence.risks.length > 0 && (
                  <span className="rounded-full border border-oat-200 bg-white px-2 py-px text-2xs tabular-nums text-oat-600">
                    {evidence.risks.length}
                  </span>
                )}
              </h4>

              {evidence.risks.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2.5" aria-live="polite">
                  {evidence.risks.map((risk) => (
                    <li key={risk.id} className="cfh-arrive rounded-lg border border-oat-200 bg-white p-3.5 shadow-xs">
                      <RiskBadge level={risk.level} prefix={risk.label} />
                      {risk.note && <p className="mt-2 text-sm text-oat-800">{risk.note}</p>}
                      <button
                        type="button"
                        onClick={() => focusQuestion(risk.id)}
                        className="mt-2 rounded-sm text-xs text-teal-700 underline underline-offset-[3px] hover:text-teal-900"
                      >
                        Raised in {SECTION}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-lg border border-dashed border-oat-300 p-4 text-sm text-oat-600">
                  Nothing raised. Answer yes to any risk and it appears here, with the question that raised
                  it.
                </p>
              )}
            </div>

            <div className="mt-7">
              <h4 className="flex items-center gap-2 text-2xs font-semibold uppercase text-oat-600">
                <Users className="h-3.5 w-3.5 text-teal-600" aria-hidden="true" />
                People in this record
              </h4>
              <ul className="mt-3 divide-y divide-mulberry-200 overflow-hidden rounded-lg border border-mulberry-200 bg-mulberry-50">
                {evidence.people.map((person) => (
                  <li key={person.id} className="flex items-center gap-3 px-3.5 py-2.5">
                    <Avatar name={person.name} size="md" />
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-oat-900">{person.name}</p>
                      <p className="text-xs text-mulberry-700">{person.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
};
