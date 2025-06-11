import { useEffect } from "react";
import { useDispatch} from "react-redux";
import HomePage from "@/pages/home-page.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobDetailPage from "@/pages/job-detail-page.tsx";
import SignInForm from "@/components/auth/signin-form.tsx";
import SignupForm from "@/components/auth/signup-form.tsx";
import JobListingsPage from "@/pages/job-listings-page.tsx";
import JobApplicationReviewPage from "@/pages/job-application-review-page.tsx";
import ErrorPage from "@/pages/error-page.tsx";
import { AppDispatch} from "./store/store";
import { isTokenExpired } from "./api/axios-client";
import { fetchUserByUsername, refreshToken, restoreAuthFromToken} from "./store/slices/auth-slice";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import JobPostPage from "@/pages/job-post-page.tsx";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      if (isTokenExpired(accessToken)) {
        dispatch(refreshToken());
      } else {
        try {
          const decodedToken = jwtDecode<JwtPayload>(accessToken);
          const username = decodedToken?.sub;
          if (username) {
            const user = await dispatch(fetchUserByUsername(username)).unwrap();
            dispatch(restoreAuthFromToken({ token: accessToken, user }));
          } else {
            console.error("Username is undefined");
          }
        } catch (error) {
          console.error("Failed to restore auth:", error);
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <main className={"w-full h-full"}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/jobs" element={<JobListingsPage />} />
            <Route path="/sign-in" element={<SignInForm />} />
            <Route path="/sign-up" element={<SignupForm />} />
            <Route
              path="/employer/candidates"
              element={<JobApplicationReviewPage />}
            />
            <Route path="/employer/post-job" element={<JobPostPage/>} />
            <Route path="*" element={<ErrorPage message={"Not found page"}  />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
