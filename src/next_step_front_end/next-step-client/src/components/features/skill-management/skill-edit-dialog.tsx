"use client"

import {useState, useEffect, useRef, useCallback} from "react"
import {useDispatch} from "react-redux"
import {motion} from "framer-motion"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Edit, Save, X, Lightbulb, Loader2} from "lucide-react"
import {toast} from "sonner"
import type SkillType from "@/types/skill-type"
import type {SkillRequest} from "@/types/skill-type"
import type {AppDispatch} from "@/store/store"
import {updateSkill} from "@/store/slices/skills-slice"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
    CustomDialogFooter,
} from "@/components/ui/custom-dialog"

const skillEditSchema = z.object({
    skillName: z.string().min(1, "Skill name is required").max(100, "Skill name too long"),
})

type SkillEditFormData = z.infer<typeof skillEditSchema>

interface SkillEditDialogProps {
    skill: SkillType | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SkillEditDialog({skill, open, onOpenChange}: SkillEditDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isInitializing, setIsInitializing] = useState(false)
    const initializationRef = useRef<boolean>(false)

    const form = useForm<SkillEditFormData>({
        resolver: zodResolver(skillEditSchema),
        mode: "onChange",
        defaultValues: {
            skillName: "",
        },
    })

    // Helper functions
    const initializeFormData = useCallback(
        async (skillData: SkillType) => {
            if (initializationRef.current) return

            setIsInitializing(true)
            initializationRef.current = true

            try {
                const formValues = {
                    skillName: skillData.skillName || "",
                }

                // Use setTimeout to ensure form is ready
                setTimeout(() => {
                    form.reset(formValues)
                    setIsInitializing(false)
                }, 100)
            } catch (error) {
                console.error("Error initializing form:", error)
                setIsInitializing(false)
                toast.error("Failed to load skill data")
            }
        },
        [form],
    )

    // Reset initialization when dialog opens/closes
    useEffect(() => {
        if (open && skill && !initializationRef.current) {
            initializeFormData(skill)
        } else if (!open) {
            initializationRef.current = false
            setIsInitializing(false)
        }
    }, [open, skill, initializeFormData])

    const handleCancel = useCallback(() => {
        if (isSubmitting) return

        setIsInitializing(false)
        initializationRef.current = false
        onOpenChange(false)
    }, [isSubmitting, onOpenChange])

    const onSubmit = async (data: SkillEditFormData) => {
        if (!skill || isSubmitting) {
            return
        }

        setIsSubmitting(true)

        try {
            const skillRequest: SkillRequest = {
                skillName: data.skillName,
            }

            const result = await dispatch(updateSkill({id: skill.skillId, skillName: skillRequest.skillName}))

            if (updateSkill.fulfilled.match(result)) {
                toast.success("Skill updated successfully!")
                handleCancel()
            } else {
                toast.error("Failed to update skill. Please try again.")
            }
        } catch (error) {
            console.error("Failed to update skill:", error)
            toast.error("An error occurred while updating the skill")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!skill) return null

    return (
        <CustomDialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen && !isSubmitting && !isInitializing) {
                    handleCancel()
                }
            }}
            className="max-w-2xl"
        >
            <CustomDialogContent showCloseButton={false}>
                {/* Header */}
                <CustomDialogHeader>
                    <div className="flex items-center justify-between pr-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Edit className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <CustomDialogTitle>Edit Skill</CustomDialogTitle>
                                <CustomDialogDescription>Update skill information</CustomDialogDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting || isInitializing}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                </CustomDialogHeader>

                {/* Loading State */}
                {isInitializing && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                            <p className="text-sm text-muted-foreground">Loading skill data...</p>
                        </div>
                    </div>
                )}

                {/* Scrollable Body */}
                {!isInitializing && (
                    <CustomDialogBody>
                        <Form {...form}>
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <motion.div
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: 0.1}}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-primary/10">
                                            <Lightbulb className="h-4 w-4 text-primary"/>
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground">Skill Information</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="skillName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Skill Name
                                                        *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter skill name"
                                                            className="rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
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
                        <X className="h-4 w-4"/>
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
                                animate={{rotate: 360}}
                                transition={{duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear"}}
                            >
                                <Save className="h-4 w-4"/>
                            </motion.div>
                        ) : (
                            <Save className="h-4 w-4"/>
                        )}
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </CustomDialogFooter>
            </CustomDialogContent>
        </CustomDialog>
    )
}
