"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bell,
    Trash2,
    ExternalLink,
    Building2,
    Star,
    Sparkles,
    ArrowRight,
    ChevronDown,
    Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import type { AppDispatch } from "@/store/store"
import type NotificationType from "@/types/notification-type"
import { markRead, deleteNotification } from "@/store/slices/notifications-slice"
import { useNavigate } from "react-router-dom"
import { ReadNotification, useReadNotification } from "@/components/notification-state/read-notification.tsx"

interface NotificationItemProps {
    notification: NotificationType
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteAnimation, setDeleteAnimation] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const {
        notification: readNotification,
        showReadSuccess,
        showDeleteSuccess,
        showError,
        hideNotification,
    } = useReadNotification()

    const isUnread = notification.status === "UNREAD"

    const handleMarkRead = async () => {
        if (isUnread) {
            try {
                await dispatch(markRead(notification.notificationId))
                showReadSuccess()
            } catch (error) {
                console.error(error)
                showError("Failed to Mark as Read", "Could not mark notification as read. Please try again.")
            }
        }
    }

    const handleDelete = async () => {
        setDeleteAnimation(true)
        setTimeout(() => setDeleteAnimation(false), 1000)

        setIsDeleting(true)
        try {
            await dispatch(deleteNotification({ id: notification.notificationId }))
            showDeleteSuccess()
        } catch (error) {
            console.error(error)
            setIsDeleting(false)
            showError("Delete Failed", "Could not delete notification. Please try again.")
        }
    }

    const handleJobClick = () => {
        if (notification.job) {
            handleMarkRead()
            navigate(`/jobs/${notification.job.jobId}`)
        }
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="group"
            >
                <Card
                    className={`overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20 relative ${
                        isUnread ? "border-primary/30 bg-primary/5" : ""
                    } ${isExpanded ? "shadow-xl" : ""}`}
                >
                    {/* Enhanced top gradient bar */}
                    {isUnread && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60"></div>
                    )}

                    {/* Simple View */}
                    <CardHeader className="pb-3 pt-4">
                        <div className="flex items-center justify-between gap-4">
                            {/* Left side - Basic info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Notification icon */}
                                <div className="relative">
                                    {/* Unread indicator */}
                                    {isUnread && (
                                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                                            <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                        </div>
                                    )}
                                </div>

                                {/* User and message info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={notification.user.avatarUrl || ""}
                                                alt={notification.user.fullName || notification.user.username}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {(notification.user.fullName || notification.user.username).charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p
                                            className={`text-sm font-semibold truncate ${
                                                isUnread ? "text-foreground" : "text-muted-foreground"
                                            }`}
                                        >
                                            {notification.user.fullName || notification.user.username}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Bell className="h-3 w-3" />
                                            <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                        </div>
                                    </div>

                                    <p
                                        className={`text-sm leading-relaxed line-clamp-1 ${
                                            isUnread ? "text-foreground font-medium" : "text-muted-foreground"
                                        }`}
                                    >
                                        {notification.message || "You have a new notification"}
                                    </p>
                                </div>

                                {/* Status badge */}
                                <div className="flex items-center gap-2">
                                    {notification.readAt ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                                            Read
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Unread</Badge>
                                    )}
                                </div>
                            </div>

                            {/* Right side - Actions */}
                            <div className="flex items-center gap-2">
                                {/* Quick actions - always visible */}
                                {isUnread && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleMarkRead()
                                                    }}
                                                >
                                                    <Bell className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Mark as read</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                <div className="relative">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDelete()
                                                    }}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Delete notification</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    {/* Floating animation for delete */}
                                    {deleteAnimation && (
                                        <div className="absolute -top-1 -right-1 pointer-events-none">
                                            <Trash2 className="h-3 w-3 text-red-500 animate-bounce" />
                                        </div>
                                    )}
                                </div>

                                {/* Expand/Collapse button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                onClick={toggleExpanded}
                                            >
                                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                                    <ChevronDown className="h-4 w-4" />
                                                </motion.div>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isExpanded ? "Hide details" : "Show details"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Detailed View - Expandable */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <Separator className="mx-6" />

                                <CardContent className="pt-4 space-y-4">
                                    {/* Full message */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-foreground">Message Details</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {notification.message || "You have a new notification"}
                                        </p>
                                    </div>

                                    {/* Job information */}
                                    {notification.job && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-foreground">Related Job</h4>
                                            <div
                                                className="flex items-center gap-4 p-3 bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group/job"
                                                onClick={handleJobClick}
                                            >
                                                <Avatar className="h-10 w-10 rounded-lg border border-border/30">
                                                    <AvatarImage
                                                        src={notification.job.postedBy.company.logoUrl || ""}
                                                        alt={`${notification.job.postedBy.company.name} logo`}
                                                    />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-lg">
                                                        {notification.job.postedBy.company.name?.charAt(0) || "C"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-semibold text-foreground group-hover/job:text-primary transition-colors duration-300 line-clamp-1">
                                                        {notification.job.title}
                                                    </h5>
                                                    <div className="flex items-center text-muted-foreground transition-colors duration-300 group-hover/job:text-foreground">
                                                        <Building2 className="h-3.5 w-3.5 mr-1.5" />
                                                        <span className="text-sm">{notification.job.postedBy.company.name}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 opacity-0 group-hover/job:opacity-100 transition-opacity duration-300">
                                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                    <ArrowRight className="h-4 w-4 text-primary" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notification metadata */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-foreground">Details</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Send at:</span>
                                                <p className="font-medium">
                                                    {new Date(notification.createdAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                            {notification.readAt && (
                                                <div>
                                                    <span className="text-muted-foreground">Read at:</span>
                                                    <p className="font-medium text-green-600">
                                                        {new Date(notification.readAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons in expanded view */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                        <div className="flex items-center gap-2">
                                            {notification.readAt ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <Star className="h-3 w-3 mr-1 fill-current" />
                                                    Read {formatDistanceToNow(new Date(notification.readAt), { addSuffix: true })}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    Unread
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isUnread && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                                    onClick={handleMarkRead}
                                                >
                                                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                                                    Mark as Read
                                                </Button>
                                            )}

                                            {notification.job && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                                    onClick={handleJobClick}
                                                >
                                                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                                                    View Job
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </>
    )
}
