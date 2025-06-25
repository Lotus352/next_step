"use client"

import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface AlertDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

interface AlertDialogContentProps {
    children: React.ReactNode
    className?: string
}

interface AlertDialogHeaderProps {
    children: React.ReactNode
    className?: string
}

interface AlertDialogTitleProps {
    children: React.ReactNode
    className?: string
}

interface AlertDialogDescriptionProps {
    children: React.ReactNode
    className?: string
}

interface AlertDialogFooterProps {
    children: React.ReactNode
    className?: string
}

interface AlertDialogActionProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

interface AlertDialogCancelProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

// Context for managing dialog state
const AlertDialogContext = React.createContext<{
    open: boolean
    onOpenChange: (open: boolean) => void
} | null>(null)

const useAlertDialog = () => {
    const context = React.useContext(AlertDialogContext)
    if (!context) {
        throw new Error("AlertDialog components must be used within AlertDialog")
    }
    return context
}

// Main AlertDialog component
export const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
    // Handle ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onOpenChange(false)
            }
        }

        if (open) {
            document.addEventListener("keydown", handleEscape)
            // Prevent body scroll when dialog is open
            document.body.style.overflow = "hidden"
            document.body.style.paddingRight = "0px" // Prevent scrollbar shift
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            // Restore body scroll when dialog is closed
            document.body.style.overflow = ""
            document.body.style.paddingRight = ""
        }
    }, [open, onOpenChange])

    if (!open) return null

    // Create portal to render at document.body level
    const dialogContent = (
        <AlertDialogContext.Provider value={{ open, onOpenChange }}>
            <div
                style={{
                    position: "fixed",
                    inset: "0px",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                }}
            >
                {/* Dark Backdrop Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onOpenChange(false)}
                    style={{
                        position: "fixed",
                        inset: "0px",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        zIndex: 50,
                    }}
                />

                {/* Dialog Content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 51,
                        width: "100%",
                        maxWidth: "32rem",
                    }}
                >
                    {children}
                </div>
            </div>
        </AlertDialogContext.Provider>
    )

    // Use createPortal to render at document.body level
    return createPortal(dialogContent, document.body)
}

// AlertDialog Content
export const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ children, className }) => {
    const { onOpenChange } = useAlertDialog()

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
                duration: 0.2,
                ease: "easeOut",
            }}
            className={cn("relative overflow-hidden", className)}
            style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e5e7eb",
                width: "100%",
                maxWidth: "500px",
                margin: "0 auto",
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Close button */}
            <button
                onClick={() => onOpenChange(false)}
                style={{
                    position: "absolute",
                    right: "16px",
                    top: "16px",
                    zIndex: 20,
                    borderRadius: "50%",
                    padding: "4px",
                    opacity: 0.7,
                    transition: "all 0.2s",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1"
                    e.currentTarget.style.backgroundColor = "#f3f4f6"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.7"
                    e.currentTarget.style.backgroundColor = "transparent"
                }}
                aria-label="Close dialog"
            >
                <X size={16} color="#6b7280" />
            </button>
            {children}
        </motion.div>
    )
}

// AlertDialog Header
export const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({ children, className }) => (
    <div className={cn("px-6 pt-6 pb-4", className)}>
        <div className="flex flex-col space-y-2 text-center sm:text-left">{children}</div>
    </div>
)

// AlertDialog Title
export const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({ children, className }) => (
    <h2
        className={cn("text-xl font-semibold", className)}
        style={{
            color: "#111827",
            fontFamily: "Montserrat, sans-serif",
            margin: 0,
            lineHeight: 1.4,
        }}
    >
        {children}
    </h2>
)

// AlertDialog Description
export const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({ children, className }) => (
    <p
        className={cn("text-sm leading-relaxed", className)}
        style={{
            color: "#6b7280",
            fontFamily: "Montserrat, sans-serif",
            margin: 0,
            lineHeight: 1.5,
        }}
    >
        {children}
    </p>
)

// AlertDialog Footer
export const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({ children, className }) => (
    <div
        className={cn("px-6 pb-6 pt-4", className)}
        style={{
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e5e7eb",
        }}
    >
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0">
            {children}
        </div>
    </div>
)

// AlertDialog Action (Confirm button)
export const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
                                                                        children,
                                                                        onClick,
                                                                        className,
                                                                        disabled = false,
                                                                    }) => {
    const handleClick = () => {
        if (onClick && !disabled) {
            onClick()
        }
    }

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-sm hover:shadow-md",
                className,
            )}
            style={{
                backgroundColor: disabled ? "#9ca3af" : "#dc2626",
                color: "white",
                border: "none",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = "#b91c1c"
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = "#dc2626"
                }
            }}
        >
            {children}
        </motion.button>
    )
}

// AlertDialog Cancel
export const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
                                                                        children,
                                                                        onClick,
                                                                        className,
                                                                        disabled = false,
                                                                    }) => {
    const { onOpenChange } = useAlertDialog()

    const handleClick = () => {
        if (onClick && !disabled) {
            onClick()
        }
        onOpenChange(false)
    }

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-sm hover:shadow-md",
                "sm:mr-3",
                className,
            )}
            style={{
                backgroundColor: disabled ? "#f3f4f6" : "white",
                color: disabled ? "#9ca3af" : "#374151",
                border: "1px solid #d1d5db",
                cursor: disabled ? "not-allowed" : "pointer",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "500",
            }}
            onMouseEnter={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = "#f9fafb"
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled) {
                    e.currentTarget.style.backgroundColor = "white"
                }
            }}
        >
            {children}
        </motion.button>
    )
}
