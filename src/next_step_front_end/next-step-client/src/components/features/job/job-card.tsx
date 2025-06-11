"use client"

import {
  MapPin,
  Briefcase,
  Clock,
  BookmarkPlus,
  Send,
  ExternalLink,
  Building2,
  Heart,
  Sparkles,
  Calendar,
  Users,
  Star,
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
import { FavoriteNotification } from "@/components/favorite-notification"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { toggleFavoriteJob } from "@/store/slices/jobs-slice"

interface JobCardProps {
  job: JobType
}

interface NotificationState {
  isVisible: boolean
  jobTitle: string
  type: "added" | "removed"
}

export function JobCard({ job }: JobCardProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
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

  const handleBookmark = async () => {
    if (isAuthenticated) {
      const wasFavorite = isBookmarked

      // Trigger animation
      setBookmarkAnimation(true)
      setTimeout(() => setBookmarkAnimation(false), 1000)

      // Update local state
      setIsBookmarked(!isBookmarked)

      // Dispatch action
      await dispatch(toggleFavoriteJob({ id: job.jobId }))

      // Show notification
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
    console.log(`Applying for job: ${job.title}`)
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
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-pulse"></div>
          </div>

          <CardHeader className="pb-4 bg-gradient-to-br from-muted/20 via-transparent to-transparent relative">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex gap-4 items-start flex-1">
                {/* Enhanced company logo */}
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-border/30 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
                    <AvatarImage
                      src={job.postedBy.company.logoUrl || "/placeholder.svg?height=64&width=64"}
                      alt={`${job.postedBy.company.name} logo`}
                      className="object-cover transition-all duration-300 group-hover:brightness-110"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                      {job.postedBy.company.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Verified badge */}
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 line-clamp-2">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-base flex items-center gap-2 mt-1 group-hover:text-foreground transition-colors duration-300">
                    <Building2 className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                    {job.postedBy.company.name}
                  </CardDescription>

                  {/* Job posting date */}
                  <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Posted {formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced salary and bookmark section */}
              <div className="md:text-right flex md:flex-col items-start md:items-end gap-3">
                <div className="relative">
                  <div className="font-bold text-lg text-primary bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-sm group-hover:shadow-md transition-all duration-300">
                    {formatSalary(job.salary.minSalary, job.salary.maxSalary, job.salary.currency)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-center">per {job.salary.payPeriod}</div>
                </div>

                {/* Enhanced bookmark button */}
                <div className="relative">
                  <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="icon"
                    onClick={handleBookmark}
                    className={`h-10 w-10 transition-all duration-300 hover:scale-110 ${
                      isBookmarked
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
                        : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                    }`}
                  >
                    {isBookmarked ? (
                      <Heart className="h-5 w-5 fill-current animate-pulse" />
                    ) : (
                      <BookmarkPlus className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                    )}
                  </Button>

                  {/* Floating animation for bookmarks */}
                  {bookmarkAnimation && (
                    <div className="absolute -top-2 -right-2 pointer-events-none">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-bounce" />
                      <div className="absolute inset-0 h-4 w-4 text-red-500 fill-red-500 animate-ping">
                        <Heart className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <Separator className="mx-6 group-hover:bg-primary/20 transition-colors duration-300" />

          <CardContent className="pt-6 space-y-5">
            {/* Enhanced job details */}
            <div className="flex flex-wrap items-center gap-3">
              {job.location && (
                <div className="flex items-center gap-2 bg-muted/40 hover:bg-primary/10 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 group/item">
                  <MapPin className="h-4 w-4 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                  <span className="text-sm font-medium">
                    {job.location.city}, {job.location.countryName}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 bg-muted/40 hover:bg-primary/10 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 group/item">
                <Briefcase className="h-4 w-4 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                <span className="text-sm font-medium">{formatTextEnum(job.employmentType)}</span>
              </div>

              <div className="flex items-center gap-2 bg-muted/40 hover:bg-primary/10 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 group/item">
                <Clock className="h-4 w-4 text-primary/70 group-hover/item:text-primary transition-colors duration-300" />
                <span className="text-sm font-medium">
                  {job.experienceLevels.length === 1
                    ? job.experienceLevels[0].experienceName
                    : job.experienceLevels.length > 0
                      ? job.experienceLevels.map((exp, index) => (
                          <span key={exp.experienceId} className="inline-block">
                            {index > 0 && <span className="mr-1 text-muted-foreground">, </span>}
                            {exp.experienceName}
                          </span>
                        ))
                      : "Any level"}
                </span>
              </div>
            </div>

            {/* Enhanced description */}
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300 line-clamp-3">
                {job.shortDescription}
              </p>
            </div>

            {/* Enhanced skills section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180" />
                </div>
                <span className="text-sm font-bold text-foreground">Required Skills</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 6).map((skill, index) => (
                  <motion.div
                    key={skill.skillId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Badge
                      variant="outline"
                      className="bg-primary/5 hover:bg-primary/15 transition-all duration-300 hover:scale-105 border-primary/20 text-primary/80 hover:text-primary font-medium px-3 py-1.5"
                    >
                      <span className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                        {skill.skillName}
                      </span>
                    </Badge>
                  </motion.div>
                ))}

                {job.skills.length > 6 && (
                  <Badge
                    variant="outline"
                    className="bg-gradient-to-r from-muted to-muted/70 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 hover:scale-105 font-medium px-3 py-1.5 border-dashed border-primary/30"
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />+{job.skills.length - 6} more
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-3 justify-between border-t bg-gradient-to-br from-muted/10 to-transparent pt-4 transition-all duration-300 group-hover:from-muted/20">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View Details</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 border-border/50 font-medium"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Company</span>
              </Button>
            </div>

            <Button
              onClick={handleApply}
              className="gap-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 font-semibold relative overflow-hidden group/apply"
            >
              <Send className="h-4 w-4 transition-all duration-300 group-hover/apply:translate-x-1" />
              <span>Apply Now</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover/apply:opacity-100 transition-all duration-300 -ml-2 group-hover/apply:ml-0" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/apply:translate-x-[200%] transition-transform duration-700" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  )
}
