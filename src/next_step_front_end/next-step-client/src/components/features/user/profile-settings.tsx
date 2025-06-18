"use client"

import type React from "react"

import {useState, useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {motion, AnimatePresence} from "framer-motion"
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {Switch} from "@/components/ui/switch"
import {Separator} from "@/components/ui/separator"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {
    Settings,
    Save,
    Loader2,
    Bell,
    Shield,
    Key,
    User,
    Briefcase,
    Plus,
    Edit,
    Trash2,
    Calendar,
    MapPin,
    Building2,
    GraduationCap,
    Eye,
    EyeOff,
} from "lucide-react"
import {updateUserProfile, fetchUserProfile, changePassword} from "@/store/slices/user-slice"
import type {AppDispatch, RootState} from "@/store/store"
import {StatusNotification, type NotificationType} from "@/components/notification-state/status-notification"
import type {UserExperienceType, UserRequest, UserExperienceRequest} from "@/types/user-type"
import type ExperienceLevelType from "@/types/experience-level-type.ts"

export default function ProfileSettings() {
    const dispatch = useDispatch<AppDispatch>()
    const {profile, statuses} = useSelector((state: RootState) => state.user)
    const {content: experienceLevels} = useSelector((state: RootState) => state.experienceLevels)

    const [formData, setFormData] = useState<Partial<UserRequest>>({
        username: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        nationality: "",
        isSend: true,
        bio: "",
        status: null,
        companyId: null,
        skillIds: [],
        roleIds: [],
        experiences: [],
    })

    // Password change state
    const [passwordDialog, setPasswordDialog] = useState({
        isOpen: false,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
    })

    // Experiences state - keep as UserExperienceType for display
    const [experiences, setExperiences] = useState<UserExperienceType[]>([])

    // Experience editing state
    const [isEditingExperience, setIsEditingExperience] = useState(false)
    const [currentEditingExperience, setCurrentEditingExperience] = useState<UserExperienceType | null>(null)
    const [isNewExperience, setIsNewExperience] = useState(false)

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

    // Initialize form data from profile
    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username,
                email: profile.email,
                fullName: profile.fullName || "",
                phoneNumber: profile.phoneNumber || "",
                nationality: profile.nationality || "",
                bio: profile.bio || "",
                status: profile.status,
                isSend: profile.isSend,
                companyId: profile.company?.companyId || null,
                skillIds: profile.skills.map((skill) => skill.skillId),
                roleIds: profile.roles.map((role) => role.roleId),
                experiences: [],
            })

            // Sort experiences by start date (most recent first)
            if (profile.experiences && profile.experiences.length > 0) {
                const sortedExperiences = [...profile.experiences].sort((a, b) => {
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                })
                setExperiences(sortedExperiences)
            }
        }
    }, [profile])

    if (!profile) return null

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
        })
    }

    // Convert UserExperienceType[] to UserExperienceRequest[] for API
    const convertExperiencesForAPI = (experiences: UserExperienceType[]): UserExperienceRequest[] => {
        return experiences.map((exp) => ({
            userId: exp.userId,
            experienceId: exp.experienceLevel.experienceId,
            title: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
        }))
    }

    // Handle input changes for basic profile
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    // Handle switch changes
    const handleSwitchChange = (name: string, checked: boolean) => {
        console.log(checked)
        setFormData((prev) => ({...prev, [name]: checked}))
    }

    // Handle password input changes
    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setPasswordDialog((prev) => ({...prev, [name]: value}))
    }

    // Toggle password visibility
    const togglePasswordVisibility = (field: "showCurrentPassword" | "showNewPassword" | "showConfirmPassword") => {
        setPasswordDialog((prev) => ({...prev, [field]: !prev[field]}))
    }

    // Handle password change
    const handleChangePassword = () => {
        const {currentPassword, newPassword, confirmPassword} = passwordDialog

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showNotification("error", "Validation Error", "Please fill in all password fields")
            return
        }

        if (newPassword !== confirmPassword) {
            showNotification("error", "Password Mismatch", "New password and confirm password do not match")
            return
        }

        if (newPassword.length < 6) {
            showNotification("error", "Password Too Short", "New password must be at least 6 characters long")
            return
        }

        // Show loading notification
        showNotification("loading", "Changing Password", "Please wait while we update your password...")

        // Dispatch change password action
        dispatch(
            changePassword({
                id: profile.userId,
                changePasswordRequest: {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                },
            }),
        )
            .unwrap()
            .then(() => {
                // Success - Close dialog first
                setPasswordDialog({
                    isOpen: false,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                    showCurrentPassword: false,
                    showNewPassword: false,
                    showConfirmPassword: false,
                })
                // Then show success notification
                showNotification("success", "Password Changed", "Your password has been updated successfully")
            })
            .catch((error: any) => {
                // Close dialog first
                setPasswordDialog({
                    isOpen: false,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                    showCurrentPassword: false,
                    showNewPassword: false,
                    showConfirmPassword: false,
                })

                // Then show error notification
                console.error("Password change failed:", error.message)

                showNotification("error", "Password Change Failed", "Incorrect current password or other error occurred")
            })
    }

    // Handle experience input changes
    const handleExperienceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        if (currentEditingExperience) {
            setCurrentEditingExperience({
                ...currentEditingExperience,
                [name]: value,
            })
        }
    }

    // Handle experience level change
    const handleExperienceLevelChange = (value: string) => {
        if (!currentEditingExperience) return

        // Find the selected experience level
        const selectedLevel = experienceLevels.find((level) => level.experienceId === Number(value))

        if (selectedLevel && currentEditingExperience) {
            setCurrentEditingExperience({
                ...currentEditingExperience,
                experienceLevel: selectedLevel,
            })
        }
    }

    // Open experience editor for a new experience
    const handleAddExperience = () => {
        // Create a default new experience with temporary ID
        const newExperience: UserExperienceType = {
            id: 0,
            userId: profile.userId,
            experienceLevel:
                experienceLevels[0] ||
                ({
                    experienceId: 1,
                    experienceName: "Entry Level",
                } as ExperienceLevelType),
            title: "",
            company: "",
            location: "",
            description: "",
            startDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
            endDate: null,
        }

        setCurrentEditingExperience(newExperience)
        setIsNewExperience(true)
        setIsEditingExperience(true)
    }

    // Open experience editor for an existing experience
    const handleEditExperience = (experience: UserExperienceType) => {
        setCurrentEditingExperience({...experience})
        setIsNewExperience(false)
        setIsEditingExperience(true)
    }

    // Handle experience deletion
    const handleDeleteExperience = (experienceToDelete: UserExperienceType) => {
        setExperiences(
            experiences.filter(
                (exp) =>
                    exp !== experienceToDelete &&
                    !(
                        exp.title === experienceToDelete.title &&
                        exp.company === experienceToDelete.company &&
                        exp.startDate === experienceToDelete.startDate
                    ),
            ),
        )
        showNotification("success", "Experience Deleted", "The experience has been removed from your profile")
    }

    // Save experience changes
    const handleSaveExperience = () => {
        if (!currentEditingExperience) return

        if (isNewExperience) {
            // Add new experience to the list
            setExperiences([currentEditingExperience, ...experiences])
        } else {
            // Update existing experience - find by matching properties since we might not have stable IDs
            setExperiences(
                experiences.map((exp) => {
                    // For existing experiences, match by original properties
                    if (
                        !isNewExperience &&
                        exp.title === currentEditingExperience.title &&
                        exp.company === currentEditingExperience.company &&
                        exp.startDate === currentEditingExperience.startDate
                    ) {
                        return currentEditingExperience
                    }
                    return exp
                }),
            )
        }

        // Close the dialog
        setIsEditingExperience(false)
        setCurrentEditingExperience(null)

        // Show notification only for updates, not for new additions
        if (!isNewExperience) {
            showNotification("success", "Experience Updated", "Your experience has been updated successfully")
        }
    }

    // Show notification
    const showNotification = (type: NotificationType, title: string, message: string) => {
        setNotification({
            isVisible: true,
            type,
            title,
            message,
        })
    }

    // Hide notification
    const hideNotification = () => {
        setNotification((prev) => ({...prev, isVisible: false}))
    }

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Show loading notification
        showNotification("loading", "Saving Changes", "Please wait while we update your profile...")

        // Convert experiences to API format
        const apiExperiences = convertExperiencesForAPI(experiences)

        // Prepare the update data according to UserRequest interface
        const updateData: UserRequest = {
            username: formData.username || profile.username,
            email: formData.email || profile.email,
            fullName: formData.fullName || null,
            avatarUrl: profile.avatarUrl,
            resumeUrl: profile.resumeUrl,
            phoneNumber: formData.phoneNumber || "",
            nationality: formData.nationality || null,
            bio: formData.bio || null,
            status: formData.status || null,
            isSend: formData.isSend || true,
            companyId: formData.companyId || null,
            skillIds: formData.skillIds || profile.skills.map((skill) => skill.skillId),
            roleIds: formData.roleIds || profile.roles.map((role) => role.roleId),
            experiences: apiExperiences, // Use converted experiences
        }

        // Dispatch with correct parameters: { id, profile }
        dispatch(updateUserProfile({id: profile.userId, profile: updateData}))
            .unwrap()
            .then(() => {
                // Refresh the user profile to get updated data
                dispatch(fetchUserProfile(profile.username))

                // Show success notification
                showNotification("success", "Profile Updated", "Your profile has been updated successfully")
            })
            .catch((error: any) => {
                // Show error notification
                console.error("Profile update failed:", error.message)

                showNotification("error", "Update Failed", "There was a problem updating your profile")
            })
    }

    return (
        <>
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
                                <Settings className="h-6 w-6 text-primary"/>
                            </div>
                            <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                        </div>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="p-8">
                            <div className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <User className="h-4 w-4 text-primary"/>
                                        </div>
                                        <span className="text-xl font-bold text-foreground">Personal Information</span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName || ""}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email || ""}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ""}
                                                onChange={handleInputChange}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nationality">Nationality</Label>
                                            <Input
                                                id="nationality"
                                                name="nationality"
                                                value={formData.nationality || ""}
                                                onChange={handleInputChange}
                                                placeholder="Enter your nationality"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator/>

                                {/* Professional Information Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-2 mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-primary/10">
                                                <Briefcase className="h-4 w-4 text-primary"/>
                                            </div>
                                            <span className="text-xl font-bold text-foreground">Work Experience</span>
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddExperience}
                                                className="gap-1">
                                            <Plus className="h-4 w-4"/>
                                            Add Experience
                                        </Button>
                                    </div>

                                    {experiences.length > 0 ? (
                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {experiences.map((experience, index) => (
                                                    <motion.div
                                                        key={`${experience.title}-${experience.company}-${experience.startDate}-${index}`}
                                                        initial={{opacity: 0, y: 10}}
                                                        animate={{opacity: 1, y: 0}}
                                                        exit={{opacity: 0, height: 0}}
                                                        transition={{duration: 0.3}}
                                                        className="bg-muted/20 p-6 rounded-xl border border-border/30 relative group"
                                                    >
                                                        <div
                                                            className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                onClick={() => handleEditExperience(experience)}
                                                            >
                                                                <Edit className="h-4 w-4"/>
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleDeleteExperience(experience)}
                                                            >
                                                                <Trash2 className="h-4 w-4"/>
                                                            </Button>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Briefcase className="h-4 w-4 text-primary"/>
                                                                    <h3 className="font-semibold text-lg">{experience.title}</h3>
                                                                </div>
                                                                <div
                                                                    className="flex items-center gap-2 text-muted-foreground">
                                                                    <Building2 className="h-4 w-4"/>
                                                                    <span>{experience.company}</span>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div
                                                                    className="flex items-center gap-2 text-muted-foreground">
                                                                    <MapPin className="h-4 w-4"/>
                                                                    <span>{experience.location}</span>
                                                                </div>
                                                                <div
                                                                    className="flex items-center gap-2 text-muted-foreground">
                                                                    <Calendar className="h-4 w-4"/>
                                                                    <span>
                                    {formatDate(experience.startDate)} -{" "}
                                                                        {experience.endDate ? formatDate(experience.endDate) : "Present"}
                                  </span>
                                                                </div>
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <GraduationCap className="h-4 w-4 text-primary"/>
                                                                    <span className="text-sm text-muted-foreground">Experience Level</span>
                                                                </div>
                                                                <div
                                                                    className="font-medium">{experience.experienceLevel.experienceName}</div>
                                                            </div>

                                                            {experience.description && (
                                                                <div className="md:col-span-2">
                                                                    <div
                                                                        className="text-sm text-muted-foreground mb-1">Description
                                                                    </div>
                                                                    <p className="text-sm">{experience.description}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div
                                            className="text-center py-10 bg-muted/20 rounded-xl border border-border/30">
                                            <div
                                                className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-4">
                                                <Briefcase className="h-8 w-8 text-muted-foreground"/>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No work experience added yet</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                                Add your work experience to showcase your professional journey.
                                            </p>
                                            <Button variant="outline" onClick={handleAddExperience}>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Add Experience
                                            </Button>
                                        </div>
                                    )}

                                    <div className="space-y-2 mt-6">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio || ""}
                                            onChange={handleInputChange}
                                            placeholder="Write a short bio about yourself"
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <Separator/>

                                {/* Notification Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Bell className="h-4 w-4 text-primary"/>
                                        </div>
                                        <span className="text-xl font-bold text-foreground">Notification Settings</span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="emailNotifications">Email Notifications</Label>
                                                <p className="text-sm text-muted-foreground">Receive notifications via
                                                    email</p>
                                            </div>
                                            <Switch
                                                id="emailNotifications"
                                                checked={formData.isSend}
                                                onCheckedChange={(checked) => handleSwitchChange("isSend", checked)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator/>

                                {/* Security Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Shield className="h-4 w-4 text-primary"/>
                                        </div>
                                        <span className="text-xl font-bold text-foreground">Security Settings</span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"/>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="pt-4">
                                            <Button
                                                variant="outline"
                                                className="w-full gap-2"
                                                type="button"
                                                onClick={() =>
                                                    setPasswordDialog((prev) => ({
                                                        ...prev,
                                                        isOpen: true,
                                                    }))
                                                }
                                            >
                                                <Key className="h-4 w-4"/>
                                                Change Password
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-muted/50 px-8 py-6 border-t flex justify-between">
                            <Button type="submit" className="gap-2" disabled={statuses.updating === "loading"}>
                                {statuses.updating === "loading" ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4"/>
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>

            {/* Experience Edit Dialog */}
            <Dialog open={isEditingExperience} onOpenChange={(open) => !open && setIsEditingExperience(false)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isNewExperience ? "Add New Experience" : "Edit Experience"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={currentEditingExperience?.title || ""}
                                    onChange={handleExperienceInputChange}
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={currentEditingExperience?.company || ""}
                                    onChange={handleExperienceInputChange}
                                    placeholder="e.g. Acme Inc."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={currentEditingExperience?.location || ""}
                                    onChange={handleExperienceInputChange}
                                    placeholder="e.g. New York, NY"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experienceLevel">Experience Level</Label>
                                <Select
                                    value={currentEditingExperience?.experienceLevel?.experienceId.toString() || ""}
                                    onValueChange={handleExperienceLevelChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience level"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {experienceLevels.map((level) => (
                                            <SelectItem key={level.experienceId} value={level.experienceId.toString()}>
                                                {level.experienceName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={
                                        currentEditingExperience?.startDate
                                            ? new Date(currentEditingExperience.startDate).toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={handleExperienceInputChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date (leave empty for current position)</Label>
                                <Input
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    value={
                                        currentEditingExperience?.endDate
                                            ? new Date(currentEditingExperience.endDate).toISOString().split("T")[0]
                                            : ""
                                    }
                                    onChange={handleExperienceInputChange}
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={currentEditingExperience?.description || ""}
                                    onChange={handleExperienceInputChange}
                                    placeholder="Describe your responsibilities and achievements"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditingExperience(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveExperience}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Password Change Dialog */}
            <Dialog
                open={passwordDialog.isOpen}
                onOpenChange={(open) => setPasswordDialog((prev) => ({...prev, isOpen: open}))}
            >
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5"/>
                            Change Password
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={passwordDialog.showCurrentPassword ? "text" : "password"}
                                    value={passwordDialog.currentPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Enter your current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility("showCurrentPassword")}
                                >
                                    {passwordDialog.showCurrentPassword ? <EyeOff className="h-4 w-4"/> :
                                        <Eye className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={passwordDialog.showNewPassword ? "text" : "password"}
                                    value={passwordDialog.newPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Enter your new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility("showNewPassword")}
                                >
                                    {passwordDialog.showNewPassword ? <EyeOff className="h-4 w-4"/> :
                                        <Eye className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={passwordDialog.showConfirmPassword ? "text" : "password"}
                                    value={passwordDialog.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    placeholder="Confirm your new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility("showConfirmPassword")}
                                >
                                    {passwordDialog.showConfirmPassword ? <EyeOff className="h-4 w-4"/> :
                                        <Eye className="h-4 w-4"/>}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setPasswordDialog({
                                    isOpen: false,
                                    currentPassword: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                    showCurrentPassword: false,
                                    showNewPassword: false,
                                    showConfirmPassword: false,
                                })
                            }
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={statuses.changingPassword === "loading"}>
                            {statuses.changingPassword === "loading" ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    Changing...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Status notification */}
            <StatusNotification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={hideNotification}
                showProgress={notification.type !== "loading"}
            />
        </>
    )
}
