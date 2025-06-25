"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { Pagination } from "../../pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../ui/custom-alert-dialog"
import { TableIcon, MoreHorizontal, Loader2, AlertTriangle } from "lucide-react"
import type SkillType from "../../../types/skill-type"
import type { AppDispatch, RootState } from "../../../store/store"
import { deleteSkill, fetchSkills } from "../../../store/slices/skills-slice"
import { toast } from "sonner"
import Loading from "../../loading"

// Import the dialog components
import { SkillViewDialog } from "./skill-view-dialog"
import { SkillEditDialog } from "./skill-edit-dialog"

interface SkillManagementTableProps {
    skills: SkillType[]
    loading: boolean
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
}

export function SkillManagementTable({
                                         skills,
                                         loading,
                                         currentPage,
                                         totalPages,
                                         totalElements,
                                         pageSize,
                                         onPageChange,
                                         onPageSizeChange,
                                     }: SkillManagementTableProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { searchKeyword } = useSelector((state: RootState) => state.skills)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
    const [selectedSkillName, setSelectedSkillName] = useState<string>("")
    const [isDeleting, setIsDeleting] = useState(false)

    // Add state for dialogs
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState<SkillType | null>(null)

    const handleDelete = async () => {
        if (!selectedSkillId || isDeleting) return

        setIsDeleting(true)

        try {
            const result = await dispatch(deleteSkill(selectedSkillId))

            if (deleteSkill.fulfilled.match(result)) {
                toast.success("Skill deleted successfully!")

                // Close dialog first
                setDeleteDialogOpen(false)

                // Refresh the current page data
                await dispatch(
                    fetchSkills({
                        page: currentPage,
                        size: pageSize,
                        key: searchKeyword,
                    }),
                )

                // If current page is empty after deletion and not the first page, go to previous page
                if (skills.length === 1 && currentPage > 0) {
                    onPageChange(currentPage - 1)
                }
            } else {
                toast.error("Failed to delete skill. Please try again.")
            }
        } catch (error) {
            console.error("Error deleting skill:", error)
            toast.error("An error occurred while deleting the skill")
        } finally {
            setIsDeleting(false)
            setSelectedSkillId(null)
            setSelectedSkillName("")
        }
    }

    // Add handlers for opening dialogs
    const handleViewSkill = (skill: SkillType) => {
        setSelectedSkill(skill)
        setViewDialogOpen(true)
    }

    const handleEditSkill = (skill: SkillType) => {
        setSelectedSkill(skill)
        setEditDialogOpen(true)
    }

    const handleDeleteClick = (skill: SkillType) => {
        setSelectedSkillId(skill.skillId)
        setSelectedSkillName(skill.skillName)
        setDeleteDialogOpen(true)
    }

    const handleCancelDelete = () => {
        if (!isDeleting) {
            setDeleteDialogOpen(false)
            setSelectedSkillId(null)
            setSelectedSkillName("")
        }
    }

    if (loading) {
        return <Loading />
    }

    if (skills.length === 0) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
                    <CardContent className="p-12">
                        <TableIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No skills found</h3>
                        <p className="text-muted-foreground text-sm">
                            {searchKeyword
                                ? `No skills found matching "${searchKeyword}"`
                                : "There are currently no skills in the system."}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <TableIcon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-bold">Skills</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {totalElements} skills
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/30 hover:bg-muted/30">
                                    <TableHead className="font-semibold text-foreground">Skill Name</TableHead>
                                    <TableHead className="font-semibold text-foreground">Skill ID</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {skills.map((skill, index) => (
                                        <motion.tr
                                            key={skill.skillId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-border/30 hover:bg-muted/20 transition-all duration-300 group"
                                        >
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                                        {skill.skillName}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="py-4">
                                                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-medium">
                                                    #{skill.skillId}
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
                                                            {isDeleting && selectedSkillId === skill.skillId ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                                            onClick={() => handleViewSkill(skill)}
                                                        >
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                                            onClick={() => handleEditSkill(skill)}
                                                        >
                                                            Edit Skill
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => handleDeleteClick(skill)}
                                                            disabled={isDeleting}
                                                        >
                                                            Delete Skill
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
                                style={{ backgroundColor: "#fef2f2" }}
                            >
                                <AlertTriangle className="w-5 h-5" style={{ color: "#dc2626" }} />
                            </div>
                            <div>
                                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                            </div>
                        </div>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>"{selectedSkillName}"</strong>?
                            <br />
                            <br />
                            This action cannot be undone and will permanently remove this skill from the system.
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
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Skill"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Add the dialog components */}
            <SkillViewDialog
                skill={selectedSkill}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                onEdit={() => {
                    setViewDialogOpen(false)
                    setEditDialogOpen(true)
                }}
            />

            <SkillEditDialog skill={selectedSkill} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </motion.div>
    )
}
