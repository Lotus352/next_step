"use client"

import { useEffect } from "react"
import RelatedJobs from "@/components/features/job/related-jobs"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { clearJobSelected, fetchJobById } from "@/store/slices/jobs-slice"
import JobDetailHeader from "@/components/features/job/job-detail-header"
import JobDetailTabs from "@/components/features/job/job-detail-tabs"
import CompanyLocation from "@/components/features/company/company-location"
import { clearCompanySelected } from "@/store/slices/companies-slice"
import Header from "@/components/layout/header"
import JobApplicationCard from "@/components/features/job-application/job-application-card"
import {clearJobApps, fetchApplicationInfoByJob} from "@/store/slices/job-applications-slice"
import { motion } from "framer-motion"

export default function JobDetailPage() {
  const dispatch = useDispatch<AppDispatch>()
  const params = useParams()
  const id = params?.id as string

  useEffect(() => {
    if (id) {
      const jobId = Number.parseInt(id, 10)
      if (!isNaN(jobId)) {
        dispatch(fetchJobById(jobId))
        dispatch(fetchApplicationInfoByJob(jobId))
      }
    }
    return () => {
      dispatch(clearCompanySelected())
      dispatch(clearJobApps())
      dispatch(clearJobSelected())
    }
  }, [dispatch, id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl opacity-50" />
      </div>

      <Header />

      <div className="container mx-auto py-8 px-4 md:px-6 relative z-10">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 shadow-sm border border-primary/20">
            <span className="text-sm font-semibold">Job Details</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Job
            </span>{" "}
            <span className="text-foreground">Overview</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore detailed information about this opportunity and apply with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Job Detail Header */}
            <JobDetailHeader />

            {/* Job Detail Tabs */}
            <JobDetailTabs />
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Application Card */}
            <JobApplicationCard />

            {/* Company Location */}
            <CompanyLocation />

            {/* Related Jobs */}
            <RelatedJobs />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
