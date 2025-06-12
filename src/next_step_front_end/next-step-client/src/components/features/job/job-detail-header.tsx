"use client"

import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Heart,
  Briefcase,
  Coins,
  MapPin,
  Share2,
  Users,
  Send,
  Building2,
  Clock,
  ExternalLink,
  CheckCircle2,
  Star,
  Sparkles,
  BookmarkPlus,
  Bookmark,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { formatTextEnum } from "@/lib/utils"
import type { RootState, AppDispatch } from "@/store/store"
import { useSelector, useDispatch } from "react-redux"
import { toggleFavoriteJob } from "@/store/slices/jobs-slice"
import {FavoriteNotification, NotificationState} from "@/components/notifications/favorite-notification.tsx"
import { useNavigate } from "react-router-dom"
import DestructiveAlert from "@/components/destructive-alert"
import { Separator } from "@/components/ui/separator"


export default function JobDetailHeader() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [favoriteAnimation, setFavoriteAnimation] = useState(false)
  const [localFavoriteState, setLocalFavoriteState] = useState(false)
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    jobTitle: "",
    type: "added",
  })

  const { selected } = useSelector((state: RootState) => state.jobs)
  const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")

  const handleFavoriteToggle = async () => {
    if (!selected) return

    if (isAuthenticated) {
      const wasFavorite = localFavoriteState

      setLocalFavoriteState(!wasFavorite)

      setFavoriteAnimation(true)
      setTimeout(() => setFavoriteAnimation(false), 1000)

      try {
        await dispatch(toggleFavoriteJob({ id: selected.jobId }))

        setNotification({
          isVisible: true,
          jobTitle: selected.title,
          type: wasFavorite ? "removed" : "added",
        })
      } catch (error) {
        setLocalFavoriteState(wasFavorite)
        console.error("Failed to toggle favorite:", error)
      }
    } else {
      navigate("/sign-in")
    }
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  const handleApply = () => {
    setApplied(true)
  }

  useEffect(() => {
    if (selected) {
      setLocalFavoriteState(selected.isFavorite || false)
    }
  }, [selected?.isFavorite, selected])

  return !selected ? (
    <DestructiveAlert message="No job selected" />
  ) : (
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
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="p-8 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-6 flex-1 min-w-0">
                  <Avatar className="h-20 w-20 border-none rounded-xl p-0.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <AvatarImage
                      src={selected.postedBy.company.logoUrl || ""}
                      alt={`${selected.postedBy.company.name} logo`}
                      className="object-cover transition-all duration-300 group-hover:brightness-110"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xl rounded-xl transition-all duration-300 group-hover:bg-primary/90">
                      {selected.postedBy.company.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-3xl font-bold text-foreground mb-2 leading-tight group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">
                      {selected.title}
                    </CardTitle>
                    <CardDescription className="text-lg flex items-center gap-2 mb-4 font-medium text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                      <Building2 className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                      {selected.postedBy.company.name}
                    </CardDescription>

                    {/* Job Status Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 transition-all duration-300 hover:scale-105 font-semibold px-3 py-1">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured Job
                      </Badge>
                    </div>

                    {selected.location && (
                      <div className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground group-hover:translate-x-1">
                        <MapPin className="h-4 w-4 mr-2 transition-all duration-300 group-hover:text-primary" />
                        <span className="text-sm font-medium">
                          {selected.location.city}, {selected.location.countryName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Favorite Button */}
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={localFavoriteState ? "default" : "outline"}
                          size="icon"
                          className={`h-12 w-12 transition-all duration-300 hover:scale-110 ${
                            localFavoriteState
                              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
                              : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                          }`}
                          onClick={handleFavoriteToggle}
                        >
                          {localFavoriteState ? (
                            <Heart className="h-5 w-5 fill-current animate-pulse" />
                          ) : (
                            <Heart className="h-5 w-5 transition-all duration-300 hover:scale-110" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="bg-popover border border-border shadow-lg"
                        sideOffset={8}
                      >
                        <p>{localFavoriteState ? "Remove from favorites" : "Add to favorites"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Floating animation for favorites */}
                  {favoriteAnimation && (
                    <div className="absolute -top-2 -right-2 pointer-events-none">
                      <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-bounce" />
                      <div className="absolute inset-0 h-4 w-4 text-red-500 fill-red-500 animate-ping">
                        <Heart className="h-4 w-4" />
                      </div>
                    </div>
                  )}

                  {/* Favorite indicator badge */}
                  {localFavoriteState && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-4">
                {/* Salary and Employment Type */}
                <div className="flex flex-wrap gap-3">
                  {selected.salary && (
                    <div className="flex items-center bg-secondary border px-4 py-3 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-sm">
                      <Coins className="h-4 w-4 mr-2 text-foreground transition-all duration-300 hover:text-primary" />
                      <span className="text-sm font-semibold text-secondary-foreground">
                        {selected.salary.minSalary} - {selected.salary.maxSalary} {selected.salary.currency}
                      </span>
                      <span className="text-xs text-muted-foreground mx-1 font-medium">
                        ({selected.salary.payPeriod})
                      </span>
                    </div>
                  )}

                  {selected.employmentType && (
                    <Badge
                      variant="secondary"
                      className="px-4 py-3 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold text-sm"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      {formatTextEnum(selected.employmentType)}
                    </Badge>
                  )}

                  {selected.experienceLevels && (
                    <Badge
                      variant="secondary"
                      className="px-4 py-3 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold text-sm"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {selected.experienceLevels.map((exp, index) => (
                        <span key={exp.experienceId}>
                          {index > 0 && ", "}
                          {exp.experienceName}
                        </span>
                      ))}
                    </Badge>
                  )}

                  <div className="flex items-center bg-secondary border px-4 py-3 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-sm">
                    <Clock className="h-4 w-4 mr-2 text-foreground transition-all duration-300 hover:text-primary" />
                    <span className="text-sm font-semibold text-secondary-foreground">
                      {formatDistanceToNow(new Date(selected.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mx-8 transition-all duration-300 group-hover:bg-primary/20" />

            {/* Skills Section */}
            <div className="p-8 pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Required Skills</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.skills.map((skill, skillIndex) => (
                    <div
                      key={skill.skillId}
                      className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                      style={{
                        animationDelay: `${skillIndex * 50}ms`,
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
          </CardContent>

          <CardFooter className="bg-muted/50 px-8 py-6 border-t transition-all duration-300 group-hover:bg-muted/70 flex flex-col sm:flex-row gap-4">
            <Button
              className={`flex-1 gap-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base font-semibold relative overflow-hidden group/btn ${
                applied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              }`}
              onClick={handleApply}
              disabled={applied}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Applied Successfully
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  Apply Now
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                </>
              )}
            </Button>

            <div className="flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 border-border/50"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover border border-border shadow-lg" sideOffset={8}>
                    <p>Share this job</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-110 border-border/50"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-popover border border-border shadow-lg" sideOffset={8}>
                    <p>View on company website</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                className="gap-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 px-6 border-border/50"
                onClick={handleFavoriteToggle}
              >
                {localFavoriteState ? (
                  <>
                    <Bookmark className="h-4 w-4 fill-current text-red-500" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4" />
                    Save Job
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  )
}
