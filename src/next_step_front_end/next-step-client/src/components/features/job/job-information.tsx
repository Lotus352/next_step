"use client"

import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    Briefcase,
    MapPin,
    Clock,
    Calendar,
    DollarSign,
    Users,
    GraduationCap,
    Globe,
    Building,
    Tag,
    ExternalLink,
    Sparkles,
    TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchJobById } from "@/store/slices/jobs-slice"
import { fetchApplicationInfoByJob } from "@/store/slices/job-applications-slice"
import type { AppDispatch, RootState } from "@/store/store"
import { formatTextEnum } from "@/lib/utils"
import { motion } from "framer-motion"

interface JobInformationProps {
    jobId: number
}

export default function JobInformation({ jobId }: JobInformationProps) {
    const dispatch: AppDispatch = useDispatch()

    const job = useSelector((state: RootState) => state.jobs.selected)
    const information = useSelector((state: RootState) => state.jobApplications.info)
    const statuses = useSelector((state: RootState) => state.jobs.statuses)

    const fetchJobData = useCallback(
        (jobId: number) => {
            dispatch(fetchJobById(jobId))
            dispatch(fetchApplicationInfoByJob(jobId))
        },
        [dispatch],
    )

    useEffect(() => {
        fetchJobData(jobId)
    }, [fetchJobData, jobId])

    useEffect(() => {
        if (statuses.fetchingById === "succeeded" && job) {
            console.log("Job Information Loaded", `Successfully loaded details for ${job.title}`)
        } else if (statuses.fetchingById === "failed") {
            console.error("Loading Failed", "Failed to load job information. Please try again.")
        }
    }, [statuses.fetchingById, job])

    const renderContent = () => {
        if (statuses.fetchingById === "loading" || !job) {
            return (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </motion.div>
            )
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]">
                    <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">{job.title}</CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 border-primary/20">
                                <Briefcase className="h-3 w-3" />
                                {formatTextEnum(job.employmentType || "FULL_TIME")}
                            </Badge>
                            {job.location && (
                                <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                                    <MapPin className="h-3 w-3" />
                                    {job.location.city}, {job.location.countryName}
                                </Badge>
                            )}
                            {job.remoteAllowed && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                                >
                                    <Globe className="h-3 w-3" />
                                    Remote
                                </Badge>
                            )}
                            {job.experienceLevels && job.experienceLevels.length > 0 && (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200"
                                >
                                    <GraduationCap className="h-3 w-3" />
                                    {job.experienceLevels.map((level) => level.experienceName).join(", ")}
                                </Badge>
                            )}
                            {job.isFeatured && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Featured
                                </Badge>
                            )}
                            {information && (
                                <Badge variant="outline" className="flex items-center gap-1 bg-primary/5 border-primary/20">
                                    <Users className="h-3 w-3" />
                                    {information.countJobApplications} Applicants
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {job.salary && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="group"
                                >
                                    <div className="flex items-center p-4 border rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                        <div className="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors duration-300">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-green-600 font-medium">Salary Range</div>
                                            <div className="font-bold text-green-800">
                                                {job.salary.minSalary} - {job.salary.maxSalary} {job.salary.currency}
                                            </div>
                                            <div className="text-xs text-green-600">per {job.salary.payPeriod || "year"}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="group"
                            >
                                <div className="flex items-center p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-blue-600 font-medium">Posted On</div>
                                        <div className="font-bold text-blue-800">
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {information && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="group"
                                >
                                    <div className="flex items-center p-4 border rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105">
                                        <div className="p-2 bg-amber-100 rounded-lg mr-3 group-hover:bg-amber-200 transition-colors duration-300">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-amber-600 font-medium">Deadline</div>
                                            <div className="font-bold text-amber-800">
                                                {information.expiryDate ? new Date(information.expiryDate).toLocaleDateString() : "No deadline"}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Posted By Section */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="p-4 border rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-center">
                                    <div className="p-2 bg-primary/10 rounded-lg mr-3">
                                        <Building className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground font-medium">Posted By</div>
                                        <div className="font-bold text-foreground">
                                            {job.postedBy?.username || job.postedBy?.email || "Company Recruiter"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <Separator className="bg-border/50" />

                        {/* Job Descriptions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                </div>
                                <h4 className="font-bold text-lg">Job Overview</h4>
                            </div>
                            <div className="prose max-w-none">
                                <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/30">
                                    {job.shortDescription || "No short description available"}
                                </p>
                            </div>
                        </motion.div>

                        <Separator className="bg-border/50" />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <h4 className="font-bold text-lg">Detailed Description</h4>
                            </div>
                            <div className="prose max-w-none border rounded-xl p-6 bg-gradient-to-br from-muted/20 to-muted/10 border-border/30 shadow-sm">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {job.detailedDescription ||
                      "We are looking for a talented and experienced professional to join our growing team. The ideal candidate will have strong technical skills and a passion for creating innovative solutions."}
                </pre>
                            </div>
                        </motion.div>

                        {/* Skills Section */}
                        {job.skills && job.skills.length > 0 && (
                            <>
                                <Separator className="bg-border/50" />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Tag className="h-4 w-4 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg">Required Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <motion.div
                                                key={skill.skillId}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="flex items-center gap-1 hover:bg-primary/10 transition-all duration-300 hover:scale-105 border-primary/20 bg-gradient-to-r from-background to-muted/30 px-3 py-2"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                                                    {skill.skillName}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Interview Process */}
                        {information?.interviewProcess && information.interviewProcess > 0 && (
                            <>
                                <Separator className="bg-border/50" />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Users className="h-4 w-4 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg">Interview Process</h4>
                                    </div>
                                    <div className="prose max-w-none">
                                        <p className="text-sm bg-blue-50 text-blue-700 p-4 rounded-lg border border-blue-200">
                                            This job has a {information.interviewProcess}-stage interview process.
                                        </p>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* External Application Link */}
                        {job.jobUrl && (
                            <>
                                <Separator className="bg-border/50" />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <ExternalLink className="h-4 w-4 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg">Apply Externally</h4>
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline"
                                            asChild
                                            className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 bg-gradient-to-r hover:from-primary/10 hover:to-primary/5"
                                        >
                                            <a
                                                href={job.jobUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2"
                                            >
                                                Apply on company website
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return <>{renderContent()}</>
}
