import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/* ──────────────────────────────────────────────────────────────────────────
   Who is using CareFrame.

   Two questions, not one. Supabase answers "is this a real account?"; the
   `staff` table answers "is this account allowed near service-user records?".
   Both must be yes, and the database enforces the same pair independently —
   this provider decides what to render, never what is permitted. A browser
   with a doctored session still gets nothing back from Postgres.
   ────────────────────────────────────────────────────────────────────────── */

export type StaffRole = 'admin' | 'assessor' | 'viewer';

export interface StaffProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: StaffRole;
  is_active: boolean;
}

export type AuthStatus =
  /** Still restoring the session from storage — render nothing decisive yet. */
  | 'loading'
  | 'signed-out'
  /** Signed in, but no active `staff` row. An account, not a colleague. */
  | 'not-authorised'
  | 'ready';

interface AuthContextValue {
  status: AuthStatus;
  session: Session | null;
  staff: StaffProfile | null;
  /** False for `viewer`, who may read service user records but not alter them. */
  canWrite: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Thrown for anything the sign-in form should show verbatim. */
export class AuthError extends Error {}

async function loadStaff(userId: string): Promise<StaffProfile | null> {
  const { data, error } = await supabase
    .from('staff')
    .select('id, email, full_name, role, is_active')
    .eq('id', userId)
    .maybeSingle();

  // A policy denial and an absent row are the same answer to the caller: this
  // person is not staff. Distinguishing them would leak the roster's shape.
  if (error) return null;
  return (data as StaffProfile | null) ?? null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [staff, setStaff] = useState<StaffProfile | null>(null);

  // Auth events can arrive while an earlier profile fetch is still in flight —
  // a fast sign-out after sign-in, or a token refresh. Without a sequence
  // guard the stale resolution wins and restores a profile that is gone.
  const seq = useRef(0);

  const applySession = useCallback(async (next: Session | null) => {
    const ticket = ++seq.current;

    if (!next?.user) {
      if (ticket === seq.current) {
        setSession(null);
        setStaff(null);
        setStatus('signed-out');
      }
      return;
    }

    const profile = await loadStaff(next.user.id);
    if (ticket !== seq.current) return;

    setSession(next);
    setStaff(profile);
    setStatus(profile?.is_active ? 'ready' : 'not-authorised');
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) void applySession(data.session);
    });

    // Covers sign-in, sign-out, token refresh, and this tab noticing that
    // another tab signed out.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void applySession(next);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    // Deliberately one message for a wrong address and a wrong password, so
    // the form cannot be used to confirm who holds an account here.
    if (error) {
      throw new AuthError(
        error.message === 'Invalid login credentials'
          ? 'Those details were not recognised.'
          : error.message,
      );
    }
    // The resulting SIGNED_IN event drives the state change.
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStaff(null);
    setStatus('signed-out');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      staff,
      canWrite: staff?.is_active === true && staff.role !== 'viewer',
      signIn,
      signOut,
    }),
    [status, session, staff, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
