"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, X, DollarSign, Briefcase, Globe, Tag, Crown, CheckCircle, XCircle } from "lucide-react"
import type { AppDispatch, RootState } from "@/store/store"
import { updateJob, fetchEmploymentTypes, filterJobs } from "@/store/slices/jobs-slice"
import type JobType from "@/types/job-type"
import type { JobRequest } from "@/types/job-type"
import { mapJobTypeToJobRequest } from "@/types/mappers/job-mapper.ts"
import { formatTextEnum } from "@/lib/utils"
import { DEFAULT_JOB_SIZE, DEFAULT_PAGE } from "@/constants"

interface JobEditModalProps {
    job: JobType | null
    isOpen: boolean
    onClose: () => void
    isAdmin: boolean
    onSaveSuccess?: () => void // Callback để refresh data
}

export function JobEditModal({ job, isOpen, onClose, isAdmin, onSaveSuccess }: JobEditModalProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { employmentTypes, statuses, filter } = useSelector((state: RootState) => state.jobs)
    const [formData, setFormData] = useState<Partial<JobRequest>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Initialize form data when job changes
    useEffect(() => {
        if (job) {
            const jobRequest = mapJobTypeToJobRequest(job)
            setFormData(jobRequest)
        }
    }, [job])

    // Fetch employment types when modal opens
    useEffect(() => {
        if (isOpen && employmentTypes.length === 0) {
            dispatch(fetchEmploymentTypes())
        }
    }, [isOpen, employmentTypes.length, dispatch])

    const handleSave = async () => {
        if (!job || !formData) return

        setIsLoading(true)
        try {
            // Use unwrap() to get the actual result and handle errors properly
            await dispatch(
                updateJob({
                    id: job.jobId,
                    jobData: formData as JobRequest,
                }),
            ).unwrap()

            // Close modal first
            onClose()

            // Refresh the jobs list with current filter
            if (onSaveSuccess) {
                onSaveSuccess()
            } else {
                // Fallback: refresh jobs with current filter
                await dispatch(
                    filterJobs({
                        page: DEFAULT_PAGE,
                        size: DEFAULT_JOB_SIZE,
                        filter: filter || {
                            keyword: null,
                            sortBy: "createdAt",
                            sortDirection: "DESC",
                            country: null,
                            city: null,
                            employmentType: null,
                            experienceLevels: [],
                            salaryRange: {
                                minSalary: null,
                                maxSalary: null,
                            },
                            payPeriod: null,
                            currency: null,
                            skills: [],
                            datePosted: null,
                        },
                    }),
                ).unwrap()
            }
        } catch (error: any) {
            console.error("Failed to update job:", error)
            // Don't close modal on error, let user retry
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof JobRequest, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSalaryChange = (field: "minSalary" | "maxSalary" | "currency" | "payPeriod", value: any) => {
        setFormData((prev) => ({
            ...prev,
            salary: {
                ...prev.salary!,
                [field]: value,
            },
        }))
    }

    if (!job) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DialogHeader className="pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-2xl font-bold">Edit Job Posting</DialogTitle>
                                        <p className="text-muted-foreground mt-1">Update job details and settings</p>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <Card className="border-border/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Tag className="h-4 w-4" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="title">Job Title</Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title || ""}
                                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                                    placeholder="Enter job title"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="employmentType">Employment Type</Label>
                                                <Select
                                                    value={formData.employmentType || ""}
                                                    onValueChange={(value) => handleInputChange("employmentType", value)}
                                                    disabled={statuses.fetchingEmploymentTypes === "loading"}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={
                                                                statuses.fetchingEmploymentTypes === "loading" ? "Loading..." : "Select employment type"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employmentTypes.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {formatTextEnum(type)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shortDescription">Short Description</Label>
                                            <Textarea
                                                id="shortDescription"
                                                value={formData.shortDescription || ""}
                                                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                                                placeholder="Brief job summary"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="detailedDescription">Detailed Description</Label>
                                            <Textarea
                                                id="detailedDescription"
                                                value={formData.detailedDescription || ""}
                                                onChange={(e) => handleInputChange("detailedDescription", e.target.value)}
                                                placeholder="Comprehensive job description"
                                                rows={6}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Salary Information */}
                                <Card className="border-border/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <DollarSign className="h-4 w-4" />
                                            Salary Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="minSalary">Min Salary</Label>
                                                <Input
                                                    id="minSalary"
                                                    type="number"
                                                    value={formData.salary?.minSalary || ""}
                                                    onChange={(e) => handleSalaryChange("minSalary", Number(e.target.value))}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="maxSalary">Max Salary</Label>
                                                <Input
                                                    id="maxSalary"
                                                    type="number"
                                                    value={formData.salary?.maxSalary || ""}
                                                    onChange={(e) => handleSalaryChange("maxSalary", Number(e.target.value))}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="currency">Currency</Label>
                                                <Select
                                                    value={formData.salary?.currency || ""}
                                                    onValueChange={(value) => handleSalaryChange("currency", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Currency" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="USD">USD</SelectItem>
                                                        <SelectItem value="EUR">EUR</SelectItem>
                                                        <SelectItem value="GBP">GBP</SelectItem>
                                                        <SelectItem value="VND">VND</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="payPeriod">Pay Period</Label>
                                                <Select
                                                    value={formData.salary?.payPeriod || ""}
                                                    onValueChange={(value) => handleSalaryChange("payPeriod", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Period" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="hour">Hour</SelectItem>
                                                        <SelectItem value="month">Month</SelectItem>
                                                        <SelectItem value="year">Year</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Job Settings */}
                                <Card className="border-border/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Globe className="h-4 w-4" />
                                            Job Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <Label className="text-sm font-medium">Remote Work</Label>
                                                    <p className="text-xs text-muted-foreground">Allow remote work for this position</p>
                                                </div>
                                                <Switch
                                                    checked={formData.remoteAllowed || false}
                                                    onCheckedChange={(checked) => handleInputChange("remoteAllowed", checked)}
                                                />
                                            </div>

                                            {isAdmin && (
                                                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200">
                                                    <div className="space-y-1">
                                                        <Label className="text-sm font-medium flex items-center gap-2">
                                                            <Crown className="h-4 w-4 text-amber-600" />
                                                            Featured Job
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">Highlight this job in featured sections</p>
                                                    </div>
                                                    <Switch
                                                        checked={Boolean(formData.isFeatured)}
                                                        onCheckedChange={(checked) => handleInputChange("isFeatured", checked ? 1 : 0)}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Job Status</Label>
                                                <Select
                                                    value={formData.status || ""}
                                                    onValueChange={(value) => handleInputChange("status", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="OPEN">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                Open
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="CLOSED">
                                                            <div className="flex items-center gap-2">
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                                Closed
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                                <Input
                                                    id="expiryDate"
                                                    type="date"
                                                    value={formData.expiryDate?.split(" ")[0] || ""}
                                                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="jobUrl">External Job URL</Label>
                                            <Input
                                                id="jobUrl"
                                                type="url"
                                                value={formData.jobUrl || ""}
                                                onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                                                placeholder="https://company.com/careers/job-id"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="benefits">Benefits</Label>
                                            <Textarea
                                                id="benefits"
                                                value={formData.benefits || ""}
                                                onChange={(e) => handleInputChange("benefits", e.target.value)}
                                                placeholder="List benefits separated by | (e.g., Health Insurance|Flexible Hours|Remote Work)"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <DialogFooter className="pt-6 border-t">
                                <div className="flex items-center gap-3 w-full">
                                    <Button variant="outline" onClick={onClose} className="flex-1 gap-2">
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                            >
                                                <Save className="h-4 w-4" />
                                            </motion.div>
                                        ) : (
                                            <Save className="h-4 w-4" />
                                        )}
                                        Save Changes
                                    </Button>
                                </div>
                            </DialogFooter>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}
