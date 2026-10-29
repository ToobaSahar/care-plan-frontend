import React, { useEffect, useId, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  ArrowBigUp,
  ArrowLeft,
  ClipboardList,
  Eye,
  EyeOff,
  FilePlus2,
  FileText,
  KeyRound,
  LogIn,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { AuthError, useAuth } from '../auth/AuthProvider';
import { Alert, Avatar, Button, Field, Input, Logo, StatusBadge } from '../components/ui';
import { cn } from '../lib/cn';
import { PERSON, signatures } from './home/sample';
import './sign-in.css';

interface FromState {
  from?: { pathname?: string };
}

/* ──────────────────────────────────────────────────────────────────────────
   Sign in.

   The first screen of a clinical record system, so it is built like the rest
   of the product rather than bolted on: the form sits on the same oat ground
   as the workspace, with the same controls. Beside it, on a Slate Teal panel,
   one sample record has its plan made while you sign in: signed, analysed,
   planned, reviewed. The product is visible before you enter it.

   There is no "create an account" link, and that is the design. Accounts are
   issued by an administrator; self-registration is turned off at the project
   level. A care record is not something you opt into.
   ────────────────────────────────────────────────────────────────────────── */

/** Where the gate will send someone once they are in, named as the workspace names it. */
function destinationFor(pathname: string): { Icon: React.ElementType; label: string } {
  if (pathname === '/assessment') return { Icon: FilePlus2, label: 'A new assessment' };
  if (pathname.startsWith('/assessment/')) return { Icon: FileText, label: 'The assessment you opened' };
  if (pathname === '/critical-information') return { Icon: ClipboardList, label: 'The Emergency Admission Pack' };
  if (pathname === '/team') return { Icon: UserCog, label: 'The team' };
  return { Icon: Users, label: 'Your dashboard' };
}

function greetingFor(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * The two questions the provider asks, in order: is this a real account,
 * then is it on the staff roster. The button names whichever is being asked.
 */
type Phase = 'idle' | 'credentials' | 'access';

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'Sign in',
  credentials: 'Checking your details…',
  access: 'Confirming staff access…',
};

/* ── The brand panel's sample record ─────────────────────────────────────── */

/** When the first mark fills, and the gap to each next one, in ms. */
const PATH_START = 700;
const PATH_STEP = 560;

const STEPS = [
  { title: 'Assessment signed', note: null, channel: 'var(--read-done)' },
  { title: 'Analysed', note: 'Falls at night are the leading risk.', channel: 'var(--read-a)' },
  { title: 'Planned', note: 'Night check at 02:00; sensor mat by the bed.', channel: 'var(--read-p)' },
  { title: 'Reviewed', note: 'Checked against every criterion. Approved.', channel: 'var(--read-r)' },
] as const;

const PATH_DONE = PATH_START + (STEPS.length - 1) * PATH_STEP + 360;

/** CSS custom properties, typed for React's style prop. */
const vars = (v: Record<string, string | number>) => v as React.CSSProperties;

const SamplePath: React.FC = () => (
  <figure className="csi-sheet rounded-xl bg-white p-5 xl:p-6">
    {/* Whose record: the person header, as the workspace sets it. */}
    <div className="flex items-center gap-3.5 border-b border-oat-200 pb-4">
      <Avatar name={PERSON.name} size="lg" className="ring-4 ring-mulberry-50" />
      <div className="min-w-0 flex-1">
        <p className="text-lg font-semibold text-teal-900">{PERSON.name}</p>
        <p className="text-xs text-oat-500">Sample record · {PERSON.age} years</p>
      </div>
      <span className="csi-status grid flex-none" style={vars({ '--done': `${PATH_DONE}ms` })}>
        <span className="csi-status-from" aria-hidden="true">
          <StatusBadge status="in_progress" />
        </span>
        <span className="csi-status-to">
          <StatusBadge status="complete" />
        </span>
      </span>
    </div>

    <ol className="mt-5">
      {STEPS.map((step, i) => {
        const next = STEPS[i + 1];
        return (
          <li
            key={step.title}
            className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-x-3.5 pb-5 last:pb-0"
            style={vars({
              '--c': step.channel,
              '--n': next?.channel ?? step.channel,
              '--d': `${PATH_START + i * PATH_STEP}ms`,
            })}
          >
            {/* The hairline down to the next mark. */}
            {next && (
              <span className="absolute bottom-0 left-[9.5px] top-[26px] w-px bg-oat-200" aria-hidden="true">
                <span className="csi-line-fill" />
              </span>
            )}
            <span className="csi-mark mt-px flex h-5 w-5 items-center justify-center rounded-full" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-3 w-3">
                <path
                  d="M3 8.5l3.2 3L13 4.5"
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-base font-semibold text-teal-900">{step.title}</p>
              {step.note ? (
                <p className="mt-0.5 text-base text-oat-700">{step.note}</p>
              ) : (
                // The two people who signed: berry, because they are people.
                <p className="mt-1 flex items-center gap-2.5 text-base text-oat-700">
                  <span className="flex flex-none gap-1" aria-hidden="true">
                    <Avatar name={signatures.assessor_name} size="sm" className="ring-2 ring-white" />
                    <Avatar name={PERSON.name} size="sm" className="ring-2 ring-white" />
                  </span>
                  <span className="min-w-0">
                    By {signatures.assessor_name} and {PERSON.name}
                  </span>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>

    <figcaption className="sr-only">
      A sample record. Its plan is made from a signed assessment, then analysed, planned and reviewed.
    </figcaption>
  </figure>
);

const StaffOnly: React.FC<{ className?: string }> = ({ className }) => (
  <p className={cn('flex items-start gap-2.5 text-sm leading-5', className)}>
    <ShieldCheck className="mt-px h-4 w-4 flex-none" aria-hidden="true" />
    Staff only. Records are closed to anyone who is not active staff.
  </p>
);

const HOME_LINK =
  'inline-flex items-center gap-1.5 rounded-sm text-base font-medium text-oat-700 underline decoration-transparent underline-offset-[5px] transition-[color,text-decoration-color] duration-fast hover:text-teal-800 hover:decoration-teal-400';

export const SignInPage: React.FC = () => {
  const { status, session, signIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  // The session as it stood when the form was sent. The provider replaces it
  // once it has settled the new sign-in, which is how a fresh answer is told
  // apart from a stale one.
  const [sessionAtSubmit, setSessionAtSubmit] = useState<Session | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  // Read once: a greeting that changed under someone's cursor would be odd.
  const [greeting] = useState(() => greetingFor(new Date().getHours()));
  const capsLockId = useId();

  useEffect(() => {
    const previous = document.title;
    document.title = 'Sign in · CentiCare';
    return () => {
      document.title = previous;
    };
  }, []);

  const busy = phase !== 'idle';
  const to = (location.state as FromState | null)?.from?.pathname ?? '/assessments';

  // Someone already signed in has no business here; bounce them to wherever
  // they were originally heading. An account this form has just signed in,
  // which turns out not to be on the staff roster, is sent on too: the gate
  // explains that case, where this page could only keep spinning.
  if (
    status === 'ready' ||
    (status === 'not-authorised' && phase === 'access' && session !== sessionAtSubmit)
  ) {
    return <Navigate to={to} replace />;
  }

  const destination = destinationFor(to);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setShowPassword(false);
    setSessionAtSubmit(session);
    setPhase('credentials');
    try {
      await signIn(email, password);
      // Navigation is left to the redirect above, which fires once the
      // provider has confirmed the staff row too. Routing on the credential
      // alone would flash the service users list at someone who cannot load it.
      setPhase('access');
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : 'Sign-in could not be completed. Check your connection and try again.',
      );
      setPhase('idle');
    }
  };

  const readCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  return (
    <main className="cf-sign-in grid min-h-[100svh] bg-oat-100 lg:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* The brand panel: the one full field of colour, at full height. The
          mark appears once, whole, in the lockup. Its spacing follows the
          screen's height, so a tablet held landscape (1024 × 768, less the
          browser's own bars) still shows all of it without a scroll. */}
      <aside
        aria-label="About CentiCare"
        className="csi-on-teal hidden flex-col gap-[clamp(24px,5vh,48px)] bg-teal-800 px-10 py-[clamp(28px,5vh,56px)] text-white lg:flex xl:px-14"
      >
        <Link to="/" className="self-start rounded-md" aria-label="CentiCare home">
          <Logo size="lg" onDark />
        </Link>

        <div className="my-auto flex flex-col gap-[clamp(24px,4.5vh,40px)]">
          <div>
            <p className="text-[clamp(2.125rem,2.9vw,3rem)] font-[650] leading-[1.02] tracking-[-0.04em] text-white">
              <span className="block">Less writing.</span>
              <span className="block">Safer care plans.</span>
            </p>
            <p className="mt-5 max-w-[26rem] text-md leading-relaxed text-teal-100 [@media(max-height:760px)]:hidden">
              Each plan is drafted from a signed assessment and checked before your team sees it.
            </p>
          </div>

          <div className="max-w-[30rem]">
            <SamplePath />
          </div>
        </div>

        <StaffOnly className="text-teal-100 [&>svg]:text-teal-300" />
      </aside>

      <div className="flex min-h-[100svh] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-oat-200 px-6 py-4 sm:px-10 lg:justify-end lg:border-transparent lg:pt-8">
          <Link to="/" className="rounded-md lg:hidden" aria-label="CentiCare home">
            <Logo size="md" />
          </Link>
          <Link to="/" className={HOME_LINK}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="cf-arrive w-full max-w-[400px]">
            <h1 className="text-3xl font-semibold tracking-tight text-teal-800">{greeting}</h1>
            <p className="mt-2 text-md leading-6 text-oat-700">
              Sign in to CentiCare. Records here are confidential.
            </p>

            {/* Where the gate will take them: the home page's "Start an
                assessment" arrives here, and should say so. */}
            <p className="mt-6 flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-base text-teal-900">
              <destination.Icon className="h-[18px] w-[18px] flex-none text-teal-600" aria-hidden="true" />
              <span className="min-w-0">
                <span className="text-oat-700">Next: </span>
                <span className="font-semibold">{destination.label}</span>
              </span>
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
              {error && <Alert tone="error" title="Could not sign in">{error}</Alert>}

              <Field label="Work email" required>
                {(props) => (
                  <Input
                    {...props}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    autoFocus
                    required
                    placeholder="you@yourcareagency.co.uk"
                  />
                )}
              </Field>

              <Field label="Password" required>
                {(props) => (
                  <>
                    <div className="relative">
                      <Input
                        {...props}
                        aria-describedby={
                          [props['aria-describedby'], capsLock && capsLockId].filter(Boolean).join(' ') ||
                          undefined
                        }
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={readCapsLock}
                        onKeyUp={readCapsLock}
                        onBlur={() => setCapsLock(false)}
                        autoComplete="current-password"
                        required
                        className="pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((shown) => !shown)}
                        aria-label="Show password"
                        aria-pressed={showPassword}
                        aria-controls={props.id}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-oat-600 transition-colors duration-fast hover:text-teal-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
                        ) : (
                          <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {/* Always present, so turning Caps Lock on is announced. */}
                    <p
                      id={capsLockId}
                      aria-live="polite"
                      className={cn('flex items-center gap-1.5 text-sm text-oat-800', !capsLock && 'sr-only')}
                    >
                      {capsLock && (
                        <>
                          <ArrowBigUp className="h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
                          Caps Lock is on.
                        </>
                      )}
                    </p>
                  </>
                )}
              </Field>

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={busy}
                icon={<LogIn />}
                // While it works, the button stays legible: it is saying which check is running.
                className={cn('mt-1', busy && '!cursor-progress !opacity-100')}
              >
                {PHASE_LABEL[phase]}
              </Button>
              <p className="sr-only" role="status">
                {busy ? PHASE_LABEL[phase] : ''}
              </p>
            </form>

            <div className="mt-8 flex gap-3 border-t border-oat-200 pt-5">
              <KeyRound className="mt-0.5 h-4 w-4 flex-none text-teal-600" aria-hidden="true" />
              <p className="text-sm leading-5 text-oat-700">
                Accounts are issued by your administrator. If you cannot get in, ask them rather than trying
                another address.
              </p>
            </div>
          </div>
        </div>

        <StaffOnly className="px-6 pb-8 text-oat-700 sm:px-10 lg:hidden [&>svg]:text-teal-600" />
      </div>
    </main>
  );
};
