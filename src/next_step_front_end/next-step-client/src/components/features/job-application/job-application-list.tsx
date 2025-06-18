"use client";

import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  AlertCircle,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchApplicationById,
  filterApplicationsByJob,
  fetchApplicationInfoByJob,
  setFilter,
} from "@/store/slices/job-applications-slice";
import type { RootState, AppDispatch } from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_JOB_APPLICATION_SIZE, DEFAULT_PAGE } from "@/constants";
import type { ScoreData } from "@/types/job-application-type";

export default function ApplicationList() {
  const dispatch: AppDispatch = useDispatch();

  const applications = useSelector(
    (state: RootState) => state.jobApplications.content,
  );
  const statuses = useSelector(
    (state: RootState) => state.jobApplications.statuses,
  );
  const information = useSelector(
    (state: RootState) => state.jobApplications.info,
  );
  const page =
    useSelector((state: RootState) => state.jobApplications.page) ||
    DEFAULT_PAGE;
  const jobId = useSelector((state: RootState) => state.jobs.selected?.jobId);
  const filter = useSelector(
    (state: RootState) => state.jobApplications.filter,
  );

  useEffect(() => {
    if (jobId) {
      dispatch(
        filterApplicationsByJob({
          jobId,
          page: page,
          size: DEFAULT_JOB_APPLICATION_SIZE,
          filter,
        }),
      );
      dispatch(fetchApplicationInfoByJob(jobId));
    }
  }, [dispatch, jobId, filter, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setFilter({
        ...filter,
        keyword: filter.keyword || null,
        status: filter.status || null,
      }),
    );
  };

  const handleStatusFilter = (statusValue: string | null) => {
    dispatch(setFilter({ ...filter, status: statusValue }));
  };

  const parseScoreData = (
    score: string | ScoreData | null,
  ): ScoreData | null => {
    if (!score) return null;
    if (typeof score === "string") {
      try {
        return JSON.parse(score) as ScoreData;
      } catch {
        return null;
      }
    }
    return score;
  };


  const getScoreTextColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-yellow-600";
    if (score >= 0.4) return "text-orange-600";
    return "text-red-600";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/10 text-green-600 border-green-200 m-2 p-3";
      case "PENDING":
        return "bg-blue-500/10 text-blue-600 border-blue-200 m-2 p-3";
      case "REJECTED":
        return "bg-red-500/10 text-red-600 border-red-200 m-2 p-3";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200 m-2 p-3";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 text-blue-500" />;
      case "REJECTED":
        return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (statuses.filtering === "loading" && applications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-64 w-full" />
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                Applications
              </h3>
              <p className="text-sm text-muted-foreground">
                Review and manage candidate applications
              </p>
            </div>
          </div>
          {information && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-primary/5 border-primary/20 px-3 py-2"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {information.countJobApplications} total
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Search and Filter */}
        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <form
                onSubmit={handleSearch}
                className="flex items-center space-x-2 flex-1"
              >
                <div className="relative flex-1 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                  <div className="relative flex bg-background border border-border/50 rounded-lg shadow-sm group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <div className="flex items-center justify-center px-3 bg-muted/30 border-r border-border/30">
                      <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search applicants by name, email..."
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-3 font-medium placeholder:text-muted-foreground/70"
                      value={filter.keyword || ""}
                      onChange={(e) =>
                        dispatch(
                          setFilter({ ...filter, keyword: e.target.value }),
                        )
                      }
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-10 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 font-semibold shadow-sm"
                >
                  Search
                </Button>
              </form>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative h-10 w-10 rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50"
                  >
                    <Filter className="h-4 w-4" />
                    {filter.status && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border-border/50 shadow-lg"
                >
                  <DropdownMenuLabel className="flex items-center gap-2 font-semibold">
                    <Filter className="h-4 w-4 text-primary" />
                    Filter by Status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/30" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleStatusFilter(null)}
                      className={`hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg mx-1 ${!filter.status ? "bg-primary/10 text-primary" : ""}`}
                    >
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusFilter("PENDING")}
                      className={`hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg mx-1 ${filter.status === "PENDING" ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusFilter("ACCEPTED")}
                      className={`hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg mx-1 ${filter.status === "ACCEPTED" ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusFilter("REJECTED")}
                      className={`hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-lg mx-1 ${filter.status === "REJECTED" ? "bg-primary/10 text-primary" : ""}`}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <AnimatePresence mode="wait">
          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20 animate-in fade-in-50 duration-500"
            >
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6 animate-in zoom-in-50 duration-700 delay-200">
                <AlertCircle className="h-8 w-8 text-muted-foreground animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                No applications found
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 duration-500 delay-500">
                There are no applications matching your current filters. Try
                adjusting your search criteria.
              </p>
              {filter.status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6"
                >
                  <Button
                    variant="outline"
                    onClick={() => handleStatusFilter(null)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    Clear filter
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
              <Table>
                <TableHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                  <TableRow className="border-border/30">
                    <TableHead className="w-[280px] font-semibold">
                      Applicant
                    </TableHead>
                    <TableHead className="font-semibold">Match Score</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Applied</TableHead>
                    <TableHead className="font-semibold">Resume</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {applications.map((application, index) => {
                    const scoreData = parseScoreData(application.score);
                    const overallScore = scoreData?.score || 0;
                    const scorePercentage = Math.round(overallScore * 100);

                    return (
                      <motion.tr
                        key={application.applicationId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="cursor-pointer transition-all duration-300 hover:bg-primary/5 hover:shadow-sm group border-b border-border/30"
                        onClick={() => {
                          dispatch(
                            fetchApplicationById(application.applicationId),
                          );
                        }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-border/30 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                              {application.applicant.avatarUrl ? (
                                <AvatarImage
                                  src={
                                    application.applicant.avatarUrl ||
                                    "/placeholder.svg"
                                  }
                                  alt={application.applicant.fullName || ""}
                                />
                              ) : (
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                  {getInitials(
                                    application.applicant.fullName || "",
                                  )}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {application.applicant.fullName}
                              </div>
                              <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                {application.applicant.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-bold ${getScoreTextColor(overallScore)}`}
                              >
                                {scorePercentage}%
                              </span>
                              <Badge
                                variant="outline"
                                className="text-xs bg-primary/5 border-primary/20"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Match
                              </Badge>
                            </div>
                            <div className="relative pt-1">
                              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-muted">
                                <div
                                  style={{ width: `${scorePercentage}%` }}
                                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-all duration-500 ${
                                    overallScore >= 0.8
                                      ? "bg-gradient-to-r from-green-400 to-green-600"
                                      : overallScore >= 0.6
                                        ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                        : overallScore >= 0.4
                                          ? "bg-gradient-to-r from-orange-400 to-orange-600"
                                          : "bg-gradient-to-r from-red-400 to-red-600"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            className={`flex items-center gap-2 px-3 py-2 font-semibold ${getStatusColor(application.status)}`}
                          >
                            {getStatusIcon(application.status)}
                            <span>{application.status.toLowerCase()}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {new Date(
                                application.appliedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 hover:underline flex items-center transition-all duration-300 hover:scale-105 font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Resume
                          </a>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
