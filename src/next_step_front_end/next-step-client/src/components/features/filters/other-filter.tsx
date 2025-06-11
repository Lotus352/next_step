"use client"

import { useDispatch, useSelector } from "react-redux"
import { Calendar, Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { setFilter } from "@/store/slices/jobs-slice"
import type { AppDispatch, RootState } from "@/store/store"
import { motion } from "framer-motion"
import { DEFAULT_DATE_POSTED } from "@/constants"

export default function OtherFilter() {
  const dispatch = useDispatch<AppDispatch>()
  const filter = useSelector((state: RootState) => state.jobs.filter)

  // Handle date posted selection
  const handleDatePostedChange = (value: string) => {
    dispatch(setFilter({ ...filter, datePosted: value }))
  }

  // Reset all date-related filters
  const handleClearAll = () => {
    dispatch(setFilter({ ...filter, datePosted: DEFAULT_DATE_POSTED }))
  }

  // UI state helpers
  const hasFilters = !!filter.datePosted

  const dateOptions = [
    { value: "all", label: "Any time" },
    { value: "day", label: "Last 24 hours" },
    { value: "week", label: "Last week" },
    { value: "month", label: "Last month" },
  ]

  return (
    <Card className="shadow-md border-border/30 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Other Filters
          </CardTitle>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full"
            >
              Clear all
            </Button>
          )}
        </div>
        <Separator className="bg-border/30" />
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="datePosted" className="font-medium text-sm">
              Date Posted
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {dateOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter.datePosted === option.value ? "default" : "outline"}
                size="sm"
                className={`h-10 justify-start gap-2 rounded-lg border-border/50 ${
                  filter.datePosted === option.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10 hover:text-primary"
                } transition-all duration-300`}
                onClick={() => handleDatePostedChange(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {!hasFilters && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-center p-4 bg-muted/30 rounded-lg border border-dashed border-border/50"
          >
            <div className="relative">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Filter jobs by posting date to find the most recent opportunities
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
