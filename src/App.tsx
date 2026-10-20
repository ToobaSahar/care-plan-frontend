import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ClipboardList, FileText, Plus, Search, User, Users } from 'lucide-react';
import { AssessmentPage } from './pages/AssessmentPage';
import { CriticalInformationPage } from './pages/CriticalInformationPage';
import { formatDate } from './lib/format';
import { cn } from './lib/cn';
import { useServiceUsers } from './hooks/useServiceUsers';
import { WorkSurface } from './components/layout/WorkSurface';
import {
  Alert,
  Avatar,
  Button,
  EmptyState,
  Logo,
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
    <div className="flex min-h-screen bg-teal-800">
      {/* Navigation — the same Slate Teal field the assessment rail uses. */}
      <nav
        aria-label="Main"
        className="cf-rail hidden w-[212px] flex-none flex-col bg-teal-800 py-5 lg:flex"
      >
        <div className="px-5 pb-7">
          <Logo onDark size="md" />
        </div>

        {/* One destination, because there is genuinely one list. Assessments and
            care plans belong to a person, so they are reached from that person's
            row rather than from nav items that cannot know who is meant. */}
        <p className="px-5 pb-2 text-2xs font-semibold uppercase text-teal-400">Workspace</p>
        <span
          aria-current="page"
          className="flex items-center gap-3 bg-teal-600 px-5 py-2.5 text-base font-semibold text-white shadow-[inset_3px_0_0_#78BDB5]"
        >
          <Users className="h-4 w-4 flex-none" aria-hidden="true" />
          Caseload
        </span>

        <p className="mt-auto px-5 text-2xs leading-5 text-teal-100/50">
          Universal Care Needs Assessment
        </p>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="px-6 pb-6 pt-5">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-end gap-x-4 gap-y-4">
            <div className="lg:hidden">
              <Logo size="sm" variant="mark" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-white">Caseload</h1>
              <p className="mt-1.5 text-base text-teal-100/80">
                Service users with an assessment or care plan on record.
              </p>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2.5">
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
            </div>
          </div>
        </header>

        <WorkSurface className="flex-1 px-6 py-7">
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
        </WorkSurface>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/assessments" replace />} />
          <Route path="/assessments" element={<CaseloadPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/:id" element={<AssessmentPage />} />
          <Route path="/critical-information" element={<CriticalInformationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
