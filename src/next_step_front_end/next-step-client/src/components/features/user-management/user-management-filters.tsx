"use client"

import {useState} from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Filter, Users, Shield, TrendingUp, X, RotateCcw, ArrowUpDown} from "lucide-react"
import type UserFilterType from "@/types/user-filter-type"
import {motion} from "framer-motion"

interface UserManagementFiltersProps {
    filter: UserFilterType
    onFilterChange: (filter: UserFilterType) => void
    userRole: "admin" | "employer"
}

export function UserManagementFilters({filter, onFilterChange, userRole}: UserManagementFiltersProps) {
    const [localFilter, setLocalFilter] = useState(filter)

    const roles = ["ADMIN", "EMPLOYER", "CANDIDATE"]
    const sortOptions = [
        {value: "username", label: "Username", icon: Users},
        {value: "email", label: "Email", icon: Users},
        {value: "fullName", label: "Full Name", icon: Users},
        {value: "status", label: "Status", icon: Shield},
    ]

    const handleFilterUpdate = (key: keyof UserFilterType, value: any) => {
        const updatedFilter = {...localFilter, [key]: value}
        setLocalFilter(updatedFilter)
        onFilterChange(updatedFilter)
    }

    const handleSortToggle = () => {
        const newDirection = localFilter.sortDirection === "DESC" ? "ASC" : "DESC"
        handleFilterUpdate("sortDirection", newDirection)
    }

    const handleReset = () => {
        const resetFilter = {
            keyword: "",
            role: undefined,
            isDeleted: undefined,
            sortBy: "username",
            sortDirection: "ASC" as const,
        }
        setLocalFilter(resetFilter)
        onFilterChange(resetFilter)
    }

    const hasActiveFilters = localFilter.role || localFilter.isDeleted !== undefined

    const getCurrentSortOption = () => {
        return sortOptions.find((option) => option.value === (localFilter.sortBy || "username"))
    }

    const getSortDirectionLabel = () => {
        const currentSort = getCurrentSortOption()
        const isDesc = localFilter.sortDirection === "DESC"

        if (currentSort?.value === "username" || currentSort?.value === "email" || currentSort?.value === "fullName") {
            return isDesc ? "Z to A" : "A to Z"
        } else if (currentSort?.value === "status") {
            return isDesc ? "Inactive First" : "Active First"
        }
        return isDesc ? "Descending" : "Ascending"
    }

    return (
        <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
            <Card
                className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Filter className="h-4 w-4 text-primary"/>
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
                                <RotateCcw className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Horizontal Filter Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {/* Role Filter */}
                        {userRole === 'admin' && <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-primary"/>
                                <label className="text-sm font-semibold text-foreground">Role</label>
                            </div>
                            <Select
                                value={localFilter.role || ""}
                                onValueChange={(value) => handleFilterUpdate("role", value === "all" ? undefined : value)}
                            >
                                <SelectTrigger
                                    className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                                    <SelectValue placeholder="All Roles"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0) + role.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        }

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-foreground">Status</label>
                            </div>
                            <Select
                                value={localFilter.isDeleted === undefined ? "" : localFilter.isDeleted ? "deleted" : "active"}
                                onValueChange={(value) =>
                                    handleFilterUpdate("isDeleted", value === "all" ? undefined : value === "deleted")
                                }
                            >
                                <SelectTrigger
                                    className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                                    <SelectValue placeholder="All Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By Filter */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-foreground">Sort By</label>
                            </div>
                            <Select
                                value={localFilter.sortBy || "username"}
                                onValueChange={(value) => handleFilterUpdate("sortBy", value)}
                            >
                                <SelectTrigger
                                    className="w-full rounded-lg border-border/50 hover:border-primary/50 transition-colors duration-300">
                                    <SelectValue/>
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
                                    <ArrowUpDown className="h-4 w-4"/>
                                    <span className="truncate">{getSortDirectionLabel()}</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleReset}
                                    disabled={!hasActiveFilters}
                                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-lg px-3"
                                >
                                    <RotateCcw className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="mt-6 pt-4 border-t border-border/30">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">Active filters:</span>
                                {localFilter.role && (
                                    <Badge variant="secondary"
                                           className="bg-primary/10 text-primary border-primary/20 text-xs">
                                        Role: {localFilter.role}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                                            onClick={() => handleFilterUpdate("role", undefined)}
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                    </Badge>
                                )}
                                {localFilter.isDeleted !== undefined && (
                                    <Badge variant="secondary"
                                           className="bg-primary/10 text-primary border-primary/20 text-xs">
                                        Status: {localFilter.isDeleted ? "Deleted" : "Active"}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                                            onClick={() => handleFilterUpdate("isDeleted", undefined)}
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Current Sort Display */}
                    <div className="mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <TrendingUp className="h-4 w-4"/>
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
