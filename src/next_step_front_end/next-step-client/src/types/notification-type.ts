import UserType from "@/types/user-type.ts";
import JobType from "@/types/job-type.ts";

export default interface NotificationType {
    notificationId: number;
    user: UserType;
    job: JobType;
    message: string | null;
    status: "READ" | "UNREAD";
    createdAt: string;
    readAt: string | null;
}

export interface NotificationRequest {
    userId: number;
    jobId: number;
    message: string | null;
    status: "READ" | "UNREAD";
    createdAt: string;
    readAt: string | null;
}
