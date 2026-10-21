import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClipboardList, FileText, Plus, Search, User } from 'lucide-react';
import { AssessmentPage } from './pages/AssessmentPage';
import { SignInPage } from './pages/SignInPage';
import { TeamPage } from './pages/TeamPage';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { CriticalInformationPage } from './pages/CriticalInformationPage';
import { formatDate } from './lib/format';
import { cn } from './lib/cn';
import { useServiceUsers } from './hooks/useServiceUsers';
import { WorkspaceShell } from './components/layout/WorkspaceShell';
import {
  Alert,
  Avatar,
  Button,
  EmptyState,
  Pagination,
  SkeletonRows,
} from './components/ui';
import './index.css';

const PAGE_SIZE = 12;

/**
 * Caseload — the product's first screen.
 *
 * It opens on who needs attention rather than on a blank form, so the first
 * thing anyone sees (assessor or otherwise) is the work, not an empty shell.
 * Paging and searching are both done in Postgres; see useServiceUsers.
 */
const CaseloadPage: React.FC = () => {
  const navigate = useNavigate();
  const listTopRef = useRef<HTMLDivElement>(null);

  const {
    rows,
    total,
    page,
    pageCount,
    pageSize,
    isInitialLoading,
    isFetching,
    error,
    query,
    setQuery,
    setPage,
    retry,
  } = useServiceUsers({ pageSize: PAGE_SIZE });

  const handleViewCarePlan = (userId: string) => {
    navigate(`/critical-information?userId=${userId}`);
  };

  // Changing page keeps the scroll position otherwise, which lands the reader
  // halfway down a list they have not seen the top of.
  const handlePageChange = (next: number) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const isSearching = query.trim().length > 0;

  return (
    <WorkspaceShell
      title="Caseload"
      description="Service users with an assessment or care plan on record."
      actions={
        <>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-300"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or id"
              aria-label="Search caseload"
              className="h-10 w-full rounded-md border border-teal-600 bg-teal-900/60 pl-9 pr-3 text-base text-white placeholder:text-teal-300/80 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/40 sm:w-64"
            />
          </div>
          <Button variant="onDark" icon={<Plus />} onClick={() => navigate('/assessment')}>
            New assessment
          </Button>
        </>
      }
    >
      <div ref={listTopRef} className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        {error && (
          <Alert tone="error" title="The caseload could not be loaded">
            {error}
            <div className="mt-2.5">
              <Button variant="secondary" size="sm" onClick={retry}>
                Try again
              </Button>
            </div>
          </Alert>
        )}

        <div className="flex items-baseline gap-2.5">
          <h2 className="text-lg font-semibold text-oat-900">Service users</h2>
          {!isInitialLoading && (
            <span className="text-xs tabular-nums text-oat-600">
              {total}
              {isSearching ? ' matching' : ''}
            </span>
          )}
        </div>

        {isInitialLoading ? (
          <SkeletonRows rows={6} />
        ) : rows.length === 0 ? (
          <div className="rounded-xl border border-oat-200 bg-white">
            <EmptyState
              icon={<User />}
              title={isSearching ? 'Nothing matches that search' : 'No service users yet'}
              description={
                isSearching
                  ? 'Try a different name, or clear the search to see the whole caseload.'
                  : 'Once an assessment is started, the person it is about appears here with their care plan.'
              }
              action={
                isSearching ? (
                  <Button variant="secondary" onClick={() => setQuery('')}>
                    Clear search
                  </Button>
                ) : (
                  <Button icon={<Plus />} onClick={() => navigate('/assessment')}>
                    Start an assessment
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <ul
            className={cn(
              'flex flex-col gap-2.5 transition-opacity duration-fast',
              isFetching && 'opacity-60',
            )}
            aria-busy={isFetching}
          >
            {rows.map((user) => (
              <li key={user.id}>
                <article className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-oat-200 bg-white px-4 py-2.5 shadow-xs transition-shadow duration-fast ease-out hover:shadow-sm">
                  <Avatar name={user.full_name ?? undefined} size="md" />

                  <h3 className="min-w-0 flex-1 truncate text-base font-semibold text-oat-900">
                    {user.full_name || 'Unnamed service user'}
                  </h3>

                  <p className="hidden w-28 flex-none text-xs text-oat-600 sm:block">
                    {formatDate(user.created_at)}
                  </p>

                  {/* Both of a person's destinations, offered from the person
                      — which is the only context in which either makes sense. */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/assessment/${user.id}`)}
                    icon={<ClipboardList />}
                  >
                    Assessment
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewCarePlan(user.id)}
                    icon={<FileText />}
                  >
                    Care plan
                  </Button>
                </article>
              </li>
            ))}
          </ul>
        )}

        {!isInitialLoading && rows.length > 0 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            total={total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            busy={isFetching}
            itemLabel="service users"
          />
        )}
      </div>
    </WorkspaceShell>
  );
};

/**
 * Every route but sign-in sits behind the gate.
 *
 * Wrapping each element rather than nesting under one guard route keeps the
 * URLs unchanged — a bookmark saved before this existed still resolves, it
 * just passes through sign-in on the way.
 */
const guarded = (element: React.ReactNode) => <RequireAuth>{element}</RequireAuth>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<Navigate to="/assessments" replace />} />
            <Route path="/assessments" element={guarded(<CaseloadPage />)} />
            <Route path="/assessment" element={guarded(<AssessmentPage />)} />
            <Route path="/assessment/:id" element={guarded(<AssessmentPage />)} />
            <Route
              path="/critical-information"
              element={guarded(<CriticalInformationPage />)}
            />
            {/* The page itself offers nothing without `staff:read`, and the
                API refuses the calls regardless, so the guard here is the
                ordinary one. */}
            <Route path="/team" element={guarded(<TeamPage />)} />
            {/* An unknown path should not render a blank page. */}
            <Route path="*" element={<Navigate to="/assessments" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
