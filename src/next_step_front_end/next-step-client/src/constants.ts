import type JobFilterType from "@/types/job-filter-type";
import type JobApplicationFilterType from "@/types/job-application-filter-type";

export const DEFAULT_LEVEL_SIZE = 50;
export const DEFAULT_SKILL_SIZE = 50;
export const DEFAULT_JOB_SIZE = 10;
export const DEFAULT_REVIEW_SIZE = 5;
export const DEFAULT_LOCATION_SIZE = 50;
export const DEFAULT_JOB_APPLICATION_SIZE = 10;
export const DEFAULT_PAGE = 0;
export const DEFAULT_STATUS = "ACTIVE";
export const DEFAULT_EXPIRY_DATE = new Date().toISOString();
export const DEFAULT_CURRENCY = null
export const DEFAULT_PAY_PERIOD = null
export const DEFAULT_MIN_SALARY = 0
export const DEFAULT_MAX_SALARY = 1000000
export const DEFAULT_SORT_BY = "createdAt"
export const DEFAULT_SORT_DIRECTION = "DESC"
export const DEFAULT_EMPLOYMENT_TYPE = null
export const DEFAULT_COUNTRY = null
export const DEFAULT_CITY = null
export const DEFAULT_DATE_POSTED = null
export const DEFAULT_KEYWORD = null

export const FEATURED_CATEGORIES_LIMIT = 12;
export const FEATURED_COMPANIES_LIMIT = 8;
export const FEATURED_JOBS_LIMIT = 6;
export const PAY_PERIODS = ["Yearly", "Monthly", "Weekly", "Daily", "Hourly"]
export const SALARY_STEP = 100

export const DATE_POSTED_LABELS: Record<string, string> = {
  day: "Last 24 hours",
  week: "Last week",
  month: "Last month",
};

export const DEFAULT_JOB_FILTER : JobFilterType = {
  country: DEFAULT_COUNTRY,
  city: DEFAULT_CITY,
  employmentType: DEFAULT_EMPLOYMENT_TYPE,
  experienceLevels: [],
  salaryRange: {
    minSalary: DEFAULT_MIN_SALARY ,
    maxSalary: DEFAULT_MAX_SALARY,
  },
  payPeriod: DEFAULT_PAY_PERIOD  ,
  currency: DEFAULT_CURRENCY,
  skills: [],
  datePosted: DEFAULT_DATE_POSTED,
  keyword: DEFAULT_KEYWORD,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};  

export const DEFAULT_JOB_APPLICATION_FILTER : JobApplicationFilterType = {
  status: DEFAULT_STATUS,
  keyword: DEFAULT_KEYWORD,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
}   

