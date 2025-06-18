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
  currentSkill: SkillType | null;
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
const initialState: SkillsState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  currentSkill: null,
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

export const fetchSkillById = createAsyncThunk<SkillType, number>(
    "skills/fetchById",
    async (id) => {
      const { data } = await axiosClient.get(`/api/skills/${id}`);
      return data;
    },
);

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
    clearCurrentSkill: (state) => {
      state.currentSkill = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatuses: (state) => {
      Object.keys(state.statuses).forEach((key) => {
        state.statuses[key as keyof typeof state.statuses] = "idle";
      });
    },
  },
  extraReducers: (builder) => {
    builder
        /* Fetch All Skills */
        .addCase(fetchSkills.pending, (state) => {
          state.statuses.fetching = "loading";
          state.error = null;
        })
        .addCase(fetchSkills.fulfilled, (state, action) => {
          Object.assign(state, action.payload, {
            statuses: { ...state.statuses, fetching: "idle" }
          });
        })
        .addCase(fetchSkills.rejected, (state) => {
          state.statuses.fetching = "failed";
          state.error = "Failed to fetch skills";
        })

        /* Fetch Skill By ID */
        .addCase(fetchSkillById.pending, (state) => {
          state.statuses.fetchingById = "loading";
          state.error = null;
        })
        .addCase(fetchSkillById.fulfilled, (state, action) => {
          state.statuses.fetchingById = "idle";
          state.currentSkill = action.payload;
        })
        .addCase(fetchSkillById.rejected, (state) => {
          state.statuses.fetchingById = "failed";
          state.error = "Failed to fetch skill";
        })

        /* Add Skill */
        .addCase(addSkill.pending, (state) => {
          state.statuses.creating = "loading";
          state.error = null;
        })
        .addCase(addSkill.fulfilled, (state, action) => {
          state.statuses.creating = "idle";
          state.content.unshift(action.payload);
          state.totalElements += 1;
        })
        .addCase(addSkill.rejected, (state) => {
          state.statuses.creating = "failed";
          state.error = "Failed to create skill";
        })

        /* Update Skill */
        .addCase(updateSkill.pending, (state) => {
          state.statuses.updating = "loading";
          state.error = null;
        })
        .addCase(updateSkill.fulfilled, (state, action) => {
          state.statuses.updating = "idle";
          const idx = state.content.findIndex((x) => x.skillId === action.payload.skillId);
          if (idx !== -1) state.content[idx] = action.payload;
          // Update currentSkill if it's the same one being updated
          if (state.currentSkill?.skillId === action.payload.skillId) {
            state.currentSkill = action.payload;
          }
        })
        .addCase(updateSkill.rejected, (state) => {
          state.statuses.updating = "failed";
          state.error = "Failed to update skill";
        })

        /* Delete Skill */
        .addCase(deleteSkill.pending, (state) => {
          state.statuses.deleting = "loading";
          state.error = null;
        })
        .addCase(deleteSkill.fulfilled, (state, action) => {
          state.statuses.deleting = "idle";
          state.content = state.content.filter((x) => x.skillId !== action.payload);
          state.totalElements -= 1;

          // Clear currentSkill if it's the one being deleted
          if (state.currentSkill?.skillId === action.payload) {
            state.currentSkill = null;
          }
        })
        .addCase(deleteSkill.rejected, (state) => {
          state.statuses.deleting = "failed";
          state.error = "Failed to delete skill";
        });
  },
});

export const { clearSkills, clearCurrentSkill, clearError, resetStatuses } = skillsSlice.actions;
export default skillsSlice.reducer;