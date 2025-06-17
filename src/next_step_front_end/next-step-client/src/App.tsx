import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "@/pages/home-page.tsx";
import JobDetailPage from "@/pages/job-detail-page.tsx";
import JobListingsPage from "@/pages/job-listings-page.tsx";
import JobApplicationReviewPage from "@/pages/job-application-review-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import JobPostPage from "@/pages/job-post-page.tsx";
import { AppDispatch, RootState } from "./store/store";
import { initializeAuth } from "@/store/slices/auth-slice.ts";
import Loading from "@/components/loading.tsx";
import UserProfilePage from "@/pages/user-profile-page.tsx";
import SignInPage from "@/pages/sign-in-page.tsx";
import SignupPage from "@/pages/sign-up-page.tsx";
import FavoriteJobsPage from "@/pages/favorite-jobs-page.tsx";

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles = [] }) => {
  const { status, user } = useSelector((state: RootState) => state.auth);

  // Still loading
  if (status === "loading") {
    return <Loading />;
  }

  // Not authenticated
  if (status !== "authenticated" || !user) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check roles if specified
  if (allowedRoles.length > 0) {
    const userRoleNames = user.roles.map((role) => role.roleName.toLowerCase());
    const hasAllowedRole = allowedRoles.some((allowedRole) =>
      userRoleNames.includes(allowedRole.toLowerCase()),
    );

    if (!hasAllowedRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Auth Route Component (redirects authenticated users)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSelector((state: RootState) => state.auth);

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.auth);

  // Initialize auth on app startup
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading while initializing auth
  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <main className={"w-full h-full"}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            <Route
              path="/sign-in"
              element={
                <AuthRoute>
                  <SignInPage />
                </AuthRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              }
            />

            <Route
              path="candidate/favorite-jobs"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <FavoriteJobsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/candidate/profile/:username"
              element={<UserProfilePage />}
            />

            <Route
              path="/employer/candidates"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <JobApplicationReviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/post-job"
              element={
                <ProtectedRoute allowedRoles={["employer", "admin"]}>
                  <JobPostPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<ErrorPage message={"Not found page"} />}
            />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
