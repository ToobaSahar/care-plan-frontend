import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, KeyRound, UserPlus, X } from 'lucide-react';
import { WorkspaceShell } from '../components/layout/WorkspaceShell';
import { useAuth, type StaffRole } from '../auth/AuthProvider';
import { can, PERMISSIONS, ROLE_DESCRIPTIONS, ROLE_LABELS, ROLE_ORDER } from '../auth/permissions';
import { staffApi, StaffApiError, type CreateStaffResponse, type StaffMember } from '../lib/staffApi';
import { formatDate } from '../lib/format';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  SelectField,
  SkeletonRows,
} from '../components/ui';

/* ──────────────────────────────────────────────────────────────────────────
   The care team.

   An administrator adds colleagues, sets what each may do, and withdraws
   access when someone leaves. Everything here is gated on `staff:manage`,
   and the API and the database each check the same thing independently —
   hiding a button is a courtesy, not a control.
   ────────────────────────────────────────────────────────────────────────── */

const ROLE_OPTIONS = ROLE_ORDER.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

/**
 * The temporary password, shown once.
 *
 * Deliberately a blocking panel rather than a toast: it cannot be recovered
 * afterwards, and something that disappears on its own is the wrong shape for
 * the only chance to read a credential.
 */
const NewAccountHandover: React.FC<{
  created: CreateStaffResponse;
  onDismiss: () => void;
}> = ({ created, onDismiss }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(created.temporary_password);
      setCopied(true);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access is refused in some browsers and over plain http.
      // The password is on screen regardless, so this needs no error state.
      setCopied(false);
    }
  };

  return (
    <div className="cf-arrive rounded-xl border border-teal-200 bg-teal-50 p-6">
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-[18px] w-[18px] flex-none text-teal-700" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-teal-900">
            {created.staff.full_name} can now sign in
          </h3>
          <p className="mt-1 text-base leading-6 text-teal-900/80">
            Give them this password directly. It is shown once and is not stored anywhere
            it can be read back — if it is lost, create the account again.
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <code className="select-all rounded-md border border-teal-200 bg-white px-3 py-2 text-base font-semibold tracking-wide text-oat-900">
              {created.temporary_password}
            </code>
            <Button
              variant="secondary"
              size="sm"
              icon={copied ? <Check /> : <Copy />}
              onClick={() => void copy()}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <p className="mt-3 text-xs text-teal-900/70">
            Signing in as {created.staff.email}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex-none rounded p-1 text-teal-700 hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

/** Add-a-colleague form. Collapsed until asked for, so the roster leads. */
const AddColleague: React.FC<{
  onCreated: (result: CreateStaffResponse) => void;
  onCancel: () => void;
}> = ({ onCreated, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('assessor');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    setError(null);
    setBusy(true);
    try {
      onCreated(
        await staffApi.create({ email: email.trim(), full_name: fullName.trim(), role }),
      );
    } catch (err) {
      setError(err instanceof StaffApiError ? err.message : 'The account could not be created.');
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="cf-arrive flex flex-col gap-5 rounded-xl border border-oat-200 bg-white p-6 shadow-sheet"
    >
      <h3 className="text-lg font-semibold text-teal-800">Add a colleague</h3>

      {error && <Alert tone="error" title="Could not add them">{error}</Alert>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Full name" required>
          {(props) => (
            <Input
              {...props}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="off"
              autoFocus
              required
              placeholder="Sophie Warren"
            />
          )}
        </Field>

        <Field label="Work email" required hint="They sign in with this.">
          {(props) => (
            <Input
              {...props}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              placeholder="sophie@yourcareagency.co.uk"
            />
          )}
        </Field>
      </div>

      <Field label="Role" required hint={ROLE_DESCRIPTIONS[role]}>
        {({ id, 'aria-describedby': describedBy }) => (
          <SelectField
            id={id}
            aria-describedby={describedBy}
            name="new-colleague-role"
            value={role}
            options={ROLE_OPTIONS}
            onValueChange={(value) => setRole(value as StaffRole)}
          />
        )}
      </Field>

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" loading={busy} icon={<UserPlus />}>
          Create account
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

/** One person on the roster. */
const RosterRow: React.FC<{
  member: StaffMember;
  isSelf: boolean;
  canManage: boolean;
  busy: boolean;
  onChange: (changes: { role?: StaffRole; is_active?: boolean }) => void;
}> = ({ member, isSelf, canManage, busy, onChange }) => (
  <article
    className={cnRow(member.is_active)}
    aria-busy={busy}
  >
    <Avatar name={member.full_name ?? undefined} size="md" />

    <div className="min-w-0 flex-1">
      <h3 className="truncate text-base font-semibold text-oat-900">
        {member.full_name || 'Unnamed'}
        {isSelf && <span className="ml-2 text-xs font-normal text-oat-600">(you)</span>}
      </h3>
      <p className="truncate text-xs text-oat-600">{member.email}</p>
    </div>

    {!member.is_active && <Badge tone="neutral">No access</Badge>}

    <p className="hidden w-24 flex-none text-sm text-oat-600 sm:block">
      {member.created_at ? formatDate(member.created_at) : ''}
    </p>

    {/* Changing your own role is refused by the API, so it is not offered.
        The select is full width below `sm` so it takes its own line rather
        than squeezing the name and address into an ellipsis. */}
    {canManage && !isSelf ? (
      <div className="w-full flex-none sm:w-[168px]">
        <SelectField
          aria-label={`Role for ${member.full_name || member.email || 'this colleague'}`}
          name={`role-${member.id}`}
          value={member.role}
          options={ROLE_OPTIONS}
          disabled={busy || !member.is_active}
          onValueChange={(value) => onChange({ role: value as StaffRole })}
        />
      </div>
    ) : (
      <div className="flex-none sm:w-[168px]">
        <Badge tone={member.role === 'admin' ? 'brand' : 'neutral'}>
          {ROLE_LABELS[member.role]}
        </Badge>
      </div>
    )}

    {canManage && (
      <div className="flex flex-none sm:w-[132px] sm:justify-end">
        {!isSelf && (
          <Button
            variant={member.is_active ? 'ghost' : 'secondary'}
            size="sm"
            disabled={busy}
            onClick={() => onChange({ is_active: !member.is_active })}
          >
            {member.is_active ? 'Withdraw access' : 'Restore access'}
          </Button>
        )}
      </div>
    )}
  </article>
);

function cnRow(active: boolean): string {
  return [
    'flex flex-wrap items-center gap-x-4 gap-y-2.5 px-5 py-3.5',
    'transition-colors duration-fast ease-out',
    active ? 'bg-white hover:bg-oat-100' : 'bg-oat-100 text-oat-600',
  ].join(' ');
}

export const TeamPage: React.FC = () => {
  const { staff } = useAuth();
  const canManage = can(staff, PERMISSIONS.staffManage);

  const [roster, setRoster] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [created, setCreated] = useState<CreateStaffResponse | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const result = await staffApi.list();
      setRoster(result.staff);
    } catch (err) {
      setError(err instanceof StaffApiError ? err.message : 'The team could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleChange = async (
    id: string,
    changes: { role?: StaffRole; is_active?: boolean },
  ) => {
    setError(null);
    setPendingId(id);

    // Applied optimistically and rolled back on refusal: the common case is a
    // one-field change that succeeds, and a row that freezes mid-interaction
    // reads as a fault.
    const previous = roster;
    setRoster((rows) => rows.map((r) => (r.id === id ? { ...r, ...changes } : r)));

    try {
      const updated = await staffApi.update(id, changes);
      setRoster((rows) => rows.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setRoster(previous);
      setError(err instanceof StaffApiError ? err.message : 'The change could not be saved.');
    } finally {
      setPendingId(null);
    }
  };

  const handleCreated = (result: CreateStaffResponse) => {
    setCreated(result);
    setAdding(false);
    setRoster((rows) => [result.staff, ...rows]);
  };

  return (
    <WorkspaceShell
      title="Team"
      description="Who can open service user records, and what each of them may do."
      actions={
        canManage &&
        !adding && (
          <Button icon={<UserPlus />} onClick={() => setAdding(true)}>
            Add colleague
          </Button>
        )
      }
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        {error && (
          <Alert tone="error" title="Something went wrong">
            {error}
            <div className="mt-2.5">
              <Button variant="secondary" size="sm" onClick={() => void load()}>
                Try again
              </Button>
            </div>
          </Alert>
        )}

        {created && (
          <NewAccountHandover created={created} onDismiss={() => setCreated(null)} />
        )}

        {adding && (
          <AddColleague onCreated={handleCreated} onCancel={() => setAdding(false)} />
        )}

        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-semibold text-oat-900">Care team</h2>
          {!loading && (
            <span className="rounded-full border border-oat-200 bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-oat-600">
              {roster.filter((m) => m.is_active).length} with access
            </span>
          )}
        </div>

        {loading ? (
          <SkeletonRows rows={4} />
        ) : roster.length === 0 ? (
          <Card flush>
            <EmptyState
              icon={<UserPlus />}
              title="No one on the team yet"
              description="Add the colleagues who need to open service user records."
              action={
                canManage ? (
                  <Button icon={<UserPlus />} onClick={() => setAdding(true)}>
                    Add colleague
                  </Button>
                ) : undefined
              }
            />
          </Card>
        ) : (
          <ul className="divide-y divide-oat-100 overflow-hidden rounded-xl border border-oat-200 bg-white shadow-sheet">
            {roster.map((member) => (
              <li key={member.id}>
                <RosterRow
                  member={member}
                  isSelf={member.id === staff?.id}
                  canManage={canManage}
                  busy={pendingId === member.id}
                  onChange={(changes) => void handleChange(member.id, changes)}
                />
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs leading-5 text-oat-600">
          Withdrawing access keeps a colleague's past entries attributable, which deleting
          the account would not. The last administrator cannot be removed.
        </p>
      </div>
    </WorkspaceShell>
  );
};
