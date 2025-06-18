import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type IndustryType from "@/types/industry-type";
import { DEFAULT_LEVEL_SIZE, DEFAULT_PAGE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
  content: IndustryType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface IndustriesState extends PageResp {
  featured: IndustryType[];
  selected: IndustryType | null;

  statuses: {
    fetching: "idle" | "loading" | "failed" | "succeeded";
    fetchingById: "idle" | "loading" | "failed" | "succeeded";
    fetchingFeatured: "idle" | "loading" | "failed" | "succeeded";
    adding: "idle" | "loading" | "failed" | "succeeded";
    updating: "idle" | "loading" | "failed" | "succeeded";
    deleting: "idle" | "loading" | "failed" | "succeeded";
  };

  error: string | null;
}

const initialState: IndustriesState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  featured: [],
  selected: null,

  statuses: {
    fetching: "idle",
    fetchingById: "idle",
    fetchingFeatured: "idle",
    adding: "idle",
    updating: "idle",
    deleting: "idle",
  },

  error: null,
};

/* ---------- Thunks ---------- */
export const fetchIndustries = createAsyncThunk<
    PageResp,
    { page?: number; size?: number }
>("industries/fetch", async ({ page = DEFAULT_PAGE, size = DEFAULT_LEVEL_SIZE } = {}) => {
  const { data } = await axiosClient.get("/api/industries", {
    params: { page, size },
  });
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const fetchIndustryById = createAsyncThunk<IndustryType, number>(
    "industries/fetchById",
    async (id) => {
      const { data } = await axiosClient.get(`/api/industries/${id}`);
      return data;
    },
);

export const fetchFeaturedIndustries = createAsyncThunk<
    IndustryType[],
    { size?: number }
>("industries/fetchFeatured", async ({ size = 12 } = {}) => {
  const { data } = await axiosClient.get("/api/industries/featured", {
    params: { size },
  });
  return data;
});

export const addIndustry = createAsyncThunk<
    IndustryType,
    { industryName: string; icon?: string }
>("industries/add", async (body) => {
  const { data } = await axiosClient.post("/api/industries", body);
  return data;
});

export const updateIndustry = createAsyncThunk<
    IndustryType,
    { id: number; industryName: string; icon?: string }
>("industries/update", async ({ id, ...payload }) => {
  const { data } = await axiosClient.put(`/api/industries/${id}`, payload);
  return data;
});

export const deleteIndustry = createAsyncThunk<
    void,
    { id: number }
>("industries/delete", async ({ id }) => {
  await axiosClient.delete(`/api/industries/${id}`);
});

/* ---------- Slice ---------- */
const industriesSlice = createSlice({
  name: "industries",
  initialState,
  reducers: {
    clearIndustries: () => initialState,
    clearIndustrySelected: (s) => {
      s.selected = initialState.selected;
    },
    clearIndustryError: (s) => {
      s.error = initialState.error;
    },
    clearFeaturedIndustries: (s) => {
      s.featured = [];
    },
    setIndustrySelected: (s, a: PayloadAction<IndustryType | null>) => {
      s.selected = a.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        /* Fetch Industries */
        .addCase(fetchIndustries.pending, (s) => {
          s.statuses.fetching = "loading";
        })
        .addCase(fetchIndustries.fulfilled, (s, a) => {
          s.statuses.fetching = "succeeded";
          s.content = a.payload.content;
          s.totalPages = a.payload.totalPages;
          s.page = a.payload.page;
          s.totalElements = a.payload.totalElements;
        })
        .addCase(fetchIndustries.rejected, (s) => {
          s.statuses.fetching = "failed";
          s.error = "Failed to fetch industries";
        })

        /* Fetch Industry By Id */
        .addCase(fetchIndustryById.pending, (s) => {
          s.statuses.fetchingById = "loading";
        })
        .addCase(fetchIndustryById.fulfilled, (s, a) => {
          s.statuses.fetchingById = "succeeded";
          s.selected = a.payload;
        })
        .addCase(fetchIndustryById.rejected, (s) => {
          s.statuses.fetchingById = "failed";
          s.error = "Failed to fetch industry by id";
        })

        /* Fetch Featured Industries */
        .addCase(fetchFeaturedIndustries.pending, (s) => {
          s.statuses.fetchingFeatured = "loading";
        })
        .addCase(fetchFeaturedIndustries.fulfilled, (s, a) => {
          s.statuses.fetchingFeatured = "succeeded";
          s.featured = a.payload;
        })
        .addCase(fetchFeaturedIndustries.rejected, (s) => {
          s.statuses.fetchingFeatured = "failed";
          s.error = "Failed to fetch featured industries";
        })

        /* Add Industry */
        .addCase(addIndustry.pending, (s) => {
          s.statuses.adding = "loading";
        })
        .addCase(addIndustry.fulfilled, (s, a) => {
          s.statuses.adding = "succeeded";
          s.content.unshift(a.payload);
          s.totalElements += 1;
        })
        .addCase(addIndustry.rejected, (s) => {
          s.statuses.adding = "failed";
          s.error = "Failed to add industry";
        })

        /* Update Industry */
        .addCase(updateIndustry.pending, (s) => {
          s.statuses.updating = "loading";
        })
        .addCase(updateIndustry.fulfilled, (s, a) => {
          s.statuses.updating = "succeeded";
          // Update the industry in content array if it exists
          const industryIndex = s.content.findIndex(industry => industry.industryId === a.payload.industryId);
          if (industryIndex !== -1) {
            s.content[industryIndex] = a.payload;
          }
          // Update selected industry if it's the same
          if (s.selected && s.selected.industryId === a.payload.industryId) {
            s.selected = a.payload;
          }
          // Update featured industry if it exists
          const featuredIndex = s.featured.findIndex(industry => industry.industryId === a.payload.industryId);
          if (featuredIndex !== -1) {
            s.featured[featuredIndex] = a.payload;
          }
        })
        .addCase(updateIndustry.rejected, (s) => {
          s.statuses.updating = "failed";
          s.error = "Failed to update industry";
        })

        /* Delete Industry */
        .addCase(deleteIndustry.pending, (s) => {
          s.statuses.deleting = "loading";
        })
        .addCase(deleteIndustry.fulfilled, (s, a) => {
          s.statuses.deleting = "succeeded";
          const industryId = a.meta.arg.id;
          // Remove industry from content array
          s.content = s.content.filter(industry => industry.industryId !== industryId);
          s.totalElements = Math.max(0, s.totalElements - 1);
          // Clear selected industry if it's the deleted one
          if (s.selected && s.selected.industryId === industryId) {
            s.selected = null;
          }
          // Remove from featured if exists
          s.featured = s.featured.filter(industry => industry.industryId !== industryId);
        })
        .addCase(deleteIndustry.rejected, (s) => {
          s.statuses.deleting = "failed";
          s.error = "Failed to delete industry";
        });
  },
});

export const {
  clearIndustries,
  clearIndustrySelected,
  clearIndustryError,
  clearFeaturedIndustries,
  setIndustrySelected,
} = industriesSlice.actions;

export default industriesSlice.reducer;