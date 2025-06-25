import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import { jwtDecode } from "jwt-decode";
import type UserType from "@/types/user-type";
import {clearProfile} from "@/store/slices/users-slice.ts";

/* ---------- Types ---------- */
interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  exp: number;
}

interface AuthState {
  token: string | null;
  status: "idle" | "loading" | "authenticated" | "failed";
  user: UserType | null;
  error: string | null;
}


/* ---------- State ---------- */
const initialState: AuthState = {
  token: null,
  status: "idle",
  user: null,
  error: null,
};

/* ---------- Helpers ---------- */
const parseUser = (token: string): { username: string; isValid: boolean } => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const isValid = decoded.exp * 1000 > Date.now(); // Check if token is not expired
    return { username: decoded.sub, isValid };
  } catch {
    return { username: "", isValid: false };
  }
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

const setStoredToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

const removeStoredToken = (): void => {
  localStorage.removeItem("accessToken");
};

const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure;samesite=strict`;
};

const clearAllAuthData = (): void => {
  console.log("2")
  removeStoredToken();
  removeCookie("refreshToken");
};

/* ---------- Thunks ---------- */
export const login = createAsyncThunk<
  { token: string },
  { username: string; password: string }
>("auth/login", async (credentials, { dispatch }) => {
  // Clear any existing auth data before login
  clearAllAuthData();

  const { data } = await axiosClient.post("/api/auth/login", credentials);
  const token = data.accessToken as string;
  const refreshToken = data.refreshToken as string;

  const { username, isValid } = parseUser(token);
  if (!isValid) {
    throw new Error("Invalid token received");
  }

  // Store tokens
  setStoredToken(token);
  if (refreshToken) {
    setCookie("refreshToken", refreshToken);
  }

  // Fetch user data separately
  await dispatch(fetchUserByUsername(username));

  return { token };
});

export const register = createAsyncThunk<
  { token: string },
  {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
  },
  { rejectValue: string }
>("auth/register", async (userData, { dispatch, rejectWithValue }) => {
  clearAllAuthData();
  try {
    const { data } = await axiosClient.post("/api/auth/register", userData);
    const token = data.accessToken as string;

    const { username, isValid } = parseUser(token);
    if (!isValid) {
      return rejectWithValue("Invalid token received");
    }

    setStoredToken(token);
    await dispatch(fetchUserByUsername(username));

    return { token };
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Registration failed",
    );
  }
});

export const refreshToken = createAsyncThunk<{ token: string }, void>(
  "auth/refreshToken",
  async (_, { dispatch }) => {
    const { data } = await axiosClient.post("/api/auth/refresh-token");
    const token = data.accessToken as string;
    const newRefreshToken = data.refreshToken as string;

    const { username, isValid } = parseUser(token);
    if (!isValid) {
      throw new Error("Invalid token received");
    }

    // Update stored tokens
    setStoredToken(token);
    if (newRefreshToken) {
      setCookie("refreshToken", newRefreshToken);
    }

    // Fetch fresh user data
    await dispatch(fetchUserByUsername(username));

    return { token };
  },
);

export const logout = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  try {
    await axiosClient.post("/api/auth/logout");
  } catch (error: any) {
    console.warn("Logout request failed:", error.message);
  } finally {

    // Always clear auth data regardless of API call success
    clearAllAuthData();

    // Clear user profile from user slice
    dispatch(clearProfile());
  }
});

export const initializeAuth = createAsyncThunk<{ token: string } | null, void>(
  "auth/initialize",
  async (_, { dispatch }) => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      try {
        return await dispatch(refreshToken()).unwrap();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        clearAllAuthData();
        return null;
      }
    }

    const { username, isValid } = parseUser(storedToken);
    if (!isValid) {
      // Token expired, try to refresh
      try {
        return await dispatch(refreshToken()).unwrap();
      } catch (error) {
        clearAllAuthData();
        throw error;
      }
    }

    // Token is valid, fetch user data
    await dispatch(fetchUserByUsername(username));

    return { token: storedToken };
  },
);

export const fetchUserByUsername = createAsyncThunk<UserType, string>(
  "auth/fetchUserByUsername",
  async (username) => {
    const { data } = await axiosClient.get(`/api/user/${username}`);
    return data;
  },
);

/* ---------- Slice ---------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (s) => {
      s.token = null;
      s.status = "idle";
      s.user = null;
      s.error = null;
      clearAllAuthData();
    },
    clearStatus: (s) => {
      s.status = "idle";
    },
    clearError: (s) => {
      s.error = null;
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
      })
      .addCase(login.rejected, (s) => {
        s.status = "failed";
        s.user = null;
        s.token = null;
        clearAllAuthData();
      })

      .addCase(register.pending, (s) => {
        s.status = "loading";
      })
      .addCase(register.fulfilled, (s, a) => {
        s.status = "authenticated";
        s.token = a.payload.token;
      })
      .addCase(register.rejected, (s, a) => {
        s.error = a.payload ? a.payload : "Registration failed";
        s.status = "failed";
        s.user = null;
        s.token = null;
        clearAllAuthData();
      })

      .addCase(refreshToken.fulfilled, (s, a) => {
        s.status = "authenticated";
        s.token = a.payload.token;
      })
      .addCase(refreshToken.rejected, (s) => {
        s.status = "failed";
        s.token = null;
        s.user = null;
        clearAllAuthData();
      })

      .addCase(logout.fulfilled, (s) => {
        s.token = null;
        s.status = "idle";
        s.user = null;
        s.error = null;

        clearAllAuthData();
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
        clearAllAuthData();
      })

      .addCase(fetchUserByUsername.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(fetchUserByUsername.rejected, (s) => {
        s.token = null;
        s.status = "failed";
        s.user = null;
        clearAllAuthData();
      });
  },
});

export const { clearAuth, clearStatus } = authSlice.actions;
export default authSlice.reducer;
