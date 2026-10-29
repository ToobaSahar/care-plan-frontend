import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { deriveEvidence } from '../lib/evidence';
import { HomeNav } from './home/HomeNav';
import { Hero } from './home/Hero';
import { Problem } from './home/Problem';
import { HowItWorks } from './home/HowItWorks';
import { GuidedAssessment } from './home/GuidedAssessment';
import { ThreeReaders } from './home/ThreeReaders';
import { LiveRecord } from './home/LiveRecord';
import { PlanAreas } from './home/PlanAreas';
import { AdmissionPack } from './home/AdmissionPack';
import { Outcomes } from './home/Outcomes';
import { BuiltForCare } from './home/BuiltForCare';
import { Questions } from './home/Questions';
import { HomeFooter, StartSection } from './home/Closing';
import { usePrefersReducedMotion, useRevealOnScroll } from './home/motion';
import { INITIAL_RISKS, personalDetails, risksSection, signatures, type Answer, type RiskAnswers, type RiskKey } from './home/sample';
import './home/home.css';

/* ──────────────────────────────────────────────────────────────────────────
   CentiCare's home page.

   Public, and written for the person who decides whether a care provider
   adopts it. The sections run in the order that decision is made:

     attention   the outcome, with the product visibly working (Hero)
     problem     the week a manager already recognises (Problem)
     plan        three steps they can hold in their head (HowItWorks)
     proof       each step shown working, and one they can try themselves
                 (GuidedAssessment, ThreeReaders, LiveRecord, PlanAreas,
                 AdmissionPack)
     outcome     the same problems, resolved (Outcomes)
     authority   why it is safe with people's records (BuiltForCare)
     objections  the questions asked before saying yes (Questions)
     action      the one thing to do next (StartSection)

   Every record on it is sample data, computed by the product's own
   derivation code. Nothing here reaches the database. Its one action,
   "Start an assessment", goes through the existing sign-in gate.
   ────────────────────────────────────────────────────────────────────────── */

const TITLE = 'CentiCare — Universal Care Needs Assessment';

export const HomePage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { status } = useAuth();
  const signedIn = status === 'ready';

  // The record's live answers. Evidence, plan and pack all derive from them.
  const [answers, setAnswers] = useState<RiskAnswers>(INITIAL_RISKS);
  const onAnswer = useCallback((key: RiskKey, value: Answer) => {
    setAnswers((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const evidence = useMemo(
    () =>
      deriveEvidence({
        personalDetails,
        risksSafeguarding: risksSection(answers),
        signatures,
      }),
    [answers],
  );

  useRevealOnScroll(rootRef, !reducedMotion);

  // The tab says where you are; it is put back on the way out.
  useEffect(() => {
    const previous = document.title;
    document.title = TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  // A shared link to a section (#record, #pack) lands there once the page has
  // rendered; the browser's own jump fires before the content exists.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={rootRef} className="cf-home min-h-[100svh] bg-oat-100">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-teal-800 focus:shadow-lg"
      >
        Skip to content
      </a>

      <HomeNav signedIn={signedIn} reducedMotion={reducedMotion} />

      <main id="main">
        <Hero reducedMotion={reducedMotion} />
        <Problem />
        <HowItWorks reducedMotion={reducedMotion} />
        <GuidedAssessment reducedMotion={reducedMotion} />
        <ThreeReaders reducedMotion={reducedMotion} />
        <LiveRecord answers={answers} evidence={evidence} onAnswer={onAnswer} />
        <PlanAreas answers={answers} evidence={evidence} />
        <AdmissionPack answers={answers} />
        <Outcomes reducedMotion={reducedMotion} />
        <BuiltForCare />
        <Questions />
        <StartSection signedIn={signedIn} reducedMotion={reducedMotion} />
      </main>

      <HomeFooter reducedMotion={reducedMotion} />
    </div>
  );
};
