import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import { DEFAULT_KEYWORD, DEFAULT_LEVEL_SIZE, DEFAULT_PAGE } from "@/constants";
import CertificationType from "@/types/certification-type.ts";

/* ---------- Types ---------- */
interface PageResp<T> {
    content: T[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface CertificationsState extends PageResp<CertificationType> {
    currentCertification: CertificationType | null;
    searchKeyword: string;
    statuses: {
        fetching: "idle" | "loading" | "failed";
        fetchingById: "idle" | "loading" | "failed";
        creating: "idle" | "loading" | "failed";
        updating: "idle" | "loading" | "failed";
        deleting: "idle" | "loading" | "failed";
    };
    error: string | null;
}

/* ---------- Initial State ---------- */
const initialState: CertificationsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    currentCertification: null,
    searchKeyword: "",
    statuses: {
        fetching: "idle",
        fetchingById: "idle",
        creating: "idle",
        updating: "idle",
        deleting: "idle",
    },
    error: null,
};

/* ---------- Thunks ---------- */
export const fetchCertifications = createAsyncThunk<
    PageResp<CertificationType>,
    { page?: number; size?: number; key?: string }
>("certifications/fetch", async ({ page = DEFAULT_PAGE, size = DEFAULT_LEVEL_SIZE, key = DEFAULT_KEYWORD } = {}) => {
    const { data } = await axiosClient.get("/api/certifications", {
        params: { page, size, key },
    });
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

export const fetchCertificationById = createAsyncThunk<CertificationType, number>(
    "certifications/fetchById",
    async (id) => {
        const { data } = await axiosClient.get(`/api/certifications/${id}`);
        return data;
    }
);

export const addCertification = createAsyncThunk<CertificationType, { certificationName: string }>(
    "certifications/add",
    async (body) => {
        const { data } = await axiosClient.post("/api/certifications", body);
        return data;
    }
);

export const updateCertification = createAsyncThunk<
    CertificationType,
    { id: number; certificationName: string }
>("certifications/update", async ({ id, ...payload }) => {
    const { data } = await axiosClient.put(`/api/certifications/${id}`, payload);
    return data;
});

export const deleteCertification = createAsyncThunk<number, number>(
    "certifications/delete",
    async (id) => {
        await axiosClient.delete(`/api/certifications/${id}`);
        return id;
    }
);

/* ---------- Slice ---------- */
const certificationsSlice = createSlice({
    name: "certifications",
    initialState,
    reducers: {
        clearCertifications: () => initialState,
        clearCurrentCertification: (state) => {
            state.currentCertification = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetStatuses: (state) => {
            Object.keys(state.statuses).forEach((key) => {
                state.statuses[key as keyof typeof state.statuses] = "idle";
            });
        },
        setSearchKeyword: (state, action) => {
            state.searchKeyword = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCertifications.pending, (state) => {
                state.statuses.fetching = "loading";
                state.error = null;
            })
            .addCase(fetchCertifications.fulfilled, (state, action) => {
                Object.assign(state, action.payload, {
                    statuses: { ...state.statuses, fetching: "idle" }
                });
            })
            .addCase(fetchCertifications.rejected, (state) => {
                state.statuses.fetching = "failed";
                state.error = "Failed to fetch certifications";
            })

            .addCase(fetchCertificationById.pending, (state) => {
                state.statuses.fetchingById = "loading";
                state.error = null;
            })
            .addCase(fetchCertificationById.fulfilled, (state, action) => {
                state.statuses.fetchingById = "idle";
                state.currentCertification = action.payload;
            })
            .addCase(fetchCertificationById.rejected, (state) => {
                state.statuses.fetchingById = "failed";
                state.error = "Failed to fetch certification";
            })

            .addCase(addCertification.pending, (state) => {
                state.statuses.creating = "loading";
                state.error = null;
            })
            .addCase(addCertification.fulfilled, (state, action) => {
                state.statuses.creating = "idle";
                state.content.unshift(action.payload);
                state.totalElements += 1;
            })
            .addCase(addCertification.rejected, (state) => {
                state.statuses.creating = "failed";
                state.error = "Failed to create certification";
            })

            .addCase(updateCertification.pending, (state) => {
                state.statuses.updating = "loading";
                state.error = null;
            })
            .addCase(updateCertification.fulfilled, (state, action) => {
                state.statuses.updating = "idle";
                const idx = state.content.findIndex((x) => x.certificationId === action.payload.certificationId);
                if (idx !== -1) state.content[idx] = action.payload;
                if (state.currentCertification?.certificationId === action.payload.certificationId) {
                    state.currentCertification = action.payload;
                }
            })
            .addCase(updateCertification.rejected, (state) => {
                state.statuses.updating = "failed";
                state.error = "Failed to update certification";
            })

            .addCase(deleteCertification.pending, (state) => {
                state.statuses.deleting = "loading";
                state.error = null;
            })
            .addCase(deleteCertification.fulfilled, (state, action) => {
                state.statuses.deleting = "idle";
                state.content = state.content.filter((x) => x.certificationId !== action.payload);
                state.totalElements -= 1;
                if (state.currentCertification?.certificationId === action.payload) {
                    state.currentCertification = null;
                }
            })
            .addCase(deleteCertification.rejected, (state) => {
                state.statuses.deleting = "failed";
                state.error = "Failed to delete certification";
            });
    },
});

export const {
    clearCertifications,
    clearCurrentCertification,
    clearError,
    resetStatuses,
    setSearchKeyword
} = certificationsSlice.actions;

export default certificationsSlice.reducer;
