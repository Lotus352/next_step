"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Eye,
  Crown,
  Building2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AppDispatch, RootState } from "@/store/store"
import {
  filterJobs,
  setJobFilter,
  deleteJob,
  updateJob,
  changeJobStatus,
  fetchEmploymentTypes,
  clearJobError,
} from "@/store/slices/jobs-slice"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE } from "@/constants"
import type JobType from "@/types/job-type"
import { mapJobTypeToJobRequest } from "@/types/mappers/job-mapper.ts"
import { JobEditModal } from "@/components/features/job-management/job-edit-modal.tsx"
import type jobFilterType from "@/types/job-filter-type.ts"
import { JobManagementTable } from "@/components/features/job-management/job-management-table"
import { StatusNotification, type NotificationType } from "@/components/notification-state/status-notification"
import { Link } from "react-router-dom";

interface JobManagementPageProps {
  userRole: "employer" | "admin"
}

// Job status type definition
type JobStatus = "OPEN" | "CLOSED"

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function JobManagementPage({ userRole }: JobManagementPageProps) {
  const dispatch = useDispatch<AppDispatch>()
  const {
    content: jobs,
    totalElements,
    statuses,
    filter,
    employmentTypes,
    error,
  } = useSelector((state: RootState) => state.jobs)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [hiddenJobs, setHiddenJobs] = useState<Set<number>>(new Set())
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [notification, setNotification] = useState<{
    isVisible: boolean
    type: NotificationType
    title: string
    message: string
  }>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  })

  // Refs for cleanup and preventing multiple calls
  const abortControllerRef = useRef<AbortController | null>(null)
  const isInitializedRef = useRef(false)
  const lastFilterRef = useRef<string>("")

  const isAdmin = userRole === "admin"
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  // Initialize data only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true

      // Fetch employment types if not already loaded
      if (employmentTypes.length === 0) {
        dispatch(fetchEmploymentTypes())
      }

      // Initial job fetch
      const initialFilter: jobFilterType = {
        keyword: null,
        sortBy: "createdAt",
        sortDirection: "DESC",
        country: null,
        city: null,
        employmentType: null,
        experienceLevels: [],
        salaryRange: {
          minSalary: null,
          maxSalary: null,
        },
        payPeriod: null,
        currency: null,
        skills: [],
        datePosted: null,
      }

      dispatch(setJobFilter(initialFilter))
      fetchJobsWithFilter(initialFilter)
    }
  }, [dispatch, employmentTypes.length])

  // Handle debounced search
  useEffect(() => {
    if (isInitializedRef.current && debouncedSearchQuery !== lastFilterRef.current) {
      lastFilterRef.current = debouncedSearchQuery
      handleSearch()
    }
  }, [debouncedSearchQuery])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Clear errors when they occur
  useEffect(() => {
    if (error) {
      showNotification("error", "Operation Failed", error)
      dispatch(clearJobError())
    }
  }, [error, dispatch])

  const fetchJobsWithFilter = useCallback(
      async (filterData: jobFilterType) => {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        try {
          await dispatch(
              filterJobs({
                page: DEFAULT_PAGE,
                size: DEFAULT_JOB_SIZE,
                filter: filterData,
              }),
          ).unwrap()
        } catch (error: any) {
          if (error.name !== "AbortError") {
            console.error("Failed to fetch jobs:", error)
            showNotification("error", "Fetch Failed", "Failed to load jobs. Please try again.")
          }
        }
      },
      [dispatch],
  )

  // Handle search with debouncing
  const handleSearch = useCallback(() => {
    const updatedFilter: jobFilterType = {
      keyword: debouncedSearchQuery || null,
      sortBy: filter?.sortBy || "createdAt",
      sortDirection: filter?.sortDirection || "DESC",
      country: null,
      city: null,
      employmentType: null,
      experienceLevels: [],
      salaryRange: {
        minSalary: null,
        maxSalary: null,
      },
      payPeriod: null,
      currency: null,
      skills: [],
      datePosted: null,
    }

    dispatch(setJobFilter(updatedFilter))
    fetchJobsWithFilter(updatedFilter)
  }, [dispatch, debouncedSearchQuery, filter, fetchJobsWithFilter])

  // Handle sort
  const handleSort = useCallback(
      (sortBy: string) => {
        const currentFilter = filter || {}
        const newDirection = currentFilter.sortBy === sortBy && currentFilter.sortDirection === "ASC" ? "DESC" : "ASC"
        const updatedFilter: jobFilterType = {
          keyword: currentFilter.keyword || null,
          sortBy,
          sortDirection: newDirection,
          country: null,
          city: null,
          employmentType: null,
          experienceLevels: [],
          salaryRange: {
            minSalary: null,
            maxSalary: null,
          },
          payPeriod: null,
          currency: null,
          skills: [],
          datePosted: null,
        }

        dispatch(setJobFilter(updatedFilter))
        fetchJobsWithFilter(updatedFilter)
      },
      [dispatch, filter, fetchJobsWithFilter],
  )

  // Handle job edit
  const handleEditJob = useCallback((job: JobType) => {
    setSelectedJob(job)
    setIsEditModalOpen(true)
  }, [])

  // Handle modal close with proper cleanup
  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false)
    // Delay clearing selected job to prevent flash
    setTimeout(() => {
      setSelectedJob(null)
    }, 300)
  }, [])

  // Handle job delete with proper async handling
  const handleDeleteJob = useCallback(
      async (jobId: number) => {
        if (!window.confirm("Are you sure you want to delete this job?")) {
          return
        }

        try {
          showNotification("loading", "Deleting Job", "Removing job posting...")

          await dispatch(deleteJob({ id: jobId })).unwrap()

          showNotification("success", "Job Deleted", "Job posting has been successfully removed")

          // Clear selection if deleted job was selected
          setSelectedRows((prev) => {
            const newSet = new Set(prev)
            newSet.delete(jobId)
            return newSet
          })
        } catch (error: any) {
          console.error("Failed to delete job:", error)
          showNotification("error", "Delete Failed", error.message || "Failed to delete job. Please try again.")
        }
      },
      [dispatch],
  )

  // Handle toggle featured with proper error handling
  const handleToggleFeatured = useCallback(
      async (job: JobType) => {
        try {
          const action = job.isFeatured ? "removing from" : "adding to"
          showNotification("loading", "Updating Featured Status", `${action} featured jobs...`)

          const jobRequest = mapJobTypeToJobRequest({
            ...job,
            isFeatured: !job.isFeatured,
          })

          await dispatch(updateJob({ id: job.jobId, jobData: jobRequest })).unwrap()

          const status = job.isFeatured ? "removed from" : "added to"
          showNotification("success", "Featured Status Updated", `Job ${status} featured jobs successfully`)
        } catch (error: any) {
          console.error("Failed to toggle featured status:", error)
          showNotification(
              "error",
              "Update Failed",
              error.message || "Failed to update featured status. Please try again.",
          )
        }
      },
      [dispatch],
  )

  // Handle status toggle with proper async handling
  const handleToggleStatus = useCallback(
      async (job: JobType) => {
        const currentStatus = job.status
        const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN"

        try {
          showNotification("loading", "Updating Status", `Changing job status to ${newStatus.toLowerCase()}...`)

          await dispatch(changeJobStatus({ id: job.jobId, status: newStatus })).unwrap()

          showNotification("success", "Status Updated", `Job status changed to ${newStatus.toLowerCase()} successfully`)
        } catch (error: any) {
          console.error("Failed to change job status:", error)
          showNotification("error", "Update Failed", error.message || "Failed to change job status. Please try again.")
        }
      },
      [dispatch],
  )

  // Handle hide/show job
  const handleToggleVisibility = useCallback((jobId: number) => {
    setHiddenJobs((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }, [])

  // Handle row selection
  const handleRowSelect = useCallback((jobId: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(jobId)
      } else {
        newSet.delete(jobId)
      }
      return newSet
    })
  }, [])

  // Handle select all
  const handleSelectAll = useCallback(
      (checked: boolean) => {
        if (checked) {
          setSelectedRows(new Set(visibleJobs.map((job) => job.jobId)))
        } else {
          setSelectedRows(new Set())
        }
      },
      [jobs],
  )

  // Handle bulk status change with proper error handling
  const handleBulkStatusChange = useCallback(
      async (newStatus: JobStatus) => {
        const selectedJobIds = Array.from(selectedRows)

        if (selectedJobIds.length === 0) {
          showNotification("warning", "No Selection", "Please select jobs to update")
          return
        }

        try {
          showNotification(
              "loading",
              "Updating Jobs",
              `Changing ${selectedJobIds.length} jobs to ${newStatus.toLowerCase()}...`,
          )

          const promises = selectedJobIds.map((jobId) =>
              dispatch(changeJobStatus({ id: jobId, status: newStatus })).unwrap(),
          )

          await Promise.all(promises)

          setSelectedRows(new Set()) // Clear selection after bulk action
          showNotification(
              "success",
              "Bulk Update Complete",
              `Successfully updated ${selectedJobIds.length} jobs to ${newStatus.toLowerCase()}`,
          )
        } catch (error: any) {
          console.error("Failed to change job statuses:", error)
          showNotification(
              "error",
              "Bulk Update Failed",
              error.message || "Some jobs failed to update. Please try again.",
          )
        }
      },
      [dispatch, selectedRows],
  )

  const visibleJobs = jobs.filter((job) => !hiddenJobs.has(job.jobId))

  // Calculate status counts for stats
  const formatJobStatus = useCallback((status: string) => {
    const normalizedStatus = status?.toUpperCase()
    if (normalizedStatus === "CLOSED" || normalizedStatus === "INACTIVE" || normalizedStatus === "PAUSED") {
      return "CLOSED"
    }
    return "OPEN"
  }, [])

  const openJobs = visibleJobs.filter((job) => formatJobStatus(job.status) === "OPEN").length
  const closedJobs = visibleJobs.filter((job) => formatJobStatus(job.status) === "CLOSED").length

  const showNotification = useCallback((type: NotificationType, title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    })
  }, [])

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }, [])

  // Manual search trigger
  const handleManualSearch = useCallback(() => {
    lastFilterRef.current = searchQuery
    const updatedFilter: jobFilterType = {
      keyword: searchQuery || null,
      sortBy: filter?.sortBy || "createdAt",
      sortDirection: filter?.sortDirection || "DESC",
      country: null,
      city: null,
      employmentType: null,
      experienceLevels: [],
      salaryRange: {
        minSalary: null,
        maxSalary: null,
      },
      payPeriod: null,
      currency: null,
      skills: [],
      datePosted: null,
    }

    dispatch(setJobFilter(updatedFilter))
    fetchJobsWithFilter(updatedFilter)
  }, [dispatch, searchQuery, filter, fetchJobsWithFilter])

  // Add this function to refresh jobs after save
  const handleJobSaveSuccess = useCallback(() => {
    // Refresh jobs with current filter
    const currentFilter = filter || {
      keyword: searchQuery || null,
      sortBy: "createdAt",
      sortDirection: "DESC",
      country: null,
      city: null,
      employmentType: null,
      experienceLevels: [],
      salaryRange: {
        minSalary: null,
        maxSalary: null,
      },
      payPeriod: null,
      currency: null,
      skills: [],
      datePosted: null,
    }

    fetchJobsWithFilter(currentFilter)
  }, [filter, searchQuery, fetchJobsWithFilter])

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {isAdmin ? (
                        <Crown className="h-6 w-6 text-primary" />
                    ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {isAdmin ? "Job Administration" : "My Job Postings"}
                    </h1>
                    <p className="text-muted-foreground">
                      {isAdmin
                          ? "Manage all job postings and featured status"
                          : "Manage your job postings and applications"}
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/employer/post-job">
                <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Post New Job
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Enhanced Stats Section with Status Breakdown */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <Card className="border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Total Jobs</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{totalElements}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-green-100 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Open Jobs</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{openJobs}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-red-100 transition-colors duration-300">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Closed Jobs</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{closedJobs}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 transition-colors duration-300">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Visible</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{visibleJobs.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-100 transition-colors duration-300">
                        <Star className="h-4 w-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Featured</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">
                      {visibleJobs.filter((job) => job.isFeatured).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Section */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
          >
            <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1 relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                    <div className="relative flex bg-background border border-border/50 rounded-xl shadow-sm group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
                      <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-border/30">
                        <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <Input
                          type="search"
                          placeholder="Search jobs by title, company, skills..."
                          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4 font-medium"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
                      />
                      <Button
                          className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 font-semibold shadow-none border-0 rounded-none"
                          onClick={handleManualSearch}
                          disabled={statuses.filtering === "loading"}
                      >
                        {statuses.filtering === "loading" ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Search className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <>
                              <Search className="h-4 w-4 mr-2" />
                              Search
                            </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Selected rows actions */}
                {selectedRows.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border/30"
                    >
                      <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {selectedRows.size} job{selectedRows.size > 1 ? "s" : ""} selected
                    </span>
                        <div className="flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleBulkStatusChange("OPEN")}
                              disabled={statuses.changingStatus === "loading"}
                          >
                            {statuses.changingStatus === "loading" ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <CheckCircle className="h-4 w-4" />
                            )}
                            Mark as Open
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleBulkStatusChange("CLOSED")}
                              disabled={statuses.changingStatus === "loading"}
                          >
                            {statuses.changingStatus === "loading" ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                  <XCircle className="h-4 w-4" />
                                </motion.div>
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            Mark as Closed
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Bulk Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Delete Selected
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Jobs Table */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
          >
            <JobManagementTable
                jobs={jobs}
                isLoading={statuses.filtering === "loading"}
                isAdmin={isAdmin}
                selectedRows={selectedRows}
                hiddenJobs={hiddenJobs}
                filter={filter}
                searchQuery={searchQuery}
                isChangingStatus={statuses.changingStatus === "loading"}
                onEditJob={handleEditJob}
                onDeleteJob={handleDeleteJob}
                onToggleFeatured={handleToggleFeatured}
                onToggleStatus={handleToggleStatus}
                onToggleVisibility={handleToggleVisibility}
                onRowSelect={handleRowSelect}
                onSelectAll={handleSelectAll}
                onSort={handleSort}
            />
          </motion.div>

          {/* Edit Modal */}
          <JobEditModal
              job={selectedJob}
              isOpen={isEditModalOpen}
              onClose={handleCloseModal}
              isAdmin={isAdmin}
              onSaveSuccess={handleJobSaveSuccess}
          />

          {/* Status Notification */}
          <StatusNotification
              isVisible={notification.isVisible}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onClose={handleCloseNotification}
          />
        </div>
      </div>
  )
}
