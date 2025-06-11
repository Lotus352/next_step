"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Briefcase, GraduationCap, Code, Sparkles } from "lucide-react"
import { formatTextEnum } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setFilter } from "@/store/slices/jobs-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { DEFAULT_EMPLOYMENT_TYPE } from "@/constants"

export default function JobCriteriaFilter() {
  const dispatch = useDispatch<AppDispatch>()

  const filter = useSelector((state: RootState) => state.jobs.filter || [])
  const skills = useSelector((state: RootState) => state.skills.content || [])
  const employmentTypes = useSelector((state: RootState) => state.jobs.employmentTypes || [])
  const experienceLevels = useSelector((state: RootState) => state.experienceLevels.content || [])

  // Handle adding a skill
  const handleAddSkill = (skillName: string) => {
    if (skillName === "all") {
      dispatch(setFilter({ ...filter, skills: [] }))
      return
    }
    if (!filter.skills.includes(skillName)) {
      dispatch(setFilter({ ...filter, skills: [...filter.skills, skillName] }))
    }
  }

  // Handle removing a skill
  const handleRemoveSkill = (skillName: string) => {
    dispatch(
      setFilter({
        ...filter,
        skills: filter.skills.filter((skill) => skill !== skillName),
      }),
    )
  }

  // Handle adding an experience level
  const handleAddExperience = (experienceName: string) => {
    if (experienceName === "all") {
      dispatch(setFilter({ ...filter, experienceLevels: [] }))
      return
    }
    if (!filter.experienceLevels.includes(experienceName)) {
      dispatch(
        setFilter({
          ...filter,
          experienceLevels: [...filter.experienceLevels, experienceName],
        }),
      )
    }
  }

  // Handle removing an experience level
  const handleRemoveExperience = (experienceName: string) => {
    dispatch(
      setFilter({
        ...filter,
        experienceLevels: filter.experienceLevels.filter((exp) => exp !== experienceName),
      }),
    )
  }

  // Clear all filters
  const handleClearAll = () => {
    dispatch(
      setFilter({
        ...filter,
        employmentType: DEFAULT_EMPLOYMENT_TYPE,
        experienceLevels: [],
        skills: [],
      }),
    )
  }

  // UI state helpers
  const hasJobCriteriaFilters =
    filter.skills.length > 0 || 
    filter.experienceLevels.length > 0 || 
    filter.employmentType !== DEFAULT_EMPLOYMENT_TYPE

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  }

  return (
    <Card className="shadow-md border-border/30 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Job Criteria
          </CardTitle>
          {hasJobCriteriaFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full"
            >
              Clear all
            </Button>
          )}
        </div>
        <Separator className="bg-border/30" />
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="employmentTypes" className="font-medium text-sm">
              Employment Type
            </Label>
          </div>
          <Select
            value={filter.employmentType || undefined}
            onValueChange={(value) => dispatch(setFilter({ ...filter, employmentType: value }))}
          >
            <SelectTrigger
              id="employmentTypes"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              <SelectItem value="all">All types</SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type} className="flex items-center gap-2">
                  {formatTextEnum(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="experience" className="font-medium text-sm">
              Experience Level
            </Label>
          </div>
          <Select value="" onValueChange={handleAddExperience}>
            <SelectTrigger
              id="experience"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              <SelectItem value="all">All experience levels</SelectItem>
              {experienceLevels.map((level) => (
                <SelectItem
                  key={level.experienceId}
                  value={level.experienceName}
                  className="flex items-center gap-2"
                  disabled={filter.experienceLevels.includes(level.experienceName)}
                >
                  {level.experienceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filter.experienceLevels.length > 0 && (
            <div className="mt-3">
              <ScrollArea className="h-auto max-h-24 w-full rounded-lg border border-border/50 bg-background/50 p-2 shadow-inner">
                <AnimatePresence>
                  <motion.div
                    className="flex flex-wrap gap-2 p-0.5"
                    initial="initial"
                    animate="animate"
                    variants={{
                      initial: {},
                      animate: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {filter.experienceLevels.map((exp) => (
                      <motion.div key={exp} variants={badgeVariants} exit="exit" layout>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-primary/10 hover:bg-primary/15 text-primary py-1.5 px-3 rounded-md transition-all border border-primary/20"
                        >
                          <GraduationCap className="h-3 w-3 mr-1" />
                          {exp}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 hover:bg-primary/20 rounded-full ml-1 transition-colors"
                            onClick={() => handleRemoveExperience(exp)}
                          >
                            <X className="h-3 w-3 p-0.5" /> <span className="sr-only">Remove {exp}</span>
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Code className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="skills" className="font-medium text-sm">
              Skills
            </Label>
          </div>
          <Select value="" onValueChange={handleAddSkill}>
            <SelectTrigger
              id="skills"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select skills" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              <SelectItem value="all">All skills</SelectItem>
              {skills.map((skill) => (
                <SelectItem
                  key={skill.skillId}
                  value={skill.skillName}
                  className="flex items-center gap-2"
                  disabled={filter.skills.includes(skill.skillName)}
                >
                  {skill.skillName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filter.skills.length > 0 && (
            <div className="mt-3">
              <ScrollArea className="h-auto max-h-24 w-full rounded-lg border border-border/50 bg-background/50 p-2 shadow-inner">
                <AnimatePresence>
                  <motion.div
                    className="flex flex-wrap gap-2 p-0.5"
                    initial="initial"
                    animate="animate"
                    variants={{
                      initial: {},
                      animate: {
                        transition: {
                          staggerChildren: 0.05,
                        },
                      },
                    }}
                  >
                    {filter.skills.map((skill) => (
                      <motion.div key={skill} variants={badgeVariants} exit="exit" layout>
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-primary/10 hover:bg-primary/15 text-primary py-1.5 px-3 rounded-md transition-all border border-primary/20"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {skill}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 hover:bg-primary/20 rounded-full ml-1 transition-colors"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <X className="h-3 w-3 p-0.5" />
                            <span className="sr-only">Remove {skill}</span>
                          </Button>
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
