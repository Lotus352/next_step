"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"

interface PaginationProps {
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange?: (size: number) => void
    showPageSizeSelector?: boolean
    pageSizeOptions?: number[]
    className?: string
}

export function Pagination({
                               currentPage,
                               totalPages,
                               totalElements,
                               pageSize,
                               onPageChange,
                               onPageSizeChange,
                               showPageSizeSelector = true,
                               pageSizeOptions = [5, 10, 20, 50],
                               className = "",
                           }: PaginationProps) {
    // Calculate visible page numbers
    const getVisiblePages = () => {
        const delta = 2 // Number of pages to show on each side of current page
        const range = []
        const rangeWithDots = []

        // Always show first page
        range.push(1)

        // Calculate start and end of middle range
        const start = Math.max(2, currentPage + 1 - delta)
        const end = Math.min(totalPages - 1, currentPage + 1 + delta)

        // Add dots if there's a gap after first page
        if (start > 2) {
            rangeWithDots.push(1, "...")
        } else {
            rangeWithDots.push(1)
        }

        // Add middle range
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) {
                rangeWithDots.push(i)
            }
        }

        // Add dots if there's a gap before last page
        if (end < totalPages - 1) {
            rangeWithDots.push("...", totalPages)
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages)
        }

        return rangeWithDots
    }

    const visiblePages = getVisiblePages()
    const startItem = currentPage * pageSize + 1
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

    if (totalPages <= 1) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
        >
            {/* Page Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Showing {startItem} to {endItem} of {totalElements} results
        </span>

                {/* Page Size Selector */}
                {showPageSizeSelector && onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span>Show:</span>
                        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number.parseInt(value))}>
                            <SelectTrigger className="w-20 h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
                {/* First Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(0)}
                    disabled={currentPage === 0}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {visiblePages.map((page, index) => {
                        if (page === "...") {
                            return (
                                <div key={`dots-${index}`} className="flex items-center justify-center h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )
                        }

                        const pageNumber = page as number
                        const isActive = pageNumber - 1 === currentPage

                        return (
                            <Button
                                key={pageNumber}
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNumber - 1)}
                                className={`h-8 w-8 p-0 transition-all duration-300 ${
                                    isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-primary/10 hover:text-primary"
                                }`}
                            >
                                {pageNumber}
                            </Button>
                        )
                    })}
                </div>

                {/* Next Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last Page */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </motion.div>
    )
}
