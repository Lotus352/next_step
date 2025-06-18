"use client"

import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar"
import {Briefcase, Clock, Coins, MapPin, Building2, Sparkles, Heart} from "lucide-react"
import {useDispatch, useSelector} from "react-redux"
import type {AppDispatch, RootState} from "@/store/store"
import {useEffect, useState} from "react"
import {clearFeaturedJobs, fetchFeaturedJobs, toggleFavoriteJob} from "@/store/slices/jobs-slice"
import Loading from "@/components/loading"
import AlertDestructive from "@/components/destructive-alert"
import {formatDistanceToNow} from "date-fns"
import {Separator} from "@/components/ui/separator"
import type SkillType from "@/types/skill-type"
import {useNavigate} from "react-router-dom"
import {FavoriteNotification, NotificationState} from "@/components/notification-state/favorite-notification.tsx"

type JOB_FILTER_TYPES = "" | "FULL_TIME" | "PART_TIME" | "REMOTE"

export default function FeaturedJobs({filter}: { filter: JOB_FILTER_TYPES }) {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const [favoriteAnimations, setFavoriteAnimations] = useState<Set<number>>(new Set())
    const [notification, setNotification] = useState<NotificationState>({
        isVisible: false,
        jobTitle: "",
        type: "added",
    })

    const {featured, statuses} = useSelector((state: RootState) => state.jobs)
    const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")

    const formatEmploymentType = (type: string) =>
        type
            .split("_")
            .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")

    const handleFavoriteToggle = async (jobId: number, jobTitle: string) => {
        if (isAuthenticated) {
            const job = featured.find((j) => j.jobId === jobId)
            const wasFavorite = job?.isFavorite

            // Trigger animation
            setFavoriteAnimations((prev) => new Set(prev).add(jobId))
            setTimeout(() => {
                setFavoriteAnimations((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(jobId)
                    return newSet
                })
            }, 1000)

            // Dispatch action
            await dispatch(toggleFavoriteJob({id: jobId}))

            // Show notification
            setNotification({
                isVisible: true,
                jobTitle,
                type: wasFavorite ? "removed" : "added",
            })
        } else {
            navigate("/sign-in")
        }
    }

    const closeNotification = () => {
        setNotification((prev) => ({...prev, isVisible: false}))
    }

    useEffect(() => {
        dispatch(fetchFeaturedJobs({filter: filter}))

        return () => {
            dispatch(clearFeaturedJobs())
        }
    }, [dispatch, filter])

    const renderContent = () => {
        if (statuses.fetchingFeatured === "loading") {
            return <Loading/>
        }
        if (statuses.fetchingFeatured === "failed") return <AlertDestructive message="Failed to fetch featured jobs"/>
        if (featured.length === 0) {
            return (
                <div className="text-center py-20 animate-in fade-in-50 duration-500">
                    <div
                        className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6 animate-in zoom-in-50 duration-700 delay-200">
                        <Briefcase className="h-8 w-8 text-muted-foreground animate-pulse"/>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        No jobs found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 duration-500 delay-500">
                        We couldn't find any jobs matching your criteria. Try adjusting your filters or check back later
                        for new
                        opportunities.
                    </p>
                </div>
            )
        } else return (
            <>
                <FavoriteNotification
                    isVisible={notification.isVisible}
                    jobTitle={notification.jobTitle}
                    type={notification.type}
                    onClose={closeNotification}
                />

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {featured.map((job, index) => (
                        <Card
                            key={job.jobId}
                            className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-in fade-in-50 slide-in-from-bottom-8"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationDuration: "600ms",
                            }}
                        >
                            <CardContent className="p-0">
                                {/* Header Section */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <Avatar
                                                className="h-14 w-14 border-none rounded-xl p-0.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                <AvatarImage
                                                    src={job.companyLogo || ""}
                                                    alt={`${job.companyName} logo`}
                                                    className="object-cover transition-all duration-300 group-hover:brightness-110"
                                                />
                                                <AvatarFallback
                                                    className="bg-primary text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300 group-hover:bg-primary/90">
                                                    {job.companyName?.charAt(0) || "C"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg truncate mb-1 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">
                                                    {job.title}
                                                </h3>
                                                <div
                                                    className="flex items-center text-muted-foreground mb-2 transition-all duration-300 group-hover:text-foreground">
                                                    <Building2
                                                        className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110"/>
                                                    <span className="text-sm font-medium">{job.companyName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Favorite Button */}
                                        <div className="relative">
                                            <Button
                                                variant={job.isFavorite ? "default" : "outline"}
                                                size="icon"
                                                className={`h-10 w-10 transition-all duration-300 hover:scale-110 ${
                                                    job.isFavorite
                                                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
                                                        : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                                }`}
                                                onClick={() => handleFavoriteToggle(job.jobId, job.title)}
                                            >
                                                {job.isFavorite ? (
                                                    <Heart className="h-5 w-5 fill-current animate-pulse"/>
                                                ) : (
                                                    <Heart
                                                        className="h-5 w-5 transition-all duration-300 hover:scale-110"/>
                                                )}
                                            </Button>

                                            {/* Floating animation for favorites */}
                                            {favoriteAnimations.has(job.jobId) && (
                                                <div className="absolute -top-2 -right-2 pointer-events-none">
                                                    <Heart
                                                        className="h-4 w-4 text-red-500 fill-red-500 animate-bounce"/>
                                                    <div
                                                        className="absolute inset-0 h-4 w-4 text-red-500 fill-red-500 animate-ping">
                                                        <Heart className="h-4 w-4"/>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Favorite indicator badge */}
                                            {job.isFavorite && (
                                                <div
                                                    className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"/>
                                            )}
                                        </div>
                                    </div>

                                    {/* Job Details */}
                                    <div className="space-y-3">
                                        {/* Location */}
                                        {job.location && (
                                            <div
                                                className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground group-hover:translate-x-1">
                                                <MapPin
                                                    className="h-4 w-4 mr-2 transition-all duration-300 group-hover:text-primary"/>
                                                <span className="text-sm font-medium">
                        {job.location.city}, {job.location.countryName}
                      </span>
                                            </div>
                                        )}

                                        {/* Salary and Employment Type */}
                                        <div className="flex flex-wrap gap-2">
                                            {job.salary && (
                                                <div
                                                    className="flex items-center bg-secondary border px-3 py-2 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105 hover:shadow-sm">
                                                    <Coins
                                                        className="h-4 w-4 mr-2 text-foreground transition-all duration-300 hover:text-primary"/>
                                                    <span className="text-sm font-semibold text-secondary-foreground">
                          {job.salary.minSalary} - {job.salary.maxSalary} {job.salary.currency}
                        </span>
                                                    <span
                                                        className="text-xs text-muted-foreground ml-1 font-medium">.{job.salary.payPeriod}</span>
                                                </div>
                                            )}

                                            {job.employmentType && (
                                                <Badge
                                                    variant="secondary"
                                                    className="px-3 py-2 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold"
                                                >
                                                    {formatEmploymentType(job.employmentType)}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Separator className="mx-6 transition-all duration-300 group-hover:bg-primary/20"/>

                                {/* Description */}
                                <div className="p-6 pt-4">
                                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 font-medium transition-all duration-300 group-hover:text-foreground">
                                        {job.shortDescription}
                                    </p>

                                    {/* Enhanced Skills Section */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Sparkles
                                                    className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180"/>
                                            </div>
                                            <span className="text-sm font-bold text-foreground">Required Skills</span>
                                            <div
                                                className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.slice(0, 4).map((skill: SkillType, skillIndex) => (
                                                <div
                                                    key={skill.skillId}
                                                    className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                                                    style={{
                                                        animationDelay: `${(index * 100) + (skillIndex * 50) + 400}ms`,
                                                        animationDuration: "400ms",
                                                    }}
                                                >
                                                    <Badge
                                                        variant="outline"
                                                        className="relative text-xs hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-3 py-2 border-primary/20 bg-gradient-to-r from-background to-muted/30"
                                                    >
                          <span className="relative z-10 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"/>
                              {skill.skillName}
                          </span>
                                                        <div
                                                            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300"/>
                                                    </Badge>
                                                </div>
                                            ))}
                                            {job.skills.length > 4 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs bg-gradient-to-r from-muted to-muted/70 hover:from-primary/10 hover:to-primary/5 transition-all duration-300 hover:scale-105 font-semibold px-3 py-2 border-dashed border-primary/30 animate-in fade-in-50 slide-in-from-bottom-2"
                                                    style={{
                                                        animationDelay: `${index * 100 + 600}ms`,
                                                        animationDuration: "400ms",
                                                    }}
                                                >
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3"/>+{job.skills.length - 4} more
                        </span>
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter
                                className="bg-muted/50 px-6 py-4 border-t transition-all duration-300 group-hover:bg-muted/70 flex items-center justify-between">
                                {/* Posted Date - Bottom Left */}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <div className="p-1 rounded-full bg-primary/10">
                                        <Clock className="h-3 w-3 text-primary"/>
                                    </div>
                                    <span className="text-xs font-medium">
                  {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                  })}
                </span>
                                </div>

                                {/* View Details Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="font-medium bg-white transition-all border round-xl duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-md transform active:scale-95 px-6 text-muted-foreground hover:font-semibold"
                                    onClick={() => navigate(`/jobs/${job.jobId}`)}
                                >
                                <span
                                    className="transition-all duration-300 group-hover:translate-x-1">View Details</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </>
        )
    }

    return (
        <>{renderContent()}</>
    )

}
