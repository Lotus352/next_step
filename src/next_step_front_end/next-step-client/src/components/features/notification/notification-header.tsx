"use client"

import {useDispatch, useSelector} from "react-redux"
import {Bell, CheckCheck, Settings, TrendingUp, Star,} from "lucide-react"
import {Button} from "@/components/ui/button"
import {motion} from "framer-motion"
import type {AppDispatch, RootState} from "@/store/store"
import {markAllRead} from "@/store/slices/notifications-slice"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {ReadNotification, useReadNotification} from "@/components/notification-state/read-notification.tsx"

export default function NotificationHeader() {
    const dispatch = useDispatch<AppDispatch>()
    const {unreadCount, totalElements, statuses} = useSelector((state: RootState) => state.notifications)
    const {
        notification: readNotification,
        showMarkAllReadSuccess,
        showError,
        showLoading,
        hideNotification,
    } = useReadNotification()

    const handleMarkAllRead = async () => {
        if (unreadCount > 0) {
            showLoading("Marking All as Read", "Processing all notifications...")

            try {
                await dispatch(markAllRead())
                showMarkAllReadSuccess(unreadCount)
            } catch (error) {
                console.error(error)
                showError("Failed to Mark All as Read", "Could not mark all notifications as read. Please try again.")
            }
        }
    }

    const stats = [
        {icon: Bell, label: "Total", value: totalElements.toString()},
        {icon: TrendingUp, label: "Unread", value: unreadCount.toString()},
        {icon: Star, label: "Read", value: (totalElements - unreadCount).toString()},
    ]

    // Animation variants
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 30},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    return (
        <>
            <ReadNotification
                isVisible={readNotification.isVisible}
                type={readNotification.type}
                title={readNotification.title}
                message={readNotification.message}
                onClose={hideNotification}
            />

            <motion.div
                initial={{opacity: 0, y: 40}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.8}}
                className="text-center mb-8"
            >
                {/* Main Title */}
                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3, duration: 0.6}}
                >
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Notifications
          </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.4, duration: 0.6}}
                >
                    Stay updated with your latest activities and never miss important updates from your job
                    applications.
                </motion.p>

                {/* Stats */}
                <motion.div
                    className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            className="flex items-center gap-3 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
                            variants={itemVariants}
                            whileHover={{scale: 1.05, y: -2}}
                        >
                            <div className="p-2 rounded-full bg-primary/10">
                                <stat.icon className="h-4 w-4 text-primary"/>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-foreground">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Action Toolbar */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.6, duration: 0.6}}
                className="mb-8"
            >
                <div
                    className="relative overflow-hidden border border-border/30 bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg">
                    {/* Enhanced gradient bar */}
                    <div
                        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>

                    {/* Floating decorative elements */}
                    <div className="absolute top-4 right-4 opacity-30">
                        <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 opacity-20">
                        <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-pulse"></div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-muted/10 via-transparent to-transparent">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Left side - Title */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Bell className="h-5 w-5 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Notification Actions</h3>
                                    <p className="text-sm text-muted-foreground">Manage your notifications</p>
                                </div>
                            </div>

                            {/* Right side - Action buttons */}
                            <div className="flex items-center gap-3">
                                {/* Mark All Read Button */}
                                <div className="relative">
                                    {/* Decorative background glow */}
                                    <div
                                        className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-lg opacity-60 animate-pulse"/>

                                    <Button
                                        onClick={handleMarkAllRead}
                                        disabled={unreadCount === 0 || statuses.markingAllRead === "loading"}
                                        className="group relative px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-primary/20 hover:border-primary/40"
                                    >
                                        {/* Animated background gradient */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"
                                            animate={{
                                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Number.POSITIVE_INFINITY,
                                                ease: "linear",
                                            }}
                                            style={{
                                                backgroundSize: "200% 100%",
                                            }}
                                        />

                                        {/* Shimmer effect */}
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"/>

                                        {/* Button content */}
                                        <span className="relative z-10 flex items-center gap-2">
                      <CheckCheck
                          className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"/>
                      <span className="transition-all duration-300 group-hover:tracking-wide">
                        {statuses.markingAllRead === "loading" ? "Marking..." : "Mark All Read"}
                      </span>
                                            {unreadCount > 0 && (
                                                <span
                                                    className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                          {unreadCount}
                        </span>
                                            )}
                    </span>
                                    </Button>
                                </div>

                                {/* Divider */}
                                <div className="h-8 w-px bg-border/50"></div>

                                {/* Settings Button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 shadow-sm"
                                            >
                                                <Settings className="h-4 w-4"/>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Notification settings</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
