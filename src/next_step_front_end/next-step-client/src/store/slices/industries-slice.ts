import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type IndustryType from "@/types/industry-type";
import { DEFAULT_LEVEL_SIZE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
  content: IndustryType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface IndustriesState extends PageResp {
  featured: IndustryType[];
  status: "idle" | "loading" | "failed";
}

const initialState: IndustriesState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  featured: [],
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchIndustries = createAsyncThunk<
  PageResp,
  { page?: number; size?: number }
>("industries/fetch", async ({ page = 0, size = DEFAULT_LEVEL_SIZE } = {}) => {
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

export const fetchFeaturedIndustries = createAsyncThunk<
  IndustryType[],
  number | void
>("industries/fetchFeatured", async (size = 12) => {
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

export const deleteIndustry = createAsyncThunk<number, number>(
  "industries/delete",
  async (id) => {
    await axiosClient.delete(`/api/industries/${id}`);
    return id;
  },
);

/* ---------- Slice ---------- */
const industriesSlice = createSlice({
  name: "industries",
  initialState,
  reducers: {
    clearIndustries: () => initialState,
  },
  extraReducers: (b) => {
    b
      /* list */
      .addCase(fetchIndustries.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchIndustries.fulfilled, (s, a) => {
        Object.assign(s, a.payload, { status: "idle" });
      })
      .addCase(fetchIndustries.rejected, (s) => {
        s.status = "failed";
      })

      /* featured */
      .addCase(fetchFeaturedIndustries.fulfilled, (s, a) => {
        s.featured = a.payload;
      })

      /* add */
      .addCase(addIndustry.fulfilled, (s, a) => {
        s.content.unshift(a.payload);
        s.totalElements += 1;
      })

      /* update */
      .addCase(updateIndustry.fulfilled, (s, a) => {
        const idx = s.content.findIndex(
          (x) => x.industryId === a.payload.industryId,
        );
        if (idx !== -1) s.content[idx] = a.payload;
      })

      /* delete */
      .addCase(deleteIndustry.fulfilled, (s, a) => {
        s.content = s.content.filter((x) => x.industryId !== a.payload);
        s.totalElements -= 1;
      });
  },
});

export const { clearIndustries } = industriesSlice.actions;
export default industriesSlice.reducer;
