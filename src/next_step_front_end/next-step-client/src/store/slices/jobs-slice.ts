import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type JobType from "@/types/job-type";
import type FeaturedJobType from "@/types/featured-job-type";
import type JobFilterType from "@/types/job-filter-type";
import type {JobRequest} from "@/types/job-type";
import {
    DEFAULT_JOB_SIZE, DEFAULT_MAX_SALARY
    , DEFAULT_PAGE, FEATURED_JOBS_LIMIT, DEFAULT_MIN_SALARY,
    DEFAULT_JOB_FILTER
} from "@/constants";
import SalaryRangeType from "@/types/salary-range-type";

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

    statuses: {
        filtering: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
        adding: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
        fetchingFeatured: "idle" | "loading" | "failed" | "succeeded";
        fetchingEmploymentTypes: "idle" | "loading" | "failed" | "succeeded";
        fetchingSalaryRange: "idle" | "loading" | "failed" | "succeeded";
        togglingFavorite: "idle" | "loading" | "failed" | "succeeded";
    };

    salaryRange: {
        minSalary: number;
        maxSalary: number;
    };

    error: string | null;
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

    statuses: {
        filtering: "idle",
        fetchingById: "idle",
        adding: "idle",
        updating: "idle",
        deleting: "idle",
        fetchingFeatured: "idle",
        fetchingEmploymentTypes: "idle",
        fetchingSalaryRange: "idle",
        togglingFavorite: "idle",
    },

    salaryRange: {
        minSalary: DEFAULT_MIN_SALARY,
        maxSalary: DEFAULT_MAX_SALARY,
    },

    error: null,
};

/* ---------- Thunks ---------- */
export const fetchFeaturedJobs = createAsyncThunk<
    FeaturedJobType[],
    { size?: number; filter?: string }
>("jobs/fetchFeatured", async ({size = FEATURED_JOBS_LIMIT, filter = ""}) => {
    const {data} = await axiosClient.get("/api/jobs/featured", {
        params: {size, filter},
    });
    return data;
});

export const fetchJobById = createAsyncThunk<JobType, number>(
    "jobs/fetchById",
    async (id) => {
        const {data} = await axiosClient.get(`/api/jobs/${id}`);
        return data;
    },
);

export const fetchEmploymentTypes = createAsyncThunk<string[]>(
    "jobs/fetchEmploymentTypes",
    async () => {
        const {data} = await axiosClient.get("/api/jobs/employment-types");
        return data;
    },
);

export const filterJobs = createAsyncThunk<
    PageResp,
    { page?: number; size?: number; employerId?: number; filter: JobFilterType }
