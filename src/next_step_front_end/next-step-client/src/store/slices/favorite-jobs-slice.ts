import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type JobType from "@/types/job-type";
import { DEFAULT_PAGE, DEFAULT_JOB_SIZE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
    content: JobType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface FavoriteJobsState extends PageResp {
    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded";
    };
    error: string | null;
}

const initialState: FavoriteJobsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    statuses: {
        fetching: "idle",
    },
    error: null,
};

/* ---------- Thunks ---------- */
export const fetchFavoriteJobs = createAsyncThunk<
    PageResp,
    { id: number; page?: number; size?: number }
>("favoriteJobs/fetch", async ({ id, page = DEFAULT_PAGE, size = DEFAULT_JOB_SIZE }) => {
    const { data } = await axiosClient.get(`/api/user/${id}/favorite-jobs`, {
        params: { page, size },
    });
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

/* ---------- Slice ---------- */
const favoriteJobsSlice = createSlice({
    name: "favoriteJobs",
    initialState,
    reducers: {
        clearFavoriteJobs: () => initialState,
        clearFavoriteJobsError: (state) => {
            state.error = null;
        },
        resetFavoriteJobsStatus: (state) => {
            state.statuses.fetching = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Favorite Jobs */
            .addCase(fetchFavoriteJobs.pending, (state) => {
                state.statuses.fetching = "loading";
                state.error = null;
            })
            .addCase(fetchFavoriteJobs.fulfilled, (state, action) => {
                state.statuses.fetching = "succeeded";
                state.content = action.payload.content;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.page;
                state.totalElements = action.payload.totalElements;
            })
            .addCase(fetchFavoriteJobs.rejected, (state) => {
                state.statuses.fetching = "failed";
                state.error = "Failed to fetch favorite jobs";
            });
    },
});

export const {
    clearFavoriteJobs,
    clearFavoriteJobsError,
    resetFavoriteJobsStatus,
} = favoriteJobsSlice.actions;

export default favoriteJobsSlice.reducer;