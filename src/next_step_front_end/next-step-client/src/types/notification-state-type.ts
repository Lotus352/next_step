import { type NotificationType } from "@/components/notification-state/status-notification";

export default interface NotificationState {
  isVisible: boolean;
  type: NotificationType;
  title: string;
  message: string;
}
