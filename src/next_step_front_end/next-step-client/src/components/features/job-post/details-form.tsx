"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Minus, Plus, FileText, Link, Users, X, Wifi, Gift } from "lucide-react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { updateJobRequest } from "@/store/slices/jobs-slice"
import type { JobRequest } from "@/types/job-type"
import { useEffect, useState } from "react"

interface DetailsFormProps {
  onNext: () => void
  onClearAll: () => void
}

export function DetailsForm({ onNext, onClearAll }: DetailsFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const request = useSelector((state: RootState) => state.jobs.request)

  // Local state for form fields
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    jobUrl: "",
    remoteAllowed: false,
    interviewProcess: 1,
    benefits: "",
  })

  // Local state for benefits management
  const [benefitsList, setBenefitsList] = useState<string[]>([])
  const [currentBenefit, setCurrentBenefit] = useState("")

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddBenefit = () => {
    const trimmedBenefit = currentBenefit.trim()
    if (trimmedBenefit && !benefitsList.includes(trimmedBenefit)) {
      const newBenefitsList = [...benefitsList, trimmedBenefit]
      setBenefitsList(newBenefitsList)
      setCurrentBenefit("")

      // Update formData with pipe-separated string
      const benefitsString = newBenefitsList.join("|")
      setFormData((prev) => ({
        ...prev,
        benefits: benefitsString,
      }))
    }
  }

  const handleRemoveBenefit = (benefitToRemove: string) => {
    const newBenefitsList = benefitsList.filter((benefit) => benefit !== benefitToRemove)
    setBenefitsList(newBenefitsList)

    // Update formData with pipe-separated string
    const benefitsString = newBenefitsList.join("|")
    setFormData((prev) => ({
      ...prev,
      benefits: benefitsString,
    }))
  }

  const handleBenefitKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddBenefit()
    }
  }

  const handleClearAll = () => {
    setFormData({
      title: "",
      shortDescription: "",
      detailedDescription: "",
      jobUrl: "",
      remoteAllowed: false,
      interviewProcess: 1,
      benefits: "",
    })
    setBenefitsList([])
    setCurrentBenefit("")
    onClearAll()
  }

  const handleNext = () => {
    // Only save to Redux when clicking Next
    const updatedJob = {
      ...request,
      ...formData,
    } as JobRequest

    dispatch(updateJobRequest(updatedJob))
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

  // Initialize request if it doesn't exist
  useEffect(() => {
    if (!request) {
      dispatch(updateJobRequest(null))
    } else {
      // Populate form with existing data if available
      setFormData({
        title: request.title || "",
        shortDescription: request.shortDescription || "",
        detailedDescription: request.detailedDescription || "",
        jobUrl: request.jobUrl || "",
        remoteAllowed: request.remoteAllowed || false,
        interviewProcess: request.interviewProcess || 1,
        benefits: request.benefits || "",
      })

      // Initialize benefits list from existing data
      if (request?.benefits) {
        const existingBenefits = request.benefits.split("|").filter((b) => b.trim())
        setBenefitsList(existingBenefits)
      }
    }
  }, [dispatch, request])

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

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <Label className="font-medium text-sm">Benefits & Perks</Label>
              </div>

              <div className="flex gap-2">
                <Input
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={handleBenefitKeyPress}
                    placeholder="e.g. Health Insurance, Paid Leave, Flexible Hours"
                    className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow flex-1"
                />
                <Button
                    type="button"
                    onClick={handleAddBenefit}
                    disabled={!currentBenefit.trim() || benefitsList.includes(currentBenefit.trim())}
                    className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm hover:shadow transition-all duration-300 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              {benefitsList.length === 0 && (
                  <div className="p-4 bg-muted/10 rounded-lg border border-dashed border-border/30 text-center">
                    <Gift className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No benefits added yet</p>
                    <p className="text-xs text-muted-foreground">Add benefits to make your job more attractive</p>
                  </div>
              )}

              {benefitsList.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 p-4 bg-muted/20 rounded-lg border border-border/30 min-h-[60px]">
                      {benefitsList.map((benefit, index) => (
                          <motion.div
                              key={`${benefit}-${index}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: index * 0.05 }}
                          >
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary py-2 px-3 rounded-lg transition-all border border-primary/20 shadow-sm hover:shadow text-sm"
                            >
                              <Gift className="h-3.5 w-3.5" />
                              <span>{benefit}</span>
                              <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-primary/20 rounded-full ml-1 transition-colors"
                                  onClick={() => handleRemoveBenefit(benefit)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      {benefitsList.length} benefit{benefitsList.length !== 1 ? "s" : ""} added • Stored as:{" "}
                      {formData.benefits}
                    </p>
                  </div>
              )}

              <div className="bg-muted/30 p-3 rounded-lg border border-border/30">
                <div className="flex items-start gap-2">
                  <Gift className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium mb-1">Benefits Tips</h4>
                    <p className="text-xs text-muted-foreground">
                      Add attractive benefits like health insurance, flexible hours, professional development, or remote
                      work options to make your job posting more appealing.
                    </p>
                  </div>
                </div>
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
