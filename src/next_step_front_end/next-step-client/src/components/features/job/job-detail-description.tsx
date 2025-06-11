"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { checkExpiryDate, formatTextEnum } from "@/lib/utils"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import ErrorPage from "@/pages/error-page"
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Lightbulb,
  MapPin,
  GraduationCap,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function JobDetailDescription() {
  const selected = useSelector((state: RootState) => state.jobs.selected)

  if (!selected) {
    return <ErrorPage message="No job selected" />
  }
  const isExpired = selected.expiryDate && checkExpiryDate(selected.expiryDate)
  const benefits = selected.benefits ? selected.benefits.split("|") : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="animate-in fade-in-50 slide-in-from-bottom-8"
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
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
                  <Sparkles className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180" />
                </div>
                <span className="text-xl font-bold text-foreground">Overview</span>
                <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
              </div>
              <div className="text-base leading-relaxed whitespace-pre-line bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                {selected.detailedDescription}
              </div>
            </div>

            <Separator className="my-8 bg-border/50 transition-all duration-300 group-hover:bg-primary/20" />

            {/* Job details section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {selected.employmentType && (
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
                      {formatTextEnum(selected.employmentType)}
                    </Badge>
                  </div>
                </motion.div>
              )}

              {selected.location && (
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
                      {selected.location.city}, {selected.location.countryName}
                    </p>
                  </div>
                </motion.div>
              )}

              {selected.experienceLevels && selected.experienceLevels.length > 0 && (
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
                      {selected.experienceLevels.map((exp) => (
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

              {selected.expiryDate && (
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
                        className={`p-2 rounded-lg ${isExpired ? "bg-red-100" : "bg-primary/10 group-hover/item:bg-primary/15"} transition-colors duration-300`}
                      >
                        <Calendar className={`h-5 w-5 ${isExpired ? "text-red-500" : "text-primary"}`} />
                      </div>
                      <h3 className="font-semibold text-lg">Application Deadline</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-base">{selected.expiryDate.split(" ")[0]}</p>
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
            {selected.skills && selected.skills.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Lightbulb className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  <span className="text-xl font-bold text-foreground">Required Skills</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                </div>

                <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="flex flex-wrap gap-2">
                    {selected.skills.map((skill, index) => (
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
            {selected.benefits && selected.benefits.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary transition-all duration-300 group-hover:rotate-180" />
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
