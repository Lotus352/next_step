"use client"

import { useDispatch, useSelector } from "react-redux"
import { Calendar, Banknote, Coins, RefreshCw, DollarSign } from "lucide-react"
import { cn, currencySymbols } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setFilter } from "@/store/slices/jobs-slice"
import type { AppDispatch, RootState } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DEFAULT_MIN_SALARY,
  DEFAULT_MAX_SALARY,
  SALARY_STEP,
  PAY_PERIODS,
  DEFAULT_PAY_PERIOD,
  DEFAULT_CURRENCY,
} from "@/constants"
import { motion } from "framer-motion"

export default function SalaryFilter() {
  const dispatch = useDispatch<AppDispatch>()

  const filter = useSelector((state: RootState) => state.jobs.filter)
  const currencies = useSelector((state: RootState) => state.salaries.currencies || [])

  // Handle pay period selection
  const handlePayPeriodChange = (value: string) => {
    dispatch(setFilter({ ...filter, payPeriod: value }))
  }

  // Handle currency selection
  const handleCurrencyChange = (value: string) => {
    dispatch(setFilter({ ...filter, currency: value }))
  }

  // Reset all salary-related filters
  const handleClearAll = () => {
    dispatch(
      setFilter({
        ...filter,
        payPeriod: DEFAULT_PAY_PERIOD,
        currency: DEFAULT_CURRENCY,
        salaryRange: {
          minSalary: DEFAULT_MIN_SALARY,
          maxSalary: DEFAULT_MAX_SALARY,
        },
      }),
    )
  }

  // UI state helpers
  const hasSalaryFilters = !!filter.payPeriod || !!filter.currency
  const isPayPeriodSelected = !!filter.payPeriod
  const isSalaryRangeInteractive = !!filter.payPeriod && !!filter.currency

  return (
    <Card className="shadow-md border-border/30 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Salary
          </CardTitle>
          {/* Show clear button if any filter is applied */}
          {hasSalaryFilters && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all salary filters</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Separator className="bg-border/30" />
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {/* Pay Period Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="payPeriod" className="font-medium text-sm flex items-center gap-1">
              Pay Period <span className="text-destructive">*</span>
            </Label>
          </div>
          <Select value={filter.payPeriod || undefined} onValueChange={handlePayPeriodChange}>
            <SelectTrigger
              id="payPeriod"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select pay period" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              {PAY_PERIODS.map((period) => (
                <SelectItem key={period} value={period} className="flex items-center gap-2">
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency Selection, disabled until pay period is selected */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Banknote className="h-4 w-4 text-primary" />
            </div>
            <Label
              htmlFor="salaryCurrency"
              className={cn("font-medium text-sm", !isPayPeriodSelected ? "text-muted-foreground" : "")}
            >
              Currency
            </Label>
          </div>
          <Select
            value={filter.currency || undefined}
            onValueChange={handleCurrencyChange}
            disabled={!isPayPeriodSelected}
          >
            <SelectTrigger
              id="salaryCurrency"
              className={cn(
                "bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg",
                !isPayPeriodSelected && "opacity-60 cursor-not-allowed",
              )}
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency} className="flex items-center gap-2">
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range Selection, only interactive if both currency and pay period are selected */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <Label
              id="salary-range-label"
              className={cn("font-medium text-sm", !isSalaryRangeInteractive ? "text-muted-foreground" : "")}
            >
              Salary Range
            </Label>
          </div>

          {/* Min and Max Salary Text Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {/* Min Salary Input */}
            <div className="space-y-2">
              <Label htmlFor="minSalary" className="text-xs text-muted-foreground">
                Minimum
              </Label>
              <div className="relative">
                {/* Show currency symbol if selected */}
                {filter.currency && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencySymbols(filter.currency)}
                  </div>
                )}
                <input
                  id="minSalary"
                  type="number"
                  value={filter.salaryRange?.minSalary || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? null : Number(e.target.value)
                    const minSalary = value !== null ? Math.max(DEFAULT_MIN_SALARY, value) : DEFAULT_MIN_SALARY
                    const maxSalary = filter.salaryRange?.maxSalary || DEFAULT_MAX_SALARY

                    dispatch(
                      setFilter({
                        ...filter,
                        salaryRange: {
                          minSalary,
                          maxSalary: Math.max(maxSalary, minSalary),
                        },
                      }),
                    )
                  }}
                  placeholder="Min"
                  disabled={!isSalaryRangeInteractive}
                  className={cn(
                    "w-full h-10 bg-background/80 border border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 rounded-lg px-3",
                    filter.currency && "pl-8",
                    !isSalaryRangeInteractive && "opacity-60 cursor-not-allowed",
                  )}
                  min={DEFAULT_MIN_SALARY}
                  max={DEFAULT_MAX_SALARY}
                  step={SALARY_STEP}
                />
              </div>
            </div>

            {/* Max Salary Input */}
            <div className="space-y-2">
              <Label htmlFor="maxSalary" className="text-xs text-muted-foreground">
                Maximum
              </Label>
              <div className="relative">
                {/* Show currency symbol if selected */}
                {filter.currency && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencySymbols(filter.currency)}
                  </div>
                )}
                <input
                  id="maxSalary"
                  type="number"
                  value={filter.salaryRange?.maxSalary || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? null : Number(e.target.value)
                    const maxSalary = value !== null ? Math.min(DEFAULT_MAX_SALARY, value) : DEFAULT_MAX_SALARY
                    const minSalary = filter.salaryRange?.minSalary || DEFAULT_MIN_SALARY

                    dispatch(
                      setFilter({
                        ...filter,
                        salaryRange: {
                          minSalary: Math.min(minSalary, maxSalary),
                          maxSalary,
                        },
                      }),
                    )
                  }}
                  placeholder="Max"
                  disabled={!isSalaryRangeInteractive}
                  className={cn(
                    "w-full h-10 bg-background/80 border border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 rounded-lg px-3",
                    filter.currency && "pl-8",
                    !isSalaryRangeInteractive && "opacity-60 cursor-not-allowed",
                  )}
                  min={DEFAULT_MIN_SALARY}
                  max={DEFAULT_MAX_SALARY}
                  step={SALARY_STEP}
                />
              </div>
            </div>
          </div>

          {/* Salary range display */}
          {isSalaryRangeInteractive && (filter.salaryRange?.minSalary || filter.salaryRange?.maxSalary) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">
                  Range: {filter.currency && currencySymbols(filter.currency)}
                  {(filter.salaryRange?.minSalary || DEFAULT_MIN_SALARY).toLocaleString()} -{" "}
                  {filter.currency && currencySymbols(filter.currency)}
                  {(filter.salaryRange?.maxSalary || DEFAULT_MAX_SALARY).toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Help text when not interactive */}
        {!isSalaryRangeInteractive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-center p-4 bg-muted/30 rounded-lg border border-dashed border-border/50"
          >
            <div className="relative">
              <Coins className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Select pay period and currency to set salary range
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
