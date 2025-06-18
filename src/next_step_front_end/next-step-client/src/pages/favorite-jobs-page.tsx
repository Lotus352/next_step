"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  Grid3X3,
  List,
  Sparkles,
  BookmarkPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchFavoriteJobs,
  clearFavoriteJobs,
} from "@/store/slices/favorite-jobs-slice";
import Loading from "@/components/loading";
import AlertDestructive from "@/components/destructive-alert";
import { DEFAULT_JOB_SIZE } from "@/constants";
import { FavoriteJobCard } from "@/components/features/job/favorite-job-card.tsx";
import Header from "@/components/layout/header.tsx";
import Footer from "@/components/layout/footer.tsx";

export default function FavoriteJobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(0);

  const {
    content: favoriteJobs,
    totalPages,
    statuses,
    error,
  } = useSelector((state: RootState) => state.favoriteJobs);
  const { profile } = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.status === "authenticated",
  );

  // Filter jobs based on search query
  const filteredJobs = favoriteJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.postedBy.company.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "salary-high":
        return (b.salary?.maxSalary || 0) - (a.salary?.maxSalary || 0);
      case "salary-low":
        return (a.salary?.minSalary || 0) - (b.salary?.minSalary || 0);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  useEffect(() => {
    if (isAuthenticated && profile?.userId) {
      dispatch(
        fetchFavoriteJobs({
          id: profile.userId,
          page: currentPage,
          size: DEFAULT_JOB_SIZE,
        }),
      );
    }

    return () => {
      dispatch(clearFavoriteJobs());
    };
  }, [dispatch, isAuthenticated, profile?.userId, currentPage]);

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1 && profile?.userId) {
      setCurrentPage((prev) => prev + 1);
      dispatch(
        fetchFavoriteJobs({
          id: profile.userId,
          page: currentPage + 1,
          size: DEFAULT_JOB_SIZE,
        }),
      );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

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
  };

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
          <p className="text-muted-foreground mb-6">
            Please sign in to view your favorite jobs.
          </p>
          <Button className="w-full">Sign In</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {/* Animated Background Elements */}
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

        <div className="container px-4 md:px-6 py-8 relative">
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">
                Saved
              </span>
              <br />
              <span className="text-foreground">Opportunities</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Keep track of the jobs that caught your attention. Your
              personalized collection of career opportunities.
            </motion.p>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            className="mb-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* Search and Filters */}
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

              {/* Sort and View Controls */}
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 h-12 rounded-xl border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="salary-high">
                      Salary: High to Low
                    </SelectItem>
                    <SelectItem value="salary-low">
                      Salary: Low to High
                    </SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center border border-border/50 rounded-xl p-1 bg-background">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-red-50 border-red-200 text-red-700"
                >
                  {filteredJobs.length}{" "}
                  {filteredJobs.length === 1 ? "job" : "jobs"} found
                </Badge>
                {searchQuery && (
                  <Badge variant="secondary">Searching: "{searchQuery}"</Badge>
                )}
              </div>
            </div>
          </motion.div>

          <Separator className="mb-8 bg-border/50" />

          {/* Content */}
          <AnimatePresence mode="wait">
            {statuses.fetching === "loading" && favoriteJobs.length === 0 ? (
              <Loading />
            ) : statuses.fetching === "failed" ? (
              <AlertDestructive
                message={error || "Failed to fetch favorite jobs"}
              />
            ) : sortedJobs.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6">
                  <BookmarkPlus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  {searchQuery ? "No matching jobs found" : "No saved jobs yet"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium">
                  {searchQuery
                    ? "Try adjusting your search terms to find the jobs you're looking for."
                    : "Start exploring jobs and save the ones that interest you. They'll appear here for easy access."}
                </p>
                {!searchQuery && (
                  <Button
                    className="mt-6"
                    onClick={() => (window.location.href = "/jobs")}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1 max-w-4xl mx-auto"
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
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
        </div>
      </div>
      <Footer />
    </>
  );
}
