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
  Building,
  Star,
  BarChart,
  Globe,
  MoreVertical,
  Sparkles,
  Code,
  ExternalLink,
  Trophy,
  Check,
  X,
  Zap,
  Link,
  GitBranch,
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
import { motion, AnimatePresence } from "framer-motion"
import { formatTextEnum } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type SkillType from "@/types/skill-type"
import type { AppDispatch } from "@/store/store"
import { updateApplicationStatus } from "@/store/slices/job-applications-slice"

export default function ApplicationDetail() {
  const dispatch: AppDispatch = useDispatch()

  const application = useSelector((state: RootState) => state.jobApplications.selected) as JobApplicationType | null
  const job = useSelector((state: RootState) => state.jobs.selected) as JobType | null
  const statuses = useSelector((state: RootState) => state.jobApplications.statuses)

  const parseScoreData = (score: string | ScoreData | null): ScoreData | null => {
    if (!score) return null

    if (typeof score === "string") {
      try {
        return JSON.parse(score) as ScoreData
      } catch (e) {
        console.log(e)
        const scores = score.split(",").map((s) => Number.parseInt(s, 10) || 0)
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length / 100 : 0

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

    return score
  }

  const parseRatioToPercentage = (ratio: string): number => {
    const parts = ratio.split("/")
    if (parts.length !== 2) return 0

    const numerator = Number.parseInt(parts[0], 10)
    const denominator = Number.parseInt(parts[1], 10)

    if (denominator === 0) return 0
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
      if (a.match !== b.match) {
        return b.match - a.match
      }
      return b.score - a.score
    })
  }

  const sortCertsByScore = (certs: CertMatch[]): CertMatch[] => {
    return [...certs].sort((a, b) => {
      if (a.match !== b.match) {
        return b.match - a.match
      }
      const aScoreDiff = Number(a.cv_score) - Number(a.jd_score)
      const bScoreDiff = Number(b.cv_score) - Number(b.jd_score)
      return bScoreDiff - aScoreDiff
    })
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return
    try {
      await dispatch(updateApplicationStatus({ id: application.applicationId, status: newStatus })).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  if (statuses.filtering === "loading" || !application) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full md:col-span-2" />
          </div>
        </motion.div>
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

  const unmatchedCerts = sortedCerts.filter(
      (cert) => cert.match === 0 && Number(cert.cv_score) < Number(cert.jd_score) * 0.8,
  )

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        {/* Enhanced Header Card */}
        <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01] shadow-lg">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border-b border-border/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-105">
                    {application.applicant.avatarUrl ? (
                      <AvatarImage
                        src={
                          application.applicant.avatarUrl || "/placeholder.svg"
                        }
                        alt={application.applicant.fullName || ""}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                        {getInitials(application.applicant.fullName || "")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-foreground">
                      {application.applicant.fullName}
                    </h2>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {application.applicant.email}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge
                        className={`px-3 py-2 font-semibold ${getStatusColor(application.status)}`}
                      >
                        <span className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span>{getStatusLabel(application.status)}</span>
                        </span>
                      </Badge>
                      {resumeContent?.experienceLevel && (
                        <Badge
                          variant="outline"
                          className="px-3 py-2 bg-primary/5 border-primary/20"
                        >
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {resumeContent.experienceLevel}
                        </Badge>
                      )}
                      {scoreData && (
                        <Badge
                          variant="outline"
                          className={`px-3 py-2 font-semibold ${
                            overallScore >= 0.7
                              ? "bg-green-50 text-green-700 border-green-200"
                              : overallScore >= 0.5
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <BarChart className="h-3 w-3" />
                            Match: {scorePercentage}%
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <a
                      href={application.resumeUrl}
                      download
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border-border/50 shadow-lg"
                    >
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("ACCEPTED")}
                        className="hover:bg-green-50 hover:text-green-700 transition-colors duration-200 rounded-lg mx-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        Accept
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("REJECTED")}
                        className="hover:bg-red-50 hover:text-red-700 transition-colors duration-200 rounded-lg mx-1"
                      >
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("PENDING")}
                        className="hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg mx-1"
                      >
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        Mark as Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Information Card */}
        {job && (
          <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center text-lg">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Applied for: {job.title}
              </CardTitle>
              {job.shortDescription && (
                <CardDescription className="text-base">
                  {job.shortDescription}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3">
                {job.location && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-primary/5 border-primary/20"
                  >
                    <MapPin className="h-3 w-3" />
                    {job.location.city}, {job.location.countryName}
                  </Badge>
                )}
                {job.employmentType && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Building className="h-3 w-3" />
                    {formatTextEnum(job.employmentType)}
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
                    <Briefcase className="h-3 w-3" />
                    {job.experienceLevels
                      .map((level) => level.experienceName)
                      .join(", ")}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center text-lg">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  {application.applicant.phoneNumber && (
                    <div className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                      <Phone className="h-4 w-4 mr-3 text-primary/70" />
                      <span className="text-sm font-medium">
                        {application.applicant.phoneNumber}
                      </span>
                    </div>
                  )}
                  {application.applicant.nationality && (
                    <div className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                      <MapPin className="h-4 w-4 mr-3 text-primary/70" />
                      <span className="text-sm font-medium">
                        {application.applicant.nationality}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <Calendar className="h-4 w-4 mr-3 text-primary/70" />
                    <span className="text-sm font-medium">
                      Applied on{" "}
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Score Card */}
            <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center text-lg">
                  <Star className="h-5 w-5 mr-2 text-primary" />
                  Match Score
                </CardTitle>
                <CardDescription>
                  Overall compatibility with job requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                {/* Overall Score Display */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/20 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        {scorePercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Skills</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {scoreData?.details.skill_score || "0/0"}
                        </span>
                        <span
                          className={`text-sm font-bold ${getScoreColor(skillScorePercentage / 100)}`}
                        >
                          {skillScorePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skillScorePercentage}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm font-medium">
                          Certifications
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {scoreData?.details.cert_score || "0/0"}
                        </span>
                        <span
                          className={`text-sm font-bold ${getScoreColor(certScorePercentage / 100)}`}
                        >
                          {certScorePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${certScorePercentage}%` }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                        <span className="text-sm font-medium">Experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {scoreData?.details.exp_score || "0/0"}
                        </span>
                        <span
                          className={`text-sm font-bold ${getScoreColor(expScorePercentage / 100)}`}
                        >
                          {expScorePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${expScorePercentage}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience Level Comparison - Improved Balanced Layout */}
            <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="h-5 w-5 mr-2 text-primary" />
                  Experience Level
                </CardTitle>
                <CardDescription>
                  Comparison between candidate and job requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-6">
                  {/* Balanced Two-Row Layout for Experience Comparison */}
                  <div className="space-y-4">
                    {/* Candidate Level Row */}
                    <div className="text-sm font-medium text-muted-foreground mb-3">
                      Candidate Level:
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50/50 border border-blue-200/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-blue-700">
                            {scoreData?.details.exp_detail.cv_level ||
                              "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Divider */}
                    <div className="flex justify-center">
                      <div className="flex items-center text-muted-foreground">
                        <div className="h-px bg-border w-16" />
                        <div className="h-px bg-border w-16" />
                      </div>
                    </div>

                    {/* Required Levels Row */}
                    <div className="text-sm font-medium text-muted-foreground mb-3">
                      Required Levels:
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50/50 border border-amber-200/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-100">
                          <Briefcase className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {scoreData?.details.exp_detail.jd_required_levels &&
                            scoreData.details.exp_detail.jd_required_levels
                              .length > 0 ? (
                              scoreData.details.exp_detail.jd_required_levels.map(
                                (level, index) => (
                                  <span
                                    key={index}
                                    className="text-sm font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded"
                                  >
                                    {level}
                                  </span>
                                ),
                              )
                            ) : (
                              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                Not specified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Result */}
                  <div className="border-t border-border/30 pt-4">
                    <div className="">
                      <div className="text-sm font-medium text-muted-foreground mb-3">
                        Match Result:
                      </div>
                      <Badge
                        variant="outline"
                        className={`px-6 py-3 w-full rounded-lg font-semibold text-base ${
                          scoreData?.details.exp_match === 1
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {scoreData?.details.exp_match === 1 ? (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            Compatible
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 mr-2" />
                            Not Compatible
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-md overflow-hidden">
              <Tabs defaultValue="resume" className="w-full">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      Candidate Details
                    </span>
                  </div>
                  <TabsList className="w-full grid grid-cols-5 bg-background/80 backdrop-blur-sm rounded-xl border border-border/30">
                    <TabsTrigger
                      value="resume"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Resume
                    </TabsTrigger>
                    <TabsTrigger
                      value="skills-match"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Skills
                    </TabsTrigger>
                    <TabsTrigger
                      value="cert-match"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Certs
                    </TabsTrigger>
                    <TabsTrigger
                      value="cover-letter"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Cover
                    </TabsTrigger>
                    <TabsTrigger
                      value="comparison"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Analysis
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    <TabsContent value="resume" className="m-0 p-6">
                      {resumeContent ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          {resumeContent.summary && (
                            <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  Professional Summary
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm leading-relaxed italic">
                                  {resumeContent.summary}
                                </p>
                              </CardContent>
                            </Card>
                          )}

                          {resumeContent.workExperience &&
                            resumeContent.workExperience.length > 0 && (
                              <Card className="border-primary/20">
                                <CardHeader className="pb-2 bg-primary/5">
                                  <CardTitle className="text-base flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2 text-primary" />
                                    Work Experience
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-4">
                                  {resumeContent.workExperience.map(
                                    (exp, index) => (
                                      <motion.div
                                        key={index}
                                        className={`${index > 0 ? "pt-4 border-t border-border/30" : ""} relative pl-4`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                      >
                                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/20 rounded-full" />
                                        <div className="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-primary" />
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h4 className="font-semibold text-sm">
                                              {exp.role}
                                            </h4>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <Building className="h-3 w-3 mr-1" />
                                              {exp.company}
                                            </div>
                                          </div>
                                          <Badge
                                            variant="outline"
                                            className="text-xs bg-primary/5"
                                          >
                                            {exp.duration}
                                          </Badge>
                                        </div>
                                        <p className="text-sm leading-relaxed">
                                          {exp.description}
                                        </p>
                                      </motion.div>
                                    ),
                                  )}
                                </CardContent>
                              </Card>
                            )}

                          {resumeContent.education &&
                            resumeContent.education.length > 0 && (
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
                                      className={
                                        index > 0
                                          ? "pt-4 border-t border-border/30"
                                          : ""
                                      }
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                    >
                                      <h4 className="font-medium text-sm">
                                        {edu.degree}
                                      </h4>
                                      <div className="text-sm text-muted-foreground">
                                        {edu.school}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs mt-1 bg-primary/5 rounded-lg p-1 mt-2"
                                      >
                                        Graduation: {edu.graduationYear}
                                      </Badge>
                                    </motion.div>
                                  ))}
                                </CardContent>
                              </Card>
                            )}

                          {/* Improved Projects Section */}
                          {resumeContent.projects &&
                            resumeContent.projects.length > 0 && (
                              <Card className="border-primary/20">
                                <CardHeader className="pb-2 bg-primary/5">
                                  <CardTitle className="text-base flex items-center">
                                    <Code className="h-4 w-4 mr-2 text-primary" />
                                    Projects ({resumeContent.projects.length})
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {resumeContent.projects.map(
                                      (project, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                          className="group p-4 border border-border/30 rounded-lg hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/20"
                                        >
                                          <div className="space-y-3">
                                            {/* Project Header */}
                                            <div className="flex-row items-start justify-between">
                                              <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                                                </div>
                                                <h4 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                                  {project.name}
                                                </h4>
                                              </div>

                                              <Badge
                                                variant="outline"
                                                className="text-xs mt-5 p-2 rounded-lg bg-blue-50 text-blue-700 border-blue-200 shrink-0"
                                              >
                                                Role: {project.role}
                                              </Badge>
                                            </div>

                                            {/* Project Description */}
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 group-hover:text-foreground transition-colors duration-300">
                                              {project.description}
                                            </p>

                                            {/* Project Link */}
                                            {project.url && (
                                              <div className="pt-2 border-t border-border/20">
                                                <a
                                                  href={project.url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 hover:underline transition-all duration-300 group-hover:scale-105"
                                                >
                                                  <Link className="h-3 w-3" />
                                                  View Project
                                                  <ExternalLink className="h-2.5 w-2.5" />
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      ),
                                    )}
                                  </div>
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
                                    {Object.entries(skillsByCategory).map(
                                      ([category, skills]) => (
                                        <motion.div
                                          key={category}
                                          initial={{ opacity: 0, y: 5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                        >
                                          <h4 className="text-sm font-medium mb-2 text-primary/80">
                                            {category}
                                          </h4>
                                          <div className="flex flex-wrap gap-1.5">
                                            {skills.map((skill, index) => (
                                              <Badge
                                                key={index}
                                                variant="outline"
                                                className="text-xs hover:bg-primary/5 transition-colors"
                                              >
                                                {typeof skill === "string"
                                                  ? skill
                                                  : skill.skillName}
                                              </Badge>
                                            ))}
                                          </div>
                                        </motion.div>
                                      ),
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {resumeContent.certifications &&
                              resumeContent.certifications.length > 0 && (
                                <Card className="border-primary/20">
                                  <CardHeader className="pb-2 bg-primary/5">
                                    <CardTitle className="text-base flex items-center">
                                      <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                      Certifications
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-4">
                                    <div className="space-y-2">
                                      {resumeContent.certifications.map(
                                        (cert, index) => (
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
                                              <Badge
                                                variant="secondary"
                                                className="text-xs bg-amber-500/10 text-amber-700"
                                              >
                                                Score: {cert.score}
                                              </Badge>
                                            )}
                                          </motion.div>
                                        ),
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                          </div>

                          {resumeContent.awards &&
                            resumeContent.awards.length > 0 && (
                              <Card className="border-primary/20">
                                <CardHeader className="pb-2 bg-primary/5">
                                  <CardTitle className="text-base flex items-center">
                                    <Trophy className="h-4 w-4 mr-2 text-primary" />
                                    Awards
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                  <div className="space-y-2">
                                    {resumeContent.awards.map(
                                      (award, index) => (
                                        <motion.div
                                          key={index}
                                          className="flex justify-between items-center p-2 rounded-md hover:bg-primary/5 transition-colors"
                                          initial={{ opacity: 0, y: 5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                        >
                                          <div>
                                            <span className="text-sm font-medium">
                                              {award.name}
                                            </span>
                                            {award.issuer && (
                                              <div className="text-xs text-muted-foreground">
                                                {award.issuer}
                                              </div>
                                            )}
                                          </div>
                                          {award.date && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {award.date}
                                            </Badge>
                                          )}
                                        </motion.div>
                                      ),
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">
                            No resume content available
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="skills-match" className="m-0 p-6">
                      {scoreData?.details.skills_detail &&
                      scoreData.details.skills_detail.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-green-50 border-green-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center text-green-700">
                                  <Check className="h-4 w-4 mr-2" />
                                  Exact Matches
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-green-700">
                                  {matchedSkills.length}
                                </div>
                                <p className="text-sm text-green-600">
                                  skills exactly match job requirements
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-yellow-50 border-yellow-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center text-yellow-700">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Partial Matches
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-yellow-700">
                                  {partialMatchSkills.length}
                                </div>
                                <p className="text-sm text-yellow-600">
                                  skills partially match job requirements
                                </p>
                              </CardContent>
                            </Card>

                            <Card className="bg-red-50 border-red-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center text-red-700">
                                  <X className="h-4 w-4 mr-2" />
                                  No Matches
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-red-700">
                                  {unmatchedSkills.length}
                                </div>
                                <p className="text-sm text-red-600">
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
                                Complete list of candidate skills and their
                                match with job requirements
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
                                        <td className="py-2 px-3 text-sm">
                                          {skill.cv_skill}
                                        </td>
                                        <td className="py-2 px-3 text-sm">
                                          {skill.jd_skill}
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          {skill.match === 1 ? (
                                            <Badge className="bg-green-100 text-green-800">
                                              <Check className="h-3.5 w-3.5 mr-1" />
                                              Match
                                            </Badge>
                                          ) : (
                                            <Badge className="bg-red-100 text-red-800">
                                              <X className="h-3.5 w-3.5 mr-1" />
                                              No Match
                                            </Badge>
                                          )}
                                        </td>
                                        <td className="py-2 px-3">
                                          <div className="flex items-center justify-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                              <div
                                                className={`h-2.5 rounded-full ${getScoreBackgroundColor(skill.score)}`}
                                                style={{
                                                  width: `${Math.round(skill.score * 100)}%`,
                                                }}
                                              />
                                            </div>
                                            <span
                                              className={`text-xs font-medium ${getScoreColor(skill.score)}`}
                                            >
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
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                          <Award className="h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">
                            No skills match data available
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="cert-match" className="m-0 p-6">
                      {scoreData?.details.certs_detail &&
                      scoreData.details.certs_detail.length > 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-green-50 border-green-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center text-green-700">
                                  <Check className="h-4 w-4 mr-2" />
                                  Exact Matches
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-green-700">
                                  {matchedCerts.length}
                                </div>
                                <p className="text-sm text-green-600">
                                  certifications exactly match job requirements
                                </p>
                              </CardContent>
                            </Card>
                            <Card className="bg-red-50 border-red-200">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center text-red-700">
                                  <X className="h-4 w-4 mr-2" />
                                  No Matches
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-red-700">
                                  {unmatchedCerts.length}
                                </div>
                                <p className="text-sm text-red-600">
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
                                Complete list of candidate certifications and
                                their match with job requirements
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
                                        <td className="py-2 px-3 text-sm">
                                          {cert.cv_cert}
                                        </td>
                                        <td className="py-2 px-3 text-sm">
                                          {cert.jd_cert}
                                        </td>
                                        <td className="py-2 px-3 text-sm text-center">
                                          {cert.jd_score}
                                        </td>
                                        <td className="py-2 px-3 text-sm text-center">
                                          <span
                                            className={
                                              Number(cert.cv_score) >=
                                              Number(cert.jd_score)
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }
                                          >
                                            {cert.cv_score}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          {cert.match === 1 ? (
                                            <Badge className="bg-green-100 text-green-800">
                                              <Check className="h-3.5 w-3.5 mr-1" />
                                              Match
                                            </Badge>
                                          ) : (
                                            <Badge className="bg-red-100 text-red-800">
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
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                          <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                          <p className="text-muted-foreground">
                            No certification match data available
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="cover-letter" className="m-0 p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="prose max-w-none"
                      >
                        {application.coverLetter ? (
                          <div className="bg-muted/20 p-6 rounded-md max-h-[600px] overflow-y-auto border border-primary/10">
                            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                              {application.coverLetter}
                            </pre>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-md">
                            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">
                              No cover letter provided
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="comparison" className="m-0 p-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-dashed border-primary/20 bg-gradient-to-br from-blue-50 to-transparent">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <Award className="h-4 w-4 mr-2 text-blue-500" />
                                Skills Match
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  Match Score
                                </span>
                                <div className="flex items-center">
                                  <span className="text-xs text-muted-foreground mr-2">
                                    {scoreData?.details.skill_score || "0/0"}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`${getScoreColor(skillScorePercentage / 100)} bg-white/80 backdrop-blur-sm`}
                                  >
                                    {skillScorePercentage}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="relative pt-1 mb-4">
                                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-blue-100">
                                  <div
                                    style={{
                                      width: `${skillScorePercentage}%`,
                                    }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                                  />
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

                          <Card className="border-dashed border-primary/20 bg-gradient-to-br from-purple-50 to-transparent">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-purple-500" />
                                Certification Match
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                  Match Score
                                </span>
                                <div className="flex items-center">
                                  <span className="text-xs text-muted-foreground mr-2">
                                    {scoreData?.details.cert_score || "0/0"}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`${getScoreColor(certScorePercentage / 100)} bg-white/80 backdrop-blur-sm`}
                                  >
                                    {certScorePercentage}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="relative pt-1 mb-4">
                                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-purple-100">
                                  <div
                                    style={{ width: `${certScorePercentage}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                                  />
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

                        <Card className="border-dashed border-primary/20 bg-gradient-to-br from-amber-50 to-transparent">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-amber-500" />
                              Experience Match
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Match Score
                              </span>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground mr-2">
                                  {scoreData?.details.exp_score || "0/0"}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`${getScoreColor(expScorePercentage / 100)} bg-white/80 backdrop-blur-sm`}
                                >
                                  {expScorePercentage}%
                                </Badge>
                              </div>
                            </div>
                            <div className="relative pt-1 mb-4">
                              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-amber-100">
                                <div
                                  style={{ width: `${expScorePercentage}%` }}
                                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                                />
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
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              Recommended Actions
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              {scorePercentage >= 70 ? (
                                <>
                                  <div className="flex items-center p-2 rounded-md bg-green-50 text-green-700">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Schedule an interview with this candidate
                                    </span>
                                  </div>
                                  <div className="flex items-center p-2 rounded-md bg-blue-50 text-blue-700">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Send a personalized follow-up email
                                    </span>
                                  </div>
                                </>
                              ) : scorePercentage >= 50 ? (
                                <>
                                  <div className="flex items-center p-2 rounded-md bg-yellow-50 text-yellow-700">
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Consider for a technical assessment
                                    </span>
                                  </div>
                                  <div className="flex items-center p-2 rounded-md bg-blue-50 text-blue-700">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Request additional information
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex items-center p-2 rounded-md bg-red-50 text-red-700">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Consider rejecting this application
                                    </span>
                                  </div>
                                  <div className="flex items-center p-2 rounded-md bg-gray-50 text-gray-700">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span className="text-sm">
                                      Send a polite rejection email
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-primary/5 to-transparent py-4 px-6 flex justify-between border-t border-border/30">
                  <div className="text-xs text-muted-foreground">
                    Application ID: {application.applicationId}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    >
                      <Mail className="h-3.5 w-3.5 mr-1.5" />
                      Contact
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Schedule Interview
                    </Button>
                  </div>
                </CardFooter>
              </Tabs>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
}
