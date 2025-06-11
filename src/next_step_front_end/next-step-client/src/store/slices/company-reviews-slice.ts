import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type CompanyReviewType from "@/types/company-review-type";
import {DEFAULT_REVIEW_SIZE } from "@/constants";
import { DEFAULT_PAGE } from "@/constants";

/* ---------- State ---------- */
interface PaginatedReviews {
  content: CompanyReviewType[];
  totalPages: number;
  page: number;
  totalElements: number;
}

interface CompanyReviewsState {
  items: CompanyReviewType[];
  totalPages: number;
  page: number;
  totalElements: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CompanyReviewsState = {
  items: [],
  totalPages: 0,
  page: 0,
  totalElements: 0,
  status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchReviews = createAsyncThunk<
  PaginatedReviews,
  { companyId: number; page?: number; size?: number }
>("companyReviews/fetchReviews", async ({ companyId, page = DEFAULT_PAGE, size = DEFAULT_REVIEW_SIZE }) => {
  const { data } = await axiosClient.get(
    `/api/company-reviews/companies/${companyId}`,
    {
      params: { page, size },
    },
  );
  return {
    content: data.content,
    totalPages: data.totalPages,
    page: data.number,
    totalElements: data.totalElements,
  };
});

export const addReview = createAsyncThunk<
  CompanyReviewType,
  { companyId: number; rating: number; reviewText: string; userId: number }
>("companyReviews/addReview", async (body) => {
  const { data } = await axiosClient.post("/api/company-reviews", body);
  return data;
});

export const updateReview = createAsyncThunk<
  CompanyReviewType,
  { reviewId: number; rating: number; reviewText: string; userId: number }
>("companyReviews/updateReview", async ({ reviewId, ...payload }) => {
  const { data } = await axiosClient.put(`/api/company-reviews/${reviewId}`, payload);
  return data;
});

export const deleteReview = createAsyncThunk<number, number>(
  "companyReviews/deleteReview",
  async (id) => {
    await axiosClient.delete(`/api/company-reviews/${id}`);
    return id;
  },
);

export const hasUserReviewedCompany = createAsyncThunk<
  boolean,
  { userId: number; companyId: number }
>("companyReviews/hasUserReviewedCompany", async ({ userId, companyId }) => {
  const { data } = await axiosClient.get(
    "/api/company-reviews/has-commented",
    {
      params: { userId, companyId },
    },
  );
  return data;
});

/* ---------- Slice ---------- */
const companyReviewsSlice = createSlice({
  name: "companyReviews",
  initialState,
  reducers: {
    clearReviews: () => initialState,
  },
  extraReducers: (b) => {
    b
      /* fetch */
      .addCase(fetchReviews.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (s, a) => {
        s.status = "idle";
        s.items = a.payload.content;
        s.totalPages = a.payload.totalPages;
        s.page = a.payload.page;
        s.totalElements = a.payload.totalElements;
      })
      .addCase(fetchReviews.rejected, (s) => {
        s.status = "failed";
      })

      /* add */
      .addCase(addReview.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
        s.totalElements += 1;
      })

      /* update */
      .addCase(updateReview.fulfilled, (s, a) => {
        const idx = s.items.findIndex((r) => r.reviewId === a.payload.reviewId);
        if (idx !== -1) s.items[idx] = a.payload;
      })

      /* delete */
      .addCase(deleteReview.fulfilled, (s, a) => {
        s.items = s.items.filter((r) => r.reviewId !== a.payload);
        s.totalElements -= 1;
      });
  },
});

export const { clearReviews } = companyReviewsSlice.actions;
export default companyReviewsSlice.reducer;
