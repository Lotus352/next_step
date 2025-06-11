import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type JobType from "@/types/job-type";
import type FeaturedJobType from "@/types/featured-job-type";
import type JobFilterType from "@/types/job-filter-type";
import type { JobRequest } from "@/types/job-type";
import { DEFAULT_JOB_SIZE, DEFAULT_MAX_SALARY
  , DEFAULT_PAGE, FEATURED_JOBS_LIMIT, DEFAULT_MIN_SALARY,
  DEFAULT_JOB_FILTER} from "@/constants";
import SalaryRangeType from "@/types/salary-range-type";
import { mapJobTypeToJobRequest } from "@/types/mappers/job-mapper";

/* ---------- State ---------- */
interface PageResp {
  content: JobType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface JobsState extends PageResp {
  featured: FeaturedJobType[];
  selected: JobType | null;
  request: JobRequest | null;
  employmentTypes: string[];
  filter: JobFilterType;
  status: "idle" | "loading" | "failed" | "succeeded";
  salaryRange: {
    minSalary: number;
    maxSalary: number;
  };
}


const initialState: JobsState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  featured: [],
  selected: null,
  request: null,
  employmentTypes: [],
  filter: DEFAULT_JOB_FILTER,  
  status: "idle",
  salaryRange: {
    minSalary: DEFAULT_MIN_SALARY,
    maxSalary: DEFAULT_MAX_SALARY,
  },
};

/* ---------- Thunks ---------- */
export const fetchFeaturedJobs = createAsyncThunk<
  FeaturedJobType[],
  { size?: number; filter?: string}
>("jobs/fetchFeatured", async ({ size = FEATURED_JOBS_LIMIT, filter = ""}) => {
  const { data } = await axiosClient.get("/api/jobs/featured", {
    params: { size, filter},
  });
  return data;
});

export const fetchJobById = createAsyncThunk<JobType, number>(
  "jobs/fetchById",
  async (id) => {
    const { data } = await axiosClient.get(`/api/jobs/${id}`);
    return data;
  },
);

export const fetchEmploymentTypes = createAsyncThunk<string[]>(
  "jobs/fetchEmploymentTypes",
  async () => {
    const { data } = await axiosClient.get("/api/jobs/employment-types");
    return data;
  },
);

export const filterJobs = createAsyncThunk<
  PageResp,
  { page?: number; size?: number; employerId?: number; filter: JobFilterType }
>("jobs/filter", async ({ page = DEFAULT_PAGE, size = DEFAULT_JOB_SIZE ,filter }) => {
  const { data } = await axiosClient.post("/api/jobs/filter", filter, {
    params: { page, size},
  });
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const addJob = createAsyncThunk<
  void,
  JobRequest
>("jobs/addJob", async (jobData) => {
  await axiosClient.post("/api/jobs", jobData);
});

export const toggleFavoriteJob = createAsyncThunk<
  void,
  { id: number}
>("jobs/toggleFavorite", async ({ id }) => {
  await axiosClient.put(`/api/jobs/${id}/favorite`);
});

  export const fetchSalaryRange = createAsyncThunk<
SalaryRangeType
>("jobs/fetchSalaryRange", async () => {
  const { data } = await axiosClient.get("/api/jobs/salary-max-min");
  return data;
});

/* ---------- Slice ---------- */
const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobSelected: (s) => {
      s.selected = null;
    },
    setFilter: (s, a: PayloadAction<JobFilterType>) => {
      s.filter = a.payload;
    },
    resetFilter: (s) => {
      s.filter = DEFAULT_JOB_FILTER;
    },
    updateJob: (s, a: PayloadAction<JobRequest | null>) => {
      s.request = a.payload;
    },
    initializeJob: (s) => {
      s.request = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* featured */
      .addCase(fetchFeaturedJobs.fulfilled, (s, a) => {
        s.featured = a.payload;
      })

      /* employment types */
      .addCase(fetchEmploymentTypes.fulfilled, (s, a) => {
        s.employmentTypes = a.payload;
      })

      /* filter */
      .addCase(filterJobs.pending, (s) => {
        s.status = "loading";
      })
      .addCase(filterJobs.fulfilled, (s, a) => {
        Object.assign(s, a.payload, { status: "idle" });
      })
      .addCase(filterJobs.rejected, (s) => {
        s.status = "failed";
      })

      /* detail */
      .addCase(fetchJobById.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchJobById.fulfilled, (s, a) => {
        s.status = "idle";
        s.selected = a.payload;
        s.request = mapJobTypeToJobRequest(a.payload);
      })
      .addCase(fetchJobById.rejected, (s) => {
        s.status = "failed";
      })

      /* add job */
      .addCase(addJob.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addJob.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addJob.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleFavoriteJob.fulfilled, (state, action) => {
        state.featured = state.featured.map((job) =>
          job.jobId === action.meta.arg.id ? { ...job, isFavorite: !job.isFavorite } : job
        );
      })
      .addCase(fetchSalaryRange.fulfilled, (s, a) => {
        s.salaryRange = {
          minSalary: a.payload.minSalary ?? DEFAULT_MIN_SALARY,
          maxSalary: a.payload.maxSalary ?? DEFAULT_MAX_SALARY,
        };
      });
  },
});

export const { clearJobSelected, setFilter, resetFilter, updateJob, initializeJob } = jobsSlice.actions;
export default jobsSlice.reducer;
