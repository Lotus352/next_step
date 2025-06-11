"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2, Filter, Briefcase, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JobHeader } from "./job-header"
import { JobFilters } from "../filters/job-filters"
import { JobCard } from "./job-card"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { fetchLevels } from "@/store/slices/experience-levels-slice"
import { fetchSkills } from "@/store/slices/skills-slice"
import { fetchEmploymentTypes, filterJobs, resetFilter } from "@/store/slices/jobs-slice"
import { fetchCountries } from "@/store/slices/locations-slice"
import { fetchCurrencies } from "@/store/slices/salary-slice"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { DEFAULT_JOB_SIZE, DEFAULT_JOB_FILTER, DEFAULT_SKILL_SIZE, DEFAULT_LEVEL_SIZE, DEFAULT_PAGE } from "@/constants"

export function JobListings() {
  const dispatch = useDispatch<AppDispatch>()
  const { content, totalPages, totalElements, page, filter, status } = useSelector((state: RootState) => state.jobs)

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleResetFilters = () => {
    dispatch(resetFilter())
    dispatch(
      filterJobs({
        page: DEFAULT_PAGE,
        size: DEFAULT_JOB_SIZE,
        filter: DEFAULT_JOB_FILTER,
      }),
    )
  }

  const setCurrentPage = (newPage: number) => {
    dispatch(
      filterJobs({
        page: newPage - 1,
        size: DEFAULT_JOB_SIZE,
        filter,
      }),
    )
  }

  useEffect(() => {
    dispatch(fetchLevels({ page: DEFAULT_PAGE, size: DEFAULT_LEVEL_SIZE }))
    dispatch(fetchSkills({ page: DEFAULT_PAGE, size: DEFAULT_SKILL_SIZE }))
    dispatch(fetchCountries())
    dispatch(fetchEmploymentTypes())
    dispatch(fetchCurrencies())
  }, [dispatch])

  useEffect(() => {
    dispatch(
      filterJobs({
        page: page,
        size: DEFAULT_JOB_SIZE,
        filter,
      }),
    )
  }, [dispatch, filter, page])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto py-16 px-4 max-w-6xl relative z-10">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-semibold">Find Your Dream Job</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Job Listings
            </span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
            Discover thousands of opportunities from top companies worldwide. Find the perfect match for your skills and
            career goals.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="p-6 shadow-lg border-primary/10 overflow-hidden relative rounded-xl backdrop-blur-sm bg-background/80">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              <JobHeader openFilter={() => setIsFilterOpen(true)} />
            </Card>
          </motion.div>

          <JobFilters isOpen={isFilterOpen} onOpenChange={setIsFilterOpen} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border/40 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-full">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <div className="text-sm font-medium">
                Showing <span className="font-semibold text-primary">{content.length}</span> of{" "}
                <span className="font-semibold text-primary">{totalElements}</span> jobs
              </div>
            </div>

            {totalPages > 0 && (
              <div className="text-sm bg-background/80 px-4 py-2 rounded-full shadow-sm border border-border/50 font-medium">
                Page <span className="font-semibold text-primary">{page + 1}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>
            )}
          </motion.div>

          {status === "loading" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-muted/20 rounded-2xl border border-border/30 shadow-inner"
            >
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-6" />
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
              </div>
              <p className="text-muted-foreground text-lg font-medium">Finding the perfect jobs for you...</p>
            </motion.div>
          ) : content.length > 0 ? (
            <AnimatePresence>
              <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                {content.map((job, index) => (
                  <motion.div
                    key={job.jobId}
                    variants={item}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.05,
                    }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed p-16 text-center my-12 bg-muted/30 shadow-inner"
            >
              <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 relative">
                <Search className="h-10 w-10 text-muted-foreground" />
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">No jobs found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                We couldn't find any jobs matching your criteria. Try adjusting your search or filter parameters.
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={handleResetFilters}
                className="px-8 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
              >
                Reset all filters
              </Button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center mt-12 bg-muted/20 p-6 rounded-xl shadow-sm border border-border/30"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  disabled={page === 0 || status === "loading"}
                  className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show first page, last page, current page, and pages around current
                    let pageToShow
                    if (totalPages <= 5) {
                      pageToShow = i + 1
                    } else if (page < 2) {
                      pageToShow = i + 1
                    } else if (page > totalPages - 3) {
                      pageToShow = totalPages - 4 + i
                    } else {
                      pageToShow = page - 1 + i
                    }

                    if (pageToShow > totalPages) return null

                    return (
                      <Button
                        key={pageToShow}
                        variant={page + 1 === pageToShow ? "default" : "outline"}
                        size="icon"
                        className={`h-10 w-10 rounded-full ${
                          page + 1 === pageToShow
                            ? "shadow-md bg-primary hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
                        }`}
                        onClick={() => setCurrentPage(pageToShow)}
                        disabled={status === "loading"}
                      >
                        {pageToShow}
                      </Button>
                    )
                  })}

                  {totalPages > 5 && page < totalPages - 3 && (
                    <>
                      <span className="text-muted-foreground px-1">...</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={status === "loading"}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(page + 2)}
                  disabled={page + 1 === totalPages || status === "loading"}
                  className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-colors border-border/50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
