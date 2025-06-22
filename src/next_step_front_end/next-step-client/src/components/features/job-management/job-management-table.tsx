"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  MoreVertical,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Building2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import type JobType from "@/types/job-type"
import { formatDate, formatTextEnum, formatSalary } from "@/lib/utils"

interface JobManagementTableProps {
  jobs: JobType[]
  isLoading: boolean
  isAdmin: boolean
  selectedRows: Set<number>
  hiddenJobs: Set<number>
  filter: any
  searchQuery: string
  isChangingStatus: boolean
  onEditJob: (job: JobType) => void
  onDeleteJob: (jobId: number) => void
  onToggleFeatured: (job: JobType) => void
  onToggleStatus: (job: JobType) => void
  onToggleVisibility: (jobId: number) => void
  onRowSelect: (jobId: number, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onSort: (sortBy: string) => void
}

// Job status type definition
type JobStatus = "OPEN" | "CLOSED"

// Helper function to format job status
const formatJobStatus = (status: string): JobStatus => {
  const normalizedStatus = status?.toUpperCase()
  if (normalizedStatus === "CLOSED" || normalizedStatus === "INACTIVE" || normalizedStatus === "PAUSED") {
    return "CLOSED"
  }
  return "OPEN"
}

// Helper function to get status badge variant and icon
const getStatusDisplay = (status: JobStatus) => {
  switch (status) {
    case "OPEN":
      return {
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Open",
      }
    case "CLOSED":
      return {
        variant: "secondary" as const,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
        label: "Closed",
      }
    default:
      return {
        variant: "secondary" as const,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
        label: "Open",
      }
  }
}

export function JobManagementTable({
                                     jobs,
                                     isLoading,
                                     isAdmin,
                                     selectedRows,
                                     hiddenJobs,
                                     filter,
                                     searchQuery,
                                     isChangingStatus,
                                     onEditJob,
                                     onDeleteJob,
                                     onToggleFeatured,
                                     onToggleStatus,
                                     onToggleVisibility,
                                     onRowSelect,
                                     onSelectAll,
                                     onSort,
                                   }: JobManagementTableProps) {
  const visibleJobs = jobs.filter((job) => !hiddenJobs.has(job.jobId))

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (filter?.sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />
    }
    return filter.sortDirection === "ASC" ? (
        <ChevronUp className="h-4 w-4 text-primary" />
    ) : (
        <ChevronDown className="h-4 w-4 text-primary" />
    )
  }

