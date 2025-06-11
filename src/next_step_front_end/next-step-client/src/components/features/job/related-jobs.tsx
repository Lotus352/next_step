"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, DollarSign, Briefcase, TrendingUp, Star, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function RelatedJobs() {
  const relatedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "WebSolutions Ltd",
      location: "Ho Chi Minh City",
      salary: "$70K - $90K",
      type: "Full-time",
      logo: "/placeholder.svg?height=40&width=40",
      logoFallback: "WS",
      skills: ["React", "JavaScript", "CSS"],
      featured: true,
      rating: 4.8,
    },
    {
      id: 2,
      title: "Senior UI Developer",
      company: "DigitalCraft",
      location: "Remote",
      salary: "$85K - $110K",
      type: "Full-time",
      logo: "/placeholder.svg?height=40&width=40",
      logoFallback: "DC",
      skills: ["React", "TypeScript", "UI/UX"],
      featured: false,
      rating: 4.9,
    },
    {
      id: 3,
      title: "React Native Developer",
      company: "AppMakers Inc",
      location: "Hanoi",
      salary: "$75K - $95K",
      type: "Full-time",
      logo: "/placeholder.svg?height=40&width=40",
      logoFallback: "AM",
      skills: ["React Native", "JavaScript", "Mobile"],
      featured: true,
      rating: 4.7,
    },
  ]

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
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Similar Jobs</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {relatedJobs.map((job, index) => (
            <motion.div
              key={job.id}
              className="group/job relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <div className="border border-border/30 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-muted/5 to-transparent">
                {/* Featured badge */}
                {job.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-none rounded-xl p-0.5 transition-all duration-300 group-hover/job:scale-110 group-hover/job:rotate-3">
                    <AvatarImage src={job.logo || "/placeholder.svg"} alt={`${job.company} logo`} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300 group-hover/job:bg-primary/90">
                      {job.logoFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg truncate group-hover/job:text-primary transition-all duration-300 transform group-hover/job:translate-x-1">
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground transition-all duration-300 group-hover/job:text-foreground">
                      <span className="text-sm font-medium">{job.company}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium">{job.rating}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center bg-secondary border px-2 py-1 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center bg-secondary border px-2 py-1 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center bg-secondary border px-2 py-1 rounded-full transition-all duration-300 hover:bg-accent hover:scale-105">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((skill, skillIndex) => (
                        <div
                          key={skill}
                          className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                          style={{
                            animationDelay: `${index * 100 + skillIndex * 50}ms`,
                            animationDuration: "400ms",
                          }}
                        >
                          <Badge
                            variant="outline"
                            className="relative text-xs hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-2 py-1 border-primary/20 bg-gradient-to-r from-background to-muted/30"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-primary/60 animate-pulse" />
                              {skill}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300" />
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full font-medium bg-white transition-all border rounded-xl duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-md transform active:scale-95 px-6 text-muted-foreground hover:font-semibold"
                  >
                    <span className="transition-all duration-300 group-hover/job:translate-x-1">View Details</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          <Button
            variant="ghost"
            className="w-full rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 font-semibold"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View All Similar Jobs
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
