import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/api/axios-client";
import type NotificationType from "@/types/notification-type";
import type { NotificationRequest } from "@/types/notification-type";
import { DEFAULT_LEVEL_SIZE } from "@/constants";

/* ---------- State ---------- */
interface PageResp {
    content: NotificationType[];
    totalPages: number;
    page: number;
    totalElements: number;
}

interface NotificationsState extends PageResp {
    selected: NotificationType | null;
    request: NotificationRequest | null;
    unreadCount: number;

    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded";
        fetchingById: "idle" | "loading" | "failed" | "succeeded";
        fetchingUnreadCount: "idle" | "loading" | "failed" | "succeeded";
        creating: "idle" | "loading" | "failed" | "succeeded";
        updating: "idle" | "loading" | "failed" | "succeeded";
        deleting: "idle" | "loading" | "failed" | "succeeded";
        markingRead: "idle" | "loading" | "failed" | "succeeded";
        markingAllRead: "idle" | "loading" | "failed" | "succeeded";
    };

    error: string | null;
}

const initialState: NotificationsState = {
    content: [],
    totalPages: 0,
    page: 0,
    totalElements: 0,
    selected: null,
    request: null,
    unreadCount: 0,

    statuses: {
        fetching: "idle",
        fetchingById: "idle",
        fetchingUnreadCount: "idle",
        creating: "idle",
        updating: "idle",
        deleting: "idle",
        markingRead: "idle",
        markingAllRead: "idle",
    },

    error: null,
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

export const fetchNotificationById = createAsyncThunk<NotificationType, number>(
    "notifications/fetchById",
    async (id) => {
        const { data } = await axiosClient.get(`/api/notifications/${id}`);
        return data;
    }
);

export const fetchUnreadCount = createAsyncThunk<number>(
    "notifications/fetchUnreadCount",
    async () => {
        const { data } = await axiosClient.get("/api/notifications/unread-count");
        return data as number;
    }
);

export const createNotification = createAsyncThunk<
    NotificationType,
    NotificationRequest
>("notifications/create", async (notificationData) => {
    const { data } = await axiosClient.post("/api/notifications", notificationData);
    return data;
});

export const updateNotification = createAsyncThunk<
    NotificationType,
    { id: number; notificationData: NotificationRequest }
>("notifications/update", async ({ id, notificationData }) => {
    const { data } = await axiosClient.put(`/api/notifications/${id}`, notificationData);
    return data;
});

export const deleteNotification = createAsyncThunk<
    void,
    { id: number }
>("notifications/delete", async ({ id }) => {
    await axiosClient.delete(`/api/notifications/${id}`);
});

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
    }
);

