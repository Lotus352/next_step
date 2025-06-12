import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import axiosClient from "@/api/axios-client"
import type SkillType from "@/types/skill-type"
import UserType, {UserRequest} from "@/types/user-type.ts";

/* ---------- State ---------- */
interface UserState {
    profile: UserType | null
    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded"
        updating: "idle" | "loading" | "failed" | "succeeded"
        updatingSkills: "idle" | "loading" | "failed" | "succeeded"
        uploadingAvatar: "idle" | "loading" | "failed" | "succeeded"
        uploadingResume: "idle" | "loading" | "failed" | "succeeded"
    }
    error: string | null
}

const initialState: UserState = {
    profile: null,
    statuses: {
        fetching: "idle",
        updating: "idle",
        updatingSkills: "idle",
        uploadingAvatar: "idle",
        uploadingResume: "idle",
    },
    error: null,
}

/* ---------- Thunks ---------- */
export const fetchUserProfile = createAsyncThunk<UserType, string>("user/profile", async (username) => {
    const {data} = await axiosClient.get(`/api/user/${username}`)
    return data
})

export const updateUserProfile = createAsyncThunk<UserType, UserRequest>(
    "user/updateProfile",
    async (profile, id) => {
        const {data} = await axiosClient.put(`/api/user/profile/${id}`, profile)
        return data
    },
)

export const updateUserSkills = createAsyncThunk<SkillType[], { id: number; skillIds: number[] }>(
    "user/updateSkills",
    async ({id, skillIds}) => {
        const {data} = await axiosClient.put(`/api/user/${id}/skills`, skillIds)
        return data
    },
)

export const uploadAvatar = createAsyncThunk<string, { id: number; file: File }>(
    "user/uploadAvatar",
    async ({id, file}) => {
        const formData = new FormData()
        formData.append("file", file)

        const {data} = await axiosClient.post(`/api/user/${id}/avatar`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        })
        return data
    },
)

export const uploadResume = createAsyncThunk<string, { id: number; file: File }>(
    "user/uploadResume",
    async ({id, file}) => {
        const formData = new FormData()
        formData.append("file", file)

        const {data} = await axiosClient.post(`/api/user/${id}/resume`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        })

        return data
    },
)

/* ---------- Slice ---------- */
const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
        clearProfile: () => initialState,
        clearError: (state) => {
            state.error = null
        },
        resetStatuses: (state) => {
            Object.keys(state.statuses).forEach((key) => {
                state.statuses[key as keyof typeof state.statuses] = "idle"
            })
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Profile */
            .addCase(fetchUserProfile.pending, (state) => {
                state.statuses.fetching = "loading"
                state.error = null
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.statuses.fetching = "succeeded"
                state.profile = action.payload
            })
            .addCase(fetchUserProfile.rejected, (state) => {
                state.statuses.fetching = "failed"
                state.error = "Failed to fetch user profile"
            })

            /* Update Profile */
            .addCase(updateUserProfile.pending, (state) => {
                state.statuses.updating = "loading"
                state.error = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.statuses.updating = "succeeded"
                state.profile = action.payload
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.statuses.updating = "failed"
                state.error = "Failed to update user profile"
            })

            /* Update Skills */
            .addCase(updateUserSkills.pending, (state) => {
                state.statuses.updatingSkills = "loading"
                state.error = null
            })
            .addCase(updateUserSkills.fulfilled, (state) => {
                state.statuses.updatingSkills = "succeeded"
            })
            .addCase(updateUserSkills.rejected, (state) => {
                state.statuses.updatingSkills = "failed"
                state.error = "Failed to update user skills"
            })

            /* Upload Avatar */
            .addCase(uploadAvatar.pending, (state) => {
                state.statuses.uploadingAvatar = "loading"
                state.error = null
            })
            .addCase(uploadAvatar.fulfilled, (state) => {
                state.statuses.uploadingAvatar = "succeeded"
            })
            .addCase(uploadAvatar.rejected, (state) => {
                state.statuses.uploadingAvatar = "failed"
                state.error = "Failed to upload avatar"
            })

            /* Upload Resume */
            .addCase(uploadResume.pending, (state) => {
                state.statuses.uploadingResume = "loading"
                state.error = null
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.statuses.uploadingResume = "succeeded"
                if (state.profile) {
                    state.profile.resumeUrl = action.payload
                }
            })
            .addCase(uploadResume.rejected, (state) => {
                state.statuses.uploadingResume = "failed"
                state.error = "Failed to upload resume"
            })
    },
})

export const {clearProfile, clearError, resetStatuses} = userProfileSlice.actions
export default userProfileSlice.reducer
