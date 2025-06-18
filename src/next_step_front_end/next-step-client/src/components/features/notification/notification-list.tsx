"use client"

import { motion, AnimatePresence } from "framer-motion"
import type NotificationType from "@/types/notification-type"
import NotificationItem from "./notification-item"

interface NotificationListProps {
    notifications: NotificationType[]
}

export default function NotificationList({ notifications }: NotificationListProps) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
            <AnimatePresence>
                {notifications.map((notification, index) => (
                    <motion.div
                        key={notification.notificationId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.6,
                            ease: "easeOut",
                        }}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationDuration: "600ms",
                        }}
                    >
                        <NotificationItem notification={notification} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    )
}
