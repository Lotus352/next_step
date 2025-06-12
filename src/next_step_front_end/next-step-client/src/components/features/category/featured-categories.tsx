"use client"

import {Card, CardContent} from "@/components/ui/card"
import type {AppDispatch, RootState} from "@/store/store"
import {useDispatch, useSelector} from "react-redux"
import {useEffect} from "react"
import Loading from "@/components/loading"
import {clearIndustries, fetchFeaturedIndustries} from "@/store/slices/industries-slice"
import AlertDestructive from "@/components/destructive-alert"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {FEATURED_CATEGORIES_LIMIT} from "@/constants"
import {Briefcase, Users} from "lucide-react"
import {motion} from "framer-motion"
import {Badge} from "@/components/ui/badge"

export default function FeaturedCategories() {
    const dispatch = useDispatch<AppDispatch>()
    const {featured, status} = useSelector((state: RootState) => state.industries)

    useEffect(() => {
        dispatch(fetchFeaturedIndustries(FEATURED_CATEGORIES_LIMIT))
        return () => {
            dispatch(clearIndustries())
        }
    }, [dispatch])

    // Animation variants
    const container = {
        hidden: {opacity: 0},
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: {opacity: 0, y: 20},
        show: {opacity: 1, y: 0, transition: {duration: 0.5}},
    }

    const renderContent = () => {
        if (status === "loading") {
            return <Loading/>
        }
        if (status === "failed") {
            return <AlertDestructive message="Failed to fetch featured categories"/>
        }
        return (
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{once: true}}
            >
                {featured.map((category, index) => {
                    const initials = category.industryName
                        ? category.industryName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                        : "NA"

                    return (
                        <motion.div
                            key={category.industryId}
                            variants={item}
                            transition={{duration: 0.5, delay: index * 0.05}}
                            whileHover={{y: -5, transition: {duration: 0.2}}}
                        >
                            <Card
                                className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 h-full bg-background/80 backdrop-blur-sm">
                                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                                    <div className="relative mb-5">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300"/>
                                        <div
                                            className="relative h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 shadow-md group-hover:shadow-lg transition-all duration-300">
                                            {category.icon ? (
                                                <Avatar className="h-8 w-8 border-none p-0.5">
                                                    <AvatarImage
                                                        src={category.icon || "/placeholder.svg"}
                                                        alt={category.industryName}
                                                        className="object-cover"
                                                    />
                                                    <AvatarFallback
                                                        className="bg-primary/20 text-primary font-bold text-sm">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <Briefcase className="h-7 w-7 text-primary"/>
                                            )}
                                            <div
                                                className="absolute top-2 right-2 w-2 h-2 bg-primary/60 rounded-full animate-pulse"/>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors duration-300">
                                        {category.industryName}
                                    </h3>

                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <Users className="h-3.5 w-3.5 text-muted-foreground"/>
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-muted/50 hover:bg-accent transition-all duration-300 hover:scale-105 font-medium px-2 py-0.5"
                                        >
                                            {category.countJobs} jobs
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>
        )
    }

    return <>{renderContent()}</>
}
