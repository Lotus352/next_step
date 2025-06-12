"use client"

import {useSelector} from "react-redux"
import {motion} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {User, Mail, Phone, Calendar, GraduationCap, Briefcase, Flag, Building2} from "lucide-react"
import type {RootState} from "@/store/store"

export default function ProfileInformation() {
    const {profile} = useSelector((state: RootState) => state.user)

    if (!profile) return null

    return (
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
                            <User className="h-6 w-6 text-primary"/>
                        </div>
                        <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <User
                                        className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12"/>
                                </div>
                                <span className="text-xl font-bold text-foreground">Basic Details</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                            </div>

                            <div className="space-y-4">
                                <div
                                    className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <User className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Full Name
                                                </div>
                                                <div
                                                    className="font-semibold">{profile.fullName || "Not provided"}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <Mail className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Email
                                                    Address
                                                </div>
                                                <div className="font-semibold">{profile.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <Phone className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Phone
                                                    Number
                                                </div>
                                                <div
                                                    className="font-semibold">{profile.phoneNumber || "Not provided"}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <Flag className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Nationality
                                                </div>
                                                <div
                                                    className="font-semibold">{profile.nationality || "Not provided"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-lg bg-primary/10">
                                    <Briefcase
                                        className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-12"/>
                                </div>
                                <span className="text-xl font-bold text-foreground">Professional Details</span>
                                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                            </div>

                            <div className="space-y-4">
                                <div
                                    className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <GraduationCap className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Experience
                                                    Level
                                                </div>
                                                <div className="font-semibold">
                                                    {profile.experiences && profile.experiences.length > 0 ? (
                                                        (() => {
                                                            const latestExperience = [...profile.experiences]
                                                                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
                                                            return (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="mt-1 bg-primary/5 text-primary border-primary/20"
                                                                >
                                                                    {latestExperience.experienceLevel.experienceName}
                                                                </Badge>
                                                            );
                                                        })()
                                                    ) : (
                                                        "Not specified"
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {profile.company && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                    <Building2 className="h-4 w-4 text-primary"/>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-muted-foreground font-medium">Company
                                                    </div>
                                                    <div className="font-semibold">{profile.company.name}</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                                                <Calendar className="h-4 w-4 text-primary"/>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground font-medium">Account
                                                    Status
                                                </div>
                                                <div className="font-semibold">
                                                    <Badge
                                                        className={
                                                            profile.status === "ACTIVE"
                                                                ? "bg-green-100 text-green-700 border-green-300"
                                                                : "bg-amber-100 text-amber-700 border-amber-300"
                                                        }
                                                    >
                                                        {profile.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
