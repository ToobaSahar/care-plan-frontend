import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AuthError, useAuth } from '../auth/AuthProvider';
import { Alert, Button, Field, Input, Logo } from '../components/ui';

interface FromState {
  from?: { pathname?: string };
}

/* ──────────────────────────────────────────────────────────────────────────
   Sign in.

   The first screen of a clinical record system, so it is built like the rest
   of the product rather than bolted on: the same oat ground as the
   workspace, the same controls.

   There is no "create an account" link, and that is the design. Accounts are
   issued by an administrator; self-registration is turned off at the project
   level. A care record is not something you opt into.
   ────────────────────────────────────────────────────────────────────────── */

export const SignInPage: React.FC = () => {
  const { status, signIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Someone already signed in has no business here; bounce them to wherever
  // they were originally heading.
  if (status === 'ready') {
    const to = (location.state as FromState | null)?.from?.pathname ?? '/assessments';
    return <Navigate to={to} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setBusy(true);
    try {
      await signIn(email, password);
      // Navigation is left to the redirect above, which fires once the
      // provider has confirmed the staff row too. Routing on the credential
      // alone would flash the service users list at someone who cannot load it.
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : 'Sign-in could not be completed. Check your connection and try again.',
      );
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-oat-100 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* The brand panel: one tonal step down from the form's oat, at full
          height. The mark appears once, whole, in the lockup. */}
      <aside className="hidden flex-col justify-between border-r border-oat-200 bg-oat-100 p-10 lg:flex xl:p-14">
        <Logo size="lg" />
        <p className="max-w-sm text-3xl font-semibold leading-tight tracking-tight text-teal-900">
          Universal Care Needs Assessment
        </p>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="border-b border-oat-200 bg-oat-100 px-6 py-4 lg:hidden">
          <Logo size="md" />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
          <div className="cf-arrive w-full max-w-[400px]">
            <h1 className="text-3xl font-semibold tracking-tight text-teal-800">Sign in</h1>
            <p className="mt-2 text-base leading-6 text-oat-600">
              <span className="lg:hidden">Universal Care Needs Assessment. </span>
              Records here are confidential.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
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
                  <Input
                    {...props}
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                )}
              </Field>

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={busy}
                icon={<LogIn />}
                className="mt-1"
              >
                Sign in
              </Button>
            </form>

            <p className="mt-8 border-t border-oat-200 pt-5 text-xs leading-5 text-oat-600">
              Accounts are issued by your administrator. If you cannot get in, ask them rather
              than trying another address.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
