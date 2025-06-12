"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { X, Briefcase, GraduationCap, Code, Loader2, AlertCircle, ChevronLeft } from "lucide-react"
import { fetchSkills } from "@/store/slices/skills-slice"
import { fetchLevels } from "@/store/slices/experience-levels-slice"
import { fetchEmploymentTypes, updateJobRequest, initializeJobRequest } from "@/store/slices/jobs-slice"
import type { AppDispatch, RootState } from "@/store/store"
import { DEFAULT_PAGE, DEFAULT_SKILL_SIZE, DEFAULT_LEVEL_SIZE } from "@/constants"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import type { JobRequest } from "@/types/job-type"

interface CriteriaSelectorProps {
  onClearAll: () => void
  onBack: () => void
  onSubmit: () => void
}

export function CriteriaSelector({ onClearAll, onBack, onSubmit }: CriteriaSelectorProps) {
  const dispatch = useDispatch<AppDispatch>()

  // Redux state
  const skills = useSelector((state: RootState) => state.skills.content)
  const levels = useSelector((state: RootState) => state.experienceLevels.content)
  const employmentTypes = useSelector((state: RootState) => state.jobs.employmentTypes)
  const skillsStatus = useSelector((state: RootState) => state.skills.status)
  const levelsStatus = useSelector((state: RootState) => state.experienceLevels.status)
  const request = useSelector((state: RootState) => state.jobs.request)

  // Local state for form fields
  const [formData, setFormData] = useState({
    employmentType: "",
    skillIds: [] as number[],
    experienceLevelIds: [] as number[],
  })

  // Initialize request if it doesn't exist
  useEffect(() => {
    if (!request) {
      dispatch(initializeJobRequest())
    } else {
      // Populate form with existing data if available
      setFormData({
        employmentType: request.employmentType || "",
        skillIds: request.skillIds || [],
        experienceLevelIds: request.experienceLevelIds || [],
      })
    }
  }, [dispatch, request])

  const selectedEmploymentType = formData.employmentType || ""
  const selectedSkills = formData.skillIds?.map(String) || []
  const selectedExperienceLevels = formData.experienceLevelIds?.map(String) || []

  const isSkillsLoading = skillsStatus === "loading"
  const isLevelsLoading = levelsStatus === "loading"

  useEffect(() => {
    dispatch(fetchSkills({ page: DEFAULT_PAGE, size: DEFAULT_SKILL_SIZE }))
    dispatch(fetchLevels({ page: DEFAULT_PAGE, size: DEFAULT_LEVEL_SIZE }))
    dispatch(fetchEmploymentTypes())
  }, [dispatch])

  const handleEmploymentTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentType: value,
    }))
  }

  const handleAddSkill = (skillId: string) => {
    if (skillId === "all") {
      setFormData((prev) => ({
        ...prev,
        skillIds: [],
      }))
      return
    }

    if (!selectedSkills.includes(skillId)) {
      const newSkills = [...selectedSkills, skillId]
      setFormData((prev) => ({
        ...prev,
        skillIds: newSkills.map((id) => Number(id)),
      }))
    }
  }

  const handleRemoveSkill = (skillId: string) => {
    const newSkills = selectedSkills.filter((skill) => skill !== skillId)
    setFormData((prev) => ({
      ...prev,
      skillIds: newSkills.map((id) => Number(id)),
    }))
  }

  const handleAddExperience = (experienceId: string) => {
    if (experienceId === "all") {
      setFormData((prev) => ({
        ...prev,
        experienceLevelIds: [],
      }))
      return
    }

    if (!selectedExperienceLevels.includes(experienceId)) {
      const newLevels = [...selectedExperienceLevels, experienceId]
      setFormData((prev) => ({
        ...prev,
        experienceLevelIds: newLevels.map((id) => Number(id)),
      }))
    }
  }

  const handleRemoveExperience = (experienceId: string) => {
    const newLevels = selectedExperienceLevels.filter((level) => level !== experienceId)
    setFormData((prev) => ({
      ...prev,
      experienceLevelIds: newLevels.map((id) => Number(id)),
    }))
  }

  const handleClearAll = () => {
    setFormData({
      employmentType: "",
      skillIds: [],
      experienceLevelIds: [],
    })
    onClearAll()
  }

  const handleSubmit = () => {
    // Only save to Redux when clicking Submit
    const updatedJob = {
      ...request,
      ...formData,
    } as JobRequest

    dispatch(updateJobRequest(updatedJob))
    onSubmit()
  }

  // Check if form is complete for local validation
  const isFormComplete = !!formData.employmentType

  const getSkillNameById = (id: string) => {
    const skill = skills.find((skill) => skill.skillId.toString() === id)
    return skill ? skill.skillName : id
  }

  const getExperienceNameById = (id: string) => {
    const level = levels.find((level) => level.experienceId.toString() === id)
    return level ? level.experienceName : id
  }

  const formatTextEnum = (text: string) => {
    return text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                Job Criteria
              </CardTitle>
              <CardDescription className="mt-1.5">
                Define employment type, required skills, and experience levels
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>
          <Separator className="bg-gradient-to-r from-border/50 via-border/30 to-border/50" />
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="employmentTypes" className="font-medium text-sm">
                Employment Type <span className="text-destructive">*</span>
              </Label>
            </div>
            <Select value={selectedEmploymentType || undefined} onValueChange={handleEmploymentTypeChange}>
              <SelectTrigger
                id="employmentTypes"
                className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
              >
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-lg border-border/50 shadow-lg">
                <div className="sticky top-0 bg-background p-2 border-b border-border/30 z-10">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Select employment type</div>
                </div>
                {employmentTypes.length > 0 ? (
                  employmentTypes.map((type) => (
                    <SelectItem key={type} value={type} className="flex items-center gap-2 rounded-md my-1 pl-3 group">
                      <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Briefcase className="h-3.5 w-3.5 text-primary" />
                      </div>
                      {formatTextEnum(type)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    <p className="text-sm">No employment types available</p>
                  </div>
                )}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="experience" className="font-medium text-sm">
                Experience Level
              </Label>
              {isLevelsLoading && (
                <div className="flex items-center gap-1 ml-auto">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
            {isLevelsLoading ? (
              <Skeleton className="h-11 w-full" />
            ) : (
              <Select value="" onValueChange={handleAddExperience}>
                <SelectTrigger
                  id="experience"
                  className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
                >
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-lg border-border/50 shadow-lg">
                  <div className="sticky top-0 bg-background p-2 border-b border-border/30 z-10">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Select experience levels</div>
                  </div>
                  <SelectItem value="all" className="flex items-center gap-2 rounded-md my-1 pl-3 group">
                    <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Clear all experience levels
                  </SelectItem>
                  {levels.length > 0 ? (
                    levels.map((level) => (
                      <SelectItem
                        key={level.experienceId}
                        value={level.experienceId.toString()}
                        disabled={selectedExperienceLevels.includes(level.experienceId.toString())}
                        className="flex items-center gap-2 rounded-md my-1 pl-3 group disabled:opacity-50"
                      >
                        <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {level.experienceName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <GraduationCap className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm">No experience levels available</p>
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}

            {selectedExperienceLevels.length > 0 && (
              <ScrollArea className="h-auto max-h-32 w-full rounded-lg border border-border/30 bg-muted/20 p-3 shadow-inner">
                <div className="flex flex-wrap gap-2">
                  {selectedExperienceLevels.map((expId, index) => (
                    <motion.div
                      key={expId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge className="flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary py-2 px-3 rounded-lg transition-all border border-primary/20 shadow-sm hover:shadow">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {getExperienceNameById(expId)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 hover:bg-primary/20 rounded-full ml-1 transition-colors"
                          onClick={() => handleRemoveExperience(expId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Code className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="skills" className="font-medium text-sm">
                Skills
              </Label>
              {isSkillsLoading && (
                <div className="flex items-center gap-1 ml-auto">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">Loading...</span>
                </div>
              )}
            </div>
            {isSkillsLoading ? (
              <Skeleton className="h-11 w-full" />
            ) : (
              <Select value="" onValueChange={handleAddSkill}>
                <SelectTrigger
                  id="skills"
                  className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
                >
                  <SelectValue placeholder="Select skills" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-lg border-border/50 shadow-lg">
                  <div className="sticky top-0 bg-background p-2 border-b border-border/30 z-10">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Select required skills</div>
                  </div>
                  <SelectItem value="all" className="flex items-center gap-2 rounded-md my-1 pl-3 group">
                    <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Code className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Clear all skills
                  </SelectItem>
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <SelectItem
                        key={skill.skillId}
                        value={skill.skillId.toString()}
                        disabled={selectedSkills.includes(skill.skillId.toString())}
                        className="flex items-center gap-2 rounded-md my-1 pl-3 group disabled:opacity-50"
                      >
                        <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Code className="h-3.5 w-3.5 text-primary" />
                        </div>
                        {skill.skillName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Code className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p className="text-sm">No skills available</p>
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}

            {selectedSkills.length > 0 && (
              <ScrollArea className="h-auto max-h-32 w-full rounded-lg border border-border/30 bg-muted/20 p-3 shadow-inner">
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skillId, index) => (
                    <motion.div
                      key={skillId}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge className="flex items-center gap-1.5 bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary py-2 px-3 rounded-lg transition-all border border-primary/20 shadow-sm hover:shadow">
                        <Code className="h-3.5 w-3.5" />
                        {getSkillNameById(skillId)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 p-0 hover:bg-primary/20 rounded-full ml-1 transition-colors"
                          onClick={() => handleRemoveSkill(skillId)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="bg-muted/30 p-4 rounded-lg border border-border/30">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full mt-0.5">
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Selection Tips</h4>
                <p className="text-xs text-muted-foreground">
                  Choose the most essential skills and experience levels. Too many requirements may discourage qualified
                  candidates from applying.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="border-border/50 hover:bg-muted/50 transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormComplete}
              className={`flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 ${
                !isFormComplete ? "opacity-70" : ""
              }`}
            >
              Post Job
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
