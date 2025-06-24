"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

interface CustomDialogContentProps {
    children: React.ReactNode
    className?: string
    showCloseButton?: boolean
    onClose?: () => void
}

interface CustomDialogHeaderProps {
    children: React.ReactNode
    className?: string
}

interface CustomDialogTitleProps {
    children: React.ReactNode
    className?: string
}

interface CustomDialogDescriptionProps {
    children: React.ReactNode
    className?: string
}

interface CustomDialogBodyProps {
    children: React.ReactNode
    className?: string
}

interface CustomDialogFooterProps {
    children: React.ReactNode
    className?: string
}

export function CustomDialog({ open, onOpenChange, children, className }: CustomDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false)
            }
        }

        if (open) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [open, onOpenChange])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false)
        }
    }

    if (!open) return null

    // Inline styles to force override any CSS conflicts
    const backdropStyles: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 999999,
    }

    const containerStyles: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        pointerEvents: "auto",
    }

    const dialogContent = (
        <AnimatePresence>
            <div style={containerStyles}>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleBackdropClick}
                    style={backdropStyles}
                />

                {/* Dialog Content */}
                <motion.div
                    ref={dialogRef}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={cn(
                        "relative w-full bg-background border border-border/30 rounded-2xl shadow-2xl flex flex-col",
                        "max-h-[95vh] overflow-hidden",
                        className,
                    )}
                    style={{
                        zIndex: 999999,
                        pointerEvents: "auto",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </div>
        </AnimatePresence>
    )

    // Use portal to render outside current DOM tree
    if (typeof window !== "undefined") {
        return createPortal(dialogContent, document.body)
    }

    return null
}

export function CustomDialogContent({
                                        children,
                                        className,
                                        showCloseButton = true,
                                        onClose,
                                    }: CustomDialogContentProps) {
    return (
        <div className={cn("relative flex flex-col h-full overflow-hidden", className)}>
            {showCloseButton && onClose && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[999999] h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
                    style={{ zIndex: 999999 }}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
            {children}
        </div>
    )
}

export function CustomDialogHeader({ children, className }: CustomDialogHeaderProps) {
    return (
        <div
            className={cn(
                "flex-shrink-0 px-6 py-6 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30",
                className,
            )}
        >
            {children}
        </div>
    )
}

export function CustomDialogTitle({ children, className }: CustomDialogTitleProps) {
    return <h2 className={cn("text-2xl font-bold text-foreground leading-tight", className)}>{children}</h2>
}

export function CustomDialogDescription({ children, className }: CustomDialogDescriptionProps) {
    return <p className={cn("text-muted-foreground mt-2", className)}>{children}</p>
}

export function CustomDialogBody({ children, className }: CustomDialogBodyProps) {
    return <div className={cn("flex-1 overflow-y-auto overflow-x-hidden px-6 py-4", className)}>{children}</div>
}

export function CustomDialogFooter({ children, className }: CustomDialogFooterProps) {
    return (
        <div
            className={cn(
                "flex-shrink-0 px-6 py-4 border-t border-border/30 bg-gradient-to-r from-muted/10 to-transparent flex items-center justify-end gap-3",
                className,
            )}
        >
            {children}
        </div>
    )
}
