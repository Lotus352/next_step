"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Search, Grid3X3, List, Sparkles, BookmarkPlus, Filter, SortAsc, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchFavoriteJobs, clearFavoriteJobs } from "@/store/slices/favorite-jobs-slice"
import Loading from "@/components/loading"
import AlertDestructive from "@/components/destructive-alert"
import { DEFAULT_JOB_SIZE } from "@/constants"
import { FavoriteJobCard } from "@/components/features/job/favorite-job-card.tsx"
import Header from "@/components/layout/header.tsx"
import Footer from "@/components/layout/footer.tsx"

export default function FavoriteJobsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(0)

  const { content: favoriteJobs, totalPages, statuses, error } = useSelector((state: RootState) => state.favoriteJobs)
  const { profile } = useSelector((state: RootState) => state.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")

  // Filter jobs based on search query
  const filteredJobs = favoriteJobs.filter(
      (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.postedBy.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) => skill.skillName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "salary-high":
        return (b.salary?.maxSalary || 0) - (a.salary?.maxSalary || 0)
      case "salary-low":
        return (a.salary?.minSalary || 0) - (b.salary?.minSalary || 0)
      case "title":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  useEffect(() => {
    if (isAuthenticated && profile?.userId) {
      dispatch(
          fetchFavoriteJobs({
            id: profile.userId,
            page: currentPage,
            size: DEFAULT_JOB_SIZE,
          }),
      )
    }

    return () => {
      dispatch(clearFavoriteJobs())
    }
  }, [dispatch, isAuthenticated, profile?.userId, currentPage])

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1 && profile?.userId) {
      setCurrentPage((prev) => prev + 1)
      dispatch(
          fetchFavoriteJobs({
            id: profile.userId,
            page: currentPage + 1,
            size: DEFAULT_JOB_SIZE,
          }),
      )
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  // Stats for header
  const stats = [
    { icon: Heart, label: "Total Saved", value: favoriteJobs.length.toString() },
    { icon: Search, label: "Filtered", value: filteredJobs.length.toString() },
    { icon: Sparkles, label: "Available", value: sortedJobs.length.toString() },
  ]

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-2xl bg-background/80 backdrop-blur-sm border border-border/30 shadow-xl max-w-md"
          >
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to view your favorite jobs.</p>
            <Button className="w-full">Sign In</Button>
          </motion.div>
        </div>
    )
  }

  return (
      <>
        <Header />
        <section className="relative py-20 md:py-32 overflow-hidden min-h-screen">
          {/* Enhanced Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
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
                className="absolute top-1/2 -right-40 w-96 h-96 bg-red-500/8 rounded-full blur-3xl"
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

          <div className="container mx-auto px-4 py-8 max-w-6xl relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
              {/* Header Section */}
              <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-8"
              >
                {/* Main Title */}
                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                  Favorite Jobs
                </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Keep track of the jobs that caught your attention. Your personalized collection of career opportunities.
                </motion.p>

                {/* Stats */}
                <motion.div
                    className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                  {stats.map((stat) => (
                      <motion.div
                          key={stat.label}
                          className="flex items-center gap-3 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="p-2 rounded-full bg-red-500/10">
                          <stat.icon className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-foreground">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Action Toolbar - Matching notification-page style */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mb-8"
              >
                <div className="relative overflow-hidden border border-border/30 bg-background/80 backdrop-blur-sm rounded-2xl shadow-lg">
                  {/* Enhanced gradient bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-600"></div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 opacity-30">
                    <div className="w-2 h-2 bg-red-500/40 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-4 left-4 opacity-20">
                    <div className="w-1.5 h-1.5 bg-red-500/30 rounded-full animate-pulse"></div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-muted/10 via-transparent to-transparent">
                    <div className="flex flex-col gap-6">
                      {/* Top Row - Title and View Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left side - Title */}
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-red-500/10">
                            <Heart className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Job Management</h3>
                            <p className="text-sm text-muted-foreground">Search, filter and organize your saved jobs</p>
                          </div>
                        </div>

                        {/* Right side - View Mode Toggle */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border/50 rounded-xl p-1 bg-background shadow-sm">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant={viewMode === "grid" ? "default" : "ghost"}
                                      size="sm"
                                      className="h-10 w-10 p-0 rounded-lg"
                                      onClick={() => setViewMode("grid")}
                                  >
                                    <Grid3X3 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Grid view</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                      variant={viewMode === "list" ? "default" : "ghost"}
                                      size="sm"
                                      className="h-10 w-10 p-0 rounded-lg"
                                      onClick={() => setViewMode("list")}
                                  >
                                    <List className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>List view</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - Search and Controls */}
                      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        {/* Search */}
                        <div className="flex-1 relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                          <div className="relative flex bg-background border border-border/50 rounded-xl shadow-sm group-hover:border-red-500/50 transition-all duration-300 overflow-hidden">
                            <div className="flex items-center justify-center px-4 bg-muted/30 border-r border-border/30">
                              <Search className="h-5 w-5 text-muted-foreground group-hover:text-red-500 transition-colors duration-300" />
                            </div>
                            <Input
                                type="search"
                                placeholder="Search your saved jobs..."
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-4 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                          {/* Sort Dropdown */}
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-48 h-12 rounded-xl border-border/50 shadow-sm hover:border-red-500/50 transition-colors duration-300">
                              <div className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4 text-muted-foreground" />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="newest">Newest First</SelectItem>
                              <SelectItem value="oldest">Oldest First</SelectItem>
                              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                              <SelectItem value="title">Title A-Z</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Divider */}
                          <div className="h-8 w-px bg-border/50"></div>

                          {/* Filter Button */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-12 px-4 rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-300 hover:scale-105 border-border/50 shadow-sm"
                                >
                                  <Filter className="h-4 w-4 mr-2" />
                                  Filter
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Advanced filters</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {/* Settings Button */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-12 w-12 p-0 rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all duration-300 hover:scale-105 border-border/50 shadow-sm"
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Job preferences</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      {/* Results Summary */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <Badge
                              variant="outline"
                              className="bg-red-50 border-red-200 text-red-700 font-semibold px-4 py-2 hover:bg-red-100 transition-all duration-300"
                          >
                            {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
                          </Badge>
                          {searchQuery && (
                              <Badge variant="secondary" className="px-3 py-1">
                                Searching: "{searchQuery}"
                              </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {statuses.fetching === "loading" && favoriteJobs.length === 0 ? (
                    <Loading />
                ) : statuses.fetching === "failed" ? (
                    <AlertDestructive message={error || "Failed to fetch favorite jobs"} />
                ) : sortedJobs.length === 0 ? (
                    <motion.div
                        className="text-center py-20 animate-in fade-in-50 duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                      <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6 animate-in zoom-in-50 duration-700 delay-200">
                        <div className="h-8 w-8 text-muted-foreground animate-pulse">
                          {searchQuery ? <Search /> : <BookmarkPlus />}
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        {searchQuery ? "No matching jobs found" : "No saved jobs yet"}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 duration-500 delay-500">
                        {searchQuery
                            ? "Try adjusting your search terms to find the jobs you're looking for."
                            : "Start exploring jobs and save the ones that interest you. They'll appear here for easy access."}
                      </p>
                      {!searchQuery && (
                          <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                          >
                            <Button
                                className="mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                onClick={() => (window.location.href = "/jobs")}
                            >
                              <Search className="h-4 w-4 mr-2" />
                              Browse Jobs
                            </Button>
                          </motion.div>
                      )}
                    </motion.div>
                ) : (
                    <motion.div
                        className={`grid gap-6 ${
                            viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
                        }`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                      {sortedJobs.map((job, index) => (
                          <motion.div
                              key={job.jobId}
                              variants={itemVariants}
                              style={{
                                animationDelay: `${index * 100}ms`,
                              }}
                          >
                            <FavoriteJobCard job={job} />
                          </motion.div>
                      ))}
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Load More */}
              {sortedJobs.length > 0 && currentPage < totalPages - 1 && (
                  <motion.div
                      className="text-center mt-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                  >
                    <Button
                        onClick={handleLoadMore}
                        disabled={statuses.fetching === "loading"}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {statuses.fetching === "loading" ? (
                          <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                                className="mr-2"
                            >
                              <Sparkles className="h-4 w-4" />
                            </motion.div>
                            Loading...
                          </>
                      ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Load More Jobs
                          </>
                      )}
                    </Button>
                  </motion.div>
              )}
            </motion.div>
          </div>
        </section>
        <Footer />
      </>
  )
}
