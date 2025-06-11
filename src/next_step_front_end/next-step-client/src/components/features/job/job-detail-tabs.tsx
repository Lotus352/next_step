"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import JobDetailDescription from "@/components/features/job/job-detail-description"
import CompanyDescription from "@/components/features/company/company-description"
import CompanyReviewsSection from "@/components/features/company-review/company-reviews-section"
import { FileText, Building2, MessageSquare, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import DestructiveAlert from "@/components/destructive-alert"

export default function JobDetailTabs() {
  const { selected } = useSelector((state: RootState) => state.jobs)
  const [activeTab, setActiveTab] = useState("description")

  return !selected ? (
    <DestructiveAlert message={"Not found job"} />
  ) : (
    <motion.div
      className="w-full mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Tabs defaultValue="description" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8">
          {/* Enhanced tab header */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Detailed Information</span>
          </div>

          <TabsList className="w-full h-auto p-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg grid grid-cols-3 gap-2">
            <TabsTrigger
              value="description"
              className={`
                flex flex-col items-center justify-center gap-3 py-6 px-4
                rounded-xl transition-all duration-500 ease-out relative overflow-hidden
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                hover:bg-muted/50 group
              `}
            >
              {/* Background glow for active state */}
              {activeTab === "description" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                  layoutId="activeTabBg"
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={`
                    p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                    ${
                      activeTab === "description"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    }
                  `}
                >
                  <FileText className="h-6 w-6" />
                </div>
                <span
                  className={`
                    text-sm font-semibold transition-all duration-300
                    ${
                      activeTab === "description"
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    }
                  `}
                >
                  <span className="hidden sm:inline">Job Description</span>
                  <span className="sm:hidden">Description</span>
                </span>

                {activeTab === "description" && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                    layoutId="tabIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="company"
              className={`
                flex flex-col items-center justify-center gap-3 py-6 px-4
                rounded-xl transition-all duration-500 ease-out relative overflow-hidden
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                hover:bg-muted/50 group
              `}
            >
              {/* Background glow for active state */}
              {activeTab === "company" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                  layoutId="activeTabBg"
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={`
                    p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                    ${
                      activeTab === "company"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    }
                  `}
                >
                  <Building2 className="h-6 w-6" />
                </div>
                <span
                  className={`
                    text-sm font-semibold transition-all duration-300
                    ${
                      activeTab === "company"
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    }
                  `}
                >
                  Company
                </span>

                {activeTab === "company" && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                    layoutId="tabIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="reviews"
              className={`
                flex flex-col items-center justify-center gap-3 py-6 px-4
                rounded-xl transition-all duration-500 ease-out relative overflow-hidden
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                hover:bg-muted/50 group
              `}
            >
              {/* Background glow for active state */}
              {activeTab === "reviews" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                  layoutId="activeTabBg"
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={`
                    p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                    ${
                      activeTab === "reviews"
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    }
                  `}
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
                <span
                  className={`
                    text-sm font-semibold transition-all duration-300
                    ${
                      activeTab === "reviews"
                        ? "text-primary-foreground"
                        : "text-muted-foreground group-hover:text-primary"
                    }
                  `}
                >
                  Reviews
                </span>

                {activeTab === "reviews" && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                    layoutId="tabIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <TabsContent value="description" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <JobDetailDescription />
            </TabsContent>

            <TabsContent value="company" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <CompanyDescription />
            </TabsContent>

            <TabsContent value="reviews" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <CompanyReviewsSection />
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  )
}
