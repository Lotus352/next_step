"use client"

import {
    MapPin,
    Briefcase,
    BookmarkPlus,
    Send,
    ExternalLink,
    Building2,
    Heart,
    Sparkles,
    Calendar,
    ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type JobType from "@/types/job-type"
import { formatDate, formatSalary, formatTextEnum } from "@/lib/utils"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { FavoriteNotification, type NotificationState } from "@/components/notification-state/favorite-notification.tsx"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { toggleFavoriteJob } from "@/store/slices/jobs-slice"

interface FavoriteJobCardProps {
    job: JobType
}

export function FavoriteJobCard({ job }: FavoriteJobCardProps) {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    // Copy exact favorite handling logic from job-card.tsx
    const [isBookmarked, setIsBookmarked] = useState(job.isFavorite || false)
    const [bookmarkAnimation, setBookmarkAnimation] = useState(false)
    const [notification, setNotification] = useState<NotificationState>({
        isVisible: false,
        jobTitle: "",
        type: "added",
    })

    const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")

    const handleViewDetails = () => {
        navigate(`/jobs/${job.jobId}`)
    }

    // Copy exact bookmark handling logic from job-card.tsx
    const handleBookmark = async () => {
        if (isAuthenticated) {
            const wasFavorite = isBookmarked

            setBookmarkAnimation(true)
            setTimeout(() => setBookmarkAnimation(false), 1000)

            setIsBookmarked(!isBookmarked)

            await dispatch(toggleFavoriteJob({ id: job.jobId }))

            setNotification({
                isVisible: true,
                jobTitle: job.title,
                type: wasFavorite ? "removed" : "added",
            })
        } else {
            navigate("/sign-in")
        }
    }

    const closeNotification = () => {
        setNotification((prev) => ({ ...prev, isVisible: false }))
    }

    const handleApply = () => {
        // Implement your apply logic here
    }

    return (
        <>
            <FavoriteNotification
                isVisible={notification.isVisible}
                jobTitle={notification.jobTitle}
                type={notification.type}
                onClose={closeNotification}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group"
            >
                <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:border-primary/20 relative">
                    {/* Enhanced top gradient bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                    {/* Floating elements for visual appeal */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
                    </div>

                    <CardHeader className="pb-4 bg-gradient-to-br from-muted/20 via-transparent to-transparent relative">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex gap-4 items-start flex-1">
                                {/* Enhanced company logo - smaller for compact view */}
                                <div className="relative">
                                    <Avatar className="h-12 rounded-xl w-12 border-2 p-1 border-border/30 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
                                        <AvatarImage
                                            src={job.postedBy.company.logoUrl || "/placeholder.svg?height=48&width=48"}
                                            alt={`${job.postedBy.company.name} logo`}
                                            className="object-cover transition-all duration-300 group-hover:brightness-110"
                                        />
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                            {job.postedBy.company.name?.charAt(0) || "C"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Show favorite indicator if bookmarked */}
                                    {isBookmarked && (
                                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                            <Heart className="h-2.5 w-2.5 text-white fill-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 line-clamp-2">
                                        {job.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm flex items-center gap-2 mt-1 group-hover:text-foreground transition-colors duration-300">
                                        <Building2 className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                                        {job.postedBy.company.name}
                                    </CardDescription>

                                    {/* Show salary if available */}
                                    {job.salary && (
                                        <div className="mt-2">
                      <span className="text-sm font-semibold text-primary">
                        {formatSalary(job.salary.minSalary, job.salary.maxSalary, job.salary.currency)}
                      </span>
                                            <span className="text-xs text-muted-foreground ml-1">/{job.salary.payPeriod}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced bookmark button - copy exact logic from job-card.tsx */}
                            <div className="relative">
                                <Button
                                    variant={isBookmarked ? "default" : "outline"}
                                    size="icon"
                                    onClick={handleBookmark}
                                    className={`h-8 w-8 transition-all duration-300 hover:scale-110 ${
                                        isBookmarked
                                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
                                            : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                    }`}
                                >
                                    {isBookmarked ? (
                                        <Heart className="h-4 w-4 fill-current animate-pulse" />
                                    ) : (
                                        <BookmarkPlus className="h-4 w-4 transition-all duration-300 hover:scale-110" />
                                    )}
                                </Button>

                                {/* Floating animation for bookmarks - copy exact logic from job-card.tsx */}
                                {bookmarkAnimation && (
                                    <div className="absolute -top-2 -right-2 pointer-events-none">
                                        <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-bounce" />
                                        <div className="absolute inset-0 h-3 w-3 text-red-500 fill-red-500 animate-ping">
                                            <Heart className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <Separator className="mx-6 group-hover:bg-primary/20 transition-colors duration-300" />

                    <CardContent className="pt-4 space-y-4">
                        {/* Show only essential job details - hide experience levels */}
                        <div className="flex flex-wrap items-center gap-2">
                            {job.location && (
                                <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-primary/10 px-2.5 py-1.5 rounded-full transition-all duration-300 hover:scale-105 group/item">
                                    <MapPin className="h-3.5 w-3.5 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                                    <span className="text-xs font-medium">
                    {job.location.city}, {job.location.countryName}
                  </span>
                                </div>
                            )}

                            <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-primary/10 px-2.5 py-1.5 rounded-full transition-all duration-300 hover:scale-105 group/item">
                                <Briefcase className="h-3.5 w-3.5 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                                <span className="text-xs font-medium">{formatTextEnum(job.employmentType)}</span>
                            </div>

                            <div className="flex items-center gap-1.5 bg-muted/40 hover:bg-primary/10 px-2.5 py-1.5 rounded-full transition-all duration-300 hover:scale-105 group/item">
                                <Calendar className="h-3.5 w-3.5 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                                <span className="text-xs font-medium">Posted {formatDate(job.createdAt)}</span>
                            </div>
                        </div>

                        {/* Hide description for more compact view */}

                        {/* Show only top 3 skills */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="p-1 rounded-lg bg-primary/10">
                                    <Sparkles className="h-3.5 w-3.5 text-primary transition-all duration-300 group-hover:rotate-180" />
                                </div>
                                <span className="text-xs font-bold text-foreground">Skills</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {job.skills.slice(0, 3).map((skill, index) => (
                                    <motion.div
                                        key={skill.skillId}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                    >
                                        <Badge
                                            variant="outline"
                                            className="bg-primary/5 hover:bg-primary/15 transition-all duration-300 hover:scale-105 border-primary/20 text-primary/80 hover:text-primary font-medium px-2 py-1 text-xs"
                                        >
                      <span className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" />
                          {skill.skillName}
                      </span>
                                        </Badge>
                                    </motion.div>
                                ))}

                                {job.skills.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="bg-gradient-to-r from-muted to-muted/70 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 hover:scale-105 font-medium px-2 py-1 border-dashed border-primary/30 text-xs"
                                    >
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />+{job.skills.length - 3}
                    </span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-wrap gap-2 justify-between border-t bg-gradient-to-br from-muted/10 to-transparent pt-3 transition-all duration-300 group-hover:from-muted/20">
                        {/* Hide Company button, keep only essential actions */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewDetails}
                            className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium text-xs"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Details</span>
                        </Button>

                        <Button
                            onClick={handleApply}
                            size="sm"
                            className="gap-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 font-semibold relative overflow-hidden group/apply text-xs"
                        >
                            <Send className="h-3.5 w-3.5 transition-all duration-300 group-hover/apply:translate-x-1" />
                            <span>Apply</span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover/apply:opacity-100 transition-all duration-300 -ml-2 group-hover/apply:ml-0" />

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/apply:translate-x-[200%] transition-transform duration-700" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </>
    )
}
