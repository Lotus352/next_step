import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axiosClient from "@/api/axios-client"
import type NotificationType from "@/types/notification-type"
import type { NotificationRequest } from "@/types/notification-type"
import { DEFAULT_NOTIFICATION_SIZE } from "@/constants"

/* ---------- State ---------- */
interface PageResp {
    content: NotificationType[]
    totalPages: number
    page: number
    totalElements: number
}

interface NotificationsState extends PageResp {
    selected: NotificationType | null
    request: NotificationRequest | null
    unreadCount: number

    statuses: {
        fetching: "idle" | "loading" | "failed" | "succeeded"
        fetchingById: "idle" | "loading" | "failed" | "succeeded"
        fetchingUnreadCount: "idle" | "loading" | "failed" | "succeeded"
        creating: "idle" | "loading" | "failed" | "succeeded"
        updating: "idle" | "loading" | "failed" | "succeeded"
        deleting: "idle" | "loading" | "failed" | "succeeded"
        markingRead: "idle" | "loading" | "failed" | "succeeded"
        markingAllRead: "idle" | "loading" | "failed" | "succeeded"
    }

    error: string | null
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
}

/* ---------- Thunks ---------- */
export const fetchNotifications = createAsyncThunk<PageResp, { page?: number; size?: number }, { rejectValue: string }>(
    "notifications/fetch",
    async ({ page = 0, size = DEFAULT_NOTIFICATION_SIZE } = {}, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get("/api/notifications", { params: { page, size } })
            return {
                content: data.content,
                totalPages: data.totalPages,
                page: data.number,
                totalElements: data.totalElements,
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications")
        }
    },
)

export const fetchNotificationById = createAsyncThunk<NotificationType, number, { rejectValue: string }>(
    "notifications/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get(`/api/notifications/${id}`)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notification")
        }
    },
)

export const fetchUnreadCount = createAsyncThunk<number, void, { rejectValue: string }>(
    "notifications/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get("/api/notifications/unread-count")
            return data as number
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch unread count")
        }
    },
)

export const createNotification = createAsyncThunk<NotificationType, NotificationRequest, { rejectValue: string }>(
    "notifications/create",
    async (notificationData, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.post("/api/notifications", notificationData)
            return data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create notification")
        }
    },
)

export const updateNotification = createAsyncThunk<
    NotificationType,
    { id: number; notificationData: NotificationRequest },
    { rejectValue: string }
>("notifications/update", async ({ id, notificationData }, { rejectWithValue }) => {
    try {
        const { data } = await axiosClient.put(`/api/notifications/${id}`, notificationData)
        return data
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Failed to update notification")
    }
})

