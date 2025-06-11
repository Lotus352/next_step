import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  status: "idle" | "loading" | "failed";
}

const initialState: ExperienceLevelsState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  status: "idle",
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

export const addLevel = createAsyncThunk<ExperienceLevelType, { experienceName: string }>(
    "experienceLevels/add",
    async (body) => {
      const { data } = await axiosClient.post("/api/experience-levels", body);
      return data;
    },
);

export const updateLevel = createAsyncThunk<
    ExperienceLevelType,
    { id: number; experienceName: string }
>("experienceLevels/update", async ({ id, ...payload }) => {
  const { data } = await axiosClient.put(`/api/experience-levels/${id}`, payload);
  return data;
});

export const deleteLevel = createAsyncThunk<number, number>(
    "experienceLevels/delete",
    async (id) => {
      await axiosClient.delete(`/api/experience-levels/${id}`);
      return id;
    },
);

/* ---------- Slice ---------- */
const expLevelsSlice = createSlice({
  name: "experienceLevels",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (b) => {
    b
        .addCase(fetchLevels.pending, (s) => { s.status = "loading"; })
        .addCase(fetchLevels.fulfilled, (s, a) => {
          Object.assign(s, a.payload, { status: "idle" });
        })
        .addCase(fetchLevels.rejected, (s) => { s.status = "failed"; })

        .addCase(addLevel.fulfilled, (s, a) => {
          s.content.unshift(a.payload);
          s.totalElements += 1;
        })

        .addCase(updateLevel.fulfilled, (s, a) => {
          const idx = s.content.findIndex((x) => x.experienceId === a.payload.experienceId);
          if (idx !== -1) s.content[idx] = a.payload;
        })

        .addCase(deleteLevel.fulfilled, (s, a) => {
          s.content = s.content.filter((x) => x.experienceId !== a.payload);
          s.totalElements -= 1;
        });
  },
});

export const { clear } = expLevelsSlice.actions;
export default expLevelsSlice.reducer;
