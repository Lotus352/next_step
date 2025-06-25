import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./slices/jobs-slice.ts";
import industriesReducer from "./slices/industries-slice.ts";
import companiesReducer from "./slices/companies-slice.ts";
import companyReviewsReducer from "./slices/company-reviews-slice.ts";
import locationReducer from "./slices/locations-slice.ts";
import authReducer from "./slices/auth-slice.ts";
import jobApplicationsReducer from "./slices/job-applications-slice.ts";
import notificationsReducer from "./slices/notifications-slice.ts";
import skillsReducer from "./slices/skills-slice.ts";
import experienceLevelsReducer from "./slices/experience-levels-slice.ts";
import salaryReducer from "@/store/slices/salaries-slice.ts";
import userReducer from "@/store/slices/users-slice.ts";
import favoriteJobReducer from "@/store/slices/favorite-jobs-slice.ts";
import certificationReducer from "@/store/slices/certifications-slice.ts";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    companies: companiesReducer,
    industries: industriesReducer,
    companyReviews: companyReviewsReducer,
    locations: locationReducer,
    auth: authReducer,
    jobApplications: jobApplicationsReducer,
    notifications: notificationsReducer,
    skills: skillsReducer,
    experienceLevels: experienceLevelsReducer,
    salaries: salaryReducer,
    user: userReducer,
    favoriteJobs: favoriteJobReducer,
    certifications: certificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;