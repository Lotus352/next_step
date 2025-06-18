import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type ExperienceLevelType from "@/types/experience-level-type";
import { DEFAULT_LEVEL_SIZE, DEFAULT_PAGE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
    content: ExperienceLevelType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface ExperienceLevelsState extends PageResp {
    selected: ExperienceLevelType | null;

    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
        adding: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
    };

    error: string | null;
}

const initialState: ExperienceLevelsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    selected: null,

    statuses: {
        fetching: "idle",
        fetchingById: "idle",
        adding: "idle",
        updating: "idle",
        deleting: "idle",
    },

    error: null,
};

/* ---------- Thunks ---------- */
export const fetchLevels = createAsyncThunk<
    PageResp,
    { page?: number; size?: number }
>("experienceLevels/fetch", async ({ page = DEFAULT_PAGE, size = DEFAULT_LEVEL_SIZE } = {}) => {
    const { data } = await axiosClient.get("/api/experience-levels", { params: { page, size } });
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

export const fetchLevelById = createAsyncThunk<ExperienceLevelType, number>(
    "experienceLevels/fetchById",
    async (id) => {
        const { data } = await axiosClient.get(`/api/experience-levels/${id}`);
        return data;
    },
);

export const addLevel = createAsyncThunk<
    ExperienceLevelType,
    { experienceName: string }
>("experienceLevels/add", async (body) => {
    const { data } = await axiosClient.post("/api/experience-levels", body);
    return data;
});

export const updateLevel = createAsyncThunk<
    ExperienceLevelType,
    { id: number; experienceName: string }
>("experienceLevels/update", async ({ id, ...payload }) => {
    const { data } = await axiosClient.put(`/api/experience-levels/${id}`, payload);
    return data;
});

export const deleteLevel = createAsyncThunk<
    void,
    { id: number }
>("experienceLevels/delete", async ({ id }) => {
    await axiosClient.delete(`/api/experience-levels/${id}`);
});

/* ---------- Slice ---------- */
const expLevelsSlice = createSlice({
    name: "experienceLevels",
    initialState,
    reducers: {
        clearLevels: () => initialState,
        clearLevelSelected: (s) => {
            s.selected = initialState.selected;
        },
        clearLevelError: (s) => {
            s.error = initialState.error;
        },
        setLevelSelected: (s, a: PayloadAction<ExperienceLevelType | null>) => {
            s.selected = a.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Levels */
            .addCase(fetchLevels.pending, (s) => {
                s.statuses.fetching = "loading";
            })
            .addCase(fetchLevels.fulfilled, (s, a) => {
                s.statuses.fetching = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(fetchLevels.rejected, (s) => {
                s.statuses.fetching = "failed";
                s.error = "Failed to fetch experience levels";
            })

            /* Fetch Level By Id */
            .addCase(fetchLevelById.pending, (s) => {
                s.statuses.fetchingById = "loading";
            })
            .addCase(fetchLevelById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchLevelById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch experience level by id";
            })

            /* Add Level */
            .addCase(addLevel.pending, (s) => {
                s.statuses.adding = "loading";
            })
            .addCase(addLevel.fulfilled, (s, a) => {
                s.statuses.adding = "succeeded";
                s.content.unshift(a.payload);
                s.totalElements += 1;
            })
            .addCase(addLevel.rejected, (s) => {
                s.statuses.adding = "failed";
                s.error = "Failed to add experience level";
            })

            /* Update Level */
            .addCase(updateLevel.pending, (s) => {
                s.statuses.updating = "loading";
            })
            .addCase(updateLevel.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";
                // Update the level in content array if it exists
                const levelIndex = s.content.findIndex(level => level.experienceId === a.payload.experienceId);
                if (levelIndex !== -1) {
                    s.content[levelIndex] = a.payload;
                }
                // Update selected level if it's the same
                if (s.selected && s.selected.experienceId === a.payload.experienceId) {
                    s.selected = a.payload;
                }
            })
            .addCase(updateLevel.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update experience level";
            })

            /* Delete Level */
            .addCase(deleteLevel.pending, (s) => {
                s.statuses.deleting = "loading";
            })
            .addCase(deleteLevel.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                const levelId = a.meta.arg.id;

                // Remove level from content array
                s.content = s.content.filter(level => level.experienceId !== levelId);
                s.totalElements = Math.max(0, s.totalElements - 1);

                // Clear selected level if it's the deleted one
                if (s.selected && s.selected.experienceId === levelId) {
                    s.selected = null;
                }
            })
            .addCase(deleteLevel.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete experience level";
            });
    },
});

export const {
    clearLevels,
    clearLevelSelected,
    clearLevelError,
    setLevelSelected,
} = expLevelsSlice.actions;

export default expLevelsSlice.reducer;