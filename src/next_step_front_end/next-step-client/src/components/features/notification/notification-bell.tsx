"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Bell, BellRing } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchUnreadCount } from "@/store/slices/notifications-slice"
import NotificationBellDropdown from "@/components/features/notification/notification-bell-dropdown"

export default function NotificationBell() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { unreadCount, statuses } = useSelector((state: RootState) => state.notifications)
    const { status: authStatus } = useSelector((state: RootState) => state.auth)

    const isAuthenticated = authStatus === "authenticated"
    const hasUnread = unreadCount > 0

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleMouseEnter = () => {
        setIsDropdownOpen(true)
    }

    const handleMouseLeave = () => {
        // Delay closing to allow moving to dropdown
        setTimeout(() => {
            if (!dropdownRef.current?.matches(":hover")) {
                setIsDropdownOpen(false)
            }
        }, 150)
    }

    // Fetch unread count when component mounts and user is authenticated
    useEffect(() => {
        if (isAuthenticated && statuses.fetchingUnreadCount === "idle") {
            dispatch(fetchUnreadCount())
        }
    }, [isAuthenticated, dispatch, statuses.fetchingUnreadCount])

    // Periodically refresh unread count
    useEffect(() => {
        if (!isAuthenticated) return

        const interval = setInterval(() => {
            dispatch(fetchUnreadCount())
        }, 30000) // Refresh every 30 seconds

        return () => clearInterval(interval)
    }, [isAuthenticated, dispatch])

    const handleNotificationClick = () => {
        navigate("/candidate/notifications")
        setIsDropdownOpen(false)
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        ref={dropdownRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-10 w-10 rounded-full transition-all duration-300 relative ${
                                hasUnread
                                    ? "hover:bg-primary/10 hover:text-primary text-primary"
                                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={handleNotificationClick}
                        >
                            {/* Bell Icon with Animation */}
                            <motion.div
                                animate={hasUnread ? { rotate: [0, -10, 10, -10, 0] } : {}}
                                transition={{
                                    duration: 0.5,
                                    repeat: hasUnread ? Number.POSITIVE_INFINITY : 0,
                                    repeatDelay: 3,
                                }}
                            >
                                {hasUnread ? <BellRing className="h-3 w-3" /> : <Bell className="h-3 w-3" />}
                            </motion.div>

                            {/* Unread Count Badge */}
                            {hasUnread && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Badge
                                        className={`h-5 min-w-5 px-1 text-xs font-bold bg-red-500 hover:bg-red-500 text-white border-2 border-background shadow-lg ${
                                            unreadCount > 99 ? "px-1.5" : ""
                                        }`}
                                    >
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </Badge>
                                </motion.div>
                            )}

                            {/* Pulsing Ring for Unread Notifications */}
                            {hasUnread && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 0, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}

                            {/* Glowing Effect for Unread */}
                            {hasUnread && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Number.POSITIVE_INFINITY,
                                        ease: "easeInOut",
                                    }}
                                />
                            )}
                        </Button>

                        {/* Notification Dropdown */}
                        <NotificationBellDropdown
                            isOpen={isDropdownOpen}
                            onClose={() => setIsDropdownOpen(false)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {hasUnread ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "No new notifications"}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
