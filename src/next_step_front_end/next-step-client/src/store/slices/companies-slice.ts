import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type CompanyType from "@/types/company-type";
import { FEATURED_COMPANIES_LIMIT } from "@/constants";

/* ---------- State ---------- */
interface CompaniesState {
  featured: CompanyType[];
  selected: CompanyType | null;
  status: "idle" | "loading" | "failed";
}

const initialState: CompaniesState = {
  featured: [],
  selected: null,
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchFeatured = createAsyncThunk<CompanyType[], number>(
  "companies/fetchFeatured",
  async (size = FEATURED_COMPANIES_LIMIT) => {
    const { data } = await axiosClient.get("/api/companies/featured", {
      params: { size },
    });
    return data;
  },
);

export const fetchCompany = createAsyncThunk<CompanyType, number>(
  "companies/fetchCompany",
  async (id) => {
    const { data } = await axiosClient.get(`/api/companies/${id}`);
    return data;
  },
);

/* ---------- Slice ---------- */
const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    clearCompanySelected: (s) => {
      s.selected = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchFeatured.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchFeatured.fulfilled, (s, a) => {
        s.status = "idle";
        s.featured = a.payload;
      })
      .addCase(fetchFeatured.rejected, (s) => {
        s.status = "failed";
      })

      .addCase(fetchCompany.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchCompany.fulfilled, (s, a) => {
        s.status = "idle";
        s.selected = a.payload;
      })
      .addCase(fetchCompany.rejected, (s) => {
        s.status = "failed";
        s.selected = null;
      });
  },
});

export const { clearCompanySelected } = companiesSlice.actions;
export default companiesSlice.reducer;