>("jobs/filter", async ({page = DEFAULT_PAGE, size = DEFAULT_JOB_SIZE, filter}) => {
    const {data} = await axiosClient.post("/api/jobs/filter", filter, {
        params: {page, size},
    });
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

export const addJob = createAsyncThunk<
    JobType,
    JobRequest
>("jobs/addJob", async (jobData) => {
    const {data} = await axiosClient.post("/api/jobs", jobData);
    return data;
});

export const updateJob = createAsyncThunk<
    JobType,
    { id: number; jobData: JobRequest }
>("jobs/updateJob", async ({id, jobData}) => {
    const {data} = await axiosClient.put(`/api/jobs/${id}`, jobData);
    return data;
});

export const deleteJob = createAsyncThunk<
    void,
    { id: number }
>("jobs/deleteJob", async ({id}) => {
    await axiosClient.delete(`/api/jobs/${id}`);
});

export const toggleFavoriteJob = createAsyncThunk<
    void,
    { id: number }
>("jobs/toggleFavorite", async ({id}) => {
    await axiosClient.put(`/api/jobs/${id}/favorite`);
});

export const fetchSalaryRange = createAsyncThunk<
    SalaryRangeType
>("jobs/fetchSalaryRange", async () => {
    const {data} = await axiosClient.get("/api/jobs/salary-max-min");
    return data;
});

/* ---------- Slice ---------- */
const jobsSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        clearJobs: () => initialState,
        clearJobSelected: (s) => {
            s.selected = initialState.selected;
        },
        clearJobError: (s) => {
            s.error = initialState.error;
        },
        clearJobRequest: (s) => {
            s.request = initialState.request;
        },
        clearFeaturedJobs: (s) => {
            s.featured = [];
        },
        resetJobFilter: (s) => {
            s.filter = initialState.filter;
        },
        setJobFilter: (s, a: PayloadAction<JobFilterType>) => {
            s.filter = a.payload;
        },
        updateJobRequest: (s, a: PayloadAction<JobRequest | null>) => {
            s.request = a.payload;
        },
        initializeJobRequest(s) {
            s.request = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* Featured Jobs */
            .addCase(fetchFeaturedJobs.pending, (s) => {
                s.statuses.fetchingFeatured = "loading";
            })
            .addCase(fetchFeaturedJobs.fulfilled, (s, a) => {
                s.statuses.fetchingFeatured = "succeeded";
                s.featured = a.payload;
            })
            .addCase(fetchFeaturedJobs.rejected, (s) => {
                s.statuses.fetchingFeatured = "failed";
                s.error = "Failed to fetch featured jobs";
            })

            /* Employment Types */
            .addCase(fetchEmploymentTypes.pending, (s) => {
                s.statuses.fetchingEmploymentTypes = "loading";
            })
            .addCase(fetchEmploymentTypes.fulfilled, (s, a) => {
                s.statuses.fetchingEmploymentTypes = "succeeded";
                s.employmentTypes = a.payload;
            })
            .addCase(fetchEmploymentTypes.rejected, (s) => {
                s.statuses.fetchingEmploymentTypes = "failed";
                s.error = "Failed to fetch employment types";
            })

            /* Filter Jobs */
            .addCase(filterJobs.pending, (s) => {
                s.statuses.filtering = "loading";
            })
            .addCase(filterJobs.fulfilled, (s, a) => {
                s.statuses.filtering = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(filterJobs.rejected, (s) => {
                s.statuses.filtering = "failed";
                s.error = "Failed to filter jobs";
            })

            /* Fetch Job By Id */
            .addCase(fetchJobById.pending, (s) => {
                s.statuses.fetchingById = "loading";
            })
            .addCase(fetchJobById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchJobById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch job by id";
            })

            /* Add Job */
            .addCase(addJob.pending, (s) => {
                s.statuses.adding = "loading";
            })
            .addCase(addJob.fulfilled, (s, a) => {
                s.statuses.adding = "succeeded";
                // Optionally add the new job to the content array
                s.content.unshift(a.payload);
                s.totalElements += 1;
            })
            .addCase(addJob.rejected, (s) => {
                s.statuses.adding = "failed";
                s.error = "Failed to add job";
            })

            /* Update Job */
            .addCase(updateJob.pending, (s) => {
                s.statuses.updating = "loading";
            })
            .addCase(updateJob.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";
                // Update the job in content array if it exists
                const jobIndex = s.content.findIndex(job => job.jobId === a.payload.jobId);
                if (jobIndex !== -1) {
                    s.content[jobIndex] = a.payload;
                }
                // Update selected job if it's the same
                if (s.selected && s.selected.jobId === a.payload.jobId) {
                    s.selected = a.payload;
                }
            })
            .addCase(updateJob.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update job";
            })

            /* Delete Job */
            .addCase(deleteJob.pending, (s) => {
                s.statuses.deleting = "loading";
            })
            .addCase(deleteJob.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                const jobId = a.meta.arg.id;
                // Remove job from content array
                s.content = s.content.filter(job => job.jobId !== jobId);
                s.totalElements = Math.max(0, s.totalElements - 1);
                // Clear selected job if it's the deleted one
                if (s.selected && s.selected.jobId === jobId) {
                    s.selected = null;
                }
                // Remove from featured if exists
                s.featured = s.featured.filter(job => job.jobId !== jobId);
            })
            .addCase(deleteJob.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete job";
            })

            /* Toggle Favorite */
            .addCase(toggleFavoriteJob.pending, (s) => {
                s.statuses.togglingFavorite = "loading";
            })
            .addCase(toggleFavoriteJob.fulfilled, (s, a) => {
                s.statuses.togglingFavorite = "succeeded";
                const jobId = a.meta.arg.id;

                // Update featured jobs
                s.featured = s.featured.map((job) =>
                    job.jobId === jobId ? {...job, isFavorite: !job.isFavorite} : job
                );

                // Update content jobs if they have favorite property
                s.content = s.content.map((job) =>
                    job.jobId === jobId && 'isFavorite' in job
                        ? {...job, isFavorite: !(job as any).isFavorite}
                        : job
                );

                // Update selected job if it has favorite property
                if (s.selected && s.selected.jobId === jobId && 'isFavorite' in s.selected) {
                    s.selected = {...s.selected, isFavorite: !(s.selected as any).isFavorite};
                }
            })
            .addCase(toggleFavoriteJob.rejected, (s) => {
                s.statuses.togglingFavorite = "failed";
                s.error = "Failed to toggle favorite";
            })

            /* Fetch Salary Range */
            .addCase(fetchSalaryRange.pending, (s) => {
                s.statuses.fetchingSalaryRange = "loading";
            })
            .addCase(fetchSalaryRange.fulfilled, (s, a) => {
                s.statuses.fetchingSalaryRange = "succeeded";
                s.salaryRange = {
                    minSalary: a.payload.minSalary ?? DEFAULT_MIN_SALARY,
                    maxSalary: a.payload.maxSalary ?? DEFAULT_MAX_SALARY,
                };
            })
            .addCase(fetchSalaryRange.rejected, (s) => {
                s.statuses.fetchingSalaryRange = "failed";
                s.error = "Failed to fetch salary range";
            });
    },
});

export const {
    clearJobSelected,
    clearJobRequest,
    clearJobError,
    setJobFilter,
    resetJobFilter,
    clearJobs,
    updateJobRequest,
    clearFeaturedJobs,
    initializeJobRequest
} = jobsSlice.actions;

export default jobsSlice.reducer;