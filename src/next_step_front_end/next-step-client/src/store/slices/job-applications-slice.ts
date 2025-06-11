import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type JobApplicationType from "@/types/job-application-type";
import type JobApplicationInformationType from "@/types/job-application-information-type";
import type JobApplicationFilterType from "@/types/job-application-filter-type";
import { DEFAULT_JOB_APPLICATION_FILTER, DEFAULT_PAGE, DEFAULT_JOB_APPLICATION_SIZE } from "@/constants";

interface PageResp {
  content: JobApplicationType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface JobAppsState extends PageResp {
  info: JobApplicationInformationType | null;
  selected: JobApplicationType | null;
  status: "idle" | "loading" | "failed";
  applied: boolean;
  filter: JobApplicationFilterType;
}

const initialState: JobAppsState = {
  content: [],
  totalPages: 0,
  page: DEFAULT_PAGE,
  totalElements: 0,
  info: null,
  selected: null,
  status: "idle",
  applied: false,
  filter: DEFAULT_JOB_APPLICATION_FILTER,
};

export const fetchApplicationById = createAsyncThunk<
  JobApplicationType,
  number
>("jobApps/fetchById", async (id) => {
  const { data } = await axiosClient.get(`/api/job-applications/${id}`);
  return data;
});

export const fetchApplicationInfoByJob = createAsyncThunk<
  JobApplicationInformationType,
  number
>("jobApps/fetchInfoByJob", async (jobId) => {
  const { data } = await axiosClient.get(
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
>("jobApps/filterByJob", async ({ jobId, page = DEFAULT_PAGE, 
                                  size = DEFAULT_JOB_APPLICATION_SIZE, 
                                  filter = DEFAULT_JOB_APPLICATION_FILTER }) => {
  const { data } = await axiosClient.post(
    `/api/job-applications/jobs/${jobId}/filter`,
    filter,
    {
      params: { page, size },
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
>("jobApps/apply", async ({ file, userId, jobId, coverLetter }) => {
  const form = new FormData();
  form.append("file", file);
  form.append("userId", userId.toString());
  form.append("jobId", jobId.toString());
  form.append("coverLetter", coverLetter);
  const { data } = await axiosClient.post("/api/job-applications/apply", form, {
    headers: { "Content-Type": "multipart/form-data" },
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

export const statusApplication = createAsyncThunk<
  void,
  {
    id: number;
    status: string;
  }
>("jobApps/status", async ({ id, status }) => {
  await axiosClient.put(`/api/job-applications/${id}/status?status=${status}`);
});

const jobAppsSlice = createSlice({
  name: "jobApplications",
  initialState,
  reducers: {
    clearJobApps: () => initialState,
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetFilter: (state) => {
      state.filter = DEFAULT_JOB_APPLICATION_FILTER;
    },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchApplicationInfoByJob.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchApplicationInfoByJob.fulfilled, (s, a) => {
        s.info = a.payload;
      })
      .addCase(fetchApplicationInfoByJob.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(fetchApplicationById.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchApplicationById.fulfilled, (s, a) => {
        s.selected = a.payload;
      })
      .addCase(fetchApplicationById.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(filterApplicationsByJob.pending, (s) => {
        s.status = "loading";
      })
      .addCase(filterApplicationsByJob.fulfilled, (s, a) => {
        Object.assign(s, a.payload, { status: "idle" });
      })
      .addCase(filterApplicationsByJob.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(apply.pending, (s) => {
        s.status = "loading";
      })
      .addCase(apply.fulfilled, (s) => {
        s.status = "idle";
        s.applied = true;
      })
      .addCase(apply.rejected, (s) => {
        s.status = "failed";
        s.applied = true;
      })
      
      .addCase(deleteApplication.fulfilled, (s, a) => {
        s.content = s.content.filter((x) => x.applicationId !== a.payload);
        s.totalElements -= 1;
      })
      .addCase(statusApplication.fulfilled, (s, a) => {
        if (s.content.length > 0) {
          s.content = s.content.map(app => 
            app.applicationId === a.meta.arg.id 
              ? { ...app, status: a.meta.arg.status }
              : app
          );
        }
        if (s.selected && s.selected.applicationId === a.meta.arg.id) {
          s.selected = { ...s.selected, status: a.meta.arg.status };
        }
      });
  },
});

export const { clearJobApps, setFilter } = jobAppsSlice.actions;
export default jobAppsSlice.reducer;
