"use client"

import {useSelector} from "react-redux"
import {motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Briefcase, Building2, Calendar, GraduationCap, Clock, MapPin} from "lucide-react"
import type {RootState} from "@/store/store"
import {formatDate} from "@/lib/utils.ts";

export default function ProfileExperience() {
    const {profile} = useSelector((state: RootState) => state.user)
    if (!profile) return null
    const experiences = profile.experiences;

    return (experiences && experiences.length > 0) && (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.6}}
            className="animate-in fade-in-50 slide-in-from-bottom-8"
        >
            <Card
                className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader
                    className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Briefcase className="h-6 w-6 text-primary"/>
                        </div>
                        <CardTitle className="text-2xl font-bold">Work Experience</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="space-y-8">
                        {experiences.length > 0 ? (
                            experiences.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.5, delay: index * 0.1}}
                                    className="relative pl-8 pb-8"
                                >
                                    {/* Timeline connector */}
                                    {index < experiences.length - 1 && (
                                        <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-border"/>
                                    )}

                                    {/* Timeline dot */}
                                    <div
                                        className="absolute left-0 top-1.5 h-7 w-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                                        <div className="h-3 w-3 rounded-full bg-primary"/>
                                    </div>

                                    <div
                                        className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <div
                                            className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">{exp.experienceLevel.experienceName} - {exp.title}</h3>
                                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                                    <Building2 className="h-4 w-4"/>
                                                    <span>{exp.company}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                                    <MapPin className="h-4 w-4"/>
                                                    <span>{exp.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                                                <Calendar className="h-4 w-4 text-primary"/>
                                                <span className="text-sm font-medium">
                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-muted-foreground">{exp.description}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-4">
                                    <Briefcase className="h-8 w-8 text-muted-foreground"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No work experience added yet</h3>
                                <p className="text-muted-foreground max-w-md mx-auto">
                                    Add your work experience to showcase your professional journey.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className="mt-12">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <GraduationCap
                                    className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-45"/>
                            </div>
                            <span className="text-xl font-bold text-foreground">Education</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                        </div>

                        <div
                            className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Bachelor of Science in
                                        Computer Science</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <Building2 className="h-4 w-4"/>
                                        <span>University of Technology</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                                    <Clock className="h-4 w-4 text-primary"/>
                                    <span className="text-sm font-medium">2014 - 2018</span>
                                </div>
                            </div>

                            <div className="mt-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                    GPA: 3.8/4.0
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
