import React, { useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Plus, Search, User } from 'lucide-react';
import { AssessmentPage } from './pages/AssessmentPage';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { TeamPage } from './pages/TeamPage';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './auth/RequireAuth';
import { CriticalInformationPage } from './pages/CriticalInformationPage';
import { cn } from './lib/cn';
import { useServiceUsers } from './hooks/useServiceUsers';
import { useServiceUserSignals } from './hooks/useServiceUserSignals';
import { WorkspaceShell } from './components/layout/WorkspaceShell';
import { ServiceUsersAtAGlance, NeedsAttention } from './components/serviceUsers/ServiceUsersOverview';
import { SERVICE_USER_COLUMNS, ServiceUserListRow } from './components/serviceUsers/ServiceUserListRow';
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Pagination,
  SkeletonRows,
} from './components/ui';
import './index.css';

const PAGE_SIZE = 12;

/**
 * Service users — the product's first screen.
 *
 * It opens on who needs attention rather than on a blank form, so the first
 * thing anyone sees (assessor or otherwise) is the work, not an empty shell.
 * Paging and searching are both done in Postgres; see useServiceUsers. The
 * signals beside each person are read separately and never block the list;
 * see useServiceUserSignals.
 */
const ServiceUsersPage: React.FC = () => {
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

  const { overview, progress } = useServiceUserSignals(rows.map((r) => r.id));

  const handleViewCarePlan = (userId: string) => {
    navigate(`/critical-information?userId=${userId}`);
  };

  const openAssessment = (userId: string) => navigate(`/assessment/${userId}`);

  // Changing page keeps the scroll position otherwise, which lands the reader
  // halfway down a list they have not seen the top of.
  const handlePageChange = (next: number) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  const isSearching = query.trim().length > 0;

  return (
    <WorkspaceShell
      title="Service users"
      description="Service users with an assessment or care plan on record."
      wide
      actions={
        <>
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-oat-500"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or id"
              aria-label="Search service users"
              className="h-10 w-full rounded-md border border-oat-300 bg-white pl-10 pr-3 text-base text-oat-900 shadow-xs transition-[border-color,box-shadow] duration-fast ease-out placeholder:text-oat-500 hover:border-oat-400 focus:border-teal-600 focus:shadow-focus focus:outline-none"
            />
          </div>
          <Button icon={<Plus />} onClick={() => navigate('/assessment')}>
            New assessment
          </Button>
        </>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        {error && (
          <Alert tone="error" title="Service users could not be loaded">
            {error}
            <div className="mt-2.5">
              <Button variant="secondary" size="sm" onClick={retry}>
                Try again
              </Button>
            </div>
          </Alert>
        )}

        {/* The picture across all service users, set aside while searching so the
            results lead. */}
        {!isSearching && !error && (
          <>
            <ServiceUsersAtAGlance overview={overview} />
            <NeedsAttention
              overview={overview}
              onOpenAssessment={openAssessment}
              onOpenCarePlan={handleViewCarePlan}
            />
          </>
        )}

        <section ref={listTopRef} aria-labelledby="service-users" className="flex scroll-mt-6 flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <h2 id="service-users" className="text-lg font-semibold text-oat-900">
              All service users
            </h2>
            {!isInitialLoading && (
              <span className="rounded-full border border-oat-200 bg-white px-2 py-0.5 text-xs font-medium tabular-nums text-oat-600">
                {total}
                {isSearching ? ' matching' : ''}
              </span>
            )}
          </div>

          {isInitialLoading ? (
            <SkeletonRows rows={6} />
          ) : rows.length === 0 ? (
            <Card flush>
              <EmptyState
                icon={<User />}
                title={isSearching ? 'Nothing matches that search' : 'No service users yet'}
                description={
                  isSearching
                    ? 'Try a different name, or clear the search to see all service users.'
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
            </Card>
          ) : (
            <Card
              flush
              className={cn('overflow-hidden transition-opacity duration-fast', isFetching && 'opacity-60')}
            >
              <div
                aria-hidden="true"
                className={`hidden items-center gap-x-4 border-b border-oat-200 bg-oat-100 px-5 py-2.5 text-xs font-medium text-oat-500 min-[1360px]:grid ${SERVICE_USER_COLUMNS}`}
              >
                <span />
                <span>Service user</span>
                <span>Sections saved</span>
                <span>Highest risk</span>
                <span>Care plan</span>
                <span />
              </div>
              <ul className="divide-y divide-oat-100" aria-busy={isFetching}>
                {rows.map((user) => (
                  <li key={user.id}>
                    <ServiceUserListRow
                      user={user}
                      saved={
                        progress.status === 'ready'
                          ? progress.data.get(user.id)
                          : progress.status === 'loading'
                          ? undefined
                          : null
                      }
                      riskStatus={overview.status}
                      risk={overview.status === 'ready' ? overview.data.risks.get(user.id) : undefined}
                      planStatus={overview.status}
                      planReady={
                        overview.status === 'ready' && overview.data.carePlanIds.has(user.id)
                      }
                      onOpenAssessment={() => openAssessment(user.id)}
                      onOpenCarePlan={() => handleViewCarePlan(user.id)}
                    />
                  </li>
                ))}
              </ul>
            </Card>
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
        </section>
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
            {/* The home page is public: it shows sample data only and reads no
                records. Signed-in staff are offered their workspace from it. */}
            <Route path="/" element={<HomePage />} />
            <Route path="/assessments" element={guarded(<ServiceUsersPage />)} />
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
