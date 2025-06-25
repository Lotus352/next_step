"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import type { AppDispatch, RootState } from "@/store/store"
import { filterJobs, resetJobFilter, setJobFilter } from "@/store/slices/jobs-slice"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE, DEFAULT_JOB_FILTER } from "@/constants"
import { JobManagementHeader } from "@/components/features/job-management/job-management-header"
import { JobManagementTable } from "@/components/features/job-management/job-management-table"
import { JobManagementFilters } from "@/components/features/job-management/job-management-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Settings,
    BarChart3,
    Briefcase,
    Users,
    Star,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface JobManagementPageProps {
    userRole: "admin" | "employer"
}

export function JobManagementPage({ userRole }: JobManagementPageProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(DEFAULT_JOB_SIZE)

    const { content: jobs, totalElements, totalPages, statuses, filter } = useSelector((state: RootState) => state.jobs)

    useEffect(() => {
        dispatch(resetJobFilter())
        dispatch(
            filterJobs({
                page: DEFAULT_PAGE,
                size: pageSize,
                filter: DEFAULT_JOB_FILTER,
            }),
        )
    }, [dispatch, pageSize])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        dispatch(
            filterJobs({
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
            filterJobs({
                page: 0,
                size: newSize,
                filter,
            }),
        )
    }

    const handleFilterChange = (newFilter: typeof filter) => {
        dispatch(setJobFilter(newFilter))
        dispatch(
            filterJobs({
                page: 0,
                size: pageSize,
                filter: newFilter,
            }),
        )
        setCurrentPage(0)
    }

    // Calculate statistics
    const stats = {
        totalJobs: totalElements,
        openJobs: jobs.filter((job) => job.status === "OPEN").length,
        closedJobs: jobs.filter((job) => job.status === "CLOSE").length,
        featuredJobs: jobs.filter((job) => job.isFeatured).length,
        totalApplications: jobs.reduce((sum, job) => sum + job.appliedCount, 0),
        recentJobs: jobs.filter((job) => {
            const jobDate = new Date(job.createdAt)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return jobDate >= weekAgo
        }).length,
        employmentTypes: {
            fullTime: jobs.filter((job) => job.employmentType === "FULL_TIME").length,
            partTime: jobs.filter((job) => job.employmentType === "PART_TIME").length,
            contract: jobs.filter((job) => job.employmentType === "CONTRACT").length,
            internship: jobs.filter((job) => job.employmentType === "INTERNSHIP").length,
        },
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
                                    <h1 className="text-3xl font-bold text-foreground">Job Management</h1>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                                        {userRole === "admin" ? "Admin Panel" : "Employer Dashboard"}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-lg">
                                    Manage and monitor job postings with advanced filtering and analytics
                                </p>
                            </div>

                            <Button
                                size="lg"
                                className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 font-semibold"
                            >
                                <Plus className="h-5 w-5" />
                                <span className="hidden sm:inline">Create New Job</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Statistics Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Total Jobs */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Briefcase className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Total Jobs</div>
                                        <div className="text-xl font-bold text-foreground">{stats.totalJobs}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Open Jobs */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Open Jobs</div>
                                        <div className="text-xl font-bold text-foreground">{stats.openJobs}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Closed Jobs */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Closed Jobs</div>
                                        <div className="text-xl font-bold text-foreground">{stats.closedJobs}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured Jobs - Only show for admin */}
                        {userRole === "admin" && (
                            <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <Star className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground">Featured</div>
                                            <div className="text-xl font-bold text-foreground">{stats.featuredJobs}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Total Applications */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Applications</div>
                                        <div className="text-xl font-bold text-foreground">{stats.totalApplications}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Jobs (Last 7 days) */}
                        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-teal-100 rounded-lg">
                                        <Clock className="h-5 w-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">This Week</div>
                                        <div className="text-xl font-bold text-foreground">{stats.recentJobs}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Employment Type Breakdown - Only for admin */}
                    {userRole === "admin" && (
                        <motion.div variants={itemVariants}>
                            <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <BarChart3 className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold">Employment Type Distribution</h3>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200/50">
                                            <div className="text-2xl font-bold text-blue-700">{stats.employmentTypes.fullTime}</div>
                                            <div className="text-sm text-blue-600 font-medium">Full Time</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-200/50">
                                            <div className="text-2xl font-bold text-green-700">{stats.employmentTypes.partTime}</div>
                                            <div className="text-sm text-green-600 font-medium">Part Time</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-200/50">
                                            <div className="text-2xl font-bold text-orange-700">{stats.employmentTypes.contract}</div>
                                            <div className="text-sm text-orange-600 font-medium">Contract</div>
                                        </div>
                                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-200/50">
                                            <div className="text-2xl font-bold text-purple-700">{stats.employmentTypes.internship}</div>
                                            <div className="text-sm text-purple-600 font-medium">Internship</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Header with Search and Filters */}
                    <motion.div variants={itemVariants}>
                        <JobManagementHeader
                            onFilterToggle={() => setShowFilters(!showFilters)}
                            showFilters={showFilters}
                            userRole={userRole}
                        />
                    </motion.div>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Filters Bar - Horizontal */}
                        <motion.div
                            variants={itemVariants}
                            className={`${showFilters ? "block" : "hidden"} transition-all duration-300`}
                        >
                            <JobManagementFilters filter={filter} onFilterChange={handleFilterChange} userRole={userRole} />
                        </motion.div>

                        {/* Jobs Table */}
                        <motion.div variants={itemVariants} className="transition-all duration-300">
                            <JobManagementTable
                                jobs={jobs}
                                loading={statuses.filtering === "loading"}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                userRole={userRole}
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