  return (
      <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/30">
                <TableHead className="w-12">
                  <Checkbox
                      checked={selectedRows.size === visibleJobs.length && visibleJobs.length > 0}
                      onCheckedChange={onSelectAll}
                      className="border-border/50"
                  />
                </TableHead>
                <TableHead>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary"
                      onClick={() => onSort("title")}
                  >
                  <span className="flex items-center gap-2">
                    Job Title
                    {getSortIcon("title")}
                  </span>
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary"
                      onClick={() => onSort("postedBy")}
                  >
                  <span className="flex items-center gap-2">
                    Company
                    {getSortIcon("postedBy")}
                  </span>
                  </Button>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary"
                      onClick={() => onSort("employmentType")}
                  >
                  <span className="flex items-center gap-2">
                    Type
                    {getSortIcon("employmentType")}
                  </span>
                  </Button>
                </TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary"
                      onClick={() => onSort("status")}
                  >
                  <span className="flex items-center gap-2">
                    Status
                    {getSortIcon("status")}
                  </span>
                  </Button>
                </TableHead>
                {isAdmin && <TableHead className="text-center">Featured</TableHead>}
                <TableHead>
                  <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary"
                      onClick={() => onSort("createdAt")}
                  >
                  <span className="flex items-center gap-2">
                    Posted
                    {getSortIcon("createdAt")}
                  </span>
                  </Button>
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        {isAdmin && (
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                        )}
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                      </TableRow>
                  ))
              ) : visibleJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 10 : 9} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Briefcase className="h-8 w-8 text-muted-foreground" />
                        <div className="space-y-1">
                          <h3 className="font-semibold">No jobs found</h3>
                          <p className="text-sm text-muted-foreground">
                            {searchQuery ? "No jobs match your search criteria." : "You haven't posted any jobs yet."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
              ) : (
                  <AnimatePresence>
                    {visibleJobs.map((job, index) => {
                      const jobStatus = formatJobStatus(job.status)
                      const statusDisplay = getStatusDisplay(jobStatus)

                      return (
                          <motion.tr
                              key={job.jobId}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className={`group hover:bg-muted/30 transition-all duration-200 cursor-pointer border-border/30 ${
                                  selectedRows.has(job.jobId) ? "bg-primary/5" : ""
                              } ${hiddenJobs.has(job.jobId) ? "opacity-50" : ""}`}
                              onClick={() => onEditJob(job)}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                  checked={selectedRows.has(job.jobId)}
                                  onCheckedChange={(checked) => onRowSelect(job.jobId, checked as boolean)}
                                  className="border-border/50"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {job.title}
                            </span>
                                  {job.isFeatured && (
                                      <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Featured
                                      </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {job.skills.slice(0, 2).map((skill) => (
                                      <Badge
                                          key={skill.skillId}
                                          variant="outline"
                                          className="text-xs bg-primary/5 border-primary/20"
                                      >
                                        {skill.skillName}
                                      </Badge>
                                  ))}
                                  {job.skills.length > 2 && (
                                      <Badge variant="outline" className="text-xs border-dashed">
                                        +{job.skills.length - 2}
                                      </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{job.postedBy.company.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {job.location ? (
                                  <div className="text-sm">
                                    {job.location.city}, {job.location.countryName}
                                  </div>
                              ) : (
                                  <span className="text-muted-foreground">Remote</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {formatTextEnum(job.employmentType || "FULL_TIME")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {job.salary && (
                                  <div className="text-sm font-medium">
                                    {formatSalary(job.salary.minSalary, job.salary.maxSalary, job.salary.currency)}
                                  </div>
                              )}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <Badge
                                    variant={statusDisplay.variant}
                                    className={`text-xs flex items-center gap-1 ${
                                        jobStatus === "OPEN"
                                            ? "bg-green-100 text-green-700 border-green-300"
                                            : "bg-red-100 text-red-700 border-red-300"
                                    }`}
                                >
                                  <statusDisplay.icon className="h-3 w-3" />
                                  {statusDisplay.label}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-primary/10"
                                    onClick={() => onToggleStatus(job)}
                                    disabled={isChangingStatus}
                                    title={`Change to ${jobStatus === "OPEN" ? "Closed" : "Open"}`}
                                >
                                  {isChangingStatus ? (
                                      <motion.div
                                          animate={{ rotate: 360 }}
                                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                      >
                                        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                                      </motion.div>
                                  ) : jobStatus === "OPEN" ? (
                                      <XCircle className="h-3 w-3 text-red-600" />
                                  ) : (
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            {isAdmin && (
                                <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                  <Switch checked={Boolean(job.isFeatured)} onCheckedChange={() => onToggleFeatured(job)} />
                                </TableCell>
                            )}
                            <TableCell className="text-sm text-muted-foreground">{formatDate(job.createdAt)}</TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem onClick={() => onEditJob(job)} className="gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit Job
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                      onClick={() => onToggleStatus(job)}
                                      className="gap-2"
                                      disabled={isChangingStatus}
                                  >
                                    {isChangingStatus ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        >
                                          <ArrowUpDown className="h-4 w-4" />
                                        </motion.div>
                                    ) : jobStatus === "OPEN" ? (
                                        <>
                                          <XCircle className="h-4 w-4" />
                                          Close Job
                                        </>
                                    ) : (
                                        <>
                                          <CheckCircle className="h-4 w-4" />
                                          Open Job
                                        </>
                                    )}
                                  </DropdownMenuItem>

                                  {isAdmin && (
                                      <>
                                        <DropdownMenuItem onClick={() => onToggleFeatured(job)} className="gap-2">
                                          <Star className="h-4 w-4" />
                                          {job.isFeatured ? "Remove Featured" : "Make Featured"}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onToggleVisibility(job.jobId)} className="gap-2">
                                          {hiddenJobs.has(job.jobId) ? (
                                              <Eye className="h-4 w-4" />
                                          ) : (
                                              <EyeOff className="h-4 w-4" />
                                          )}
                                          {hiddenJobs.has(job.jobId) ? "Show Job" : "Hide Job"}
                                        </DropdownMenuItem>
                                      </>
                                  )}

                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                      onClick={() => onDeleteJob(job.jobId)}
                                      className="gap-2 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Job
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                      )
                    })}
                  </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
  )
}
