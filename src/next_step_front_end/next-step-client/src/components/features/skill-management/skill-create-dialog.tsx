"use client"

import {useState} from "react"
import {useDispatch} from "react-redux"
import {motion} from "framer-motion"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Plus, Save, X, Lightbulb} from "lucide-react"
import {toast} from "sonner"
import type {AppDispatch} from "@/store/store"
import {addSkill} from "@/store/slices/skills-slice"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
    CustomDialogFooter,
} from "@/components/ui/custom-dialog"

const skillCreateSchema = z.object({
    skillName: z.string().min(1, "Skill name is required").max(100, "Skill name too long"),
})

type SkillCreateFormData = z.infer<typeof skillCreateSchema>

interface SkillCreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SkillCreateDialog({open, onOpenChange}: SkillCreateDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<SkillCreateFormData>({
        resolver: zodResolver(skillCreateSchema),
        mode: "onChange",
        defaultValues: {
            skillName: "",
        },
    })

    const handleCancel = () => {
        if (isSubmitting) return
        form.reset()
        onOpenChange(false)
    }

    const onSubmit = async (data: SkillCreateFormData) => {
        if (isSubmitting) return

        setIsSubmitting(true)

        try {
            const result = await dispatch(addSkill({skillName: data.skillName}))

            if (addSkill.fulfilled.match(result)) {
                toast.success("Skill created successfully!")
                form.reset()
                onOpenChange(false)
            } else {
                toast.error("Failed to create skill. Please try again.")
            }
        } catch (error) {
            console.error("Failed to create skill:", error)
            toast.error("An error occurred while creating the skill")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <CustomDialog
            open={open}
            onOpenChange={(newOpen) => {
                if (!newOpen && !isSubmitting) {
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
                                <Plus className="h-5 w-5 text-primary"/>
                            </div>
                            <div>
                                <CustomDialogTitle>Create New Skill</CustomDialogTitle>
                                <CustomDialogDescription>Add a new skill to the system</CustomDialogDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary rounded-full"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                </CustomDialogHeader>

                {/* Scrollable Body */}
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
                                                <FormLabel className="text-sm font-semibold">Skill Name *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter skill name (e.g., JavaScript, Python, React)"
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

                {/* Footer */}
                <CustomDialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                    >
                        <X className="h-4 w-4"/>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
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
                        {isSubmitting ? "Creating..." : "Create Skill"}
                    </Button>
                </CustomDialogFooter>
            </CustomDialogContent>
        </CustomDialog>
    )
}
