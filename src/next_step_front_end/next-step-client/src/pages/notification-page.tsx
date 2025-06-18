"use client"

import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {motion} from "framer-motion"
import type {AppDispatch, RootState} from "@/store/store"
import {fetchNotifications, fetchUnreadCount} from "@/store/slices/notifications-slice"
import NotificationHeader from "@/components/features/notification/notification-header"
import NotificationList from "@/components/features/notification/notification-list"
import NotificationPagination from "@/components/features/notification/notification-pagination"
import Loading from "@/components/loading"
import AlertDestructive from "@/components/destructive-alert"
import {DEFAULT_NOTIFICATION_SIZE} from "@/constants"
import Header from "@/components/layout/header.tsx";
import Footer from "@/components/layout/footer.tsx";

export default function NotificationPage() {
    const dispatch = useDispatch<AppDispatch>()
    const {content, page, totalPages, totalElements, statuses, error} = useSelector(
        (state: RootState) => state.notifications,
    )

    useEffect(() => {
        dispatch(fetchNotifications({page: 0, size: DEFAULT_NOTIFICATION_SIZE}))
        dispatch(fetchUnreadCount())
    }, [dispatch])

    const handlePageChange = (newPage: number) => {
        dispatch(fetchNotifications({page: newPage, size: DEFAULT_NOTIFICATION_SIZE}))
    }

    const renderContent = () => {
        if (statuses.fetching === "loading") {
            return <Loading/>
        }

        if (statuses.fetching === "failed") {
            return <AlertDestructive message={error || "Failed to load notifications"}/>
        }

        if (content.length === 0) {
            return (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    className="text-center py-20 animate-in fade-in-50 duration-500"
                >
                    <div
                        className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6 animate-in zoom-in-50 duration-700 delay-200">
                        <div className="h-8 w-8 text-muted-foreground animate-pulse">🔔</div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        No notifications yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 duration-500 delay-500">
                        When you receive notifications about job applications, favorites, or other activities,
                        they'll appear here.
                    </p>
                </motion.div>
            )
        }

        return (
            <>
                <NotificationList notifications={content}/>
                {totalPages > 1 && (
                    <NotificationPagination
                        currentPage={page}
                        totalPages={totalPages}
                        totalElements={totalElements}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
        )
    }

    return (
        <>
            <Header/>
            <section className="relative py-20 md:py-32 overflow-hidden min-h-screen">
                {/* Enhanced Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"/>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: 2,
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 py-8 max-w-4xl relative">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="space-y-8"
                    >
                        <NotificationHeader/>
                        {renderContent()}
                    </motion.div>
                </div>
            </section>
            <Footer/>
        </>
    )
}
