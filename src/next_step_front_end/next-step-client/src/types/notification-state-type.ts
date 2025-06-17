import { type NotificationType } from "@/components/notifications/status-notification";

export default interface NotificationState {
  isVisible: boolean;
  type: NotificationType;
  title: string;
  message: string;
}
