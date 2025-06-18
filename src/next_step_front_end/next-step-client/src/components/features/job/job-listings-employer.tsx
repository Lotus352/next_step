"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Briefcase, MapPin, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AppDispatch, RootState } from "@/store/store"
import { filterJobs, resetJobFilter, fetchJobById } from "@/store/slices/jobs-slice"
import { formatTextEnum } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Loading from "@/components/loading"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE, DEFAULT_JOB_FILTER } from "@/constants"

export default function JobListings() {
  const dispatch: AppDispatch = useDispatch()

  const jobs = useSelector((state: RootState) => state.jobs.content)
  const status = useSelector((state: RootState) => state.jobs.statuses)

  useEffect(() => {
    dispatch(resetJobFilter())
  }, [dispatch])

  useEffect(() => {
    dispatch(
        filterJobs({
          page: DEFAULT_PAGE,
          size: DEFAULT_JOB_SIZE,
          filter: DEFAULT_JOB_FILTER,
        }),
    )
  }, [dispatch])

  const handleJobSelect = (jobId: number) => {
    dispatch(fetchJobById(jobId))
  }

  if (status.filtering === "loading") {
    return <Loading />
  }

  if (status.filtering === "succeeded" && jobs.length === 0) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No job listings found</h3>
          <p className="text-muted-foreground text-sm">There are currently no job listings available.</p>
        </motion.div>
    )
  }

  return (
      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <AnimatePresence>
          {jobs.map((job, index) => (
              <motion.div
                  key={job.jobId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
              >
                <Card
                    className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300 border-border/30 bg-background/80 backdrop-blur-sm"
                    onClick={() => handleJobSelect(job.jobId)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Job Title */}
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors duration-300 line-clamp-2">
                        {job.title}
                      </h3>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {job.location && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location.city}
                            </Badge>
                        )}

                        {job.employmentType && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {formatTextEnum(job.employmentType)}
                            </Badge>
                        )}

                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.status ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {/* Short Description */}
                      {job.shortDescription && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{job.shortDescription}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
  )
}
