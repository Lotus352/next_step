"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import JobListings from "@/components/features/job/job-listings-employer"
import ApplicationList from "@/components/features/job-application/job-application-list"
import ApplicationDetail from "@/components/features/job-application/job-application-detail"
import JobInformation from "@/components/features/job/job-information"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { motion, AnimatePresence } from "framer-motion"

export default function JobApplicationReviewPage() {
  const [isJobListingsCollapsed, setIsJobListingsCollapsed] = useState(false)

  const job = useSelector((state: RootState) => state.jobs.selected)
  const application = useSelector((state: RootState) => state.jobApplications.selected)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
            <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Approved
            </Badge>
        )
      case "REJECTED":
        return (
            <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Rejected
            </Badge>
        )
      default:
        return (
            <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
            >
              <Clock className="h-3.5 w-3.5 mr-1" />
              Pending
            </Badge>
        )
    }
  }

  return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="container mx-auto py-8 px-4 md:px-6">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Candidate Ranking System
                  </h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    Review and manage job applications with AI-powered insights
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/5 border-primary/20 px-3 py-2">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </motion.div>

            <div
                className={`grid gap-6 transition-all duration-300 ${
                    isJobListingsCollapsed ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
                }`}
            >
              {/* Left Column - Job Listings with Collapse */}
              <AnimatePresence>
                {!isJobListingsCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -20, width: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:col-span-1"
                    >
                      <Card className="h-fit shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden relative">
                        {/* Collapse Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                            onClick={() => setIsJobListingsCollapsed(true)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                          <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Job Listings
                          </CardTitle>
                          <CardDescription className="text-base">
                            Select a job to view applications and insights
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 max-h-[600px] overflow-y-auto">
                          <JobListings />
                        </CardContent>
                      </Card>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Expand Button when collapsed */}
              {isJobListingsCollapsed && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50"
                  >
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-8 rounded-r-lg rounded-l-none bg-background/80 backdrop-blur-sm border-l-0 shadow-lg hover:bg-primary/10 hover:text-primary transition-all duration-300"
                        onClick={() => setIsJobListingsCollapsed(false)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
              )}

              {/* Main Content Area */}
              <motion.div
                  layout
                  transition={{ duration: 0.3 }}
                  className={`space-y-6 ${isJobListingsCollapsed ? "col-span-1" : "lg:col-span-3"}`}
              >
                <AnimatePresence mode="wait">
                  {job ? (
                      <motion.div
                          key="job-selected"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                      >
                        <Tabs defaultValue="applications" className="w-full">
                          <div className="mb-6">
                            <TabsList className="w-full grid grid-cols-2 bg-background/80 backdrop-blur-sm rounded-xl border border-border/30 shadow-sm">
                              <TabsTrigger
                                  value="applications"
                                  className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Candidates
                              </TabsTrigger>
                              <TabsTrigger
                                  value="job-details"
                                  className="flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                              >
                                <Briefcase className="h-4 w-4 mr-2" />
                                Job Details
                              </TabsTrigger>
                            </TabsList>
                          </div>

                          <TabsContent value="applications" className="space-y-6">
                            <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
                              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                  <Users className="h-5 w-5 text-primary" />
                                  Candidate Applications
                                </CardTitle>
                                <CardDescription className="text-base">
                                  AI-powered candidate ranking and detailed analysis for {job.title}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <ApplicationList />
                              </CardContent>
                            </Card>

                            <AnimatePresence>
                              {application && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -20 }}
                                      transition={{ duration: 0.4 }}
                                  >
                                    <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
                                      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                              <Sparkles className="h-5 w-5 text-primary" />
                                              Candidate Analysis
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                              Comprehensive review of {application.applicant.fullName}'s application
                                            </CardDescription>
                                          </div>
                                          {getStatusBadge(application.status)}
                                        </div>
                                      </CardHeader>
                                      <CardContent className="pt-4">
                                        <ApplicationDetail />
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                              )}
                            </AnimatePresence>
                          </TabsContent>

                          <TabsContent value="job-details">
                            <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
                              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                  <Briefcase className="h-5 w-5 text-primary" />
                                  Job Information
                                </CardTitle>
                                <CardDescription className="text-base">
                                  Complete details and requirements for this position
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-4">
                                <JobInformation jobId={job.jobId} />
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </motion.div>
                  ) : (
                      <motion.div
                          key="no-job-selected"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                      >
                        <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
                          <CardContent className="p-16 flex flex-col items-center justify-center min-h-[400px] text-center">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mb-6 shadow-sm"
                            >
                              <Briefcase className="h-16 w-16 text-primary" />
                            </motion.div>
                            <h3 className="text-2xl font-bold mb-3">No Job Selected</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg leading-relaxed">
                              Select a job posting from the list to view candidate applications and detailed analytics
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setIsJobListingsCollapsed(false)}
                                className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                            >
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Browse Job Listings
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  )
}
