"use client"

import {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import {formatDistanceToNow} from "date-fns"
import {motion, AnimatePresence} from "framer-motion"
import {ChevronDown, Eye, Bell} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {ScrollArea} from "@/components/ui/scroll-area"
import type {AppDispatch, RootState} from "@/store/store"
import type NotificationType from "@/types/notification-type"
import {fetchNotifications, markRead} from "@/store/slices/notifications-slice"

interface NotificationBellDropdownProps {
    isOpen: boolean
    onClose: () => void
    onMouseEnter: () => void
    onMouseLeave: () => void
}

export default function NotificationBellDropdown({
                                                     isOpen,
                                                     onClose,
                                                     onMouseEnter,
                                                     onMouseLeave,
                                                 }: NotificationBellDropdownProps) {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [dropdownPage, setDropdownPage] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)

    const {
        content: notifications,
        unreadCount,
        totalElements,
        statuses,
    } = useSelector((state: RootState) => state.notifications)

    const hasUnread = unreadCount > 0
    const itemsPerPage = 5
    const displayedNotifications = notifications.slice(0, (dropdownPage + 1) * itemsPerPage)
    const hasMore = displayedNotifications.length < Math.min(notifications.length, totalElements)

    // Fetch initial notifications when dropdown opens
    useEffect(() => {
        if (isOpen && notifications.length === 0) {
            dispatch(fetchNotifications({page: 0, size: 10}))
        }
    }, [isOpen, notifications.length, dispatch])

    const handleLoadMore = async () => {
        if (loadingMore) return

        setLoadingMore(true)
        try {
            if (displayedNotifications.length >= notifications.length) {
                // Need to fetch more from server
                const nextServerPage = Math.floor(notifications.length / 10)
                await dispatch(fetchNotifications({page: nextServerPage, size: 10}))
            }
            setDropdownPage((prev) => prev + 1)
        } finally {
            setLoadingMore(false)
        }
    }

    const handleNotificationClick = async (notification: NotificationType) => {
        if (notification.status === "UNREAD") {
            await dispatch(markRead(notification.notificationId))
        }
        navigate("/candidate/notifications")
        onClose()
    }

    const handleViewAll = () => {
        navigate("/candidate/notifications")
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0, y: -10, scale: 0.95}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: -10, scale: 0.95}}
                    transition={{duration: 0.2}}
                    className="absolute top-full right-0 mt-2 w-96 bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 z-[100] overflow-hidden"
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    {/* Enhanced Header */}
                    <div
                        className="relative p-4 bg-gradient-to-br from-muted/30 via-muted/20 to-transparent border-b border-border/30">
                        {/* Background decoration */}
                        <div className="absolute top-2 right-2 opacity-20">
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"/>
                        </div>
                        <div className="absolute bottom-2 left-2 opacity-10">
                            <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse"/>
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Bell className="h-4 w-4 text-primary"/>
                                </div>
                                <h3 className="font-semibold text-foreground">Notifications</h3>
                            </div>
                            {hasUnread && (
                                <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.1}}>
                                    <Badge
                                        className="bg-red-500 hover:bg-red-500 text-white text-xs shadow-lg">{unreadCount} new</Badge>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <ScrollArea className="max-h-96">
                        <div className="py-2">
                            {statuses.fetching === "loading" && notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center">
                                    <div
                                        className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"/>
                                    <div className="text-muted-foreground text-sm">Loading notifications...</div>
                                </div>
                            ) : displayedNotifications.length > 0 ? (
                                displayedNotifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.notificationId}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: index * 0.05}}
                                        className={`group px-4 py-3 hover:bg-muted/50 cursor-pointer transition-all duration-200 border-l-2 relative ${
                                            notification.status === "UNREAD"
                                                ? "border-l-primary bg-primary/5 hover:bg-primary/10"
                                                : "border-l-transparent hover:border-l-muted-foreground/20"
                                        }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {/* Hover effect background */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

                                        <div className="flex items-start gap-3 relative z-10">
                                            {/* User Avatar */}
                                            <div className="relative">
                                                <Avatar
                                                    className="h-8 w-8 flex-shrink-0 border border-border/30 group-hover:border-primary/30 transition-colors duration-200">
                                                    <AvatarImage
                                                        src={notification.user.avatarUrl || ""}
                                                        alt={notification.user.fullName || notification.user.username}
                                                    />
                                                    <AvatarFallback
                                                        className="bg-primary/10 text-primary text-xs font-semibold">
                                                        {(notification.user.fullName || notification.user.username).charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Header */}
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                                                        {notification.user.fullName || notification.user.username}
                                                    </p>
                                                    {notification.status === "UNREAD" && (
                                                        <motion.div
                                                            initial={{scale: 0}}
                                                            animate={{scale: 1}}
                                                            className="w-2 h-2 bg-primary rounded-full flex-shrink-0 shadow-sm"
                                                        />
                                                    )}
                                                </div>

                                                {/* Message */}
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed group-hover:text-foreground transition-colors duration-200">
                                                    {notification.message || "You have a new notification"}
                                                </p>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between">
                          <span
                              className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                            {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                          </span>

                                                    {notification.job && (
                                                        <div className="flex items-center gap-1 max-w-32">

                                                            <span className="text-xs text-primary font-medium truncate">
                                {notification.job.title}
                              </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    className="px-4 py-12 text-center"
                                >
                                    <div
                                        className="inline-flex items-center justify-center p-4 rounded-full bg-muted/50 mb-4">
                                        <Bell className="h-6 w-6 text-muted-foreground"/>
                                    </div>
                                    <div className="text-muted-foreground text-sm font-medium mb-1">No notifications
                                        yet
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        You'll see notifications about job applications and activities here
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Enhanced Footer */}
                    <div
                        className="relative p-3 bg-gradient-to-br from-muted/20 via-transparent to-transparent border-t border-border/30">
                        {/* Background decoration */}
                        <div className="absolute top-1 right-1 opacity-20">
                            <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse"/>
                        </div>

                        <div className="flex items-center justify-between gap-2 relative z-10">
                            {/* Load More Button */}
                            {hasMore && (
                                <motion.div initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                                        onClick={handleLoadMore}
                                        disabled={loadingMore}
                                    >
                                        {loadingMore ? (
                                            <div
                                                className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full mr-1"/>
                                        ) : (
                                            <ChevronDown className="h-3 w-3 mr-1"/>
                                        )}
                                        {loadingMore ? "Loading..." : "Load More"}
                                    </Button>
                                </motion.div>
                            )}

                            {/* View All Button */}
                            <motion.div
                                initial={{opacity: 0, x: 10}}
                                animate={{opacity: 1, x: 0}}
                                transition={{delay: 0.1}}
                                className="ml-auto"
                            >
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 hover:scale-105 shadow-sm"
                                    onClick={handleViewAll}
                                >
                                    <Eye className="h-3 w-3 mr-1"/>
                                    View All ({totalElements})
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
