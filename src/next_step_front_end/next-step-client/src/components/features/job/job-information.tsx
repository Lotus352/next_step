"use client"

import {useEffect, useCallback} from "react"
import {useDispatch, useSelector} from "react-redux"
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
} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Skeleton} from "@/components/ui/skeleton"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {fetchJobById} from "@/store/slices/jobs-slice"
import {fetchApplicationInfoByJob} from "@/store/slices/job-applications-slice"
import type {AppDispatch, RootState} from "@/store/store"
import {formatTextEnum} from "@/lib/utils"

interface JobInformationProps {
    jobId: number
}

export default function JobInformation({jobId}: JobInformationProps) {
    const dispatch: AppDispatch = useDispatch()
    const job = useSelector((state: RootState) => state.jobs.selected)
    const information = useSelector((state: RootState) => state.jobApplications.info)
    const statuses = useSelector((state: RootState) => state.jobs.statuses)

    // Handle fetching job data
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

    const renderContent = () => {
        if (statuses.fetchingById === "loading" || !job) {
            return (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64 mb-4"/>
                    <Skeleton className="h-32 w-full"/>
                    <Skeleton className="h-64 w-full"/>
                </div>
            )
        }
        return (
            <Card className="border border-primary/20 shadow-sm">
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3"/>
                                {formatTextEnum(job.employmentType || "FULL_TIME")}
                            </Badge>
                            {job.location && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3"/>
                                    {job.location.city}, {job.location.countryName}
                                </Badge>
                            )}
                            {job.remoteAllowed && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Globe className="h-3 w-3"/>
                                    Remote
                                </Badge>
                            )}
                            {job.experienceLevels && job.experienceLevels.length > 0 && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3"/>
                                    {job.experienceLevels.map((level) => level.experienceName).join(", ")}
                                </Badge>
                            )}
                            {job.isFeatured && <Badge variant="secondary">Featured</Badge>}
                            {information && (
                                <Badge variant="outline"
                                       className="flex items-center gap-1 bg-primary/5 border-primary/20">
                                    <Users className="h-3 w-3"/>
                                    {information.countJobApplications} Applicants
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {job.salary && (
                            <div className="flex items-center p-4 border rounded-lg bg-card shadow-sm">
                                <DollarSign className="h-5 w-5 mr-3 text-primary"/>
                                <div>
                                    <div className="text-sm text-muted-foreground">Salary Range</div>
                                    <div className="font-medium">
                                        {job.salary.minSalary} - {job.salary.maxSalary} {job.salary.currency}
                                        <div
                                            className="text-xs text-muted-foreground">per {job.salary.payPeriod || "year"}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center p-4 border rounded-lg bg-card shadow-sm">
                            <Calendar className="h-5 w-5 mr-3 text-primary"/>
                            <div>
                                <div className="text-sm text-muted-foreground">Posted On</div>
                                <div className="font-medium">{new Date().toLocaleDateString()}</div>
                            </div>
                        </div>

                        {information && (
                            <div className="flex items-center p-4 border rounded-lg bg-card shadow-sm">
                                <Clock className="h-5 w-5 mr-3 text-primary"/>
                                <div>
                                    <div className="text-sm text-muted-foreground">Deadline</div>
                                    <div
                                        className="font-medium">{information.expiryDate ? new Date(information.expiryDate).toLocaleDateString() : "No deadline"}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="flex items-center">
                            <Building className="h-5 w-5 mr-3 text-primary"/>
                            <div>
                                <div className="text-sm text-muted-foreground">Posted By</div>
                                <div
                                    className="font-medium">{job.postedBy?.username || job.postedBy?.email || "Company Recruiter"}</div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4"/>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Short Description</h4>
                        <div className="prose max-w-none">
                            <p className="text-sm">{job.shortDescription || "No short description available"}</p>
                        </div>
                    </div>

                    <Separator className="my-4"/>

                    <div className="space-y-4">
                        <h4 className="font-semibold">Detailed Description</h4>
                        <div className="prose max-w-none border rounded-lg p-4 bg-card shadow-sm">
            <pre className="whitespace-pre-wrap text-sm">
              {job.detailedDescription ||
                  "We are looking for a talented and experienced developer to join our growing team. The ideal candidate will have strong technical skills and a passion for creating innovative solutions."}
            </pre>
                        </div>
                    </div>

                    {job.skills && job.skills.length > 0 && (
                        <>
                            <Separator className="my-4"/>
                            <div className="space-y-4">
                                <h4 className="font-semibold">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                                            <Tag className="h-3 w-3"/>
                                            {skill.skillName}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {information?.interviewProcess && information.interviewProcess > 0 && (
                        <>
                            <Separator className="my-4"/>
                            <div className="space-y-4">
                                <h4 className="font-semibold">Interview Process</h4>
                                <div className="prose max-w-none">
                                    <p className="text-sm">This job has a {information.interviewProcess}-stage interview
                                        process.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {job.jobUrl && (
                        <>
                            <Separator className="my-4"/>
                            <div className="space-y-4">
                                <h4 className="font-semibold">Apply</h4>
                                <div>
                                    <Button variant="outline" asChild className="shadow-sm">
                                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center">
                                            Apply on company website
                                            <ExternalLink className="ml-2 h-4 w-4"/>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <>{renderContent()}</>
    )
}
