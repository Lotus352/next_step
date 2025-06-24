"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch, RootState } from "@/store/store"
import { filterUsers, resetUserFilter, setUserFilter } from "@/store/slices/user-slice"
import { DEFAULT_USER_SIZE, DEFAULT_PAGE, DEFAULT_USER_FILTER } from "@/constants"
import { UserManagementHeader } from "@/components/features/user-management/user-management-header"
import { UserManagementTable } from "@/components/features/user-management/user-management-table"
import { UserManagementFilters } from "@/components/features/user-management/user-management-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Settings, BarChart3, Users, UserCheck, UserX, Shield, TrendingUp, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface UserManagementPageProps {
    userRole: "admin" | "employer"
}

export function UserManagementPage({ userRole }: UserManagementPageProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(DEFAULT_USER_SIZE)

    const { content: users, totalElements, totalPages, statuses, filter } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        dispatch(resetUserFilter())
        dispatch(
            filterUsers({
                page: DEFAULT_PAGE,
                size: pageSize,
                filter: DEFAULT_USER_FILTER,
            }),
        )
    }, [dispatch, pageSize])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        dispatch(
            filterUsers({
                page,
                size: pageSize,
                filter,
            }),
        )
    }

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize)
        setCurrentPage(0)
        dispatch(
            filterUsers({
                page: 0,
                size: newSize,
                filter,
            }),
        )
    }

    const handleFilterChange = (newFilter: typeof filter) => {
        dispatch(setUserFilter(newFilter))
        dispatch(
            filterUsers({
                page: 0,
                size: pageSize,
                filter: newFilter,
            }),
        )
        setCurrentPage(0)
    }

    // Calculate statistics
    const stats = {
        totalUsers: totalElements,
        activeUsers: users.filter((user) => user.status === "ACTIVE").length,
        inactiveUsers: users.filter((user) => user.status === "INACTIVE").length,
        adminUsers: users.filter((user) => user.roles.some((role) => role.roleName === "ADMIN")).length,
        employerUsers: users.filter((user) => user.roles.some((role) => role.roleName === "EMPLOYER")).length,
        candidateUsers: users.filter((user) => user.roles.some((role) => role.roleName === "CANDIDATE")).length,
        usersWithCompany: users.filter((user) => user.company !== null).length,
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
            {/* Background Elements */}
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

            <div className="container mx-auto px-4 py-8 relative">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                    {/* Page Header */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <Settings className="h-6 w-6 text-primary" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-foreground">User Management</h1>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                                        Admin Panel
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    Manage and monitor user accounts with advanced filtering and analytics
                                </p>
                            </div>

                            <Button
                                size="lg"
                                className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 font-semibold"
                            >
                                <Plus className="h-5 w-5" />
                                <span className="hidden sm:inline">Create New User</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Total Users */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Total Users</div>
                                        <div className="text-xl font-bold text-foreground">{stats.totalUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Users */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <UserCheck className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Active</div>
                                        <div className="text-xl font-bold text-foreground">{stats.activeUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inactive Users */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <UserX className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Inactive</div>
                                        <div className="text-xl font-bold text-foreground">{stats.inactiveUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Admin Users - Always show */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Shield className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Admins</div>
                                        <div className="text-xl font-bold text-foreground">{stats.adminUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employers */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Employers</div>
                                        <div className="text-xl font-bold text-foreground">{stats.employerUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Candidates */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Candidates</div>
                                        <div className="text-xl font-bold text-foreground">{stats.candidateUsers}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Users with Company */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Building2 className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">With Company</div>
                                        <div className="text-xl font-bold text-foreground">{stats.usersWithCompany}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Role Distribution - Always show */}
                    <motion.div variants={itemVariants}>
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 rounded-lg bg-primary/10">
                                        <BarChart3 className="h-4 w-4 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold">Role Distribution</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
                                        <div className="text-2xl font-bold text-purple-700">{stats.adminUsers}</div>
                                        <div className="text-sm text-purple-600 font-medium">Administrators</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50">
                                        <div className="text-2xl font-bold text-orange-700">{stats.employerUsers}</div>
                                        <div className="text-sm text-orange-600 font-medium">Employers</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-lg border border-teal-200/50">
                                        <div className="text-2xl font-bold text-teal-700">{stats.candidateUsers}</div>
                                        <div className="text-sm text-teal-600 font-medium">Candidates</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Header with Search and Filters */}
                    <motion.div variants={itemVariants}>
                        <UserManagementHeader userRole={userRole} onFilterToggle={() => setShowFilters(!showFilters)} showFilters={showFilters} />
                    </motion.div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Filters Bar - Horizontal */}
                        <motion.div
                            variants={itemVariants}
                            className={`${showFilters ? "block" : "hidden"} transition-all duration-300`}
                        >
                            <UserManagementFilters userRole={userRole} filter={filter} onFilterChange={handleFilterChange} />
                        </motion.div>

                        {/* Users Table */}
                        <motion.div variants={itemVariants} className="transition-all duration-300">
                            <UserManagementTable
                                users={users}
                                loading={statuses.filtering === "loading"}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                userRole="admin"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
