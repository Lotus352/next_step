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
import salaryReducer from "@/store/slices/salary-slice.ts";

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
    salaries: salaryReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;