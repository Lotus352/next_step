"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Building2, Globe, MapPin, Users, Briefcase, ExternalLink} from "lucide-react"
import {useSelector} from "react-redux"
import type {RootState} from "@/store/store"
import ReviewStar from "@/components/review-star"
import ErrorPage from "@/pages/error-page"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {motion} from "framer-motion"
import {Separator} from "@/components/ui/separator"

export default function CompanyDescription() {
    // Redux state
    const {selected} = useSelector((state: RootState) => state.jobs)
    const company = selected?.postedBy.company

    return !selected ? <ErrorPage message="No job selected"/> : (
        <motion.div
            className="p-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-muted/5 to-muted/10 hover:from-muted/10 hover:to-muted/20 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
        >
            <Card
                className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/95">
                <CardHeader
                    className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-primary/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary"/>
                        <CardTitle>About {company?.name}</CardTitle>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-6">
                        <div className="flex-shrink-0">
                            <motion.div whileHover={{scale: 1.05}}
                                        transition={{type: "spring", stiffness: 300, damping: 10}}>
                                <Avatar className="h-28 w-28 border-2 border-primary/20 rounded-2xl shadow-lg">
                                    <AvatarImage src={company?.logoUrl || ""} alt={`${company?.name} logo`}/>
                                    <AvatarFallback
                                        className="text-2xl font-bold rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                        {company?.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                        {company?.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {company?.industries.map((industry) => (
                                            <Badge
                                                key={industry.industryId}
                                                className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 border-primary/20 text-primary/80 hover:text-primary rounded-full px-3 py-1"
                                            >
                                                {industry.industryName}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ReviewStar countReview={company ? company.countReview : 0}
                                                averageRating={company? company.averageRating : 0}/>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                                <Users className="h-4 w-4 text-primary/70"/>
                                <span>{company?.countEmployees} employees</span>
                            </div>

                            {company?.companyUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 gap-2 rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 border-primary/20 hover:border-primary/40 shadow-sm hover:shadow-md"
                                    onClick={() => window.open(company.companyUrl as string, "_blank")}
                                >
                                    <Globe className="h-3.5 w-3.5"/>
                                    Visit Website
                                    <ExternalLink className="h-3 w-3 ml-1"/>
                                </Button>
                            )}
                        </div>
                    </div>

                    <Separator className="my-6"/>

                    <div className="prose prose-muted max-w-none">
                        <div className="text-base leading-relaxed mb-8 whitespace-pre-line">{company?.description}</div>
                    </div>

                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 bg-gradient-to-br from-muted/10 to-muted/20 p-6 rounded-2xl border border-primary/10 shadow-inner">
                        {company?.founded && (
                            <div className="flex items-center gap-3">
                                <div
                                    className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                                    <Building2 className="h-6 w-6 text-primary"/>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Founded</div>
                                    <div className="font-medium">{company.founded}</div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                                <MapPin className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Location</div>
                                <div className="font-medium">
                                    {company?.location.city}, {company?.location.countryName}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                                <Users className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Company Size</div>
                                <div className="font-medium">{company?.countEmployees} employees</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                                <Briefcase className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Industry</div>
                                <div className="font-medium">
                                    {company?.industries.map((industry, index) => (
                                        <span key={industry.industryId}>
                      {index > 0 && <span className="mx-1">•</span>}
                                            {industry.industryName}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
