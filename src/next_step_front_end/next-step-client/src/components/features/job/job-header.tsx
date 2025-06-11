"use client"

import { Search, ArrowUpDown, SlidersHorizontal, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setFilter, filterJobs } from "@/store/slices/jobs-slice"
import type JobType from "@/types/job-type"
import { motion } from "framer-motion"
import { useState } from "react"

interface JobHeaderProps {
  openFilter: () => void
}

export function JobHeader({ openFilter }: JobHeaderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const filter = useSelector((state: RootState) => state.jobs.filter)
  const [isSearching, setIsSearching] = useState(false)

  // Local state for search input - không tự động filter
  const [localSearchQuery, setLocalSearchQuery] = useState(filter.keyword || "")

  // Extract values from Redux state
  const sortField = filter.sortBy as keyof JobType | null
  const sortDirection = filter.sortDirection as "asc" | "desc"

  const handleSort = (field: keyof JobType) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    const updatedFilter = {
      ...filter,
      sortBy: field,
      sortDirection: newDirection,
    }
    dispatch(setFilter(updatedFilter))

    // Tự động filter khi sort
    dispatch(
      filterJobs({
        page: 0,
        size: 5,
        filter: updatedFilter,
      }),
    )
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      // Cập nhật filter với search query từ local state
      const updatedFilter = {
        ...filter,
        keyword: localSearchQuery,
      }

      // Dispatch cả setFilter và filterJobs
      dispatch(setFilter(updatedFilter))
      await dispatch(
        filterJobs({
          page: 0,
          size: 5,
          filter: updatedFilter,
        }),
      )
    } finally {
      setTimeout(() => setIsSearching(false), 500)
    }
  }

  const handleQuickSearch = (term: string) => {
    setLocalSearchQuery(term)
    const updatedFilter = {
      ...filter,
      keyword: term,
    }

    dispatch(setFilter(updatedFilter))
    dispatch(
      filterJobs({
        page: 0,
        size: 5,
        filter: updatedFilter,
      }),
    )
  }

  const sortOptions = [
    { field: "title", label: "Job Title"},
    { field: "employmentType", label: "Employment Type"},
    { field: "createdAt", label: "Date Posted"},
    { field: "salary", label: "Salary Range"},
  ]

  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? "↑" : "↓"
    }
    return ""
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
      className="space-y-6"
    >
      {/* Header with title and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Search & Filter Jobs</h2>
          </div>
        </div>

      </div>

      {/* Main search and controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
        {/* Enhanced search input */}
        <div className="flex-1 space-y-2">
          <div className="relative group">
            {/* Background glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

            {/* Main search container */}
            <div className="relative flex bg-background border border-border/50 rounded-xl shadow-sm group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
              {/* Search icon */}
              <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-border/30">
                <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>

              {/* Input field */}
              <Input
                type="search"
                placeholder="Search jobs, companies, skills,..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4 font-medium placeholder:text-muted-foreground/70"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch()
                  }
                }}
              />

              {/* Search button */}
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

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/search:translate-x-[200%] transition-transform duration-700" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced controls */}
        <div className="flex items-center gap-3">
          {/* Advanced filters button */}
          <Button
            variant="outline"
            size="lg"
            className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium relative group/filter"
            onClick={openFilter}
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/filter:opacity-100 rounded-xl transition-opacity duration-300" />
            <SlidersHorizontal className="h-4 w-4 transition-transform duration-300 group-hover/filter:rotate-180" />
            <span>Advanced Filters</span>
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
            )}
          </Button>

          {/* Enhanced sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="h-12 gap-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium relative group/sort"
              >
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/sort:opacity-100 rounded-xl transition-opacity duration-300" />
                <span>Sort By</span>
                <ArrowUpDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 shadow-lg">
              <DropdownMenuLabel className="flex items-center gap-2 font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Sort Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/30" />

              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => handleSort(option.field as keyof JobType)}
                  className="flex items-center justify-between gap-3 py-3 px-3 hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg mx-1 group/item"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sortField === option.field && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary text-xs px-2 py-2">
                      </Badge>
                    )}
                    <span className="text-sm font-mono text-muted-foreground group-hover/item:text-primary transition-colors">
                      {getSortIcon(option.field)}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search suggestions or quick filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-wrap gap-2"
      >
        <span className="text-sm text-muted-foreground font-medium">Quick searches:</span>
        {["Java", "Google", "Software Engineer", "Marketing", "Design"].map((term, index) => (
          <motion.button
            key={term}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            onClick={() => handleQuickSearch(term)}
            className="px-3 text-xs bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-full transition-all duration-300 hover:scale-105 border border-border/30 hover:border-primary/30 font-medium"
          >
            {term}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}
