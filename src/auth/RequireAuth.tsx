import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { Button, Logo } from '../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   The gate in front of every route that touches a service user.

   It is a convenience, not the control: the database refuses the same
   requests on its own. Its job is to send people somewhere sensible instead
   of to a screen full of empty tables.
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Held while the session is restored from storage.
 *
 * Unbranded and all but silent — a logo that flashes for 80ms on every load
 * reads as a fault. Only the pause long enough to notice gets a message.
 */
const Restoring: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-oat-100">
    <p className="cf-arrive text-base text-oat-600" role="status">
      Signing you in…
    </p>
  </div>
);

/** Signed in, but not on the staff roster — or taken off it. */
const NotAuthorised: React.FC = () => {
  const { staff, session, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-oat-100 px-6">
      <div className="cf-arrive w-full max-w-md rounded-2xl border border-oat-200 bg-white p-8 shadow-sheet">
        <Logo size="md" className="mb-8" />

        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-teal-700">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-teal-800">
          This account cannot open service user records
        </h1>
        <p className="mt-2 text-base leading-6 text-oat-700">
          {staff
            ? 'Access for this account has been withdrawn. Your manager can restore it.'
            : 'Your sign-in worked, but the account has not been added to the care team yet. Ask an administrator to add you.'}
        </p>

        {session?.user.email && (
          <p className="mt-5 text-xs text-oat-600">
            Signed in as <span className="font-medium text-oat-800">{session.user.email}</span>
          </p>
        )}

        <Button variant="secondary" className="mt-6" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    </div>
  );
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <Restoring />;

  if (status === 'signed-out') {
    // Carrying the attempted location means a deep link survives the detour
    // through sign-in rather than dumping everyone on the service users list.
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  if (status === 'not-authorised') return <NotAuthorised />;

  return <>{children}</>;
};
