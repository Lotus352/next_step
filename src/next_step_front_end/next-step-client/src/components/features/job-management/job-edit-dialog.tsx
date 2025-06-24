"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BenefitsInput } from "@/components/ui/benefits-input"
import { Edit, Save, X, Briefcase, DollarSign, Star, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type JobType from "@/types/job-type"
import type { JobRequest } from "@/types/job-type"
import type { AppDispatch } from "@/store/store"
import { updateJob } from "@/store/slices/jobs-slice"
import { mapJobTypeToJobRequest } from "@/mappers/job-mapper"
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogBody,
  CustomDialogFooter,
} from "@/components/ui/custom-dialog"

const jobEditSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  shortDescription: z.string().max(500, "Short description too long").optional(),
  detailedDescription: z.string().min(1, "Detailed description is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  remoteAllowed: z.boolean(),
  isFeatured: z.boolean().optional(),
  status: z.string().min(1, "Status is required"),
  jobUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  benefits: z.array(z.string()).optional(),
  expiryDate: z.string().optional(),
  minSalary: z.number().min(0, "Minimum salary must be positive"),
  maxSalary: z.number().min(0, "Maximum salary must be positive"),
  currency: z.string().min(1, "Currency is required"),
  payPeriod: z.string().min(1, "Pay period is required"),
})

type JobEditFormData = z.infer<typeof jobEditSchema>

interface JobEditDialogProps {
  job: JobType | null
  open: boolean
  onOpenChange: (open: boolean) => void
  userRole: "admin" | "employer"
}

