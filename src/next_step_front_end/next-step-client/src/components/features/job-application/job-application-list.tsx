"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Briefcase,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {fetchApplicationById, filterApplicationsByJob, fetchApplicationInfoByJob, setFilter } from "@/store/slices/job-applications-slice"
import type { RootState, AppDispatch } from "@/store/store"
import { motion } from "framer-motion"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE } from "@/constants"
interface ScoreData {
  score: number;
  details: {
    skill_score: string;
    cert_score: string;
    exp_score: string;
  };
}

export default function ApplicationList() {
  const dispatch: AppDispatch = useDispatch()

  const applications = useSelector((state: RootState) => state.jobApplications.content)
  const status = useSelector((state: RootState) => state.jobApplications.status)
  const information = useSelector((state: RootState) => state.jobApplications.info)
  const page = useSelector((state: RootState) => state.jobApplications.page) || DEFAULT_PAGE
  const jobId = useSelector((state: RootState) => state.jobs.selected?.jobId)
  const filter = useSelector((state: RootState) => state.jobApplications.filter)

  useEffect(() => {
    if (jobId) {
      dispatch(filterApplicationsByJob({ jobId, page: page, size: DEFAULT_JOB_SIZE, filter }))
      dispatch(fetchApplicationInfoByJob(jobId))
    }
  }, [dispatch, jobId, filter, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setFilter({ ...filter, keyword: filter.keyword || null, status: filter.status || null }))
  }

  const handleStatusFilter = (statusValue: string | null) => {
    dispatch(setFilter({ ...filter, status: statusValue }))
  }

  const parseScoreData = (score: string | ScoreData | null): ScoreData | null => {
    if (!score) return null
    if (typeof score === "string") {
      try {
        return JSON.parse(score) as ScoreData
      } catch {
        return null
      }
    }
    return score
  }

  const parseRatioToPercentage = (ratio: string): number => {
    const parts = ratio.split("/")
    if (parts.length !== 2) return 0
    const numerator = Number.parseInt(parts[0], 10)
    const denominator = Number.parseInt(parts[1], 10)
    if (denominator === 0) return 0
    return Math.round((numerator / denominator) * 100)
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    if (score >= 0.4) return "text-orange-600"
    return "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "PENDING":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "REJECTED":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 text-blue-500" />
      case "REJECTED":
        return <XCircle className="h-3.5 w-3.5 text-red-500" />
      default:
        return <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (status === "loading" && applications.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          Applications
          {information && (
            <Badge variant="outline" className="ml-2 bg-primary/5 border-primary/20">
              {information.countJobApplications} total
            </Badge>
          )}
        </h3>
      </div>

      <div className="flex items-center space-x-2">
        <form onSubmit={handleSearch} className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search applicants..."
              className="pl-8"
              value={filter.keyword || ""}
              onChange={(e) => dispatch(setFilter({ ...filter, keyword: e.target.value }))}
            />
          </div>
          <Button type="submit" size="sm">
            Search
          </Button>
        </form>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Filter className="h-4 w-4" />
              {filter.status && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleStatusFilter(null)} className={!filter.status ? "bg-accent" : ""}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("PENDING")}
                className={filter.status === "PENDING" ? "bg-accent" : ""}
              >
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("ACCEPTED")}
                className={filter.status === "ACCEPTED" ? "bg-accent" : ""}
              >
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Accepted
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("REJECTED")}
                className={filter.status === "REJECTED" ? "bg-accent" : ""}
              >
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Rejected
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gradient-to-b from-muted/20 to-transparent rounded-lg flex flex-col items-center justify-center"
        >
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No applications found</h3>
          <p className="text-muted-foreground mb-4">There are no applications matching your current filters</p>
          {filter.status && (
            <Button variant="outline" onClick={() => handleStatusFilter(null)}>
              Clear filter
            </Button>
          )}
        </motion.div>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="w-[250px]">Applicant</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Resume</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {applications.map((application, index) => {
                const scoreData = parseScoreData(application.score)
                const overallScore = scoreData?.score || 0
                const scorePercentage = Math.round(overallScore * 100)

                const skillScorePercentage = scoreData?.details.skill_score
                  ? parseRatioToPercentage(scoreData.details.skill_score)
                  : 0
                const certScorePercentage = scoreData?.details.cert_score
                  ? parseRatioToPercentage(scoreData.details.cert_score)
                  : 0
                const expScorePercentage = scoreData?.details.exp_score
                  ? parseRatioToPercentage(scoreData.details.exp_score)
                  : 0

                return (
                  <motion.tr
                    key={application.applicationId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={"cursor-pointer transition-colors hover:bg-primary/5"}
                    onClick={() => {
                      dispatch(fetchApplicationById(application.applicationId))
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {application.applicant.avatarUrl ? (
                            <AvatarImage
                              src={application.applicant.avatarUrl || "/placeholder.svg"}
                              alt={application.applicant.fullName || ""}
                            />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(application.applicant.fullName || "")}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{application.applicant.fullName}</div>
                          <div className="text-xs text-muted-foreground">{application.applicant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getScoreTextColor(overallScore)}`}>
                            {scorePercentage}%
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              style={{ width: `${scorePercentage}%` }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full ${
                                overallScore >= 0.8
                                  ? "bg-gradient-to-r from-green-400 to-green-600"
                                  : overallScore >= 0.6
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : overallScore >= 0.4
                                      ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                      : "bg-gradient-to-r from-red-400 to-red-600"
                              }`}
                            ></div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Award className="h-3 w-3 text-blue-500" />
                                  <span>{skillScorePercentage}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3 text-purple-500" />
                                  <span>{certScorePercentage}%</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="h-3 w-3 text-amber-500" />
                                  <span>{expScorePercentage}%</span>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs space-y-1">
                                <div>Skills: {scoreData?.details.skill_score || "0/0"}</div>
                                <div>Certifications: {scoreData?.details.cert_score || "0/0"}</div>
                                <div>Experience: {scoreData?.details.exp_score || "0/0"}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status.toLowerCase()}</span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-sm">{new Date(application.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 hover:underline flex items-center transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </a>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </Table>
        </Card>
      )}
    </div>
  )
}
