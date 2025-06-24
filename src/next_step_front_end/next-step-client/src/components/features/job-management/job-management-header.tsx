"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, SlidersHorizontal, Download, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AppDispatch, RootState } from "@/store/store"
import { setJobFilter, filterJobs } from "@/store/slices/jobs-slice"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE } from "@/constants"
import { motion } from "framer-motion"

interface JobManagementHeaderProps {
    onFilterToggle: () => void
    showFilters: boolean
    userRole: "admin" | "employer"
}

export function JobManagementHeader({ onFilterToggle, showFilters, userRole }: JobManagementHeaderProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { filter, statuses } = useSelector((state: RootState) => state.jobs)
    const [localSearchQuery, setLocalSearchQuery] = useState(filter.keyword || "")
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        try {
            const updatedFilter = {
                ...filter,
                keyword: localSearchQuery,
            }

            dispatch(setJobFilter(updatedFilter))
            await dispatch(
                filterJobs({
                    page: DEFAULT_PAGE,
                    size: DEFAULT_JOB_SIZE,
                    filter: updatedFilter,
                }),
            )
        } finally {
            setTimeout(() => setIsSearching(false), 500)
        }
    }

    const handleRefresh = () => {
        dispatch(
            filterJobs({
                page: DEFAULT_PAGE,
                size: DEFAULT_JOB_SIZE,
                filter,
            }),
        )
    }

    const hasActiveFilters = Object.values(filter).some((value) => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === "object" && value !== null) return Object.keys(value).length > 0
        return value !== "" && value !== null && value !== undefined
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            {/* Main Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Enhanced search input */}
                <div className="flex-1 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

                    <div className="relative flex bg-background border border-border/50 rounded-xl shadow-sm group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
                        <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-border/30">
                            <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                        </div>

                        <Input
                            type="search"
                            placeholder="Search jobs by title, company, skills..."
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4 font-medium placeholder:text-muted-foreground/70"
                            value={localSearchQuery}
                            onChange={(e) => setLocalSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                        />

                        <Button
                            className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 font-semibold shadow-none border-0 rounded-none relative overflow-hidden group/search"
                            onClick={handleSearch}
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    <Search className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <>
                                    <Search className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/search:scale-110" />
                                    <span>Search</span>
                                </>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/search:translate-x-[200%] transition-transform duration-700" />
                        </Button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium relative group/filter"
                        onClick={onFilterToggle}
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/filter:opacity-100 rounded-xl transition-opacity duration-300" />
                        <SlidersHorizontal
                            className={`h-4 w-4 transition-all duration-300 ${showFilters ? "rotate-180" : ""} group-hover/filter:rotate-180`}
                        />
                        <span className="hidden sm:inline">Filters</span>
                        {hasActiveFilters && (
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium"
                        onClick={handleRefresh}
                        disabled={statuses.filtering === "loading"}
                    >
                        <RefreshCw
                            className={`h-4 w-4 transition-all duration-300 ${statuses.filtering === "loading" ? "animate-spin" : ""}`}
                        />
                        <span className="hidden sm:inline">Refresh</span>
                    </Button>

                    {userRole === "admin" && (
                        <Button
                            variant="outline"
                            size="lg"
                            className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 items-center"
                >
                    <span className="text-sm text-muted-foreground font-medium">Active filters:</span>
                    {filter.keyword && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Keyword: {filter.keyword}
                        </Badge>
                    )}
                    {filter.employmentType && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Type: {filter.employmentType}
                        </Badge>
                    )}
                    {filter.skills.length > 0 && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Skills: {filter.skills.length}
                        </Badge>
                    )}
                </motion.div>
            )}
        </motion.div>
    )
}
