"use client"

import {useState, useEffect, useRef, useCallback} from "react"
import {useDispatch} from "react-redux"
import {motion} from "framer-motion"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "../../ui/button"
import {Input} from "../../ui/input"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form"
import {Edit, Save, X, Award, Loader2} from "lucide-react"
import {toast} from "sonner"
import type CertificationType from "../../../types/certification-type"
import type {CertificationRequest} from "../../../types/certification-type"
import type {AppDispatch} from "../../../store/store"
import {updateCertification} from "../../../store/slices/certifications-slice"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
    CustomDialogFooter,
} from "../../ui/custom-dialog"

const certificationEditSchema = z.object({
    certificationName: z.string().min(1, "Certification name is required").max(100, "Certification name too long"),
})

type CertificationEditFormData = z.infer<typeof certificationEditSchema>

interface CertificationEditDialogProps {
    certification: CertificationType | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CertificationEditDialog({certification, open, onOpenChange}: CertificationEditDialogProps) {
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isInitializing, setIsInitializing] = useState(false)
    const initializationRef = useRef<boolean>(false)

    const form = useForm<CertificationEditFormData>({
        resolver: zodResolver(certificationEditSchema),
        mode: "onChange",
        defaultValues: {
            certificationName: "",
        },
    })

    // Helper functions
    const initializeFormData = useCallback(
        async (certificationData: CertificationType) => {
            if (initializationRef.current) return

            setIsInitializing(true)
            initializationRef.current = true

            try {
                const formValues = {
                    certificationName: certificationData.certificationName || "",
                }

                // Use setTimeout to ensure form is ready
                setTimeout(() => {
                    form.reset(formValues)
                    setIsInitializing(false)
                }, 100)
            } catch (error) {
                console.error("Error initializing form:", error)
                setIsInitializing(false)
                toast.error("Failed to load certification data")
            }
        },
        [form],
    )

    // Reset initialization when dialog opens/closes
    useEffect(() => {
        if (open && certification && !initializationRef.current) {
            initializeFormData(certification)
        } else if (!open) {
            initializationRef.current = false
            setIsInitializing(false)
        }
    }, [open, certification, initializeFormData])

    const handleCancel = useCallback(() => {
        if (isSubmitting) return

        setIsInitializing(false)
        initializationRef.current = false
        onOpenChange(false)
    }, [isSubmitting, onOpenChange])

    const onSubmit = async (data: CertificationEditFormData) => {
        if (!certification || isSubmitting) {
            return
        }

        setIsSubmitting(true)

        try {
            const certificationRequest: CertificationRequest = {
                certificationName: data.certificationName,
            }

            const result = await dispatch(
                updateCertification({
                    id: certification.certificationId,
                    certificationName: certificationRequest.certificationName,
                }),
            )

            if (updateCertification.fulfilled.match(result)) {
                toast.success("Certification updated successfully!")
                handleCancel()
            } else {
                toast.error("Failed to update certification. Please try again.")
            }
        } catch (error) {
            console.error("Failed to update certification:", error)
            toast.error("An error occurred while updating the certification")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!certification) return null

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
                                <CustomDialogTitle>Edit Certification</CustomDialogTitle>
                                <CustomDialogDescription>Update certification information</CustomDialogDescription>
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
                            <p className="text-sm text-muted-foreground">Loading certification data...</p>
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
                                                            placeholder="Enter certification name"
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
