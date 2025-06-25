"use client"

import {useEffect, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {motion} from "framer-motion"
import {fetchCertifications} from "@/store/slices/certifications-slice"
import {DEFAULT_LEVEL_SIZE, DEFAULT_PAGE} from "@/constants"
import {
    CertificationManagementHeader
} from "@/components/features/certification-management/certification-management-header"
import {
    CertificationManagementTable
} from "@/components/features/certification-management/certification-management-table"
import {CertificationCreateDialog} from "@/components/features/certification-management/certification-create-dialog"
import {Settings} from "lucide-react"
import {Badge} from "@/components/ui/badge"
import {AppDispatch, RootState} from "@/store/store.ts";
import Header from "@/components/layout/header.tsx";
import Footer from "@/components/layout/footer.tsx";

export function CertificationManagementPage() {
    const dispatch = useDispatch<AppDispatch>()
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(DEFAULT_LEVEL_SIZE)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    const {
        content: certifications,
        totalElements,
        totalPages,
        statuses,
        searchKeyword,
    } = useSelector((state: RootState) => state.certifications)

    useEffect(() => {
        dispatch(
            fetchCertifications({
                page: DEFAULT_PAGE,
                size: pageSize,
            }),
        )
    }, [dispatch, pageSize])

    const handleSearch = (keyword: string) => {
        setCurrentPage(0)
        dispatch(
            fetchCertifications({
                page: 0,
                size: pageSize,
                key: keyword,
            }),
        )
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        dispatch(
            fetchCertifications({
                page,
                size: pageSize,
                key: searchKeyword,
            }),
        )
    }

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize)
        setCurrentPage(0)
        dispatch(
            fetchCertifications({
                page: 0,
                size: newSize,
                key: searchKeyword,
            }),
        )
    }

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }

    return (
        <>
            <Header/>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
                        animate={{
                            scale: [1.2, 1, 1.2],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                            delay: 2,
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 py-8 relative">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                        {/* Page Header */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-primary/10 rounded-xl">
                                            <Settings className="h-6 w-6 text-primary"/>
                                        </div>
                                        <h1 className="text-3xl font-bold text-foreground">Certification Management</h1>
                                        <Badge variant="outline"
                                               className="bg-primary/10 text-primary border-primary/20 font-semibold">
                                            Admin Panel
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-lg">
                                        Manage and organize certifications with comprehensive CRUD operations
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Header with Search */}
                        <motion.div variants={itemVariants}>
                            <CertificationManagementHeader onCreateNew={() => setCreateDialogOpen(true)}
                                                           onSearch={handleSearch}/>
                        </motion.div>

                        {/* Certifications Table */}
                        <motion.div variants={itemVariants} className="transition-all duration-300">
                            <CertificationManagementTable
                                certifications={certifications}
                                loading={statuses.fetching === "loading"}
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                pageSize={pageSize}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Create Dialog */}
                <CertificationCreateDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}/>
            </div>
            <Footer/>
        </>
    )
}
