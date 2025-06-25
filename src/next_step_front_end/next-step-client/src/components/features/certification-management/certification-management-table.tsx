"use client"

import {useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {motion, AnimatePresence} from "framer-motion"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Pagination} from "@/components/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/custom-alert-dialog"
import {TableIcon, MoreHorizontal, Loader2, AlertTriangle} from "lucide-react"
import type CertificationType from "@/types/certification-type"
import {toast} from "sonner"
import Loading from "@/components/loading"

// Import the dialog components
import {CertificationViewDialog} from "./certification-view-dialog"
import {CertificationEditDialog} from "./certification-edit-dialog"
import {AppDispatch, RootState} from "@/store/store.ts";
import {deleteCertification, fetchCertifications} from "@/store/slices/certifications-slice.ts";

interface CertificationManagementTableProps {
    certifications: CertificationType[]
    loading: boolean
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
}

export function CertificationManagementTable(
    {
        certifications,
        loading,
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        onPageChange,
        onPageSizeChange,
    }: CertificationManagementTableProps) {
    const dispatch = useDispatch<AppDispatch>()
    const {searchKeyword} = useSelector((state: RootState) => state.certifications)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCertificationId, setSelectedCertificationId] = useState<number | null>(null)
    const [selectedCertificationName, setSelectedCertificationName] = useState<string>("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Add state for dialogs
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedCertification, setSelectedCertification] = useState<CertificationType | null>(null)

    const handleDelete = async () => {
        if (!selectedCertificationId || isDeleting) return

        setIsDeleting(true)

        try {
            const result = await dispatch(deleteCertification(selectedCertificationId))

            if (deleteCertification.fulfilled.match(result)) {
                toast.success("Certification deleted successfully!")

                // Close dialog first
                setDeleteDialogOpen(false)

                // Refresh the current page data
                await dispatch(
                    fetchCertifications({
                        page: currentPage,
                        size: pageSize,
                        key: searchKeyword,
                    }),
                )

                // If current page is empty after deletion and not the first page, go to previous page
                if (certifications.length === 1 && currentPage > 0) {
                    onPageChange(currentPage - 1)
                }
            } else {
                toast.error("Failed to delete certification. Please try again.")
            }
        } catch (error) {
            console.error("Error deleting certification:", error)
            toast.error("An error occurred while deleting the certification")
        } finally {
            setIsDeleting(false)
            setSelectedCertificationId(null)
            setSelectedCertificationName("")
        }
    }

    // Add handlers for opening dialogs
    const handleViewCertification = (certification: CertificationType) => {
        setSelectedCertification(certification)
        setViewDialogOpen(true)
    }

    const handleEditCertification = (certification: CertificationType) => {
        setSelectedCertification(certification)
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (certification: CertificationType) => {
        setSelectedCertificationId(certification.certificationId)
        setSelectedCertificationName(certification.certificationName)
        setDeleteDialogOpen(true)
    }

    const handleCancelDelete = () => {
        if (!isDeleting) {
            setDeleteDialogOpen(false)
            setSelectedCertificationId(null)
            setSelectedCertificationName("")
        }
    }

    if (loading) {
        return <Loading/>
    }

    if (certifications.length === 0) {
        return (
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="text-center py-12">
                <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-12">
                        <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                        <h3 className="text-lg font-semibold mb-2">No certifications found</h3>
                        <p className="text-muted-foreground text-sm">
                            {searchKeyword
                                ? `No certifications found matching "${searchKeyword}"`
                                : "There are currently no certifications in the system."}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5}}
            className="space-y-6"
        >
            <Card
                className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <TableIcon className="h-4 w-4 text-primary"/>
                        </div>
                        <CardTitle className="text-lg font-bold">Certifications</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {totalElements} certifications
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/30 hover:bg-muted/30">
                                    <TableHead className="font-semibold text-foreground">Certification Name</TableHead>
                                    <TableHead className="font-semibold text-foreground">Certification ID</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {certifications.map((certification, index) => (
                                        <motion.tr
                                            key={certification.certificationId}
                                            initial={{opacity: 0, y: 10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            transition={{delay: index * 0.05}}
                                            className="border-border/30 hover:bg-muted/20 transition-all duration-300 group"
                                        >
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div
                                                        className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                        {certification.certificationName}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <Badge variant="outline"
                                                       className="bg-primary/5 border-primary/20 text-primary font-medium">
                                                    #{certification.certificationId}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className="py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                                            disabled={isDeleting}
                                                        >
                                                            {isDeleting && selectedCertificationId === certification.certificationId ? (
                                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4"/>
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                                            onClick={() => handleViewCertification(certification)}
                                                        >
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                                            onClick={() => handleEditCertification(certification)}
                                                        >
                                                            Edit Certification
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => handleDeleteClick(certification)}
                                                            disabled={isDeleting}
                                                        >
                                                            Delete Certification
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                showPageSizeSelector={true}
                pageSizeOptions={[5, 10, 20, 50]}
            />

            {/* Enhanced Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                style={{backgroundColor: "#fef2f2"}}
                            >
                                <AlertTriangle className="w-5 h-5" style={{color: "#dc2626"}}/>
                            </div>
                            <div>
                                <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                            </div>
                        </div>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>"{selectedCertificationName}"</strong>?
                            <br/>
                            <br/>
                            This action cannot be undone and will permanently remove this certification from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} onClick={handleCancelDelete}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                                    Deleting...
                                </>
                            ) : (
                                "Delete Certification"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add the dialog components */}
            <CertificationViewDialog
                certification={selectedCertification}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                onEdit={() => {
                    setViewDialogOpen(false)
                    setEditDialogOpen(true)
                }}
            />

            <CertificationEditDialog
                certification={selectedCertification}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </motion.div>
    )
}
