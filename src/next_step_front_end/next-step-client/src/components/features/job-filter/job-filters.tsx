"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store.ts"
import { fetchSalaryRange } from "@/store/slices/salaries-slice.ts"
import { resetJobFilter } from "@/store/slices/jobs-slice.ts"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet.tsx"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs.tsx"
import { Button } from "@/components/ui/button.tsx"
import LocationFilter from "@/components/features/job-filter/location-filter"
import SalaryFilter from "@/components/features/job-filter/salary-filter"
import OtherFilter from "@/components/features/job-filter/other-filter"
import ActiveFilter from "@/components/features/job-filter/active-filter"
import JobCriteriaFilters from "@/components/features/job-filter/job-criteria-filter"
import { MapPin, Briefcase, Coins, RefreshCw, Filter, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface JobFiltersProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function JobFilters({ isOpen, onOpenChange }: JobFiltersProps) {
  const dispatch = useDispatch<AppDispatch>()

  const filter = useSelector((state: RootState) => state.jobs.filter)

  const tabItems = [
    { id: "location", label: "Location", icon: MapPin },
    { id: "job", label: "Job", icon: Briefcase },
    { id: "salary", label: "Salary", icon: Coins },
    { id: "other", label: "Other", icon: Sparkles },
  ]

  useEffect(() => {
    if (filter.currency && filter.payPeriod) {
      dispatch(
          fetchSalaryRange({
            currency: filter.currency,
            payPeriod: filter.payPeriod,
          }),
      )
    }
  }, [dispatch, filter.currency, filter.payPeriod])

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto p-6 bg-background/95 backdrop-blur-md border-l border-border/50">
          <SheetHeader className="pb-6 border-b border-border/30">
            <SheetTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              Filter Jobs
            </SheetTitle>
            <SheetDescription className="text-base mt-2">
              Narrow down your job search with specific criteria to find the perfect match for your career goals.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Tabs defaultValue="location" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6 bg-muted/50 p-1 rounded-lg border border-border/30">
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary flex items-center gap-2 py-2.5 transition-all duration-300"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="bg-muted/20 p-5 rounded-xl border border-border/30 shadow-sm">
                <TabsContent value="location" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LocationFilter />
                  </motion.div>
                </TabsContent>
                <TabsContent value="job" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <JobCriteriaFilters />
                  </motion.div>
                </TabsContent>
                <TabsContent value="salary" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SalaryFilter />
                  </motion.div>
                </TabsContent>
                <TabsContent value="other" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OtherFilter />
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <SheetFooter className="pt-4 border-t border-border/30 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => dispatch(resetJobFilter())}
              className="w-full sm:w-auto order-2 sm:order-1 flex items-center gap-2 border-border/50 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
              Reset All
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="my-4">
        <ActiveFilter />
      </div>
    </>
  )
}
