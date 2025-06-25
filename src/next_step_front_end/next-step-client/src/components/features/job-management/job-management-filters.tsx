"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Briefcase, Calendar, TrendingUp, X, RotateCcw, ArrowUpDown } from "lucide-react"
import type JobFilterType from "@/types/job-filter-type"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchCountries, fetchCities, clearCities } from "@/store/slices/locations-slice"
import { motion } from "framer-motion"

interface JobManagementFiltersProps {
  filter: JobFilterType
  onFilterChange: (filter: JobFilterType) => void
  userRole: "admin" | "employer"
}

export function JobManagementFilters({ filter, onFilterChange }: JobManagementFiltersProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [localFilter, setLocalFilter] = useState(filter)

  // Get location data from Redux store
  const cities = useSelector((state: RootState) => state.locations.cities || [])
  const countries = useSelector((state: RootState) => state.locations.countries || [])
  const locationStatuses = useSelector((state: RootState) => state.locations.statuses)

  // Load countries and cities on component mount
  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchCountries())
    }
  }, [dispatch, countries.length])

  useEffect(() => {
    if (localFilter.country && localFilter.country !== "all") {
      dispatch(fetchCities({ country: localFilter.country }))
    } else {
      dispatch(clearCities())
    }
  }, [dispatch, localFilter.country])

  const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]
  const sortOptions = [
    { value: "createdAt", label: "Date Created", icon: Calendar },
    { value: "title", label: "Job Title", icon: Briefcase },
    { value: "employmentType", label: "Employment Type", icon: Briefcase },
    { value: "appliedCount", label: "Applications Count", icon: TrendingUp },
  ]

  const handleFilterUpdate = (key: keyof JobFilterType, value: any) => {
    const updatedFilter = { ...localFilter, [key]: value }

    // Reset city when country changes
    if (key === "country") {
      updatedFilter.city = null
    }

    setLocalFilter(updatedFilter)
    onFilterChange(updatedFilter)
  }

  const handleSortToggle = () => {
    const newDirection = localFilter.sortDirection === "DESC" ? "ASC" : "DESC"
    handleFilterUpdate("sortDirection", newDirection)
  }

  const handleReset = () => {
    const resetFilter = {
      ...filter,
      employmentType: null,
      country: null,
      city: null,
      datePosted: null,
      sortBy: "createdAt",
      sortDirection: "DESC",
    }
    setLocalFilter(resetFilter)
    onFilterChange(resetFilter)
  }

  const hasActiveFilters =
      localFilter.employmentType || localFilter.country || localFilter.city || localFilter.datePosted

  const getCurrentSortOption = () => {
    return sortOptions.find((option) => option.value === (localFilter.sortBy || "createdAt"))
  }

  const getSortDirectionLabel = () => {
    const currentSort = getCurrentSortOption()
    const isDesc = localFilter.sortDirection === "DESC"

    if (currentSort?.value === "createdAt") {
      return isDesc ? "Newest First" : "Oldest First"
    } else if (currentSort?.value === "title") {
      return isDesc ? "Z to A" : "A to Z"
    } else if (currentSort?.value === "appliedCount") {
      return isDesc ? "Most Applied" : "Least Applied"
    } else if (currentSort?.value === "employmentType") {
      return isDesc ? "Z to A" : "A to Z"
    }
    return isDesc ? "Descending" : "Ascending"
  }

  return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Filter className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold">Filters & Sorting</CardTitle>
              </div>
              {hasActiveFilters && (
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Horizontal Filter Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Employment Type Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">Employment Type</label>
                </div>
                <Select
                    value={localFilter.employmentType || ""}
                    onValueChange={(value) => handleFilterUpdate("employmentType", value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {employmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type
                              .replace("_", " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">Country</label>
                </div>
                <Select
                    value={localFilter.country || ""}
                    onValueChange={(value) => handleFilterUpdate("country", value === "all" ? null : value)}
                    disabled={locationStatuses.fetchingCountries === "loading"}
                >
                  <SelectTrigger className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue
                        placeholder={locationStatuses.fetchingCountries === "loading" ? "Loading..." : "All Countries"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">City</label>
                </div>
                <Select
                    value={localFilter.city || ""}
                    onValueChange={(value) => handleFilterUpdate("city", value === "all" ? null : value)}
                    disabled={locationStatuses.fetchingCities === "loading" || !localFilter.country}
                >
                  <SelectTrigger className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue
                        placeholder={
                          locationStatuses.fetchingCities === "loading"
                              ? "Loading..."
                              : !localFilter.country
                                  ? "Select country first"
                                  : "All Cities"
                        }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Posted Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">Date Posted</label>
                </div>
                <Select
                    value={localFilter.datePosted || ""}
                    onValueChange={(value) => handleFilterUpdate("datePosted", value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="day">Last 24 hours</SelectItem>
                    <SelectItem value="week">Last week</SelectItem>
                    <SelectItem value="month">Last month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">Sort By</label>
                </div>
                <Select
                    value={localFilter.sortBy || "createdAt"}
                    onValueChange={(value) => handleFilterUpdate("sortBy", value)}
                >
                  <SelectTrigger className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => {
                      return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              {option.label}
                            </div>
                          </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Direction Toggle & Reset */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-foreground">Sort Direction</label>
                </div>
                <div className="flex gap-2">
                  <Button
                      variant="outline"
                      onClick={handleSortToggle}
                      className="flex-1 gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg text-xs"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="truncate">{getSortDirectionLabel()}</span>
                  </Button>
                  <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={!hasActiveFilters}
                      className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg px-3"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-6 pt-4 border-t border-border/30">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Active filters:</span>
                    {localFilter.employmentType && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Type: {localFilter.employmentType}
                          <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                              onClick={() => handleFilterUpdate("employmentType", null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                    )}
                    {localFilter.country && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Country: {localFilter.country}
                          <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                              onClick={() => handleFilterUpdate("country", null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                    )}
                    {localFilter.city && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          City: {localFilter.city}
                          <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                              onClick={() => handleFilterUpdate("city", null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                    )}
                    {localFilter.datePosted && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          Date: {localFilter.datePosted}
                          <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                              onClick={() => handleFilterUpdate("datePosted", null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                    )}
                  </div>
                </div>
            )}

            {/* Current Sort Display */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>
                Sorting by <strong className="text-foreground">{getCurrentSortOption()?.label}</strong> -{" "}
                  {getSortDirectionLabel()}
              </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
  )
}
