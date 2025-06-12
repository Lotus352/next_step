"use client"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store.ts"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Globe, MapPin, Briefcase, Clock, Coins, Calendar, X, Filter } from "lucide-react"
import { currencySymbols, formatTextEnum } from "@/lib/utils.ts"
import type { JSX } from "react"
import { DATE_POSTED_LABELS, DEFAULT_MAX_SALARY } from "@/constants"
import { DEFAULT_MIN_SALARY } from "@/constants"
import { resetJobFilter } from "@/store/slices/jobs-slice"
import { motion, AnimatePresence } from "framer-motion"

export default function ActiveFilter() {
  const dispatch = useDispatch<AppDispatch>()

  const filter = useSelector((state: RootState) => state.jobs.filter)
  const salaryRange = useSelector((state: RootState) => state.salaries.range || null)

  const hasSalaryFilter =
    !!filter.salaryRange &&
    ((filter.salaryRange.minSalary != null &&
      filter.salaryRange.minSalary > (salaryRange?.minSalary ?? DEFAULT_MIN_SALARY)) ||
      (filter.salaryRange.maxSalary != null &&
        filter.salaryRange.maxSalary < (salaryRange?.maxSalary ?? DEFAULT_MAX_SALARY)))

  const hasActiveFilter =
    !!filter.country ||
    !!filter.city ||
    !!filter.employmentType ||
    filter.experienceLevels.length > 0 ||
    hasSalaryFilter ||
    filter.skills.length > 0 ||
    !!filter.datePosted

  if (!hasActiveFilter) return null

  const renderBadge = (icon: JSX.Element, content: string | number, key: string) => (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Badge
        variant="secondary"
        className="flex items-center gap-1.5 py-1.5 px-3 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/15 transition-colors"
      >
        {icon}
        <span className="font-medium">{content}</span>
      </Badge>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-2 bg-muted/30 p-4 rounded-xl border border-border/40 shadow-sm"
    >
      <div className="flex items-center gap-2 bg-background/70 px-3 py-1.5 rounded-full border border-border/30 shadow-sm">
        <Filter className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Active filters:</span>
      </div>

      <AnimatePresence>
        {filter.country && renderBadge(<Globe className="h-3.5 w-3.5" />, filter.country, `country-${filter.country}`)}
        {filter.city && renderBadge(<MapPin className="h-3.5 w-3.5" />, filter.city, `city-${filter.city}`)}
        {filter.employmentType &&
          renderBadge(
            <Briefcase className="h-3.5 w-3.5" />,
            formatTextEnum(filter.employmentType),
            `employment-${filter.employmentType}`,
          )}

        {filter.experienceLevels.map((exp, index) =>
          renderBadge(<Clock className="h-3.5 w-3.5" />, exp, `exp-${exp}-${index}`),
        )}

        {hasSalaryFilter &&
          renderBadge(
            <Coins className="h-3.5 w-3.5" />,
            `${filter.currency && currencySymbols(filter.currency)}${filter.salaryRange.minSalary?.toLocaleString() ?? salaryRange?.minSalary?.toLocaleString() ?? "N/A"} - ${filter.salaryRange.maxSalary?.toLocaleString() ?? salaryRange?.maxSalary?.toLocaleString() ?? "N/A"}`,
            `salary-${filter.currency}-${filter.salaryRange.minSalary}-${filter.salaryRange.maxSalary}`,
          )}

        {filter.datePosted &&
          renderBadge(
            <Calendar className="h-3.5 w-3.5" />,
            DATE_POSTED_LABELS[filter.datePosted] || "Unknown",
            `date-${filter.datePosted}`,
          )}

        {filter.skills.map((skill, index) =>
          renderBadge(<span className="h-2 w-2 rounded-full bg-primary" />, skill, `skill-${skill}-${index}`),
        )}
      </AnimatePresence>

      <div className="ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 rounded-full border-border/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 flex items-center gap-1.5"
          onClick={() => dispatch(resetJobFilter())}
        >
          <X className="h-3.5 w-3.5" />
          Clear all
        </Button>
      </div>
    </motion.div>
  )
}
