"use client"

import {motion} from "framer-motion"
import {ChevronLeft, ChevronRight, MoreHorizontal} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"

interface NotificationPaginationProps {
    currentPage: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
}

export default function NotificationPagination({
                                                   currentPage,
                                                   totalPages,
                                                   totalElements,
                                                   onPageChange,
                                               }: NotificationPaginationProps) {
    const getVisiblePages = () => {
        const delta = 2
        const range = []
        const rangeWithDots = []

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i)
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...")
        } else {
            rangeWithDots.push(1)
        }

        rangeWithDots.push(...range)

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    const visiblePages = getVisiblePages()

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="relative"
        >
            {/* Enhanced pagination card */}
            <div
                className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 border rounded-2xl shadow-lg relative group">
                {/* Enhanced top gradient bar */}
                <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                {/* Floating elements for visual appeal */}
                <div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
                </div>

                <div className="p-8 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Enhanced info section */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Badge
                                variant="outline"
                                className="bg-primary/5 border-primary/20 text-primary font-semibold px-4 py-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                            >
                                Page {currentPage + 1} of {totalPages}
                            </Badge>
                            <div
                                className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"/>
                                <span className="text-sm font-medium">{totalElements} total notifications</span>
                            </div>
                        </div>

                        {/* Enhanced pagination controls */}
                        <div className="flex items-center gap-3">
                            {/* Previous Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 border-border/50 shadow-sm hover:shadow-md"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeft className="h-5 w-5"/>
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2">
                                {visiblePages.map((page, index) => {
                                    if (page === "...") {
                                        return (
                                            <div key={`dots-${index}`}
                                                 className="flex items-center justify-center h-12 w-12">
                                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                                            </div>
                                        )
                                    }

                                    const pageNumber = typeof page === "number" ? page - 1 : 0
                                    const isActive = pageNumber === currentPage

                                    return (
                                        <Button
                                            key={page}
                                            variant={isActive ? "default" : "outline"}
                                            size="icon"
                                            className={`h-12 w-12 rounded-full transition-all duration-300 hover:scale-110 font-semibold ${
                                                isActive
                                                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl"
                                                    : "hover:bg-primary/10 hover:text-primary border-border/50 shadow-sm hover:shadow-md"
                                            }`}
                                            onClick={() => onPageChange(pageNumber)}
                                        >
                                            {page}
                                            {isActive && (
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] animate-pulse"/>
                                            )}
                                        </Button>
                                    )
                                })}
                            </div>

                            {/* Next Button */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 border-border/50 shadow-sm hover:shadow-md group/next"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronRight
                                    className="h-5 w-5 transition-transform duration-300 group-hover/next:translate-x-0.5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
