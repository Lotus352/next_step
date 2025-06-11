import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type SkillType from "@/types/skill-type";
import { DEFAULT_LEVEL_SIZE } from "@/constants";

/* ---------- Types ---------- */
interface PageResp<T> {
  content: T[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface SkillsState extends PageResp<SkillType> {
  status: "idle" | "loading" | "failed";
}

/* ---------- Initial State ---------- */
const initialState: SkillsState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchSkills = createAsyncThunk<
  PageResp<SkillType>,
  { page?: number; size?: number }
>("skills/fetch", async ({ page = 0, size = DEFAULT_LEVEL_SIZE } = {}) => {
  const { data } = await axiosClient.get("/api/skills", {
    params: { page, size },
  });
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const addSkill = createAsyncThunk<SkillType, { skillName: string }>(
  "skills/add",
  async (body) => {
    const { data } = await axiosClient.post("/api/skills", body);
    return data;
  },
);

export const updateSkill = createAsyncThunk<
  SkillType,
  { id: number; skillName: string }
>("skills/update", async ({ id, ...payload }) => {
  const { data } = await axiosClient.put(`/api/skills/${id}`, payload);
  return data;
});

export const deleteSkill = createAsyncThunk<number, number>(
  "skills/delete",
  async (id) => {
    await axiosClient.delete(`/api/skills/${id}`);
    return id;
  },
);

/* ---------- Slice ---------- */
const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkills: () => initialState,
  },
  extraReducers: (b) => {
    b.addCase(fetchSkills.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchSkills.fulfilled, (s, a) => {
        Object.assign(s, a.payload, { status: "idle" });
      })
      .addCase(fetchSkills.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(addSkill.fulfilled, (s, a) => {
        s.content.unshift(a.payload);
        s.totalElements += 1;
      })

      .addCase(updateSkill.fulfilled, (s, a) => {
        const idx = s.content.findIndex((x) => x.skillId === a.payload.skillId);
        if (idx !== -1) s.content[idx] = a.payload;
      })

      .addCase(deleteSkill.fulfilled, (s, a) => {
        s.content = s.content.filter((x) => x.skillId !== a.payload);
        s.totalElements -= 1;
      });
  },
});

export const { clearSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
