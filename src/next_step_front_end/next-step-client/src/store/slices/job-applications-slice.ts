import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type JobApplicationType from "@/types/job-application-type";
import type JobApplicationInformationType from "@/types/job-application-information-type";
import type JobApplicationFilterType from "@/types/job-application-filter-type";
import {DEFAULT_JOB_APPLICATION_FILTER, DEFAULT_PAGE, DEFAULT_JOB_APPLICATION_SIZE} from "@/constants";

interface PageResp {
    content: JobApplicationType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface JobAppsState extends PageResp {
    info: JobApplicationInformationType | null;
    selected: JobApplicationType | null;
    statuses: {
        fetchingInfo: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
        filtering: "idle" | "loading" | "failed" | "succeeded";
        applying: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
    }
    filter: JobApplicationFilterType;
    error: string | null,
}

const initialState: JobAppsState = {
    content: [],
    totalPages: 0,
    page: DEFAULT_PAGE,
    totalElements: 0,
    info: null,
    selected: null,

    statuses: {
        fetchingInfo: "idle",
        fetchingById: "idle",
        filtering: "idle",
        applying: "idle",
        deleting: "idle",
        updating: "idle",
    },
    filter: DEFAULT_JOB_APPLICATION_FILTER,

    error: null,
};

export const fetchApplicationById = createAsyncThunk<
    JobApplicationType,
    number
>("jobApps/fetchById", async (id) => {
    const {data} = await axiosClient.get(`/api/job-applications/${id}`);
    return data;
});

export const fetchApplicationInfoByJob = createAsyncThunk<
    JobApplicationInformationType,
    number
>("jobApps/fetchInfoByJob", async (jobId) => {
    const {data} = await axiosClient.get(
        `/api/job-applications/jobs/${jobId}/information`,
    );
    return data;
});

export const filterApplicationsByJob = createAsyncThunk<
    PageResp,
    {
        jobId: number;
        page?: number;
        size?: number;
        filter: JobApplicationFilterType;
    }
>("jobApps/filterByJob", async ({
                                    jobId, page = DEFAULT_PAGE,
                                    size = DEFAULT_JOB_APPLICATION_SIZE,
                                    filter = DEFAULT_JOB_APPLICATION_FILTER
                                }) => {
    const {data} = await axiosClient.post(
        `/api/job-applications/jobs/${jobId}/filter`,
        filter,
        {
            params: {page, size},
        },
    );
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

export const apply = createAsyncThunk<
    string,
    { file: File; userId: number; jobId: number; coverLetter: string }
>("jobApps/apply", async ({file, userId, jobId, coverLetter}) => {
    const form = new FormData();
    form.append("file", file);
    form.append("userId", userId.toString());
    form.append("jobId", jobId.toString());
    form.append("coverLetter", coverLetter);
    const {data} = await axiosClient.post("/api/job-applications/apply", form, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return data as string;
});

export const deleteApplication = createAsyncThunk<number, number>(
    "jobApps/delete",
    async (id) => {
        await axiosClient.delete(`/api/job-applications/${id}`);
        return id;
    },
);

export const updateApplicationStatus = createAsyncThunk<
    void,
    {
        id: number;
        status: string;
    }
>("jobApps/status", async ({id, status}) => {
    await axiosClient.put(`/api/job-applications/${id}/status?status=${status}`);
});

const jobAppsSlice = createSlice({
    name: "jobApplications",
    initialState,
    reducers: {
        clearJobApps: () => initialState,
        clearSelected: (state) => {
            state.selected = null;
        },
        clearInfo: (state) => {
            state.info = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setFilter: (state, a) => {
            state.filter = a.payload;
        },
        resetFilter: (state) => {
            state.filter = DEFAULT_JOB_APPLICATION_FILTER;
        },
        resetApplying: (state) => {
            state.statuses.applying = "idle";
        },
        resetStatuses: (state) => {
            Object.keys(state.statuses).forEach(key => {
                state.statuses[key as keyof typeof state.statuses] = "idle";
            });
        },
    },
    extraReducers: (b) => {
        b
            /* Fetch Application Info By Job */
            .addCase(fetchApplicationInfoByJob.pending, (s) => {
                s.statuses.fetchingById = "loading";
                s.error = null;
            })
            .addCase(fetchApplicationInfoByJob.fulfilled, (s, a) => {
                s.statuses.fetchingInfo = "succeeded";
                s.info = a.payload;
            })
            .addCase(fetchApplicationInfoByJob.rejected, (s) => {
                s.statuses.fetchingInfo = "failed";
                s.error = "Failed to fetch application info";
            })

            /* Fetch Application By Id */
            .addCase(fetchApplicationById.pending, (s) => {
                s.statuses.fetchingById = "loading";
                s.error = null;
            })
            .addCase(fetchApplicationById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchApplicationById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch application";
            })

            /* Filter Applications By Job */
            .addCase(filterApplicationsByJob.pending, (s) => {
                s.statuses.filtering = "loading";
                s.error = null;
            })
            .addCase(filterApplicationsByJob.fulfilled, (s, a) => {
                s.statuses.filtering = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(filterApplicationsByJob.rejected, (s) => {
                s.statuses.filtering = "failed";
                s.error = "Failed to filter applications";
            })

            /* Apply for Job */
            .addCase(apply.pending, (s) => {
                s.statuses.applying = "loading";
                s.error = null;
            })
            .addCase(apply.fulfilled, (s) => {
                s.statuses.applying = "succeeded";
            })
            .addCase(apply.rejected, (s) => {
                s.statuses.applying = "failed";
                s.error = "Failed to apply for job";
            })

            /* Delete Application */
            .addCase(deleteApplication.pending, (s) => {
                s.statuses.deleting = "loading";
                s.error = null;
            })
            .addCase(deleteApplication.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                s.content = s.content.filter(
                    (app) => app.applicationId !== a.payload
                );
                s.totalElements = Math.max(0, s.totalElements - 1);

                // Clear selected if it was deleted
                if (s.selected && s.selected.applicationId === a.payload) {
                    s.selected = null;
                }
            })
            .addCase(deleteApplication.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete application";
            })

            /* Update Application Status */
            .addCase(updateApplicationStatus.pending, (s) => {
                s.statuses.updating = "loading";
                s.error = null;
            })
            .addCase(updateApplicationStatus.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";
                const {id, status} = a.meta.arg;

                // Update in content array
                s.content = s.content.map(app =>
                    app.applicationId === id
                        ? {...app, status}
                        : app
                );

                // Update selected if it matches
                if (s.selected && s.selected.applicationId === id) {
                    s.selected = {...s.selected, status};
                }
            })
            .addCase(updateApplicationStatus.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update application status";
            });
    },
});

export const {
    clearJobApps,
    clearSelected,
    clearInfo,
    setFilter,
    resetFilter,
    clearError,
    resetApplying,
    resetStatuses,
} = jobAppsSlice.actions;

export default jobAppsSlice.reducer;
