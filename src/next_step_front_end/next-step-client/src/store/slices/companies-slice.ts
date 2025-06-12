import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type CompanyType from "@/types/company-type";
import {FEATURED_COMPANIES_LIMIT} from "@/constants";

/* ---------- State ---------- */
interface CompaniesState {
    featured: CompanyType[];
    selected: CompanyType | null;
    statuses: {
        fetchingFeatured: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
    };
    error: string | null;
}

const initialState: CompaniesState = {
    featured: [],
    selected: null,
    statuses: {
        fetchingFeatured: "idle",
        fetchingById: "idle"
    },
    error: null,
};

/* ---------- Thunks ---------- */
export const fetchFeaturedCompanies = createAsyncThunk<CompanyType[], number>(
    "companies/fetchFeaturedCompanies",
    async (size = FEATURED_COMPANIES_LIMIT) => {
        const {data} = await axiosClient.get("/api/companies/featured", {
            params: {size},
        });
        return data;
    },
);

export const fetchCompanyById = createAsyncThunk<CompanyType, number>(
    "companies/fetchCompanyById",
    async (id) => {
        const {data} = await axiosClient.get(`/api/companies/${id}`);
        return data;
    },
);

/* ---------- Slice ---------- */
const companiesSlice = createSlice({
    name: "companies",
    initialState,
    reducers: {
        clearCompanies: () => initialState,
        clearCompanySelected: (s) => {
            s.selected = initialState.selected;
        },
        clearError: (s) => {
            s.error = initialState.error;
        },
        clearFeaturedCompanies: (s) => {
            s.featured = initialState.featured;
        },
        resetStatuses: (s) => {
            s.statuses = initialState.statuses;
        }
    },
    extraReducers: (b) => {
        b
            /* Featured Companies */
            .addCase(fetchFeaturedCompanies.pending, (s) => {
                s.statuses.fetchingFeatured = "loading";
                s.error = null;
            })
            .addCase(fetchFeaturedCompanies.fulfilled, (s, a) => {
                s.statuses.fetchingFeatured = "succeeded";
                s.featured = a.payload;
            })
            .addCase(fetchFeaturedCompanies.rejected, (s) => {
                s.statuses.fetchingFeatured = "failed";
                s.error = "Failed to fetch featured companies";
            })

            /* Fetch Company By Id */
            .addCase(fetchCompanyById.pending, (s) => {
                s.statuses.fetchingById = "loading";
                s.error = null;
            })
            .addCase(fetchCompanyById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchCompanyById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch company";
                s.selected = null;
            });
    },
});

export const {clearCompanySelected, clearCompanies, clearError} = companiesSlice.actions;
export default companiesSlice.reducer;
