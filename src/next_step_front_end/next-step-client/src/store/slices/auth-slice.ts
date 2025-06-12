import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import {jwtDecode} from "jwt-decode";
import type UserType from "@/types/user-type";

/* ---------- Types ---------- */
interface JwtPayload {
    sub: string;
    username: string;
    email: string;
    exp: number
}

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
const parseUser = (token: string): { username: string; isValid: boolean } => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const isValid = decoded.exp * 1000 > Date.now(); // Check if token is not expired
        return {username: decoded.sub, isValid};
    } catch {
        return {username: "", isValid: false};
    }
};

const getStoredToken = (): string | null => {
    try {
        return localStorage.getItem('accessToken');
    } catch {
        return null;
    }
};

const setStoredToken = (token: string): void => {
    try {
        localStorage.setItem('accessToken', token);
    } catch {
        // Handle localStorage errors silently
    }
};

const removeStoredToken = (): void => {
    try {
        localStorage.removeItem('accessToken');
    } catch {
        // Handle localStorage errors silently
    }
};


/* ---------- Thunks ---------- */
export const login = createAsyncThunk<
    { token: string },
    { username: string; password: string }
>("auth/login", async (credentials, {dispatch}) => {
    const {data} = await axiosClient.post("/api/auth/login", credentials);
    const token = data.accessToken as string;

    const {username, isValid} = parseUser(token);
    if (!isValid) {
        throw new Error("Invalid token received");
    }

    // Fetch user data separately
    await dispatch(fetchUserByUsername(username));

    return {token};
});

export const register = createAsyncThunk<
    { token: string },
    { username: string; email: string; password: string }
>("auth/register", async (userData, {dispatch}) => {
    const {data} = await axiosClient.post("/api/auth/register", userData);
    const token = data.accessToken as string

    const {username, isValid} = parseUser(token);
    if (!isValid) {
        throw new Error("Invalid token received");
    }
    await dispatch(fetchUserByUsername(username));

    return {token};
});

export const refreshToken = createAsyncThunk<
    { token: string },
    void
>("auth/refreshToken", async (_, {dispatch}) => {
    const {data} = await axiosClient.post("/api/auth/refresh-token");
    const token = data.accessToken as string;

    const {username, isValid} = parseUser(token);
    if (!isValid) {
        throw new Error("Invalid token received");
    }

    // Fetch fresh user data
    await dispatch(fetchUserByUsername(username));

    return {token};
});

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        await axiosClient.post("/api/auth/logout");
    } catch (error: any) {
        console.warn("Logout request failed:", error.message);
    }
});

export const initializeAuth = createAsyncThunk<
    { token: string } | null,
    void
>("auth/initialize", async (_, {dispatch}) => {
    const storedToken = getStoredToken();
    if (!storedToken) return null;

    const {username, isValid} = parseUser(storedToken);
    if (!isValid) {
        // Token expired, try to refresh
        return await dispatch(refreshToken()).unwrap();
    }

    // Token is valid, fetch user data
    await dispatch(fetchUserByUsername(username));

    return {token: storedToken};
});


export const fetchUserByUsername = createAsyncThunk<
    UserType,
    string
>("auth/fetchUserByUsername", async (username) => {
    const {data} = await axiosClient.get(`/api/user/${username}`);
    return data;
});

/* ---------- Slice ---------- */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth: (s) => {
            s.token = null;
            s.status = "idle";
            s.user = null;
            removeStoredToken();
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
                setStoredToken(a.payload.token);
            })
            .addCase(login.rejected, (s) => {
                s.status = "failed";
                s.user = null;
                s.token = null;
                removeStoredToken()
            })
            .addCase(register.pending, (s) => {
                s.status = "loading";
            })
            .addCase(register.fulfilled, (s, a) => {
                s.status = "registered";
                s.token = a.payload.token;
                setStoredToken(s.token);
            })
            .addCase(register.rejected, (s) => {
                s.status = "failed";
                s.user = null;
                s.token = null;
                removeStoredToken()
            })
            .addCase(refreshToken.fulfilled, (s, a) => {
                s.status = "authenticated";
                s.token = a.payload.token;
                setStoredToken(s.token);
            })
            .addCase(refreshToken.rejected, (s) => {
                s.status = "failed";
                s.token = null;
                s.user = null;
                removeStoredToken();
            })
            .addCase(logout.fulfilled, (s) => {
                s.status = "idle";
                s.token = null;
                s.user = null;
                removeStoredToken();
            })

            // Initialize Auth
            .addCase(initializeAuth.pending, (state) => {
                state.status = "loading";
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                if (action.payload) {
                    state.status = "authenticated";
                    state.token = action.payload.token;
                } else {
                    state.status = "idle";
                }
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.status = "idle";
                state.token = null;
                state.user = null;
                removeStoredToken();
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

export const {clearAuth} = authSlice.actions;
export default authSlice.reducer;
