"use client"

import {useState} from "react"
import {useDispatch} from "react-redux"
import {motion} from "framer-motion"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "../../ui/button"
import {Input} from "../../ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form"
import {Plus, Save, X, Award} from "lucide-react"
import {toast} from "sonner"
import type {AppDispatch} from "../../../store/store"
import {addCertification} from "../../../store/slices/certifications-slice"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
    CustomDialogFooter,
} from "../../ui/custom-dialog"

const certificationCreateSchema = z.object({
    certificationName: z.string().min(1, "Certification name is required").max(100, "Certification name too long"),
})

type CertificationCreateFormData = z.infer<typeof certificationCreateSchema>

interface CertificationCreateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CertificationCreateDialog({open, onOpenChange}: CertificationCreateDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<CertificationCreateFormData>({
        resolver: zodResolver(certificationCreateSchema),
        mode: "onChange",
        defaultValues: {
            certificationName: "",
        },
    })

    const handleCancel = () => {
        if (isSubmitting) return
        form.reset()
        onOpenChange(false)
    }

    const onSubmit = async (data: CertificationCreateFormData) => {
        if (isSubmitting) return

        setIsSubmitting(true)

        try {
            const result = await dispatch(addCertification({certificationName: data.certificationName}))

            if (addCertification.fulfilled.match(result)) {
                toast.success("Certification created successfully!")
                form.reset()
                onOpenChange(false)
            } else {
                toast.error("Failed to create certification. Please try again.")
            }
        } catch (error) {
            console.error("Failed to create certification:", error)
            toast.error("An error occurred while creating the certification")
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
                                <CustomDialogTitle>Create New Certification</CustomDialogTitle>
                                <CustomDialogDescription>Add a new certification to the system</CustomDialogDescription>
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
                                        <Award className="h-4 w-4 text-primary"/>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">Certification Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="certificationName"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Certification Name
                                                    *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter certification name (e.g., AWS Certified Solutions Architect, PMP, CISSP)"
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
                        {isSubmitting ? "Creating..." : "Create Certification"}
                    </Button>
                </CustomDialogFooter>
            </CustomDialogContent>
        </CustomDialog>
    )
}
