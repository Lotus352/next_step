"use client"

import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Eye, Edit, X, Award} from "lucide-react"
import type CertificationType from "@/types/certification-type"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogHeader,
    CustomDialogTitle,
    CustomDialogDescription,
    CustomDialogBody,
} from "@/components/ui/custom-dialog"

interface CertificationViewDialogProps {
    certification: CertificationType | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onEdit?: () => void
}

export function CertificationViewDialog({certification, open, onOpenChange, onEdit}: CertificationViewDialogProps) {
    if (!certification) return null

    const handleClose = () => {
        onOpenChange(false)
    }

    return (
        <CustomDialog open={open} onOpenChange={onOpenChange} className="max-w-3xl">
            <CustomDialogContent showCloseButton={false}>
                {/* Header */}
                <CustomDialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Award className="h-6 w-6 text-primary"/>
                            </div>

                            <div className="flex-1 min-w-0">
                                <CustomDialogTitle
                                    className="line-clamp-2 mb-2">{certification.certificationName}</CustomDialogTitle>
                                <CustomDialogDescription className="text-lg flex items-center gap-2 mb-3 font-medium">
                                    <Eye className="h-5 w-5 text-primary"/>
                                    Certification Details
                                </CustomDialogDescription>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {onEdit && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onEdit}
                                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                >
                                    <Edit className="h-4 w-4"/>
                                    Edit
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </CustomDialogHeader>

                {/* Scrollable Content */}
                <CustomDialogBody>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="space-y-6"
                    >
                        {/* Certification Information Card */}
                        <Card
                            className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
                            <CardHeader
                                className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/10 rounded-xl">
                                        <Award className="h-6 w-6 text-primary"/>
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Certification Information</CardTitle>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8">
                                <div className="space-y-6">
                                    {/* Certification Name */}
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-foreground">Certification Name</h3>
                                        <div
                                            className="bg-gradient-to-br from-muted/20 to-muted/10 p-4 rounded-xl border border-border/30">
                                            <p className="text-base font-medium">{certification.certificationName}</p>
                                        </div>
                                    </div>

                                    {/* Metadata */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Certification ID */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold text-muted-foreground">Certification
                                                ID</h4>
                                            <div
                                                className="bg-gradient-to-br from-muted/20 to-muted/10 p-3 rounded-lg border border-border/30">
                                                <p className="text-sm font-mono">#{certification.certificationId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </CustomDialogBody>
            </CustomDialogContent>
        </CustomDialog>
    )
}
