"use client"

import { useSelector, useDispatch } from "react-redux"
import {
  Download,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Code,
  ExternalLink,
  Building,
  Trophy,
  Star,
  Link2,
  Check,
  X,
  ArrowRight,
  BarChart,
  Globe,
  Zap,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { RootState } from "@/store/store"
import type { ResumeContent } from "@/types/resume-content-type"
import type JobApplicationType from "@/types/job-application-type"
import type { ScoreData, SkillMatch, CertMatch } from "@/types/job-application-type"
import type JobType from "@/types/job-type"
import { motion } from "framer-motion"
import { formatTextEnum } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import SkillType from "@/types/skill-type"
import type { AppDispatch } from "@/store/store"
import {updateApplicationStatus} from "@/store/slices/job-applications-slice.ts";

export default function ApplicationDetail() {
  const dispatch: AppDispatch = useDispatch()

  const application = useSelector((state: RootState) => state.jobApplications.selected) as JobApplicationType | null
  const job = useSelector((state: RootState) => state.jobs.selected) as JobType | null
  const statuses = useSelector((state: RootState) => state.jobApplications.statuses)

  const parseScoreData = (score: string | ScoreData | null): ScoreData | null => {
    if (!score) return null

    if (typeof score === "string") {
      try {
        // Try to parse as JSON first
        return JSON.parse(score) as ScoreData
      } catch (e) {
        console.log(e)
        // If it's the old format (comma-separated values)
        const scores = score.split(",").map((s) => Number.parseInt(s, 10) || 0)
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length / 100 : 0

        // Create a simplified version of the new structure
        return {
          score: avgScore,
          details: {
            skill_score: `${scores[0] || 0}/100`,
            cert_score: `${scores[1] || 0}/100`,
            exp_score: `${scores[2] || 0}/100`,
            exp_match: 0,
            exp_detail: {
              cv_level: "Unknown",
              jd_required_levels: [],
              match: 0,
            },
            skills_detail: [],
            certs_detail: [],
          },
        }
      }
    }

    // It's already a ScoreData object
    return score
  }

  const parseRatioToPercentage = (ratio: string): number => {
    const parts = ratio.split("/")
    if (parts.length !== 2) return 0

    const numerator = Number.parseInt(parts[0], 10)
    const denominator = Number.parseInt(parts[1], 10)

    if (denominator === 0) return 0 // Avoid division by zero
    return Math.round((numerator / denominator) * 100)
  }

  const parseResumeContent = (content: string | null): ResumeContent | null => {
    if (!content) return null
    try {
      return JSON.parse(content) as ResumeContent
    } catch (error) {
      console.error("Failed to parse resume content:", error)
      return null
    }
  }

  const groupSkillsByCategory = (skills: (string | SkillType)[]) => {
    const categories: Record<string, (string | SkillType)[]> = {}

    skills.forEach((skill) => {
      if (typeof skill === "string") {
        const match = skill.match(/(.*) \$\$(.*)\$\$/)
        if (match) {
          const [, skillName, category] = match
          if (!categories[category]) {
            categories[category] = []
          }
          categories[category].push(skillName)
        } else {
          if (!categories["Other"]) {
            categories["Other"] = []
          }
          categories["Other"].push(skill)
        }
      } else {
        // Handle SkillType objects
        if (!categories["Skills"]) {
          categories["Skills"] = []
        }
        categories["Skills"].push(skill)
      }
    })

    return categories
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    if (score >= 0.4) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500"
    if (score >= 0.6) return "bg-yellow-500"
    if (score >= 0.4) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "PENDING":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-500/10 text-green-600 border-green-200"
      case "PENDING":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "REJECTED":
        return "bg-red-500/10 text-red-600 border-red-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const sortSkillsByScore = (skills: SkillMatch[]): SkillMatch[] => {
    return [...skills].sort((a, b) => {
      // First sort by match (1 before 0)
      if (a.match !== b.match) {
        return b.match - a.match
      }
      // Then sort by score (higher scores first)
      return b.score - a.score
    })
  }

  const sortCertsByScore = (certs: CertMatch[]): CertMatch[] => {
    return [...certs].sort((a, b) => {
      // First sort by match (1 before 0)
      if (a.match !== b.match) {
        return b.match - a.match
      }
      // Then sort by score difference (higher scores first)
      const aScoreDiff = Number(a.cv_score) - Number(a.jd_score)
      const bScoreDiff = Number(b.cv_score) - Number(b.jd_score)
      return bScoreDiff - aScoreDiff
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;
    try {
      await dispatch(updateApplicationStatus({ id: application.applicationId, status: newStatus })).unwrap()
      toast.success(`Application status updated to ${newStatus}`)
    } catch (error) {
      console.log(error)
      toast.error("Failed to update application status")
    }
  }

  if (statuses.filtering === "loading" || !application) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full md:col-span-2" />
        </div>
      </div>
    )
  }

  const scoreData = parseScoreData(application.score)
  const overallScore = scoreData?.score || 0
  const scorePercentage = Math.round(overallScore * 100)
  const resumeContent = parseResumeContent(application.resumeContent)
  const skillsByCategory = resumeContent?.skills ? groupSkillsByCategory(resumeContent.skills) : {}

  const skillScorePercentage = scoreData?.details.skill_score
    ? parseRatioToPercentage(scoreData.details.skill_score)
    : 0
  const certScorePercentage = scoreData?.details.cert_score ? parseRatioToPercentage(scoreData.details.cert_score) : 0
  const expScorePercentage = scoreData?.details.exp_score ? parseRatioToPercentage(scoreData.details.exp_score) : 0

  const sortedSkills = scoreData?.details.skills_detail ? sortSkillsByScore(scoreData.details.skills_detail) : []
  const matchedSkills = sortedSkills.filter((skill) => skill.match === 1)
  const partialMatchSkills = sortedSkills.filter((skill) => skill.match === 0 && skill.score > 0.3)
  const unmatchedSkills = sortedSkills.filter((skill) => skill.match === 0 && skill.score <= 0.3)

  const sortedCerts = scoreData?.details.certs_detail ? sortCertsByScore(scoreData.details.certs_detail) : []
  const matchedCerts = sortedCerts.filter((cert) => cert.match === 1)
  const partialMatchCerts = sortedCerts.filter(
    (cert) => cert.match === 0 && Number(cert.cv_score) >= Number(cert.jd_score) * 0.8,
  )
  const unmatchedCerts = sortedCerts.filter(
    (cert) => cert.match === 0 && Number(cert.cv_score) < Number(cert.jd_score) * 0.8,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border border-primary/20 shadow-sm overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                {application.applicant.avatarUrl ? (
                  <AvatarImage
                    src={application.applicant.avatarUrl || "/placeholder.svg"}
                    alt={application.applicant.fullName || ""}
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(application.applicant.fullName || "")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{application.applicant.fullName}</h2>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  {application.applicant.email}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`px-3 py-1 ${getStatusColor(application.status)}`}>
                    <span className="flex items-center">
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{getStatusLabel(application.status)}</span>
                    </span>
                  </Badge>
                  {resumeContent?.experienceLevel && (
                    <Badge variant="outline" className="px-3 py-1">
                      {resumeContent.experienceLevel}
                    </Badge>
                  )}
                  {scoreData && (
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 ${
                        overallScore >= 0.7
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                          : overallScore >= 0.5
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                      }`}
                    >
                      <span className="flex items-center">
                        <BarChart className="h-3.5 w-3.5 mr-1" />
                        Match: {scorePercentage}%
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" asChild className="shadow-sm">
                <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Resume
                </a>
              </Button>
              <Button variant="default" size="sm" asChild className="shadow-sm">
                <a href={application.resumeUrl} download className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("ACCEPTED")}>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")}>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Mark as Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {job && (
        <Card className="border border-primary/20 shadow-sm">
          <CardHeader className="pb-2 bg-primary/5">
            <CardTitle className="flex items-center text-lg">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Applied for: {job.title}
            </CardTitle>
            {job.shortDescription && <CardDescription>{job.shortDescription}</CardDescription>}
          </CardHeader>
          <CardContent className="pt-4 flex flex-wrap gap-3">
            {job.location && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {job.location.city}, {job.location.countryName}
              </Badge>
            )}
            {job.employmentType && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {formatTextEnum(job.employmentType)}
              </Badge>
            )}
            {job.remoteAllowed && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Remote
              </Badge>
            )}
            {job.experienceLevels && job.experienceLevels.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {job.experienceLevels.map((level) => level.experienceName).join(", ")}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="overflow-hidden border border-primary/20 shadow-md">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="flex items-center text-lg">
                <User className="h-5 w-5 mr-2 text-primary" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                {application.applicant.phoneNumber && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-primary/70" />
                    <span className="text-sm">{application.applicant.phoneNumber}</span>
                  </div>
                )}
                {application.applicant.nationality && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-primary/70" />
                    <span className="text-sm">{application.applicant.nationality}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-primary/70" />
                  <span className="text-sm">Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-primary/20 shadow-md">
            <CardHeader className="pb-2 bg-primary/5">
              <CardTitle className="flex items-center text-lg">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Match Score
              </CardTitle>
              <CardDescription>Overall match with job requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#7C3AED" />
                      </linearGradient>
                    </defs>
                    <circle
                      className="text-gray-100 dark:text-gray-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      stroke="url(#scoreGradient)"
                      strokeWidth="10"
                      strokeDasharray={`${scorePercentage * 2.76} 276`}
                      strokeLinecap="round"
                      fill="transparent"
                      r="44"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                      className="drop-shadow-md"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      {scorePercentage}%
                    </span>
                    <span className="text-xs text-muted-foreground">Match</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">Skills</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">
                        {scoreData?.details.skill_score || "0/0"}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(skillScorePercentage / 100)}`}>
                        {skillScorePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <div
                        style={{ width: `${skillScorePercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                      <span className="text-sm font-medium">Certifications</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">
                        {scoreData?.details.cert_score || "0/0"}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(certScorePercentage / 100)}`}>
                        {certScorePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <div
                        style={{ width: `${certScorePercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                      <span className="text-sm font-medium">Experience</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">
                        {scoreData?.details.exp_score || "0/0"}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(expScorePercentage / 100)}`}>
                        {expScorePercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <div
                        style={{ width: `${expScorePercentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {scoreData?.details.exp_detail && (
            <Card className="overflow-hidden border border-primary/20 shadow-md">
              <CardHeader className="pb-2 bg-primary/5">
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Experience Level
                </CardTitle>
                <CardDescription>Comparison between candidate's experience level and job requirements</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 items-center mb-3">
                    <div className="text-sm font-medium">Candidate Level: </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium">Required Level: </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-start">
                    <div className="text-lg font-semibold">{scoreData.details.exp_detail.cv_level}</div>
                    <div className="flex justify-center">
                      <div className="w-full bg-muted-foreground/20"></div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scoreData.details.exp_detail.jd_required_levels.map((level, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 mt-4">
                  <span className="text-sm font-medium">Experience Match</span>
                  <Badge
                    variant="outline"
                    className={
                      scoreData.details.exp_match === 1
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300"
                    }
                  >
                    {scoreData.details.exp_match === 1 ? "Match" : "No Match"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="border border-primary/20 shadow-md overflow-hidden">
            <Tabs defaultValue="resume">
              <CardHeader className="pb-2 bg-primary/5">
                <TabsList className="w-full grid grid-cols-5 bg-background/80 backdrop-blur-sm">
                  <TabsTrigger value="resume">Resume</TabsTrigger>
                  <TabsTrigger value="skills-match">Skills Match</TabsTrigger>
                  <TabsTrigger value="cert-match">Cert Match</TabsTrigger>
                  <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  <TabsTrigger value="comparison">Job Match</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="p-0">
                <TabsContent value="resume" className="m-0 p-6">
                  {resumeContent ? (
                    <div className="space-y-6">
                      {resumeContent.summary && (
                        <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm italic">{resumeContent.summary}</p>
                          </CardContent>
                        </Card>
                      )}

                      {resumeContent.workExperience && resumeContent.workExperience.length > 0 && (
                        <Card className="border-primary/20">
                          <CardHeader className="pb-2 bg-primary/5">
                            <CardTitle className="text-base flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-primary" />
                              Work Experience
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            {resumeContent.workExperience.map((exp, index) => (
                              <motion.div
                                key={index}
                                className={`${index > 0 ? "pt-4 border-t" : ""} relative pl-4`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full"></div>
                                <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-sm">{exp.role}</h4>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Building className="h-3 w-3 mr-1" />
                                      {exp.company}
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs bg-primary/5">
                                    {exp.duration}
                                  </Badge>
                                </div>
                                <p className="text-sm mt-2">{exp.description}</p>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {resumeContent.education && resumeContent.education.length > 0 && (
                        <Card className="border-primary/20">
                          <CardHeader className="pb-2 bg-primary/5">
                            <CardTitle className="text-base flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                              Education
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            {resumeContent.education.map((edu, index) => (
                              <motion.div
                                key={index}
                                className={index > 0 ? "pt-4 border-t" : ""}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <h4 className="font-medium text-sm">{edu.degree}</h4>
                                <div className="text-sm text-muted-foreground">{edu.school}</div>
                                <Badge variant="outline" className="text-xs mt-1 bg-primary/5">
                                  Graduation: {edu.graduationYear}
                                </Badge>
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      {resumeContent.projects && resumeContent.projects.length > 0 && (
                        <Card className="border-primary/20">
                          <CardHeader className="pb-2 bg-primary/5">
                            <CardTitle className="text-base flex items-center">
                              <Code className="h-4 w-4 mr-2 text-primary" />
                              Projects
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6 pt-4">
                            {resumeContent.projects.map((project, index) => (
                              <motion.div
                                key={index}
                                className={`${index > 0 ? "pt-4 border-t" : ""} group`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                                    {project.name}
                                  </h4>
                                  <Badge variant="outline" className="text-xs bg-primary/5">
                                    {project.role}
                                  </Badge>
                                </div>
                                <p className="text-sm mt-1">{project.description}</p>

                                {project.url && (
                                  <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary flex items-center mt-2 hover:underline group-hover:text-primary/80 transition-colors"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Project
                                  </a>
                                )}
                              </motion.div>
                            ))}
                          </CardContent>
                        </Card>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(skillsByCategory).length > 0 && (
                          <Card className="border-primary/20">
                            <CardHeader className="pb-2 bg-primary/5">
                              <CardTitle className="text-base flex items-center">
                                <Award className="h-4 w-4 mr-2 text-primary" />
                                Skills
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="space-y-4">
                                {Object.entries(skillsByCategory).map(([category, skills]) => (
                                  <motion.div
                                    key={category}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                  >
                                    <h4 className="text-sm font-medium mb-2 text-primary/80">{category}</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {skills.map((skill, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs hover:bg-primary/5 transition-colors"
                                        >
                                          {typeof skill === "string" ? skill : skill.skillName}
                                        </Badge>
                                      ))}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {resumeContent.certifications && resumeContent.certifications.length > 0 && (
                          <Card className="border-primary/20">
                            <CardHeader className="pb-2 bg-primary/5">
                              <CardTitle className="text-base flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                Certifications
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                {resumeContent.certifications.map((cert, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex justify-between items-center p-2 rounded-md hover:bg-primary/5 transition-colors"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                  >
                                    <span className="text-sm flex items-center">
                                      <Star className="h-3 w-3 mr-1.5 text-amber-500" />
                                      {cert.name}
                                    </span>
                                    {cert.score && (
                                      <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-700">
                                        Score: {cert.score}
                                      </Badge>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {resumeContent.awards && resumeContent.awards.length > 0 && (
                        <Card className="border-primary/20">
                          <CardHeader className="pb-2 bg-primary/5">
                            <CardTitle className="text-base flex items-center">
                              <Trophy className="h-4 w-4 mr-2 text-primary" />
                              Awards
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              {resumeContent.awards.map((award, index) => (
                                <motion.div
                                  key={index}
                                  className="flex justify-between items-center p-2 rounded-md hover:bg-primary/5 transition-colors"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div>
                                    <span className="text-sm font-medium">{award.name}</span>
                                    {award.issuer && (
                                      <div className="text-xs text-muted-foreground">{award.issuer}</div>
                                    )}
                                  </div>
                                  {award.date && (
                                    <Badge variant="outline" className="text-xs">
                                      {award.date}
                                    </Badge>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                      <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No resume content available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills-match" className="m-0 p-6">
                  {scoreData?.details.skills_detail && scoreData.details.skills_detail.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-green-700 dark:text-green-300">
                              <Check className="h-4 w-4 mr-2" />
                              Exact Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                              {matchedSkills.length}
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              skills exactly match job requirements
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-yellow-700 dark:text-yellow-300">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Partial Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                              {partialMatchSkills.length}
                            </div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              skills partially match job requirements
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-red-700 dark:text-red-300">
                              <X className="h-4 w-4 mr-2" />
                              No Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                              {unmatchedSkills.length}
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              skills don't match job requirements
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2 bg-primary/5">
                          <CardTitle className="text-base flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            All Skills Matching
                          </CardTitle>
                          <CardDescription>
                            Complete list of candidate skills and their match with job requirements
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Candidate Skill
                                  </th>
                                  <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Job Requirement
                                  </th>
                                  <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Match
                                  </th>
                                  <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Score
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedSkills.map((skill, index) => (
                                  <tr
                                    key={index}
                                    className={`border-b ${
                                      index % 2 === 0 ? "bg-muted/20" : ""
                                    } hover:bg-muted/30 transition-colors`}
                                  >
                                    <td className="py-2 px-3 text-sm">{skill.cv_skill}</td>
                                    <td className="py-2 px-3 text-sm">{skill.jd_skill}</td>
                                    <td className="py-2 px-3 text-center">
                                      {skill.match === 1 ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                          <Check className="h-3.5 w-3.5 mr-1" />
                                          Match
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                          <X className="h-3.5 w-3.5 mr-1" />
                                          No Match
                                        </Badge>
                                      )}
                                    </td>
                                    <td className="py-2 px-3">
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                          <div
                                            className={`h-2.5 rounded-full ${getScoreBackgroundColor(skill.score)}`}
                                            style={{ width: `${Math.round(skill.score * 100)}%` }}
                                          ></div>
                                        </div>
                                        <span className={`text-xs font-medium ${getScoreColor(skill.score)}`}>
                                          {Math.round(skill.score * 100)}%
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                      <Award className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No skills match data available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cert-match" className="m-0 p-6">
                  {scoreData?.details.certs_detail && scoreData.details.certs_detail.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-green-700 dark:text-green-300">
                              <Check className="h-4 w-4 mr-2" />
                              Exact Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                              {matchedCerts.length}
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              certifications exactly match job requirements
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-yellow-700 dark:text-yellow-300">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Partial Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                              {partialMatchCerts.length}
                            </div>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              certifications partially match job requirements
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center text-red-700 dark:text-red-300">
                              <X className="h-4 w-4 mr-2" />
                              No Matches
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-red-700 dark:text-red-300">
                              {unmatchedCerts.length}
                            </div>
                            <p className="text-sm text-red-600 dark:text-red-400">
                              certifications don't match job requirements
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2 bg-primary/5">
                          <CardTitle className="text-base flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-primary" />
                            All Certification Matching
                          </CardTitle>
                          <CardDescription>
                            Complete list of candidate certifications and their match with job requirements
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Candidate Certification
                                  </th>
                                  <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Job Requirement
                                  </th>
                                  <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Required Score
                                  </th>
                                  <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Candidate Score
                                  </th>
                                  <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">
                                    Match
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {sortedCerts.map((cert, index) => (
                                  <tr
                                    key={index}
                                    className={`border-b ${
                                      index % 2 === 0 ? "bg-muted/20" : ""
                                    } hover:bg-muted/30 transition-colors`}
                                  >
                                    <td className="py-2 px-3 text-sm">{cert.cv_cert}</td>
                                    <td className="py-2 px-3 text-sm">{cert.jd_cert}</td>
                                    <td className="py-2 px-3 text-sm text-center">{cert.jd_score}</td>
                                    <td className="py-2 px-3 text-sm text-center">
                                      <span
                                        className={
                                          Number(cert.cv_score) >= Number(cert.jd_score)
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {cert.cv_score}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                      {cert.match === 1 ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                          <Check className="h-3.5 w-3.5 mr-1" />
                                          Match
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                          <X className="h-3.5 w-3.5 mr-1" />
                                          No Match
                                        </Badge>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No certification match data available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cover-letter" className="m-0 p-6">
                  <div className="prose max-w-none">
                    {application.coverLetter ? (
                      <div className="bg-muted/20 p-6 rounded-md max-h-[600px] overflow-y-auto border border-primary/10">
                        <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                          {application.coverLetter}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                        <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No cover letter provided</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="comparison" className="m-0 p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border-dashed border-primary/20 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Award className="h-4 w-4 mr-2 text-blue-500" />
                            Skills Match
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Match Score</span>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">
                                {scoreData?.details.skill_score || "0/0"}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${getScoreColor(skillScorePercentage / 100)} bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm`}
                              >
                                {skillScorePercentage}%
                              </Badge>
                            </div>
                          </div>
                          <div className="relative pt-1 mb-4">
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100 dark:bg-blue-900/30">
                              <div
                                style={{ width: `${skillScorePercentage}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {skillScorePercentage >= 70
                              ? "Candidate's skills align well with job requirements"
                              : skillScorePercentage >= 40
                                ? "Candidate has some relevant skills but may need training"
                                : "Candidate's skills don't match job requirements"}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-dashed border-primary/20 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                            Certification Match
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Match Score</span>
                            <div className="flex items-center">
                              <span className="text-xs text-muted-foreground mr-2">
                                {scoreData?.details.cert_score || "0/0"}
                              </span>
                              <Badge
                                variant="outline"
                                className={`${getScoreColor(certScorePercentage / 100)} bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm`}
                              >
                                {certScorePercentage}%
                              </Badge>
                            </div>
                          </div>
                          <div className="relative pt-1 mb-4">
                            <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100 dark:bg-purple-900/30">
                              <div
                                style={{ width: `${certScorePercentage}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {certScorePercentage >= 70
                              ? "Candidate has all required certifications"
                              : certScorePercentage >= 40
                                ? "Candidate has some relevant certifications"
                                : "Candidate lacks required certifications"}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-dashed border-primary/20 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                          Experience Match
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Match Score</span>
                          <div className="flex items-center">
                            <span className="text-xs text-muted-foreground mr-2">
                              {scoreData?.details.exp_score || "0/0"}
                            </span>
                            <Badge
                              variant="outline"
                              className={`${getScoreColor(expScorePercentage / 100)} bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm`}
                            >
                              {expScorePercentage}%
                            </Badge>
                          </div>
                        </div>
                        <div className="relative pt-1 mb-4">
                          <div className="overflow-hidden h-2 text-xs flex rounded-full bg-amber-100 dark:bg-amber-900/30">
                            <div
                              style={{ width: `${expScorePercentage}%` }}
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {expScorePercentage >= 70
                            ? "Candidate has extensive relevant experience"
                            : expScorePercentage >= 40
                              ? "Candidate has moderate relevant experience"
                              : "Candidate has limited relevant experience"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20">
                      <CardHeader className="pb-2 bg-primary/5">
                        <CardTitle className="text-base flex items-center">
                          <Link2 className="h-4 w-4 mr-2 text-primary" />
                          Recommended Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {scorePercentage >= 70 ? (
                            <>
                              <div className="flex items-center p-2 rounded-md bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm">Schedule an interview with this candidate</span>
                              </div>
                              <div className="flex items-center p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="text-sm">Send a personalized follow-up email</span>
                              </div>
                            </>
                          ) : scorePercentage >= 50 ? (
                            <>
                              <div className="flex items-center p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm">Consider for a technical assessment</span>
                              </div>
                              <div className="flex items-center p-2 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="text-sm">Request additional information</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center p-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                                <XCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm">Consider rejecting this application</span>
                              </div>
                              <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="text-sm">Send a polite rejection email</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
            <CardFooter className="bg-primary/5 py-3 px-6 flex justify-between">
              <div className="text-xs text-muted-foreground">Application ID: {application.applicationId}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Contact
                </Button>
                <Button variant="default" size="sm" className="h-8">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Schedule Interview
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
