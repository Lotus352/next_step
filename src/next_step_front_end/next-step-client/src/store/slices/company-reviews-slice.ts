import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type CompanyReviewType from "@/types/company-review-type";
import {DEFAULT_REVIEW_SIZE} from "@/constants";
import {DEFAULT_PAGE} from "@/constants";

/* ---------- State ---------- */
interface PaginatedReviews {
    content: CompanyReviewType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface CompanyReviewsState extends PaginatedReviews {
    checkedUserReview: boolean;
    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded";
        adding: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
        checkingUserReview: "idle" | "loading" | "failed" | "succeeded";
    };
    error: string | null;
}

const initialState: CompanyReviewsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    checkedUserReview: false,
    statuses: {
        fetching: "idle",
        adding: "idle",
        updating: "idle",
        deleting: "idle",
        checkingUserReview: "idle",
    },
    error: null,
};

/* ---------- Thunks ---------- */
export const fetchReviews = createAsyncThunk<
    PaginatedReviews,
    { companyId: number; page?: number; size?: number }
>("companyReviews/fetchReviews", async ({companyId, page = DEFAULT_PAGE, size = DEFAULT_REVIEW_SIZE}) => {
    const {data} = await axiosClient.get(
        `/api/company-reviews/companies/${companyId}`,
        {
            params: {page, size},
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
    const {data} = await axiosClient.post("/api/company-reviews", body);
    return data;
});

export const updateReview = createAsyncThunk<
    CompanyReviewType,
    { reviewId: number; rating: number; reviewText: string; userId: number }
>("companyReviews/updateReview", async ({reviewId, ...payload}) => {
    const {data} = await axiosClient.put(`/api/company-reviews/${reviewId}`, payload);
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
>("companyReviews/hasUserReviewedCompany", async ({userId, companyId}) => {
    const {data} = await axiosClient.get(
        "/api/company-reviews/has-commented",
        {
            params: {userId, companyId},
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
        clearReviewError: (s) => {
            s.error = initialState.error;
        },
    },
    extraReducers: (b) => {
        b
            /* Fetch Reviews */
            .addCase(fetchReviews.pending, (s) => {
                s.statuses.fetching = "loading";
            })
            .addCase(fetchReviews.fulfilled, (s, a) => {
                s.statuses.fetching = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(fetchReviews.rejected, (s) => {
                s.statuses.fetching = "failed";
                s.error = "Failed to fetch reviews";
            })

            /* Add Review */
            .addCase(addReview.pending, (s) => {
                s.statuses.adding = "loading";
            })
            .addCase(addReview.fulfilled, (s, a) => {
                s.statuses.adding = "succeeded";
                s.content.unshift(a.payload);
                s.totalElements += 1;
            })
            .addCase(addReview.rejected, (s) => {
                s.statuses.adding = "failed";
                s.error = "Failed to add review";
            })

            /* Update Review */
            .addCase(updateReview.pending, (s) => {
                s.statuses.updating = "loading";
            })
            .addCase(updateReview.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";
                const idx = s.content.findIndex((r) => r.reviewId === a.payload.reviewId);
                if (idx !== -1) {
                    s.content[idx] = a.payload;
                }
            })
            .addCase(updateReview.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update review";
            })

            /* Delete Review */
            .addCase(deleteReview.pending, (s) => {
                s.statuses.deleting = "loading";
            })
            .addCase(deleteReview.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                s.content = s.content.filter((r) => r.reviewId !== a.payload);
                s.totalElements -= 1;
            })
            .addCase(deleteReview.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete review";
            })

            /* Check User Review Status */
            .addCase(hasUserReviewedCompany.pending, (s) => {
                s.statuses.checkingUserReview = "loading";
            })
            .addCase(hasUserReviewedCompany.fulfilled, (s, a) => {
                s.statuses.checkingUserReview = "succeeded";
                s.checkedUserReview = a.payload
            })
            .addCase(hasUserReviewedCompany.rejected, (s) => {
                s.statuses.checkingUserReview = "failed";
                s.error = "Failed to check user review status";
            });
    },
});

export const {clearReviews} = companyReviewsSlice.actions;
export default companyReviewsSlice.reducer;
