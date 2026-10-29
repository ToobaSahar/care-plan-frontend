import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Container, DISPLAY_H2, LEDE, RULED, RULED_SECTION, sectionHeadingProps } from './layout';

/* ──────────────────────────────────────────────────────────────────────────
   The objections a care provider manager raises before trying anything new
   with people's records, answered plainly and only with what the product
   does today.

   Native <details>: keyboard, screen readers and find-in-page all work with
   no script, and the first answer is open so the pattern is obvious.
   ────────────────────────────────────────────────────────────────────────── */

const QUESTIONS = [
  {
    q: 'Does the AI decide someone’s care?',
    a: 'No. The agents draft a plan from an assessment the assessor and the person have already signed. A reviewing agent checks the draft against set criteria before it is approved, and your team stays responsible for the care it describes.',
  },
  {
    q: 'Who can see a person’s record?',
    a: 'Only active members of your staff. Access is enforced in the database itself, and staff with a viewer role can read records without being able to change them.',
  },
  {
    q: 'Can assessors use it during a home visit?',
    a: 'Yes. It is built for a tablet, with large controls, and each section is saved as the assessor moves on, so an interrupted visit keeps everything recorded so far.',
  },
  {
    q: 'What happens if a draft plan is not good enough?',
    a: 'It is not approved. The reviewer approves a draft only when every criterion is met, and a draft that does not fit the plan’s required shape is sent back to be corrected, or the run stops rather than guessing.',
  },
  {
    q: 'What is in the Emergency Admission Pack?',
    a: 'Allergies, medical conditions, the highest risks, abilities and diet, emergency contacts and the evacuation plan, on one page that can be downloaded as a PDF.',
  },
  {
    q: 'How does my team get access?',
    a: 'Accounts are issued by your administrator. There is no public sign-up, so nobody reaches a record without being added to your team.',
  },
] as const;

export const Questions: React.FC = () => (
  <section id="questions" aria-labelledby="questions-title" className={RULED_SECTION}>
    <Container className={cn(RULED, 'grid gap-x-12 gap-y-12 lg:grid-cols-12')}>
      <div className="lg:col-span-4">
        <h2 id="questions-title" className={DISPLAY_H2} {...sectionHeadingProps}>
          Questions managers ask.
        </h2>
        <p className={cn(LEDE, 'mt-6 max-w-[26rem]')}>Straight answers about safety, access and control.</p>
      </div>

      <div className="divide-y divide-oat-200 border-y border-oat-200 lg:col-span-8">
        {QUESTIONS.map((item, i) => (
          <details key={item.q} className="group" open={i === 0}>
            <summary className="flex cursor-pointer items-center justify-between gap-6 rounded-sm py-6 text-left text-xl font-semibold text-teal-900 transition-colors duration-fast hover:text-teal-700">
              {item.q}
              <ChevronDown className="cfh-chevron h-5 w-5 flex-none text-teal-600" aria-hidden="true" />
            </summary>
            <p className="cfh-answer max-w-[40rem] pb-7 text-md leading-relaxed text-oat-800">{item.a}</p>
          </details>
        ))}
      </div>
    </Container>
  </section>
);