export function JobEditDialog({ job, open, onOpenChange, userRole }: JobEditDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const initializationRef = useRef<boolean>(false)

  // Get location data from Redux store
  const form = useForm<JobEditFormData>({
    resolver: zodResolver(jobEditSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      shortDescription: "",
      detailedDescription: "",
      employmentType: "FULL_TIME",
      remoteAllowed: false,
      isFeatured: false,
      status: "OPEN",
      jobUrl: "",
      benefits: [],
      expiryDate: "",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
      payPeriod: "Yearly",
    },
  })

  // Helper functions
  const initializeFormData = useCallback(
      async (jobData: JobType) => {
        if (initializationRef.current) return

        setIsInitializing(true)
        initializationRef.current = true

        try {
          const benefits = jobData.benefits ? jobData.benefits.split("|").filter((b) => b.trim()) : []

          const formValues = {
            title: jobData.title || "",
            shortDescription: jobData.shortDescription || "",
            detailedDescription: jobData.detailedDescription || "",
            employmentType: jobData.employmentType || "FULL_TIME",
            remoteAllowed: jobData.remoteAllowed || false,
            isFeatured: userRole === "admin" ? jobData.isFeatured || false : false,
            status: jobData.status || "OPEN",
            jobUrl: jobData.jobUrl || "",
            benefits: benefits,
            expiryDate: jobData.expiryDate
                ? jobData.expiryDate.split("T")[0] || jobData.expiryDate.split(" ")[0] || ""
                : "",
            minSalary: jobData.salary?.minSalary || 0,
            maxSalary: jobData.salary?.maxSalary || 0,
            currency: jobData.salary?.currency || "USD",
            payPeriod: jobData.salary?.payPeriod || "Yearly",
          }

          // Use setTimeout to ensure form is ready
          setTimeout(() => {
            form.reset(formValues)
            setIsInitializing(false)
          }, 100)
        } catch (error) {
          console.error("Error initializing form:", error)
          setIsInitializing(false)
          toast.error("Failed to load job data")
        }
      },
      [dispatch, form, userRole, job],
  )

  // Reset initialization when dialog opens/closes
  useEffect(() => {
    if (open && job && !initializationRef.current) {
      initializeFormData(job)
    } else if (!open) {
      initializationRef.current = false
      setIsInitializing(false)
    }
  }, [open, job, initializeFormData])

  const handleCancel = useCallback(() => {
    if (isSubmitting) return

    setIsInitializing(false)
    initializationRef.current = false
    onOpenChange(false)
  }, [isSubmitting, onOpenChange])

  const onSubmit = async (data: JobEditFormData) => {
    if (!job || isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Inline date formatting
      const formatDateForAPI = (dateString: string): string | null => {
        if (!dateString) return null
        try {
          if (dateString.includes("T")) return dateString
          const date = new Date(dateString + "T00:00:00")
          if (isNaN(date.getTime())) return null
          return date.toISOString().slice(0, 19)
        } catch (error) {
          console.error("Error formatting date:", error)
          return null
        }
      }

      const jobRequest: JobRequest = {
        ...mapJobTypeToJobRequest(job),
        title: data.title,
        shortDescription: data.shortDescription || null,
        detailedDescription: data.detailedDescription,
        employmentType: data.employmentType,
        remoteAllowed: data.remoteAllowed,
        isFeatured: userRole === "admin" ? data.isFeatured || false : job.isFeatured,
        status: data.status,
        jobUrl: data.jobUrl || null,
        benefits: data.benefits && data.benefits.length > 0 ? data.benefits.join("|") : null,
        expiryDate: formatDateForAPI(data.expiryDate || ""),
        salary: {
          salaryId: job.salary?.salaryId || 0,
          minSalary: data.minSalary,
          maxSalary: data.maxSalary,
          currency: data.currency,
          payPeriod: data.payPeriod,
        },
      }

      const result = await dispatch(updateJob({ id: job.jobId, jobData: jobRequest }))

      if (updateJob.fulfilled.match(result)) {
        toast.success("Job updated successfully!")
        handleCancel()
      } else {
        toast.error("Failed to update job. Please try again.")
      }
    } catch (error) {
      console.error("Failed to update job:", error)
      toast.error("An error occurred while updating the job")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!job) return null

  const employmentTypes = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
  ]

  const currencies = ["USD", "EUR", "GBP", "VND", "JPY", "AUD", "CAD"]
  const payPeriods = ["Yearly", "Monthly", "Weekly", "Daily", "Hourly"]
  const statuses = ["OPEN", "CLOSE"]

  return (
      <CustomDialog
          open={open}
          onOpenChange={(newOpen) => {
            if (!newOpen && !isSubmitting && !isInitializing) {
              handleCancel()
            }
          }}
          className="max-w-4xl"
      >
        <CustomDialogContent showCloseButton={false}>
          {/* Header */}
          <CustomDialogHeader>
            <div className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Edit className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CustomDialogTitle>Edit Job</CustomDialogTitle>
                  <CustomDialogDescription>Update job details and requirements</CustomDialogDescription>
                </div>
              </div>
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting || isInitializing}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CustomDialogHeader>

          {/* Loading State */}
          {isInitializing && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading job data...</p>
                </div>
              </div>
          )}

          {/* Scrollable Body */}
          {!isInitializing && (
              <CustomDialogBody>
                <Form {...form}>
                  <div className="space-y-8">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Briefcase className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
                      </div>

                      <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Job Title *</FormLabel>
                                  <FormControl>
                                    <Input
                                        placeholder="Enter job title"
                                        className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                        {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="employmentType"
                              render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold">Employment Type *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-lg border-border/50 hover:border-primary/50">
                                          <SelectValue placeholder="Select employment type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {employmentTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                              {type.label}
                                            </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                              )}
                          />

                          <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-semibold">Status *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-lg border-border/50 hover:border-primary/50">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {statuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                              {status}
                                            </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                              )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                              control={form.control}
                              name="remoteAllowed"
                              render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4">
                                    <div className="space-y-0.5">
                                      <FormLabel className="text-sm font-semibold">Remote Work</FormLabel>
                                      <FormDescription className="text-xs">Allow remote work for this position</FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                  </FormItem>
                              )}
                          />

                          {/* Featured Job - Only show for admin */}
                          {userRole === "admin" && (
                              <FormField
                                  control={form.control}
                                  name="isFeatured"
                                  render={({ field }) => (
                                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4">
                                        <div className="space-y-0.5">
                                          <FormLabel className="text-sm font-semibold">Featured Job</FormLabel>
                                          <FormDescription className="text-xs">Mark this job as featured</FormDescription>
                                        </div>
                                        <FormControl>
                                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                      </FormItem>
                                  )}
                              />
                          )}
                        </div>
                      </div>
                    </motion.div>

                    <Separator className="bg-border/50" />

                    {/* Salary Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Salary Information</h3>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField
                            control={form.control}
                            name="minSalary"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Min Salary *</FormLabel>
                                  <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="rounded-lg border-border/50 hover:border-primary/50"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxSalary"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Max Salary *</FormLabel>
                                  <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="rounded-lg border-border/50 hover:border-primary/50"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Currency *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="rounded-lg border-border/50 hover:border-primary/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {currencies.map((currency) => (
                                          <SelectItem key={currency} value={currency}>
                                            {currency}
                                          </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="payPeriod"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Pay Period *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="rounded-lg border-border/50 hover:border-primary/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {payPeriods.map((period) => (
                                          <SelectItem key={period} value={period}>
                                            {period}
                                          </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                    </motion.div>

                    <Separator className="bg-border/50" />

                    {/* Job Descriptions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Edit className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Job Descriptions</h3>
                      </div>

                      <FormField
                          control={form.control}
                          name="shortDescription"
                          render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold">Short Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                      placeholder="Brief overview of the position..."
                                      className="min-h-[100px] rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300 resize-none"
                                      {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  A brief summary that will appear in job listings (max 500 characters)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                          )}
                      />

                      <FormField
                          control={form.control}
                          name="detailedDescription"
                          render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold">Detailed Description *</FormLabel>
                                <FormControl>
                                  <Textarea
                                      placeholder="Detailed job description, responsibilities, requirements..."
                                      className="min-h-[200px] rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300 resize-none"
                                      {...field}
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Comprehensive job description including responsibilities and requirements
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                    </motion.div>

                    <Separator className="bg-border/50" />

                    {/* Benefits Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Benefits & Perks</h3>
                      </div>

                      <FormField
                          control={form.control}
                          name="benefits"
                          render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold">Benefits</FormLabel>
                                <FormControl>
                                  <BenefitsInput
                                      value={field.value || []}
                                      onChange={field.onChange}
                                      placeholder="Enter a benefit (e.g., Health Insurance, Flexible Hours)"
                                  />
                                </FormControl>
                                <FormDescription className="text-xs">
                                  Add benefits and perks to make this position more attractive to candidates
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                    </motion.div>

                    <Separator className="bg-border/50" />

                    {/* Additional Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">Additional Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="jobUrl"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">External Job URL</FormLabel>
                                  <FormControl>
                                    <Input
                                        placeholder="https://company.com/careers/job-id"
                                        className="rounded-lg border-border/50 hover:border-primary/50"
                                        {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    Link to apply on company website (optional)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-semibold">Expiry Date</FormLabel>
                                  <FormControl>
                                    <Input
                                        type="date"
                                        className="rounded-lg border-border/50 hover:border-primary/50"
                                        {...field}
                                    />
                                  </FormControl>
                                  <FormDescription className="text-xs">
                                    When this job posting should expire (optional)
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                    </motion.div>
                  </div>
                </Form>
              </CustomDialogBody>
          )}

          {/* Footer */}
          <CustomDialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting || isInitializing}
                className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting || isInitializing}
                className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {isSubmitting ? (
                  <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Save className="h-4 w-4" />
                  </motion.div>
              ) : (
                  <Save className="h-4 w-4" />
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CustomDialogFooter>
        </CustomDialogContent>
      </CustomDialog>
  )
}
