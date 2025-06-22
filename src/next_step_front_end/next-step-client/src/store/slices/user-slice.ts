import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import UserType, { UserRequest } from "@/types/user-type.ts";
import UserFilterType from "@/types/user-filter-type.ts";
import { DEFAULT_USER_FILTER } from "@/constants.ts";

/* ---------- State ---------- */

/* ---------- State ---------- */
interface PageResp<T> {
  content: T[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface UserState extends PageResp<UserType> {
  profile: UserType | null;
  selected: UserType | null;
  request: UserRequest | null;
  filter: UserFilterType;

  statuses: {
    fetching: "idle" | "loading" | "failed" | "succeeded";
    fetchingByEmail: "idle" | "loading" | "failed" | "succeeded";
    updating: "idle" | "loading" | "failed" | "succeeded";
    updatingSkills: "idle" | "loading" | "failed" | "succeeded";
    uploadingAvatar: "idle" | "loading" | "failed" | "succeeded";
    uploadingResume: "idle" | "loading" | "failed" | "succeeded";
    deleting: "idle" | "loading" | "failed" | "succeeded";
    checkingUsername: "idle" | "loading" | "failed" | "succeeded";
    checkingEmail: "idle" | "loading" | "failed" | "succeeded";
    changingPassword: "idle" | "loading" | "failed" | "succeeded";
    filtering: "idle" | "loading" | "failed" | "succeeded";
  };

  error: string | null;
  usernameExists: boolean | null;
  emailExists: boolean | null;
}

const initialState: UserState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,

  profile: null,
  selected: null,
  request: null,
  filter: DEFAULT_USER_FILTER,

  statuses: {
    fetching: "idle",
    fetchingByEmail: "idle",
    updating: "idle",
    updatingSkills: "idle",
    uploadingAvatar: "idle",
    uploadingResume: "idle",
    deleting: "idle",
    checkingUsername: "idle",
    checkingEmail: "idle",
    changingPassword: "idle",
    filtering: "idle",
  },

  error: null,
  usernameExists: null,
  emailExists: null,
};

/* ---------- Thunks ---------- */
export const fetchUserProfile = createAsyncThunk<UserType, string>(
  "user/profile",
  async (username) => {
    const { data } = await axiosClient.get(`/api/user/${username}`);
    return data;
  },
);

export const fetchUserByEmail = createAsyncThunk<UserType, string>(
  "user/fetchByEmail",
  async (email) => {
    const { data } = await axiosClient.get(`/api/user/email/${email}`);
    return data;
  },
);

export const updateUserProfile = createAsyncThunk<
  UserType,
  { id: number; profile: UserRequest }
>("user/updateProfile", async ({ id, profile }) => {
  const { data } = await axiosClient.put(`/api/user/profile/${id}`, profile);
  return data;
});

export const updateUserSkills = createAsyncThunk<
  UserType,
  { id: number; skillIds: number[] }
>("user/updateSkills", async ({ id, skillIds }) => {
  const { data } = await axiosClient.put(`/api/user/${id}/skills`, skillIds);
  return data;
});

export const uploadAvatar = createAsyncThunk<
  string,
  { id: number; file: File }
>("user/uploadAvatar", async ({ id, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post(`/api/user/${id}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
});

export const uploadResume = createAsyncThunk<
  string,
  { id: number; file: File }
>("user/uploadResume", async ({ id, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post(`/api/user/${id}/resume`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
});

export const deleteUser = createAsyncThunk<void, number>(
  "user/delete",
  async (id) => {
    await axiosClient.delete(`/api/user/${id}`);
  },
);

export const checkUsernameExists = createAsyncThunk<boolean, string>(
  "user/checkUsername",
  async (username) => {
    const { data } = await axiosClient.get(
      `/api/user/exists/username/${username}`,
    );
    return data;
  },
);

export const checkEmailExists = createAsyncThunk<boolean, string>(
  "user/checkEmail",
  async (email) => {
    const { data } = await axiosClient.get(`/api/user/exists/email/${email}`);
    return data;
  },
);

export const changePassword = createAsyncThunk<
  string,
  {
    id: number;
    changePasswordRequest: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    };
  }
>("user/changePassword", async ({ id, changePasswordRequest }) => {
  const { data } = await axiosClient.put(
    `/api/user/${id}/change-password`,
    changePasswordRequest,
  );
  return data;
});

export const filterUsers = createAsyncThunk<
  PageResp<UserType>,
  { page?: number; size?: number; filter: UserFilterType }
>("user/filterUsers", async ({ page = 0, size = 10, filter }) => {
  const { data } = await axiosClient.post("/api/user/filter", filter, {
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
const userProfileSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.statuses = {
        fetching: "idle",
        fetchingByEmail: "idle",
        updating: "idle",
        updatingSkills: "idle",
        uploadingAvatar: "idle",
        uploadingResume: "idle",
        deleting: "idle",
        checkingUsername: "idle",
        checkingEmail: "idle",
        changingPassword: "idle",
        filtering: "idle",
      };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetStatuses: (state) => {
      Object.keys(state.statuses).forEach((key) => {
        state.statuses[key as keyof typeof state.statuses] = "idle";
      });
    },
    clearExistsChecks: (state) => {
      state.usernameExists = null;
      state.emailExists = null;
    },
    setUserFilter: (state, action) => {
      state.filter = action.payload;
    },
    resetUserFilter: (state) => {
      state.filter = DEFAULT_USER_FILTER;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch Profile by Username */
      .addCase(fetchUserProfile.pending, (state) => {
        state.statuses.fetching = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.statuses.fetching = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.statuses.fetching = "failed";
        state.error = "Failed to fetch user profile";
      })

      /* Fetch Profile by Email */
      .addCase(fetchUserByEmail.pending, (state) => {
        state.statuses.fetchingByEmail = "loading";
        state.error = null;
      })
      .addCase(fetchUserByEmail.fulfilled, (state, action) => {
        state.statuses.fetchingByEmail = "succeeded";
        state.profile = action.payload;
      })
      .addCase(fetchUserByEmail.rejected, (state) => {
        state.statuses.fetchingByEmail = "failed";
        state.error = "Failed to fetch user profile by email";
      })

      /* Update Profile */
      .addCase(updateUserProfile.pending, (state) => {
        state.statuses.updating = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.statuses.updating = "succeeded";
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state) => {
        state.statuses.updating = "failed";
        state.error = "Failed to update user profile";
      })

      /* Update Skills */
      .addCase(updateUserSkills.pending, (state) => {
        state.statuses.updatingSkills = "loading";
        state.error = null;
      })
      .addCase(updateUserSkills.fulfilled, (state, action) => {
        state.statuses.updatingSkills = "succeeded";
        if (state.profile) {
          state.profile.skills = action.payload.skills;
        }
      })
      .addCase(updateUserSkills.rejected, (state) => {
        state.statuses.updatingSkills = "failed";
        state.error = "Failed to update user skills";
      })

      /* Upload Avatar */
      .addCase(uploadAvatar.pending, (state) => {
        state.statuses.uploadingAvatar = "loading";
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.statuses.uploadingAvatar = "succeeded";
        if (state.profile) {
          state.profile.avatarUrl = action.payload;
        }
      })
      .addCase(uploadAvatar.rejected, (state) => {
        state.statuses.uploadingAvatar = "failed";
        state.error = "Failed to upload avatar";
      })

      /* Upload Resume */
      .addCase(uploadResume.pending, (state) => {
        state.statuses.uploadingResume = "loading";
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.statuses.uploadingResume = "succeeded";
        if (state.profile) {
          state.profile.resumeUrl = action.payload;
        }
      })
      .addCase(uploadResume.rejected, (state) => {
        state.statuses.uploadingResume = "failed";
        state.error = "Failed to upload resume";
      })

      /* Delete User */
      .addCase(deleteUser.pending, (state) => {
        state.statuses.deleting = "loading";
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.statuses.deleting = "succeeded";
        state.profile = null;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.statuses.deleting = "failed";
        state.error = "Failed to delete user";
      })

      /* Check Username Exists */
      .addCase(checkUsernameExists.pending, (state) => {
        state.statuses.checkingUsername = "loading";
        state.error = null;
      })
      .addCase(checkUsernameExists.fulfilled, (state, action) => {
        state.statuses.checkingUsername = "succeeded";
        state.usernameExists = action.payload;
      })
      .addCase(checkUsernameExists.rejected, (state) => {
        state.statuses.checkingUsername = "failed";
        state.error = "Failed to check username availability";
      })

      /* Check Email Exists */
      .addCase(checkEmailExists.pending, (state) => {
        state.statuses.checkingEmail = "loading";
        state.error = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.statuses.checkingEmail = "succeeded";
        state.emailExists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state) => {
        state.statuses.checkingEmail = "failed";
        state.error = "Failed to check email availability";
      })

      /* Change Password */
      .addCase(changePassword.pending, (state) => {
        state.statuses.changingPassword = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.statuses.changingPassword = "succeeded";
      })
      .addCase(changePassword.rejected, (state) => {
        state.statuses.changingPassword = "failed";
        state.error = "Failed to change password";
      })

      /* Filter Users */
      .addCase(filterUsers.pending, (state) => {
        state.statuses.filtering = "loading";
        state.error = null;
      })
      .addCase(filterUsers.fulfilled, (state, action) => {
        state.statuses.filtering = "succeeded";
        state.content = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(filterUsers.rejected, (state) => {
        state.statuses.filtering = "failed";
        state.error = "Failed to filter users";
      });
  },
});

export const {
  clearProfile,
  clearError,
  resetStatuses,
  clearExistsChecks,
  setUserFilter,
  resetUserFilter,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
