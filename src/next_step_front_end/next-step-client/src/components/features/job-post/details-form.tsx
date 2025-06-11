"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Minus, Plus, FileText, Link, Users, X, Wifi } from "lucide-react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { updateJob, initializeJob } from "@/store/slices/jobs-slice"
import type { JobRequest } from "@/types/job-type"
import { useEffect, useState } from "react"

interface DetailsFormProps {
  onNext: () => void
  onClearAll: () => void
}

export function DetailsForm({ onNext, onClearAll }: DetailsFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const reduxRequest = useSelector((state: RootState) => state.jobs.request)

  // Local state for form fields
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    jobUrl: "",
    remoteAllowed: false,
    interviewProcess: 1,
  })

  // Initialize request if it doesn't exist
  useEffect(() => {
    if (!reduxRequest) {
      dispatch(initializeJob())
    } else {
      // Populate form with existing data if available
      setFormData({
        title: reduxRequest.title || "",
        shortDescription: reduxRequest.shortDescription || "",
        detailedDescription: reduxRequest.detailedDescription || "",
        jobUrl: reduxRequest.jobUrl || "",
        remoteAllowed: reduxRequest.remoteAllowed || false,
        interviewProcess: reduxRequest.interviewProcess || 1,
      })
    }
  }, [dispatch, reduxRequest])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleClearAll = () => {
    setFormData({
      title: "",
      shortDescription: "",
      detailedDescription: "",
      jobUrl: "",
      remoteAllowed: false,
      interviewProcess: 1,
    })
    onClearAll()
  }

  const handleNext = () => {
    // Only save to Redux when clicking Next
    const updatedJob = {
      ...reduxRequest,
      ...formData,
    } as JobRequest

    dispatch(updateJob(updatedJob))
    onNext()
  }

  // Check if form is complete for local validation
  const isFormComplete = formData.title?.trim() !== "" && formData.detailedDescription?.trim() !== ""

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Job Information
              </CardTitle>
              <CardDescription className="mt-1.5">
                Provide essential details about the position and requirements
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="jobTitle" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="jobTitle"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="shortDescription" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Short Description
            </Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange("shortDescription", e.target.value)}
              placeholder="Brief overview of the position (optional)"
              className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="detailedDescription" className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Detailed Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="detailedDescription"
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
              placeholder="Provide a comprehensive description of the job, including responsibilities and requirements"
              className="min-h-[200px] bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 resize-none rounded-lg shadow-sm hover:shadow"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <Label htmlFor="jobUrl" className="text-sm font-medium flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              Application URL
            </Label>
            <Input
              id="jobUrl"
              value={formData.jobUrl}
              onChange={(e) => handleInputChange("jobUrl", e.target.value)}
              placeholder="https://your-company.com/careers/job-application"
              className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Number of Interview Rounds
            </Label>
            <div className="flex items-center gap-3 max-w-xs">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleInputChange("interviewProcess", Math.max(1, (formData.interviewProcess || 1) - 1))}
                disabled={(formData.interviewProcess || 1) === 1}
                className="h-10 w-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50 flex-shrink-0"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center bg-background border border-border/50 hover:border-primary/50 transition-all h-10 rounded-lg shadow-sm hover:shadow px-4 min-w-[100px]">
                <span className="font-semibold text-primary text-base tabular-nums">
                  {formData.interviewProcess || 1}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {(formData.interviewProcess || 1) === 1 ? "round" : "rounds"}
                </span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleInputChange("interviewProcess", (formData.interviewProcess || 1) + 1)}
                className="h-10 w-10 rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-border/30 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Wifi className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <Label htmlFor="remoteAllowed" className="text-sm font-medium">
                        Remote work allowed
                      </Label>
                      <p className="text-xs text-muted-foreground">Allow candidates to work from home or remotely</p>
                    </div>
                  </div>
                  <Switch
                    id="remoteAllowed"
                    checked={formData.remoteAllowed}
                    onCheckedChange={(checked) => handleInputChange("remoteAllowed", checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end pt-4">
            <Button
              onClick={handleNext}
              className={`flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 ${
                !isFormComplete ? "opacity-70" : ""
              }`}
              disabled={!isFormComplete}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
