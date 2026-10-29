import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Button, Logo } from '../../components/ui';
import { cn } from '../../lib/cn';
import {
  Container,
  DISPLAY_H2,
  LEDE,
  RULED,
  RULED_SECTION,
  START_ASSESSMENT_PATH,
  START_LABEL,
  WORKSPACE_PATH,
  goToSection,
  sectionHeadingProps,
  useStartAssessment,
} from './layout';
import { PERSON, signatures } from './sample';

/* ──────────────────────────────────────────────────────────────────────────
   The close and the footer.

   The close asks for the one action the page has been building to, with the
   assurance that answers the last hesitation: nothing is planned until the
   assessor and the person have signed. Their two signatures write themselves
   in as the section arrives.
   ────────────────────────────────────────────────────────────────────────── */

/** Two hands, deliberately unlike: a long, right-leaning cursive and a short, upright, looped one. */
const STROKES = {
  assessor:
    'M6 30c4-12 10-24 16-24 5 0 1 14-6 22-5 6-9 4-5-2 6-9 14-12 20-10 4 2 0 10 4 10s8-8 13-8 2 8 7 8 9-6 14-6 4 5 9 5 12-3 26-5',
  person:
    'M22 12c-8 0-14 6-14 12 0 7 9 9 15 3M14 23h9M30 32c3-10 7-16 9-12s-3 12-1 12 6-9 9-9-1 8 2 8 5-5 7-6M26 40c12 1 26-1 38-5',
} as const;

const Signature: React.FC<{ who: string; role: string; stroke: string; delay: number }> = ({
  who,
  role,
  stroke,
  delay,
}) => (
  <figure className="min-w-0 flex-1">
    <svg
      viewBox="0 0 140 48"
      className="h-14 w-auto text-teal-800"
      data-reveal="write"
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
      aria-hidden="true"
    >
      <path d={stroke} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <figcaption className="mt-2 border-t border-oat-300 pt-3">
      <span className="block text-md font-semibold text-oat-900">{who}</span>
      <span className="block text-sm text-oat-600">{role}</span>
    </figcaption>
  </figure>
);

interface StartSectionProps {
  signedIn: boolean;
  reducedMotion: boolean;
}

export const StartSection: React.FC<StartSectionProps> = ({ signedIn, reducedMotion }) => {
  const navigate = useNavigate();
  const startAssessment = useStartAssessment();

  return (
    <section id="start" aria-labelledby="start-title" className={RULED_SECTION}>
      <Container className={cn(RULED, 'grid gap-x-12 gap-y-14 lg:grid-cols-12 lg:items-center')}>
        <div className="lg:col-span-6">
          <h2 id="start-title" className={DISPLAY_H2} {...sectionHeadingProps}>
            Start with your next visit.
          </h2>
          <p className={cn(LEDE, 'mt-6 max-w-[34rem]')}>
            Start an assessment at your next visit, and the three readers will draft the plan from it, ready
            for your team to review.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" className="cfh-press" onClick={startAssessment}>
              {START_LABEL}
            </Button>
            {signedIn ? (
              <Button size="lg" variant="secondary" className="cfh-press" onClick={() => navigate(WORKSPACE_PATH)}>
                Open workspace
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="cfh-press" onClick={() => goToSection('record', reducedMotion)}>
                Try a sample record
              </Button>
            )}
          </div>
        </div>

        <figure className="rounded-2xl border border-oat-200 bg-white p-7 shadow-sheet sm:p-10 lg:col-span-6" data-ui>
          <div className="flex flex-col gap-10 sm:flex-row">
            <Signature who={signatures.assessor_name} role="Assessor" stroke={STROKES.assessor} delay={150} />
            <Signature who={PERSON.name} role="The person assessed" stroke={STROKES.person} delay={900} />
          </div>
          <figcaption className="mt-8 border-t border-oat-200 pt-5 text-md text-oat-800">
            Signed before it is planned: every plan starts from an assessment both of them have signed.
          </figcaption>
        </figure>
      </Container>
    </section>
  );
};

/* ── The footer ─────────────────────────────────────────────────────────────
   The page ends on the same Slate Teal field that carries the reading stage,
   so the close of the page is unmistakable: the lockup, the page as a
   directory, then the small print. Every link in the top bar is here too; on
   a phone the bar carries none of them. */

const FOOTER_GROUPS = [
  {
    title: 'The platform',
    links: [
      { id: 'how', label: 'How it works' },
      { id: 'visit', label: 'The assessment' },
      { id: 'readers', label: 'The three readers' },
      { id: 'plan', label: 'The plan' },
      { id: 'pack', label: 'Emergency Admission Pack' },
    ],
  },
  {
    title: 'See it working',
    links: [
      { id: 'record', label: 'Try the record' },
      { id: 'outcomes', label: 'What changes' },
      { id: 'trust', label: 'Safety and access' },
      { id: 'questions', label: 'Questions' },
    ],
  },
] as const;

const FOOTER_LINK =
  'rounded-sm text-base text-teal-100 underline decoration-transparent underline-offset-[5px] transition-[color,text-decoration-color] duration-fast hover:text-white hover:decoration-teal-400';

const FOOTER_HEADING = 'text-base font-semibold text-white';

interface HomeFooterProps {
  signedIn: boolean;
  reducedMotion: boolean;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ signedIn, reducedMotion }) => {
  const onSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Modified clicks keep their browser meaning (new tab, copy link).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    goToSection(id, reducedMotion);
    // The hero's heading is not one of the anchored section headings, so
    // focus is taken there by hand: a keyboard user going back to the top
    // should not be left at the foot of the page.
    if (id === 'top') {
      const heading = document.getElementById('home-title');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({ preventScroll: true });
    }
  };

  return (
    <footer className="cfh-on-teal bg-teal-800">
      <Container className="pb-8 pt-[clamp(56px,6vw,88px)]">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a
              href="#top"
              onClick={(e) => onSectionLink(e, 'top')}
              className="inline-flex rounded-md"
              aria-label="CentiCare, back to the top"
            >
              <Logo size="md" onDark />
            </a>
            <p className="mt-5 max-w-[22rem] text-md leading-relaxed text-teal-100">
              Universal Care Needs Assessment, for home care in the UK.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className={FOOTER_HEADING}>{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.id}>
                      <a href={`#${link.id}`} onClick={(e) => onSectionLink(e, link.id)} className={FOOTER_LINK}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className={FOOTER_HEADING}>Get started</h2>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <Link to={START_ASSESSMENT_PATH} className={FOOTER_LINK}>
                    {START_LABEL}
                  </Link>
                </li>
                {signedIn && (
                  <li>
                    <Link to={WORKSPACE_PATH} className={FOOTER_LINK}>
                      Open workspace
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 grid gap-5 border-t border-teal-700 pt-7 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-12">
          <p className="text-sm text-teal-200">© {new Date().getFullYear()} CentiCare</p>
          <p className="max-w-[68ch] text-sm leading-relaxed text-teal-200">
            Everyone named on this page is fictional. The record, plan and emergency pack shown here are sample
            data, and the NHS and phone numbers are from ranges reserved for testing and fiction.
          </p>
          <a
            href="#top"
            onClick={(e) => onSectionLink(e, 'top')}
            className="group inline-flex items-center gap-2 self-start justify-self-start rounded-sm text-sm font-medium text-teal-100 transition-colors duration-fast hover:text-white"
          >
            Back to top
            <ArrowUp
              className="h-4 w-4 transition-transform duration-fast ease-out group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </Container>
    </footer>
  );
};