export const deleteNotification = createAsyncThunk<void, { id: number }, { rejectValue: string }>(
    "notifications/delete",
    async ({ id }, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/api/notifications/${id}`)
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete notification")
        }
    },
)

export const markRead = createAsyncThunk<number, number, { rejectValue: string }>(
    "notifications/markRead",
    async (id, { rejectWithValue }) => {
        try {
            await axiosClient.put(`/api/notifications/${id}/read`)
            return id
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark notification as read")
        }
    },
)

export const markAllRead = createAsyncThunk<void, void, { rejectValue: string }>(
    "notifications/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.put("/api/notifications/read-all")
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark all notifications as read")
        }
    },
)

/* ---------- Slice ---------- */
const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clear: () => initialState,
        clearNotificationSelected: (s) => {
            s.selected = initialState.selected
        },
        clearNotificationError: (s) => {
            s.error = initialState.error
        },
        clearNotificationRequest: (s) => {
            s.request = initialState.request
        },
        updateNotificationRequest: (s, a: PayloadAction<NotificationRequest | null>) => {
            s.request = a.payload
        },
        initializeNotificationRequest: (s) => {
            s.request = null
        },
        // New reducer to reset specific status
        resetStatus: (s, a: PayloadAction<keyof NotificationsState["statuses"]>) => {
            s.statuses[a.payload] = "idle"
        },
    },
    extraReducers: (builder) => {
        builder
            /* Fetch Notifications */
            .addCase(fetchNotifications.pending, (s) => {
                s.statuses.fetching = "loading"
                s.error = null
            })
            .addCase(fetchNotifications.fulfilled, (s, a) => {
                s.statuses.fetching = "succeeded"
                s.content = a.payload.content
                s.totalPages = a.payload.totalPages
                s.page = a.payload.page
                s.totalElements = a.payload.totalElements
                s.error = null
            })
            .addCase(fetchNotifications.rejected, (s, a) => {
                s.statuses.fetching = "failed"
                s.error = a.payload || "Failed to fetch notifications"
            })

            /* Fetch Notification By Id */
            .addCase(fetchNotificationById.pending, (s) => {
                s.statuses.fetchingById = "loading"
                s.error = null
            })
            .addCase(fetchNotificationById.fulfilled, (s, a) => {
                s.statuses.fetchingById = "succeeded"
                s.selected = a.payload
                s.error = null
            })
            .addCase(fetchNotificationById.rejected, (s, a) => {
                s.statuses.fetchingById = "failed"
                s.error = a.payload || "Failed to fetch notification by id"
            })

            /* Unread Count */
            .addCase(fetchUnreadCount.pending, (s) => {
                s.statuses.fetchingUnreadCount = "loading"
                s.error = null
            })
            .addCase(fetchUnreadCount.fulfilled, (s, a) => {
                s.statuses.fetchingUnreadCount = "succeeded"
                s.unreadCount = a.payload
                s.error = null
            })
            .addCase(fetchUnreadCount.rejected, (s, a) => {
                s.statuses.fetchingUnreadCount = "failed"
                s.error = a.payload || "Failed to fetch unread count"
            })

            /* Create Notification */
            .addCase(createNotification.pending, (s) => {
                s.statuses.creating = "loading"
                s.error = null
            })
            .addCase(createNotification.fulfilled, (s, a) => {
                s.statuses.creating = "succeeded"
                s.content.unshift(a.payload)
                s.totalElements += 1
                // Update unread count if new notification is unread
                if (a.payload.status === "UNREAD") {
                    s.unreadCount += 1
                }
                s.error = null
            })
            .addCase(createNotification.rejected, (s, a) => {
                s.statuses.creating = "failed"
                s.error = a.payload || "Failed to create notification"
            })

            /* Update Notification */
            .addCase(updateNotification.pending, (s) => {
                s.statuses.updating = "loading"
                s.error = null
            })
            .addCase(updateNotification.fulfilled, (s, a) => {
                s.statuses.updating = "succeeded"
                const notificationIndex = s.content.findIndex(
                    (notification) => notification.notificationId === a.payload.notificationId,
                )
                if (notificationIndex !== -1) {
                    const oldNotification = s.content[notificationIndex]
                    s.content[notificationIndex] = a.payload

                    // Update unread count based on status change
                    if (oldNotification.status === "UNREAD" && a.payload.status === "READ") {
                        s.unreadCount = Math.max(0, s.unreadCount - 1)
                    } else if (oldNotification.status === "READ" && a.payload.status === "UNREAD") {
                        s.unreadCount += 1
                    }
                }
                if (s.selected && s.selected.notificationId === a.payload.notificationId) {
                    s.selected = a.payload
                }
                s.error = null
            })
            .addCase(updateNotification.rejected, (s, a) => {
                s.statuses.updating = "failed"
                s.error = a.payload || "Failed to update notification"
            })

            /* Delete Notification */
            .addCase(deleteNotification.pending, (s) => {
                s.statuses.deleting = "loading"
                s.error = null
            })
            .addCase(deleteNotification.fulfilled, (s, a) => {
                s.statuses.deleting = "succeeded"
                const notificationId = a.meta.arg.id
                const deletedNotification = s.content.find((n) => n.notificationId === notificationId)

                s.content = s.content.filter((notification) => notification.notificationId !== notificationId)
                s.totalElements = Math.max(0, s.totalElements - 1)

                // Update unread count if deleted notification was unread
                if (deletedNotification && deletedNotification.status === "UNREAD") {
                    s.unreadCount = Math.max(0, s.unreadCount - 1)
                }

                if (s.selected && s.selected.notificationId === notificationId) {
                    s.selected = null
                }
                s.error = null
            })
            .addCase(deleteNotification.rejected, (s, a) => {
                s.statuses.deleting = "failed"
                s.error = a.payload || "Failed to delete notification"
            })

            /* Mark Single Read */
            .addCase(markRead.pending, (s) => {
                s.statuses.markingRead = "loading"
                s.error = null
            })
            .addCase(markRead.fulfilled, (s, a) => {
                s.statuses.markingRead = "succeeded"
                const idx = s.content.findIndex((n) => n.notificationId === a.payload)
                if (idx !== -1 && s.content[idx].status === "UNREAD") {
                    s.content[idx].status = "READ"
                    s.content[idx].readAt = new Date().toISOString()
                    s.unreadCount = Math.max(0, s.unreadCount - 1)
                }
                if (s.selected && s.selected.notificationId === a.payload && s.selected.status === "UNREAD") {
                    s.selected = {
                        ...s.selected,
                        status: "READ",
                        readAt: new Date().toISOString(),
                    }
                }
                s.error = null
            })
            .addCase(markRead.rejected, (s, a) => {
                s.statuses.markingRead = "failed"
                s.error = a.payload || "Failed to mark notification as read"
            })

            /* Mark All Read */
            .addCase(markAllRead.pending, (s) => {
                s.statuses.markingAllRead = "loading"
                s.error = null
            })
            .addCase(markAllRead.fulfilled, (s) => {
                s.statuses.markingAllRead = "succeeded"
                const currentTime = new Date().toISOString()
                s.content.forEach((n) => {
                    if (n.status === "UNREAD") {
                        n.status = "READ"
                        n.readAt = currentTime
                    }
                })
                s.unreadCount = 0
                if (s.selected && s.selected.status === "UNREAD") {
                    s.selected = {
                        ...s.selected,
                        status: "READ",
                        readAt: currentTime,
                    }
                }
                s.error = null
            })
            .addCase(markAllRead.rejected, (s, a) => {
                s.statuses.markingAllRead = "failed"
                s.error = a.payload || "Failed to mark all notifications as read"
            })
    },
})

export const {
    clear,
    clearNotificationSelected,
    clearNotificationError,
    clearNotificationRequest,
    updateNotificationRequest,
    initializeNotificationRequest,
    resetStatus,
} = notificationsSlice.actions

export default notificationsSlice.reducer
