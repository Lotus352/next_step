import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type SalaryType from "@/types/salary-type";
import type SalaryRangeType from "@/types/salary-range-type";
import { DEFAULT_LEVEL_SIZE } from "@/constants";

/* ---------- Types ---------- */
interface PageResp<T> {
  content: T[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface SalaryState extends PageResp<SalaryType> {
  range: SalaryRangeType | null;
  currencies: string[];
  payPeriods: string[];
  status: "idle" | "loading" | "failed";
}

/* ---------- Initial ---------- */
const initialState: SalaryState = {
  content: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  range: null,
  currencies: [],
  payPeriods: [],
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchSalaries = createAsyncThunk<
  PageResp<SalaryType>,
  { page?: number; size?: number }
>("salary/fetch", async ({ page = 0, size = DEFAULT_LEVEL_SIZE } = {}) => {
  const { data } = await axiosClient.get("/api/job-salaries", {
    params: { page, size },
  });
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const fetchCurrencies = createAsyncThunk<string[]>(
  "salary/fetchCurrencies",
  async () => {
    const { data } = await axiosClient.get("/api/job-salaries/currencies");
    return data;
  },
);

export const fetchPayPeriods = createAsyncThunk<string[]>(
  "salary/fetchPayPeriods",
  async () => {
    const { data } = await axiosClient.get("/api/job-salaries/pay-periods");
    return data;
  },
);

export const fetchSalaryRange = createAsyncThunk<
  SalaryRangeType,
  { currency: string; payPeriod: string }
>("salary/fetchRange", async ({ currency, payPeriod }) => {
  const { data } = await axiosClient.get("/api/job-salaries/salary-ranges", {
    params: { currency, payPeriod },
  });
  return data;
});

/* ---------- Slice ---------- */
const salariesSlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (b) => {
    b.addCase(fetchSalaries.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchSalaries.fulfilled, (s, a) => {
        Object.assign(s, a.payload, { status: "idle" });
      })
      .addCase(fetchSalaries.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(fetchCurrencies.fulfilled, (s, a) => {
        s.currencies = a.payload;
      })
      .addCase(fetchPayPeriods.fulfilled, (s, a) => {
        s.payPeriods = a.payload;
      })
      .addCase(fetchSalaryRange.fulfilled, (s, a) => {
        s.range = a.payload;
      });
  },
});

export const { clear } = salariesSlice.actions;
export default salariesSlice.reducer;
