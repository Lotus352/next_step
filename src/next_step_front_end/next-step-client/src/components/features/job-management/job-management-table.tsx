"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination } from "@/components/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, Users, CheckCircle, XCircle, TableIcon } from "lucide-react"
import type JobType from "@/types/job-type"
import type { AppDispatch } from "@/store/store"
import { deleteJob, changeJobStatus } from "@/store/slices/jobs-slice"
import { formatDate, formatTextEnum } from "@/lib/utils"
import Loading from "@/components/loading"


// Import the new dialog components at the top
import { JobViewDialog } from "./job-view-dialog"
import { JobEditDialog } from "./job-edit-dialog"

interface JobManagementTableProps {
  jobs: JobType[]
  loading: boolean
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  userRole: "admin" | "employer"
}

export function JobManagementTable({
                                     jobs,
                                     loading,
                                     currentPage,
                                     totalPages,
                                     totalElements,
                                     pageSize,
                                     onPageChange,
                                     onPageSizeChange,
                                     userRole,
                                   }: JobManagementTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)

  // Add state for dialogs after the existing state declarations
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null)

  const handleDelete = async () => {
    if (selectedJobId) {
      await dispatch(deleteJob({ id: selectedJobId }))
      setDeleteDialogOpen(false)
      setSelectedJobId(null)
    }
  }

  const handleStatusChange = async (jobId: number, newStatus: string) => {
    await dispatch(changeJobStatus({ id: jobId, status: newStatus }))
  }

  // Add handlers for opening dialogs
  const handleViewJob = (job: JobType) => {
    setSelectedJob(job)
    setViewDialogOpen(true)
  }

  const handleEditJob = (job: JobType) => {
    setSelectedJob(job)
    setEditDialogOpen(true)
  }

  // Update the getStatusBadge function to handle OPEN/CLOSE status
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: {
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-700 border-green-300",
      },
      CLOSE: {
        variant: "secondary" as const,
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-300",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.OPEN
    const Icon = config.icon

    return (
        <Badge variant={config.variant} className={`${config.className} flex items-center gap-1 font-medium`}>
          <Icon className="h-3 w-3" />
          {status}
        </Badge>
    )
  }

  // Function to get applications count badge
  const getApplicationsBadge = (count: number) => {
    let badgeClass = "bg-gray-100 text-gray-700 border-gray-300"

    if (count >= 50) {
      badgeClass = "bg-red-100 text-red-700 border-red-300"
    } else if (count >= 20) {
      badgeClass = "bg-orange-100 text-orange-700 border-orange-300"
    } else if (count >= 10) {
      badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-300"
    } else if (count >= 5) {
      badgeClass = "bg-blue-100 text-blue-700 border-blue-300"
    } else if (count > 0) {
      badgeClass = "bg-green-100 text-green-700 border-green-300"
    }

    return (
        <Badge variant="outline" className={`${badgeClass} flex items-center gap-1 font-medium`}>
          <Users className="h-3 w-3" />
          {count} {count === 1 ? "application" : "applications"}
        </Badge>
    )
  }

  if (loading) {
    return <Loading />
  }

  if (jobs.length === 0) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12">
              <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground text-sm">There are currently no job listings matching your criteria.</p>
            </CardContent>
          </Card>
        </motion.div>
    )
  }

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
      >
        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <TableIcon className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold">Job Listings</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {totalElements} jobs
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground">Job Details</TableHead>
                    <TableHead className="font-semibold text-foreground">Company</TableHead>
                    <TableHead className="font-semibold text-foreground">Employment Type</TableHead>
                    <TableHead className="font-semibold text-foreground">Applications</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Posted</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {jobs.map((job, index) => (
                        <motion.tr
                            key={job.jobId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-border/30 hover:bg-muted/20 transition-all duration-300 group"
                        >
                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                {job.title}
                              </div>
                              <div className="text-sm text-muted-foreground line-clamp-2">{job.shortDescription}</div>
                              {job.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {job.skills.slice(0, 2).map((skill) => (
                                        <Badge
                                            key={skill.skillId}
                                            variant="outline"
                                            className="text-xs bg-primary/5 border-primary/20 text-primary"
                                        >
                                          {skill.skillName}
                                        </Badge>
                                    ))}
                                    {job.skills.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{job.skills.length - 2}
                                        </Badge>
                                    )}
                                  </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={job.postedBy.company.logoUrl || ""} alt={job.postedBy.company.name} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs rounded-lg">
                                  {job.postedBy.company.name?.charAt(0) || "C"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm text-foreground">{job.postedBy.company.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {job.postedBy.username || job.postedBy.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium">
                              {formatTextEnum(job.employmentType || "FULL_TIME")}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-4">{getApplicationsBadge(job.appliedCount)}</TableCell>

                          <TableCell className="py-4">{getStatusBadge(job.status)}</TableCell>

                          <TableCell className="py-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDate(job.createdAt)}
                            </div>
                          </TableCell>

                          <TableCell className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleViewJob(job)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleEditJob(job)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit Job
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {job.status === "OPEN" ? (
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => handleStatusChange(job.jobId, "CLOSE")}
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Close Job
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700"
                                        onClick={() => handleStatusChange(job.jobId, "OPEN")}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Open Job
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                                    onClick={() => {
                                      setSelectedJobId(job.jobId)
                                      setDeleteDialogOpen(true)
                                    }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete Job
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pagination */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            showPageSizeSelector={true}
            pageSizeOptions={[5, 10, 20, 50]}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the job posting and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Delete Job
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add the dialog components before the closing motion.div tag */}
        <JobViewDialog
            job={selectedJob}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            onEdit={() => {
              setViewDialogOpen(false)
              setEditDialogOpen(true)
            }}
            userRole={userRole}
        />

        <JobEditDialog job={selectedJob} open={editDialogOpen} onOpenChange={setEditDialogOpen} userRole={userRole} />
      </motion.div>
  )
}
