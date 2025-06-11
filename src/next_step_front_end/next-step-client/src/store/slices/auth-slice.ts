import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import { jwtDecode } from "jwt-decode";
import type UserType from "@/types/user-type";

/* ---------- Types ---------- */
interface JwtPayload { sub: string; username: string; email: string; }

interface AuthState {
    token: string | null;
    status: "idle" | "loading" | "authenticated" | "registered" | "failed";
    user: UserType | null;
}

/* ---------- State ---------- */
const initialState: AuthState = {
    token: null,
    status: "idle",
    user: null,
};

/* ---------- Helpers ---------- */
const parseUser = (token: string): string | null => {
    try {
        const { sub } = jwtDecode<JwtPayload>(token);
        return sub;
    } catch {
        return null;
    }
};

/* ---------- Thunks ---------- */
export const login = createAsyncThunk<
    { token: string; username: string | null },
    { username: string; password: string }
>("auth/login", async (body, { dispatch }) => {
    const { data } = await axiosClient.post("/api/auth/login", body);
    const token = data.accessToken as string;
    const username = parseUser(token);
    if (username) {
        await dispatch(fetchUserByUsername(username));
    }
    return { token, username };
});

export const register = createAsyncThunk<
    void,
    { username: string; email: string; password: string }
>("auth/register", async (body) => {
    await axiosClient.post("/api/auth/register", body);
});

export const refreshToken = createAsyncThunk<
    { token: string},
    void
>("auth/refreshToken", async () => {
    const { data } = await axiosClient.post("/api/auth/refresh-token");
    const token = data.accessToken as string;
    return { token};
});

export const logout = createAsyncThunk("auth/logout", async () => {
    await axiosClient.post("/api/auth/logout");
});

export const fetchUserByUsername = createAsyncThunk<
    UserType,
    string
>("auth/fetchUserByUsername", async (username) => {
    const { data } = await axiosClient.get(`/api/user/${username}`);
    return data;
});

/* ---------- Slice ---------- */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth: () => initialState,

        restoreAuthFromToken: (state, action) => {
            state.token = action.payload.token;
            state.status = "authenticated";
            state.user = action.payload.user;
          },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (s) => {
                s.status = "loading";
            })
            .addCase(login.fulfilled, (s, a) => {
                s.status = "authenticated";
                s.token = a.payload.token;  
                localStorage.setItem('accessToken', a.payload.token);
            })
            .addCase(login.rejected, (s) => {
                s.status = "failed";
                s.token = null;
                localStorage.removeItem('accessToken');
            })
            .addCase(register.pending, (s) => {
                s.status = "loading";
            })
            .addCase(register.fulfilled, (s) => {
                s.status = "registered";
            })
            .addCase(register.rejected, (s) => {
                s.status = "failed";
                s.token = null;
                localStorage.removeItem('accessToken');
            })
            .addCase(refreshToken.fulfilled, (s, a) => {
                s.status = "authenticated";
                s.token = a.payload.token;
                localStorage.setItem('accessToken', a.payload.token);
            })
            .addCase(refreshToken.rejected, (s) => {
                s.status = "failed";
                s.token = null;
                localStorage.removeItem('accessToken');
            })
            .addCase(logout.fulfilled, (s) => {
                s.status = "idle";
                s.token = null;
                localStorage.removeItem('accessToken');
            })
            .addCase(fetchUserByUsername.fulfilled, (s, a) => {
                s.user = a.payload;
            })
            .addCase(fetchUserByUsername.rejected, (s) => {
                s.token = null;
                s.status = "failed";
                s.user = null;
                localStorage.removeItem('accessToken');
            });
    },
});

export const { clearAuth, restoreAuthFromToken} = authSlice.actions;
export default authSlice.reducer;