/* ---------- Slice ---------- */
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clear: () => initialState,
        clearNotificationSelected: (s) => {
            s.selected = initialState.selected;
        },
        clearNotificationError: (s) => {
            s.error = initialState.error;
        },
        clearNotificationRequest: (s) => {
            s.request = initialState.request;
        },
        updateNotificationRequest: (s, a: PayloadAction<NotificationRequest | null>) => {
            s.request = a.payload;
        },
        initializeNotificationRequest: (s) => {
            s.request = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Notifications */
            .addCase(fetchNotifications.pending, (s) => {
                s.statuses.fetching = "loading";
            })
            .addCase(fetchNotifications.fulfilled, (s, a) => {
                s.statuses.fetching = "succeeded";
                s.content = a.payload.content;
                s.totalPages = a.payload.totalPages;
                s.page = a.payload.page;
                s.totalElements = a.payload.totalElements;
            })
            .addCase(fetchNotifications.rejected, (s) => {
                s.statuses.fetching = "failed";
                s.error = "Failed to fetch notifications";
            })

            /* Fetch Notification By Id */
            .addCase(fetchNotificationById.pending, (s) => {
                s.statuses.fetchingById = "loading";
            })
            .addCase(fetchNotificationById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded";
                s.selected = a.payload;
            })
            .addCase(fetchNotificationById.rejected, (s) => {
                s.statuses.fetchingById = "failed";
                s.error = "Failed to fetch notification by id";
            })

            /* Unread Count */
            .addCase(fetchUnreadCount.pending, (s) => {
                s.statuses.fetchingUnreadCount = "loading";
            })
            .addCase(fetchUnreadCount.fulfilled, (s, a) => {
                s.statuses.fetchingUnreadCount = "succeeded";
                s.unreadCount = a.payload;
            })
            .addCase(fetchUnreadCount.rejected, (s) => {
                s.statuses.fetchingUnreadCount = "failed";
                s.error = "Failed to fetch unread count";
            })

            /* Create Notification */
            .addCase(createNotification.pending, (s) => {
                s.statuses.creating = "loading";
            })
            .addCase(createNotification.fulfilled, (s, a) => {
                s.statuses.creating = "succeeded";
                s.content.unshift(a.payload);
                s.totalElements += 1;
            })
            .addCase(createNotification.rejected, (s) => {
                s.statuses.creating = "failed";
                s.error = "Failed to create notification";
            })

            /* Update Notification */
            .addCase(updateNotification.pending, (s) => {
                s.statuses.updating = "loading";
            })
            .addCase(updateNotification.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded";
                const notificationIndex = s.content.findIndex(
                    notification => notification.notificationId === a.payload.notificationId
                );
                if (notificationIndex !== -1) {
                    s.content[notificationIndex] = a.payload;
                }
                if (s.selected && s.selected.notificationId === a.payload.notificationId) {
                    s.selected = a.payload;
                }
            })
            .addCase(updateNotification.rejected, (s) => {
                s.statuses.updating = "failed";
                s.error = "Failed to update notification";
            })

            /* Delete Notification */
            .addCase(deleteNotification.pending, (s) => {
                s.statuses.deleting = "loading";
            })
            .addCase(deleteNotification.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded";
                const notificationId = a.meta.arg.id;
                s.content = s.content.filter(
                    notification => notification.notificationId !== notificationId
                );
                s.totalElements = Math.max(0, s.totalElements - 1);
                if (s.selected && s.selected.notificationId === notificationId) {
                    s.selected = null;
                }
            })
            .addCase(deleteNotification.rejected, (s) => {
                s.statuses.deleting = "failed";
                s.error = "Failed to delete notification";
            })

            /* Mark Single Read */
            .addCase(markRead.pending, (s) => {
                s.statuses.markingRead = "loading";
            })
            .addCase(markRead.fulfilled, (s, a) => {
                s.statuses.markingRead = "succeeded";
                const idx = s.content.findIndex((n) => n.notificationId === a.payload);
                if (idx !== -1) {
                    s.content[idx].status = "READ";
                    if (s.unreadCount > 0) s.unreadCount -= 1;
                }
                if (s.selected && s.selected.notificationId === a.payload) {
                    s.selected = { ...s.selected, status: "READ" };
                }
            })
            .addCase(markRead.rejected, (s) => {
                s.statuses.markingRead = "failed";
                s.error = "Failed to mark notification as read";
            })

            /* Mark All Read */
            .addCase(markAllRead.pending, (s) => {
                s.statuses.markingAllRead = "loading";
            })
            .addCase(markAllRead.fulfilled, (s) => {
                s.statuses.markingAllRead = "succeeded";
                s.content.forEach((n) => (n.status = "READ"));
                s.unreadCount = 0;
                if (s.selected) {
                    s.selected = { ...s.selected, status: "READ" };
                }
            })
            .addCase(markAllRead.rejected, (s) => {
                s.statuses.markingAllRead = "failed";
                s.error = "Failed to mark all notifications as read";
            });
    },
});

export const {
    clear,
    clearNotificationSelected,
    clearNotificationError,
    clearNotificationRequest,
    updateNotificationRequest,
    initializeNotificationRequest,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;