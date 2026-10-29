import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   The page frame. One pair of outer margins at every width, one measure for
   the widest content, so every section shares the same two edges.
   ────────────────────────────────────────────────────────────────────────── */

export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12', className)}>{children}</div>;

/** Section headings on this page: display scale, two lines at most. Colour is the caller's. */
export const DISPLAY_H2_BASE =
  'text-[clamp(2.125rem,3.9vw,3.625rem)] font-[650] leading-[1.02] tracking-[-0.04em]';

/** The usual section heading, in Slate Teal on the oat ground. */
export const DISPLAY_H2 = `${DISPLAY_H2_BASE} text-teal-800`;

/** The one supporting sentence under a heading. Full ink, reading size. */
export const LEDE = 'text-lg leading-[1.6] text-oat-800';

/** Vertical rhythm: each section's own breathing room. */
export const SECTION_Y = 'py-[clamp(72px,8vw,128px)]';

/**
 * A section that follows another on the same oat ground opens on a hairline,
 * the way a case file's sections are ruled off one from the next. RULED goes
 * on the section's Container; RULED_SECTION replaces SECTION_Y on the section.
 */
export const RULED =
  // Drawn as a pseudo-element inset by the container's own padding, so the
  // rule spans exactly the content edges rather than the padded box.
  "relative pt-[clamp(72px,8vw,128px)] before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-oat-200 before:content-[''] sm:before:inset-x-8 lg:before:inset-x-12";
export const RULED_SECTION = 'pb-[clamp(72px,8vw,128px)]';

/**
 * Scrolls to a section and moves focus to its heading, so a keyboard or
 * screen-reader user arrives where the eye does. The URL follows, so a link
 * to any part of the page can be shared.
 */
export function goToSection(id: string, reducedMotion: boolean): void {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  target.querySelector<HTMLElement>('[data-section-heading]')?.focus({ preventScroll: true });

  if (window.location.hash !== `#${id}`) {
    window.history.replaceState(window.history.state, '', `#${id}`);
  }
}

/** Props for a section heading that anchor links can move focus to. */
export const sectionHeadingProps = {
  tabIndex: -1,
  'data-section-heading': true,
} as const;

/* ── The platform's main action ────────────────────────────────────────────
   "Start an assessment" goes to the new-assessment route, which sits behind
   the sign-in gate. A signed-out visitor is taken to sign-in and, once in,
   carried on to the new assessment rather than dropped elsewhere; a signed-in
   colleague starts one straight away. The gate owns that behaviour; this page
   only names the destination. */

export const START_ASSESSMENT_PATH = '/assessment';
export const WORKSPACE_PATH = '/assessments';
export const START_LABEL = 'Start an assessment';

export function useStartAssessment(): () => void {
  const navigate = useNavigate();
  return useCallback(() => navigate(START_ASSESSMENT_PATH), [navigate]);
}
