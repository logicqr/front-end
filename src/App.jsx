import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, Protected } from './lib/auth';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './Layout';

/**
 * Routes.
 *
 * Every page is a lazy chunk. Before this the whole app — all 13,000-odd lines
 * plus recharts, jspdf and framer-motion — shipped in one bundle to a visitor
 * who only wanted the landing page.
 *
 * Access is decided by `<Protected>`, which asks the server who the caller is.
 * The previous guards only checked that *some* string existed in
 * sessionStorage, with no expiry and no role, so an expired session rendered a
 * dashboard full of failed requests and a staff token rendered the admin UI.
 */

/* ---------- marketing ---------- */
const MarketingLayout = lazy(() => import('./pages/marketing/MarketingLayout'));
const Landing = lazy(() => import('./pages/marketing/Landing'));
const PricingPage = lazy(() => import('./pages/marketing/PricingPage'));
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const BlogPost = lazy(() => import('./pages/blog/BlogPost'));
const Features = lazy(() => import('./components/Landing-pages/Features'));
const Docx = lazy(() => import('./components/Landing-pages/Docx'));
const Terms = lazy(() => import('./components/Landing-pages/Terms'));
const NotFound = lazy(() => import('./pages/NotFound'));

/* ---------- public product pages ---------- */
const ReviewForm = lazy(() => import('./components/dashboard/ReviewForm'));
const UserLogin = lazy(() => import('./components/dashboard/Userlogin'));
const UserRegister = lazy(() => import('./components/dashboard/UserRegister'));
const EmployeeLogin = lazy(() => import('./components/companyDashboard/Login'));

/* ---------- customer dashboard ---------- */
const UserDashboard = lazy(() => import('./components/dashboard/Dashboard'));
const UserAccountSettings = lazy(() => import('./components/dashboard/AccountSettings'));
const UserHelp = lazy(() => import('./components/dashboard/Help'));
const Transactions = lazy(() => import('./components/dashboard/Transactions'));

/* ---------- staff & admin ---------- */
const StaffDashboard = lazy(() => import('./components/companyDashboard/staffDashboard/StaffDashboard'));
const StaffAccountSettings = lazy(() => import('./components/companyDashboard/staffDashboard/AccountSettings'));
const AdminDashboard = lazy(() => import('./components/companyDashboard/adminDashboard/AdminDashbord'));
const Payout = lazy(() => import('./components/companyDashboard/adminDashboard/Payout'));
const PayoutDetails = lazy(() => import('./components/companyDashboard/adminDashboard/PayoutDetails'));
const EmployeesDetails = lazy(() => import('./components/companyDashboard/adminDashboard/EmployeesDetails'));
const StaffRegister = lazy(() => import('./components/companyDashboard/adminDashboard/StaffRegister'));
const EmployeeDetailsPage = lazy(() => import('./components/companyDashboard/adminDashboard/EmployeeDetailsPage'));
const AdminDetailsPage = lazy(() => import('./components/companyDashboard/adminDashboard/AdminDetailsPage'));
const HelpDashboard = lazy(() => import('./components/companyDashboard/adminDashboard/HelpCenter/HelpDashboard'));
const HelpStatusUpdate = lazy(() => import('./components/companyDashboard/adminDashboard/HelpCenter/HelpStatusUpdate'));
const TempOrderList = lazy(() => import('./components/companyDashboard/adminDashboard/TempOrderList'));
const Analytics = lazy(() => import('./components/companyDashboard/adminDashboard/Analytics'));

/** Shown while a route chunk loads. Deliberately quiet — it is usually brief. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* ---------------- marketing site ---------------- */}
                <Route element={<MarketingLayout />}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/blog" element={<BlogIndex />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/docs" element={<Docx />} />
                  <Route path="/terms-condition" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* ---------------- public, standalone ---------------- */}
                {/* The QR code lands here. No nav, no footer, no distractions. */}
                <Route path="/review/:id" element={<ReviewForm />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/register" element={<UserRegister />} />
                <Route path="/admin-login" element={<EmployeeLogin />} />

                {/* ---------------- customer dashboard ---------------- */}
                <Route element={<DashboardLayout />}>
                  <Route
                    path="/dashboard/:id"
                    element={
                      <Protected kind="user">
                        <UserDashboard />
                      </Protected>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Protected kind="user">
                        <UserAccountSettings />
                      </Protected>
                    }
                  />
                  <Route
                    path="/help-centre"
                    element={
                      <Protected kind="user">
                        <UserHelp />
                      </Protected>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <Protected kind="user">
                        <Transactions />
                      </Protected>
                    }
                  />

                  {/* ---------------- staff ---------------- */}
                  <Route
                    path="/staff/dashboard/:id"
                    element={
                      <Protected kind="employee">
                        <StaffDashboard />
                      </Protected>
                    }
                  />
                  <Route
                    path="/account-setting"
                    element={
                      <Protected kind="employee">
                        <StaffAccountSettings />
                      </Protected>
                    }
                  />
                  <Route
                    path="/temp-orders"
                    element={
                      <Protected kind="employee">
                        <TempOrderList />
                      </Protected>
                    }
                  />
                  <Route
                    path="/payout/:employeeId"
                    element={
                      <Protected kind="employee">
                        <PayoutDetails />
                      </Protected>
                    }
                  />

                  {/* ---------------- admin only ---------------- */}
                  <Route
                    path="/admin/dashboard/:id"
                    element={
                      <Protected roles={['ADMIN']}>
                        <AdminDashboard />
                      </Protected>
                    }
                  />
                  <Route
                    path="/payout"
                    element={
                      <Protected roles={['ADMIN']}>
                        <Payout />
                      </Protected>
                    }
                  />
                  <Route
                    path="/employees-details"
                    element={
                      <Protected roles={['ADMIN']}>
                        <EmployeesDetails />
                      </Protected>
                    }
                  />
                  <Route
                    path="/employees-details/staff-registration"
                    element={
                      <Protected roles={['ADMIN']}>
                        <StaffRegister />
                      </Protected>
                    }
                  />
                  <Route
                    path="/employees-details/:employeeId"
                    element={
                      <Protected roles={['ADMIN']}>
                        <EmployeeDetailsPage />
                      </Protected>
                    }
                  />
                  <Route
                    path="/employees-details/admin/:employeeId"
                    element={
                      <Protected roles={['ADMIN']}>
                        <AdminDetailsPage />
                      </Protected>
                    }
                  />
                  <Route
                    path="/help-dashboard"
                    element={
                      <Protected roles={['ADMIN']}>
                        <HelpDashboard />
                      </Protected>
                    }
                  />
                  <Route
                    path="/help-dashboard/:id"
                    element={
                      <Protected roles={['ADMIN']}>
                        <HelpStatusUpdate />
                      </Protected>
                    }
                  />
                  {/* Attribution and click tracking: admin only. */}
                  <Route
                    path="/analytics"
                    element={
                      <Protected roles={['ADMIN']}>
                        <Analytics />
                      </Protected>
                    }
                  />
                </Route>

                {/* Old link shapes that used to exist. */}
                <Route path="/terms" element={<Navigate to="/terms-condition" replace />} />
                <Route path="/blogs" element={<Navigate to="/blog" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
