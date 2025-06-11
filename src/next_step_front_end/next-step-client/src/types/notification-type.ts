import UserType from "@/types/user-type.ts";
import JobType from "@/types/job-type.ts";

export default interface NotificationType {
    notificationId: number;
    user: UserType;
    job: JobType;
    message: string | null;
    status: string | "UNREAD";
    createdAt: string;
    readAt: string | null;
}
