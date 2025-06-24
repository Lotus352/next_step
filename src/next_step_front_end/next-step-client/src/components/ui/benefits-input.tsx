"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BenefitsInputProps {
    value: string[]
    onChange: (benefits: string[]) => void
    placeholder?: string
    className?: string
}

export function BenefitsInput({ value, onChange, placeholder = "Add a benefit...", className }: BenefitsInputProps) {
    const [inputValue, setInputValue] = useState("")

    const handleAddBenefit = () => {
        const trimmedValue = inputValue.trim()
        if (trimmedValue && !value.includes(trimmedValue)) {
            onChange([...value, trimmedValue])
            setInputValue("")
        }
    }

    const handleRemoveBenefit = (benefitToRemove: string) => {
        onChange(value.filter((benefit) => benefit !== benefitToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAddBenefit()
        }
    }

    return (
        <div className={className}>
            {/* Input Section */}
            <div className="flex gap-2 mb-4">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border-border/50 hover:border-primary/50 focus:border-primary transition-colors duration-300"
                />
                <Button
                    type="button"
                    onClick={handleAddBenefit}
                    disabled={!inputValue.trim() || value.includes(inputValue.trim())}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 rounded-lg"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>

            {/* Benefits Display */}
            {value.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-green-100">
                            <Sparkles className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">Benefits & Perks ({value.length})</span>
                    </div>

                    <div className="bg-gradient-to-br from-green-50/50 to-green-100/30 p-4 rounded-xl border border-green-200/50">
                        <div className="flex flex-wrap gap-2">
                            <AnimatePresence>
                                {value.map((benefit) => (
                                    <motion.div
                                        key={benefit}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="group"
                                    >
                                        <Badge
                                            variant="outline"
                                            className="relative text-sm hover:bg-green-100 transition-all duration-300 hover:scale-105 hover:shadow-sm font-medium px-3 py-2 border-green-200/50 bg-gradient-to-r from-background to-green-50/30 pr-8"
                                        >
                      <span className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          {benefit}
                      </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveBenefit(benefit)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-300 rounded-full opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}

            {value.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No benefits added yet. Add some perks to make this job more attractive!</p>
                </div>
            )}
        </div>
    )
}
