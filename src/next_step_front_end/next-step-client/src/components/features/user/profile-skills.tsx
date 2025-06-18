"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Plus, X, Check, Search, Loader2 } from "lucide-react"
import { updateUserSkills } from "@/store/slices/user-slice"
import type { AppDispatch, RootState } from "@/store/store"
import type SkillType from "@/types/skill-type"
import { StatusNotification, type NotificationType } from "@/components/notification-state/status-notification"

interface ProfileSkillsProps {
  isOwner: boolean
}

export default function ProfileSkills({ isOwner }: ProfileSkillsProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, statuses } = useSelector((state: RootState) => state.user)
  const { content: availableSkills } = useSelector((state: RootState) => state.skills)

  const [isEditing, setIsEditing] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<SkillType[]>(profile?.skills || [])
  const [searchQuery, setSearchQuery] = useState("")

  // Notification state
  const [notification, setNotification] = useState<{
    isVisible: boolean
    type: NotificationType
    title: string
    message: string
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  })

  useEffect(() => {
    if (profile) {
      setSelectedSkills(profile.skills)
    }
  }, [profile])

  if (!profile) return null

  const handleToggleSkill = (skill: SkillType) => {
    if (!isOwner) return

    const isSelected = selectedSkills.some((s) => s.skillId === skill.skillId)

    if (isSelected) {
      setSelectedSkills(selectedSkills.filter((s) => s.skillId !== skill.skillId))
    } else {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    })
  }

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  const handleSaveSkills = () => {
    if (!isOwner) return

    // Show loading notification
    showNotification("loading", "Updating Skills", "Please wait while we update your skills...")

    dispatch(
        updateUserSkills({
          id: profile.userId,
          skillIds: selectedSkills.map((skill) => skill.skillId),
        }),
    )
        .unwrap()
        .then(() => {
          // Show success notification
          showNotification(
              "success",
              "Skills Updated",
              `Successfully updated your skills (${selectedSkills.length} skills)`,
          )
          setIsEditing(false)
        })
        .catch((error) => {
          // Show error notification
          showNotification("error", "Update Failed", error?.message || "There was a problem updating your skills")
        })
  }

  const handleCancelEdit = () => {
    setSelectedSkills(profile.skills)
    setIsEditing(false)
  }

  const filteredSkills = availableSkills.filter((skill) =>
      skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
      <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="animate-in fade-in-50 slide-in-from-bottom-8"
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">Skills</CardTitle>
                </div>

                {/* Only show edit button for profile owner */}
                {isOwner && !isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Edit Skills
                    </Button>
                ) : isOwner && isEditing ? (
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="gap-1">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                          variant="default"
                          size="sm"
                          onClick={handleSaveSkills}
                          className="gap-1"
                          disabled={statuses.updatingSkills === "loading"}
                      >
                        {statuses.updatingSkills === "loading" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                        ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Save Skills
                            </>
                        )}
                      </Button>
                    </div>
                ) : null}
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {isEditing && isOwner ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                          type="text"
                          placeholder="Search skills..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Selected Skills ({selectedSkills.length})</h3>
                      <div className="flex flex-wrap gap-2 min-h-10">
                        {selectedSkills.map((skill) => (
                            <Badge
                                key={skill.skillId}
                                variant="secondary"
                                className="px-3 py-2 gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                            >
                              {skill.skillName}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => handleToggleSkill(skill)} />
                            </Badge>
                        ))}
                        {selectedSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills selected</p>}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Available Skills</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {filteredSkills.map((skill) => {
                          const isSelected = selectedSkills.some((s) => s.skillId === skill.skillId)
                          return (
                              <div
                                  key={skill.skillId}
                                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200${
                                      isSelected
                                          ? "bg-primary/10 border-primary/30"
                                          : "bg-background hover:bg-muted/50 border-border/50"
                                  }   
                                                    `}
                                  onClick={() => handleToggleSkill(skill)}
                              >
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggleSkill(skill)}
                                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                                <span className="font-medium">{skill.skillName}</span>
                              </div>
                          )
                        })}

                        {filteredSkills.length === 0 && (
                            <p className="text-sm text-muted-foreground col-span-3">No skills found matching your search</p>
                        )}
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="space-y-6">
                    {profile.skills && profile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {profile.skills.map((skill) => (
                              <div
                                  key={skill.skillId}
                                  className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                              >
                                <Badge
                                    variant="outline"
                                    className="relative text-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-3 py-2 border-primary/20 bg-gradient-to-r from-background to-muted/30"
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
                    ) : (
                        <div className="text-center py-10">
                          <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-4">
                            <Sparkles className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No skills added yet</h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            {isOwner
                                ? "Add your professional skills to help employers find you for relevant positions."
                                : "This user hasn't added any skills to their profile yet."}
                          </p>
                          {isOwner && (
                              <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Skills
                              </Button>
                          )}
                        </div>
                    )}
                  </div>
              )}
            </CardContent>

            {!isEditing && profile.skills && profile.skills.length > 0 && (
                <CardFooter className="bg-muted/50 px-8 py-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">{profile.skills.length}</span> skills{" "}
                    {isOwner ? "added to your profile" : "in this profile"}
                  </p>
                </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* Status notification - only show for profile owner */}
        {isOwner && (
            <StatusNotification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={hideNotification}
                showProgress={notification.type !== "loading"}
            />
        )}
      </>
  )
}
