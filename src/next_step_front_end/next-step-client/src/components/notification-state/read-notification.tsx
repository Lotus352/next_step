"use client"

import {useState} from "react"

import {useEffect} from "react"
import {
    CheckCircle,
    AlertCircle,
    Info,
    X,
    AlertTriangle,
    Loader2,
    Bell,
    BellRing,
    Trash2,
    CheckCheck,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {motion, AnimatePresence} from "framer-motion"

export type ReadNotificationType =
    | "success"
    | "error"
    | "warning"
    | "info"
    | "loading"
    | "read"
    | "unread"
    | "deleted"
    | "marked-all"

interface ReadNotificationProps {
    isVisible: boolean
    type: ReadNotificationType
    title: string
    message: string
    onClose: () => void
    autoCloseTime?: number
    showProgress?: boolean
}

export function ReadNotification({
                                     isVisible,
                                     type,
                                     title,
                                     message,
                                     onClose,
                                     autoCloseTime = 4000,
                                     showProgress = true,
                                 }: ReadNotificationProps) {
    useEffect(() => {
        if (isVisible && type !== "loading") {
            const timer = setTimeout(() => {
                onClose()
            }, autoCloseTime)

            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose, autoCloseTime, type])

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-emerald-600"/>,
        error: <AlertCircle className="h-5 w-5 text-rose-600"/>,
        warning: <AlertTriangle className="h-5 w-5 text-amber-600"/>,
        info: <Info className="h-5 w-5 text-sky-600"/>,
        read: <Bell className="h-5 w-5 text-green-600"/>,
        unread: <BellRing className="h-5 w-5 text-primary"/>,
        deleted: <Trash2 className="h-5 w-5 text-red-600"/>,
        "marked-all": <CheckCheck className="h-5 w-5 text-blue-600"/>,
        loading: (
            <motion.div
                animate={{rotate: 360}}
                transition={{duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
            >
                <Loader2 className="h-5 w-5 text-primary"/>
            </motion.div>
        ),
    }

    const bgColors = {
        success: "bg-emerald-50 border-emerald-200",
        error: "bg-rose-50 border-rose-200",
        warning: "bg-amber-50 border-amber-200",
        info: "bg-sky-50 border-sky-200",
        read: "bg-green-50 border-green-200",
        unread: "bg-primary-50 border-primary-200",
        deleted: "bg-red-50 border-red-200",
        "marked-all": "bg-blue-50 border-blue-200",
        loading: "bg-primary-50 border-primary-200",
    }

    const progressColors = {
        success: "bg-emerald-500",
        error: "bg-rose-500",
        warning: "bg-amber-500",
        info: "bg-sky-500",
        read: "bg-green-500",
        unread: "bg-primary-500",
        deleted: "bg-red-500",
        "marked-all": "bg-blue-500",
        loading: "bg-primary-500",
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed top-20 right-4 z-[100] max-w-sm w-full"
                    initial={{opacity: 0, x: 100, y: 0}}
                    animate={{opacity: 1, x: 0, y: 0}}
                    exit={{opacity: 0, x: 100}}
                    transition={{duration: 0.3}}
                >
                    <div
                        className={`border shadow-lg rounded-lg p-4 flex items-start gap-3 backdrop-blur-md ${bgColors[type]}`}>
                        <motion.div
                            className="p-2 rounded-full bg-white/50"
                            initial={{scale: 0.8}}
                            animate={{scale: [0.8, 1.2, 1]}}
                            transition={{duration: 0.5}}
                        >
                            {icons[type]}
                        </motion.div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="font-semibold text-sm text-gray-800">{title}</p>
                            <p className="text-xs text-gray-600">{message}</p>

                            {/* Progress bar */}
                            {showProgress && type !== "loading" && (
                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                                    <motion.div
                                        className={`h-full ${progressColors[type]}`}
                                        initial={{width: "100%"}}
                                        animate={{width: "0%"}}
                                        transition={{duration: autoCloseTime / 1000, ease: "linear"}}
                                    />
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50 -mt-1 -mr-1"
                                onClick={onClose}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Hook for managing read notifications
export function useReadNotification() {
    const [notification, setNotification] = useState<{
        isVisible: boolean
        type: ReadNotificationType
        title: string
        message: string
    }>({
        isVisible: false,
        type: "info",
        title: "",
        message: "",
    })

    const showNotification = (type: ReadNotificationType, title: string, message: string) => {
        setNotification({
            isVisible: true,
            type,
            title,
            message,
        })
    }

    const hideNotification = () => {
        setNotification((prev) => ({...prev, isVisible: false}))
    }

    // Predefined methods for common notification operations
    const showReadSuccess = (count = 1) => {
        showNotification(
            "read",
            "Marked as Read",
            count === 1
                ? "Notification has been marked as read successfully."
                : `${count} notifications have been marked as read.`,
        )
    }

    const showDeleteSuccess = (count = 1) => {
        showNotification(
            "deleted",
            "Notification Deleted",
            count === 1 ? "Notification has been deleted successfully." : `${count} notifications have been deleted.`,
        )
    }

    const showMarkAllReadSuccess = (count: number) => {
        showNotification("marked-all", "All Marked as Read", `Successfully marked ${count} notifications as read.`)
    }

    const showError = (title: string, message: string) => {
        showNotification("error", title, message)
    }

    const showLoading = (title: string, message: string) => {
        showNotification("loading", title, message)
    }

    return {
        notification,
        showNotification,
        hideNotification,
        showReadSuccess,
        showDeleteSuccess,
        showMarkAllReadSuccess,
        showError,
        showLoading,
    }
}
