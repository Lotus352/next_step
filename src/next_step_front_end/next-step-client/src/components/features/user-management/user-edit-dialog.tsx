"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useDispatch } from "react-redux"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Edit, Save, X, User, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type UserType from "@/types/user-type"
import type { UserRequest } from "@/types/user-type"
import type { AppDispatch } from "@/store/store"
import { updateUserProfile } from "@/store/slices/users-slice.ts"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
    CustomDialogFooter,
} from "@/components/ui/custom-dialog"

const userEditSchema = z.object({
    username: z.string().min(1, "Username is required").max(50, "Username too long"),
    email: z.string().email("Invalid email address"),
    fullName: z.string().max(100, "Full name too long").optional(),
    phoneNumber: z.string().max(20, "Phone number too long"),
    nationality: z.string().max(50, "Nationality too long").optional(),
    bio: z.string().max(1000, "Bio too long").optional(),
    isSend: z.boolean(),
    status: z.string().min(1, "Status is required"),
})

type UserEditFormData = z.infer<typeof userEditSchema>

interface UserEditDialogProps {
    user: UserType | null
    open: boolean
    onOpenChange: (open: boolean) => void
    userRole: "admin" | "employer"
}

export function UserEditDialog({ user, open, onOpenChange, userRole }: UserEditDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isInitializing, setIsInitializing] = useState(false)
    const initializationRef = useRef<boolean>(false)

    const form = useForm<UserEditFormData>({
        resolver: zodResolver(userEditSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            email: "",
            fullName: "",
            phoneNumber: "",
            nationality: "",
            bio: "",
            isSend: false,
            status: "ACTIVE",
        },
    })

    // Helper functions
    const initializeFormData = useCallback(
        async (userData: UserType) => {
            if (initializationRef.current) return

            setIsInitializing(true)
            initializationRef.current = true

            try {
                const formValues = {
                    username: userData.username || "",
                    email: userData.email || "",
                    fullName: userData.fullName || "",
                    phoneNumber: userData.phoneNumber || "",
                    nationality: userData.nationality || "",
                    bio: userData.bio || "",
                    isSend: userData.isSend || false,
                    status: userData.status || "ACTIVE",
                }

                // Use setTimeout to ensure form is ready
                setTimeout(() => {
                    form.reset(formValues)
                    setIsInitializing(false)
                }, 100)
            } catch (error) {
                console.error("Error initializing form:", error)
                setIsInitializing(false)
                toast.error("Failed to load user data")
            }
        },
        [form],
    )

    // Reset initialization when dialog opens/closes
    useEffect(() => {
        if (open && user && !initializationRef.current) {
            initializeFormData(user)
        } else if (!open) {
            initializationRef.current = false
            setIsInitializing(false)
        }
    }, [open, user, initializeFormData])

    const handleCancel = useCallback(() => {
        if (isSubmitting) return

        setIsInitializing(false)
        initializationRef.current = false
        onOpenChange(false)
    }, [isSubmitting, onOpenChange])

    const onSubmit = async (data: UserEditFormData) => {
        if (!user || isSubmitting) {
            return
        }

        setIsSubmitting(true)

        try {
            const userRequest: UserRequest = {
                username: data.username,
                email: data.email,
                fullName: data.fullName || null,
                avatarUrl: user.avatarUrl,
                resumeUrl: user.resumeUrl,
                phoneNumber: data.phoneNumber,
                nationality: data.nationality || null,
                bio: data.bio || null,
                isSend: data.isSend,
                status: userRole === "admin" ? data.status : user.status, // Only admin can change status
                companyId: user.company?.companyId || null,
                skillIds: user.skills?.map((skill) => skill.skillId) || [],
                roleIds: user.roles?.map((role) => role.roleId) || [],
                experiences:
                    user.experiences?.map((exp) => ({
                        userId: exp.userId,
                        experienceId: exp.experienceLevel.experienceId,
                        title: exp.title,
                        company: exp.company,
                        location: exp.location,
                        startDate: exp.startDate,
                        endDate: exp.endDate,
                        description: exp.description,
                    })) || [],
            }

            const result = await dispatch(updateUserProfile({ id: user.userId, profile: userRequest }))

            if (updateUserProfile.fulfilled.match(result)) {
                toast.success("User updated successfully!")
                handleCancel()
            } else {
                toast.error("Failed to update user. Please try again.")
            }
        } catch (error) {
            console.error("Failed to update user:", error)
            toast.error("An error occurred while updating the user")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) return null

    const statuses = ["ACTIVE", "INACTIVE"]

    return (
        <CustomDialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen && !isSubmitting && !isInitializing) {
                    handleCancel()
                }
            }}
            className="max-w-4xl"
        >
            <CustomDialogContent showCloseButton={false}>
                {/* Header */}
                <CustomDialogHeader>
                    <div className="flex items-center justify-between pr-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Edit className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CustomDialogTitle>Edit User</CustomDialogTitle>
                                <CustomDialogDescription>Update user profile and settings</CustomDialogDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting || isInitializing}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CustomDialogHeader>

                {/* Loading State */}
                {isInitializing && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading user data...</p>
                        </div>
                    </div>
                )}

                {/* Scrollable Body */}
                {!isInitializing && (
                    <CustomDialogBody>
                        <Form {...form}>
                            <div className="space-y-8">
                                {/* Basic Information */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Basic Information</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Username *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter username"
                                                                className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Email *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                placeholder="Enter email"
                                                                className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter full name"
                                                            className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Phone Number *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter phone number"
                                                                className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="nationality"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Nationality</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Enter nationality"
                                                                className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <Separator className="bg-border/50" />

                                {/* Bio Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Edit className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Bio</h3>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell us about yourself..."
                                                        className="min-h-[120px] rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    A brief description about yourself (max 1000 characters)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>

                                <Separator className="bg-border/50" />

                                {/* Settings */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Settings</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="isSend"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/50 p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm font-semibold">Email Notifications</FormLabel>
                                                        <FormDescription className="text-xs">
                                                            Receive email notifications for updates
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {/* Status - Only show for admin */}
                                        {userRole === "admin" && (
                                            <FormField
                                                control={form.control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-semibold">Status *</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-lg border-border/50 hover:border-primary/50">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {statuses.map((status) => (
                                                                    <SelectItem key={status} value={status}>
                                                                        {status}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </Form>
                    </CustomDialogBody>
                )}

                {/* Footer */}
                <CustomDialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting || isInitializing}
                        className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting || isInitializing}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                        {isSubmitting ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                                <Save className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </CustomDialogFooter>
            </CustomDialogContent>
        </CustomDialog>
    )
}
