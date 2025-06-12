"use client"

import {useDispatch, useSelector} from "react-redux"
import {useEffect, useState} from "react"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Input} from "@/components/ui/input"
import {Coins, AlertCircle, DollarSign, Clock, X, ChevronLeft, ArrowRight} from "lucide-react"
import {fetchCurrencies, fetchPayPeriods} from "@/store/slices/salary-slice"
import {updateJobRequest, initializeJobRequest} from "@/store/slices/jobs-slice"
import type {AppDispatch, RootState} from "@/store/store"
import {Button} from "@/components/ui/button"
import {motion} from "framer-motion"
import {Skeleton} from "@/components/ui/skeleton"
import type {JobRequest} from "@/types/job-type"

interface SalarySelectorProps {
    onClearAll: () => void
    onNext: () => void
    onBack: () => void
}

export function SalarySelector({onClearAll, onNext, onBack}: SalarySelectorProps) {
    const dispatch = useDispatch<AppDispatch>()

    // Redux state
    const currencies = useSelector((state: RootState) => state.salaries.currencies)
    const payPeriods = useSelector((state: RootState) => state.salaries.payPeriods)
    const status = useSelector((state: RootState) => state.salaries.status)
    const request = useSelector((state: RootState) => state.jobs.request)

    // Local state for form fields
    const [formData, setFormData] = useState({
        currency: "",
        payPeriod: "",
        minSalary: 0,
        maxSalary: 0,
    })

    const isInvalidRange =
        formData.maxSalary && formData.minSalary && formData.maxSalary > 0 && formData.minSalary > formData.maxSalary

    const isLoading = status === "loading"

    const handleFieldChange = (field: string, value: string | number | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleClearAll = () => {
        setFormData({
            currency: "",
            payPeriod: "",
            minSalary: 0,
            maxSalary: 0,
        })
        onClearAll()
    }

    const handleNext = () => {
        // Only save to Redux when clicking Next
        const updatedJob = {
            ...request,
            salary: formData,
        } as JobRequest

        dispatch(updateJobRequest(updatedJob))
        onNext()
    }

    // Check if form is complete for local validation
    const isFormComplete = !!formData.currency && !!formData.payPeriod

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0},
    }

    // Initialize request if it doesn't exist
    useEffect(() => {
        if (!request) {
            dispatch(initializeJobRequest())
        } else if (request.salary) {
            // Populate form with existing data if available
            setFormData({
                currency: request.salary.currency || "",
                payPeriod: request.salary.payPeriod || "",
                minSalary: request.salary.minSalary || 0,
                maxSalary: request.salary.maxSalary || 0,
            })
        }
    }, [dispatch, request])

    useEffect(() => {
        dispatch(fetchCurrencies())
        dispatch(fetchPayPeriods())
    }, [dispatch])

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <Card className="shadow-lg border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
                <CardHeader
                    className="pb-4 border-b border-border/30 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Coins className="h-5 w-5 text-primary"/>
                                </div>
                                Salary Information
                            </CardTitle>
                            <CardDescription className="mt-1.5">
                                Provide transparent salary information to attract qualified candidates
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full flex items-center gap-1"
                        >
                            <X className="h-3.5 w-3.5"/>
                            Clear all
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="currency" className="font-medium flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-primary"/>
                                Currency <span className="text-destructive">*</span>
                            </Label>
                            {isLoading ? (
                                <Skeleton className="h-10 w-full"/>
                            ) : (
                                <Select
                                    value={formData.currency || ""}
                                    onValueChange={(value) => handleFieldChange("currency", value || null)}
                                >
                                    <SelectTrigger
                                        id="currency"
                                        className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
                                    >
                                        <SelectValue placeholder="Select currency"/>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] rounded-lg border-border/50 shadow-lg">
                                        <div className="sticky top-0 bg-background p-2 border-b border-border/30 z-10">
                                            <div className="text-xs font-semibold text-muted-foreground mb-1">Select a
                                                currency
                                            </div>
                                        </div>
                                        {currencies.length > 0 ? (
                                            currencies.map((currency) => (
                                                <SelectItem
                                                    key={currency}
                                                    value={currency}
                                                    className="flex items-center gap-2 rounded-md my-1 pl-3 group"
                                                >
                                                    <div
                                                        className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                        <DollarSign className="h-3.5 w-3.5 text-primary"/>
                                                    </div>
                                                    {currency}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground">
                                                <p className="text-sm">No currencies available</p>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="payPeriod" className="font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary"/>
                                Pay Period <span className="text-destructive">*</span>
                            </Label>
                            {isLoading ? (
                                <Skeleton className="h-10 w-full"/>
                            ) : (
                                <Select
                                    value={formData.payPeriod || ""}
                                    onValueChange={(value) => handleFieldChange("payPeriod", value || null)}
                                >
                                    <SelectTrigger
                                        id="payPeriod"
                                        className="bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow"
                                    >
                                        <SelectValue placeholder="Select period"/>
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] rounded-lg border-border/50 shadow-lg">
                                        <div className="sticky top-0 bg-background p-2 border-b border-border/30 z-10">
                                            <div className="text-xs font-semibold text-muted-foreground mb-1">Select a
                                                pay period
                                            </div>
                                        </div>
                                        {payPeriods.length > 0 ? (
                                            payPeriods.map((period) => (
                                                <SelectItem
                                                    key={period}
                                                    value={period}
                                                    className="flex items-center gap-2 rounded-md my-1 pl-3 group"
                                                >
                                                    <div
                                                        className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                                        <Clock className="h-3.5 w-3.5 text-primary"/>
                                                    </div>
                                                    {period}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground">
                                                <p className="text-sm">No pay periods available</p>
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10">
                                <Coins className="h-4 w-4 text-primary"/>
                            </div>
                            <Label className="font-medium">Salary Range</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="minSalary"
                                       className="text-sm font-medium flex items-center justify-between">
                                    <span>Minimum Salary</span>
                                    {formData.currency &&
                                        <span className="text-xs text-muted-foreground">{formData.currency}</span>}
                                </Label>
                                <div className="relative">
                                    <DollarSign
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="minSalary"
                                        type="number"
                                        value={formData.minSalary || ""}
                                        onChange={(e) => handleFieldChange("minSalary", Number(e.target.value) || 0)}
                                        placeholder="Min"
                                        className={`bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow pl-10 ${
                                            isInvalidRange ? "border-destructive focus:border-destructive" : ""
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="maxSalary"
                                       className="text-sm font-medium flex items-center justify-between">
                                    <span>Maximum Salary</span>
                                    {formData.currency &&
                                        <span className="text-xs text-muted-foreground">{formData.currency}</span>}
                                </Label>
                                <div className="relative">
                                    <DollarSign
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="maxSalary"
                                        type="number"
                                        value={formData.maxSalary || ""}
                                        onChange={(e) => handleFieldChange("maxSalary", Number(e.target.value) || 0)}
                                        placeholder="Max"
                                        className={`bg-background border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-11 rounded-lg shadow-sm hover:shadow pl-10 ${
                                            isInvalidRange ? "border-destructive focus:border-destructive" : ""
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {isInvalidRange && (
                            <motion.div
                                initial={{opacity: 0, height: 0}}
                                animate={{opacity: 1, height: "auto"}}
                                className="flex items-center gap-2 text-destructive text-sm mt-2 bg-destructive/5 p-3 rounded-lg border border-destructive/20"
                            >
                                <AlertCircle className="h-4 w-4 flex-shrink-0"/>
                                <span>Maximum salary must be greater than minimum salary</span>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-muted/30 p-4 rounded-lg border border-border/30">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-100 rounded-full mt-0.5">
                                <AlertCircle className="h-4 w-4 text-blue-600"/>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-1">Why include salary information?</h4>
                                <p className="text-xs text-muted-foreground">
                                    Job postings with salary information receive up to 40% more applications and help
                                    attract candidates
                                    whose expectations align with your budget.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-between mt-8"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2, duration: 0.3}}
                    >
                        <Button
                            variant="outline"
                            onClick={onBack}
                            className="border-border/50 hover:bg-muted/50 transition-all duration-300"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2"/>
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            className={`flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 ${
                                !isFormComplete ? "opacity-70" : ""
                            }`}
                            disabled={!isFormComplete}
                        >
                            Next <ArrowRight className="h-4 w-4"/>
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
