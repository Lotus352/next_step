import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type NotificationType from "@/types/notification-type";
import { DEFAULT_LEVEL_SIZE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
    content: NotificationType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface NotificationsState extends PageResp {
    unreadCount: number;
    status: "idle" | "loading" | "failed";
}

const initialState: NotificationsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    unreadCount: 0,
    status: "idle",
};

/* ---------- Thunks ---------- */
export const fetchNotifications = createAsyncThunk<
    PageResp,
    { page?: number; size?: number }
>("notifications/fetch", async ({ page = 0, size = DEFAULT_LEVEL_SIZE } = {}) => {
    const { data } = await axiosClient.get("/api/notifications", { params: { page, size } });
    return {
        content: data.content,
        totalPages: data.totalPages,
        page: data.number,
        totalElements: data.totalElements,
    };
});

export const fetchUnreadCount = createAsyncThunk<number>(
    "notifications/fetchUnreadCount",
    async () => {
        const { data } = await axiosClient.get("/api/notifications/unread-count");
        return data as number;
    },
);

export const markRead = createAsyncThunk<
    number,
    number
>("notifications/markRead", async (id) => {
    await axiosClient.put(`/api/notifications/${id}/read`);
    return id;
});

export const markAllRead = createAsyncThunk<void>(
    "notifications/markAllRead",
    async () => {
        await axiosClient.put("/api/notifications/read-all");
    },
);

/* ---------- Slice ---------- */
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clear: () => initialState,
    },
    extraReducers: (b) => {
        b
            /* list */
            .addCase(fetchNotifications.pending, (s) => { s.status = "loading"; })
            .addCase(fetchNotifications.fulfilled, (s, a) => {
                Object.assign(s, a.payload, { status: "idle" });
            })
            .addCase(fetchNotifications.rejected, (s) => { s.status = "failed"; })

            /* unread count */
            .addCase(fetchUnreadCount.fulfilled, (s, a) => { s.unreadCount = a.payload; })

            /* mark single */
            .addCase(markRead.fulfilled, (s, a) => {
                const idx = s.content.findIndex((n) => n.notificationId === a.payload);
                if (idx !== -1) {
                    s.content[idx].status = "READ";
                    if (s.unreadCount > 0) s.unreadCount -= 1;
                }
            })

            /* mark all */
            .addCase(markAllRead.fulfilled, (s) => {
                s.content.forEach((n) => (n.status = "READ"));
                s.unreadCount = 0;
            });
    },
});

export const { clear } = notificationsSlice.actions;
export default notificationsSlice.reducer;
