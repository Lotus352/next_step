"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Eye,
    MapPin,
    Calendar,
    DollarSign,
    Users,
    Building2,
    Globe,
    Star,
    Sparkles,
    CheckCircle,
    ExternalLink,
    Edit,
    XCircle,
    X,
    FileText,
    Crosshair,
    Clock,
    GraduationCap,
    Lightbulb,
    AlertCircle,
} from "lucide-react"
import type JobType from "@/types/job-type"
import { formatTextEnum, formatSalary, checkExpiryDate } from "@/lib/utils"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
} from "@/components/ui/custom-dialog"

interface JobViewDialogProps {
    job: JobType | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit?: () => void
    userRole: "admin" | "employer"
}

export function JobViewDialog({ job, open, onOpenChange, onEdit }: JobViewDialogProps) {
    if (!job) return null

    const benefits = job.benefits ? job.benefits.split("|") : []
    const isExpired = job.expiryDate && checkExpiryDate(job.expiryDate)

    const getStatusBadge = (status: string) => {
        const isOpen = status === "OPEN"
        return (
            <Badge
                variant={isOpen ? "default" : "secondary"}
                className={`flex items-center gap-1 font-semibold ${
                    isOpen ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"
                }`}
            >
                {isOpen ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                {status}
            </Badge>
        )
    }

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange} className="max-w-5xl">
            <CustomDialogContent showCloseButton={false}>
                {/* Header - Company Info */}
                <CustomDialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-16 w-16 rounded-xl border-2 border-border/30 shadow-md">
                                <AvatarImage
                                    src={job.postedBy.company.logoUrl || ""}
                                    alt={`${job.postedBy.company.name} logo`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-xl">
                                    {job.postedBy.company.name?.charAt(0) || "C"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <CustomDialogTitle className="line-clamp-2 mb-2">{job.title}</CustomDialogTitle>
                                <CustomDialogDescription className="text-lg flex items-center gap-2 mb-3 font-medium">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    {job.postedBy.company.name}
                                </CustomDialogDescription>

                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-300 font-semibold">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        {job.isFeatured ? "Featured" : "Standard"}
                                    </Badge>
                                    {getStatusBadge(job.status)}
                                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                                        <Users className="h-3 w-3 mr-1" />
                                        {job.appliedCount} applications
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CustomDialogHeader>

                {/* Scrollable Content */}
                <CustomDialogBody>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Job Description Card */}
                        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <FileText className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Job Description</CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8">
                                <div className="prose prose-muted max-w-none">
                                    {/* Overview section */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Crosshair className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12" />
                                            </div>
                                            <span className="text-xl font-bold text-foreground">Overview</span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                        </div>
                                        <div className="text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                            {job.shortDescription || "No overview available"}
                                        </div>
                                    </div>

                                    <Separator className="my-8 bg-border/50 transition-all duration-300 group-hover:bg-primary/20" />

                                    {/* Detailed Description */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Eye className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12" />
                                            </div>
                                            <span className="text-xl font-bold text-foreground">Detailed Description</span>
                                            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                        </div>
                                        <div className="text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                            {job.detailedDescription || "No detailed description available"}
                                        </div>
                                    </div>

                                    <Separator className="my-8 bg-border/50 transition-all duration-300 group-hover:bg-primary/20" />

                                    {/* Job details section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        {/* Employment Type */}
                                        {job.employmentType && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg group-hover/item:bg-primary/15 transition-colors duration-300">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Employment Type</h3>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-2 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold"
                                                    >
                                                        {formatTextEnum(job.employmentType)}
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Location */}
                                        {job.location && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg group-hover/item:bg-primary/15 transition-colors duration-300">
                                                            <MapPin className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Location</h3>
                                                    </div>
                                                    <p className="text-muted-foreground font-medium text-base">
                                                        {job.location.city}, {job.location.countryName}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Salary */}
                                        {job.salary && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-green-100 rounded-lg group-hover/item:bg-green-200 transition-colors duration-300">
                                                            <DollarSign className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Salary Range</h3>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-green-800 text-lg">
                                                            {formatSalary(job.salary.minSalary, job.salary.maxSalary, job.salary.currency)}
                                                        </p>
                                                        <p className="text-sm text-green-600">per {job.salary.payPeriod}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Experience Level */}
                                        {job.experienceLevels && job.experienceLevels.length > 0 && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg group-hover/item:bg-primary/15 transition-colors duration-300">
                                                            <GraduationCap className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Experience Level</h3>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.experienceLevels.map((exp) => (
                                                            <Badge
                                                                key={exp.experienceId}
                                                                variant="secondary"
                                                                className="px-3 py-2 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold"
                                                            >
                                                                {exp.experienceName}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Remote Work */}
                                        {job.remoteAllowed && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200 p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="p-2 bg-teal-100 rounded-lg group-hover/item:bg-teal-200 transition-colors duration-300">
                                                            <Globe className="h-5 w-5 text-teal-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Work Style</h3>
                                                    </div>
                                                    <Badge
                                                        variant="secondary"
                                                        className="px-3 py-2 bg-teal-100 text-teal-700 border-teal-300 hover:bg-teal-200 transition-all duration-300 hover:scale-105 font-semibold"
                                                    >
                                                        Remote Allowed
                                                    </Badge>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Expiry Date */}
                                        {job.expiryDate && (
                                            <motion.div
                                                className="group/item relative overflow-hidden"
                                                whileHover={{ y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div
                                                    className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${
                                                        isExpired
                                                            ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                                                            : "bg-gradient-to-br from-muted/20 to-muted/10 border-border/30"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div
                                                            className={`p-2 rounded-lg ${
                                                                isExpired ? "bg-red-100" : "bg-primary/10 group-hover/item:bg-primary/15"
                                                            } transition-colors duration-300`}
                                                        >
                                                            <Calendar className={`h-5 w-5 ${isExpired ? "text-red-500" : "text-primary"}`} />
                                                        </div>
                                                        <h3 className="font-semibold text-lg">Application Deadline</h3>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-semibold text-base">{job.expiryDate.split(" ")[0]}</p>
                                                            {isExpired && (
                                                                <Badge variant="destructive" className="flex items-center gap-1">
                                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                                    Expired
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {isExpired && (
                                                            <p className="text-red-600 text-sm font-medium">
                                                                This job posting has expired. Similar positions may still be available.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    <Separator className="my-8 bg-border/50 transition-all duration-300 group-hover:bg-primary/20" />

                                    {/* Skills section */}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className="mt-10">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="p-1.5 rounded-lg bg-primary/10">
                                                    <Lightbulb className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12" />
                                                </div>
                                                <span className="text-xl font-bold text-foreground">Required Skills</span>
                                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                            </div>

                                            <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                                <div className="flex flex-wrap gap-2">
                                                    {job.skills.map((skill, index) => (
                                                        <div
                                                            key={skill.skillId}
                                                            className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                                                            style={{
                                                                animationDelay: `${index * 50}ms`,
                                                                animationDuration: "400ms",
                                                            }}
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="relative text-xs hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-3 py-2 border-primary/20 bg-gradient-to-r from-background to-muted/30"
                                                            >
                                <span className="relative z-10 flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                                    {skill.skillName}
                                </span>
                                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300" />
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Benefits section */}
                                    {benefits.length > 0 && (
                                        <div className="mt-10">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="p-1.5 rounded-lg bg-primary/10">
                                                    <Sparkles className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12" />
                                                </div>
                                                <span className="text-xl font-bold text-foreground">Benefits & Perks</span>
                                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                            </div>

                                            <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 p-6 rounded-xl border border-green-200/50 shadow-sm transition-all duration-300 hover:shadow-md">
                                                <div className="flex flex-wrap gap-2">
                                                    {benefits.map((benefit, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="group/benefit relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                                                            style={{
                                                                animationDelay: `${index * 50}ms`,
                                                                animationDuration: "400ms",
                                                            }}
                                                        >
                                                            <Badge
                                                                variant="outline"
                                                                className="relative text-xs hover:bg-green-100 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-3 py-2 border-green-200/50 bg-gradient-to-r from-background to-green-50/30"
                                                            >
                                <span className="relative z-10 flex items-center gap-1.5">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                    {benefit}
                                </span>
                                                                <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-green-200/30 opacity-0 group-hover/benefit:opacity-100 transition-opacity duration-300" />
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* External Link */}
                                    {job.jobUrl && (
                                        <div className="mt-10">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="p-1.5 rounded-lg bg-primary/10">
                                                    <ExternalLink className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="text-xl font-bold text-foreground">External Application</span>
                                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                            </div>
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
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </CustomDialogBody>
            </CustomDialogContent>
        </CustomDialog>
    )
}
