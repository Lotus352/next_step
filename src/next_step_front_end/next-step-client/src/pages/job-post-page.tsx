"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import {
  Briefcase,
  MapPin,
  Coins,
  GraduationCap,
  CheckCircle,
  ChevronLeft,
  FileText,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { DetailsForm } from "@/components/features/job-post/details-form"
import { LocationSelector } from "@/components/features/job-post/location-selector"
import { SalarySelector } from "@/components/features/job-post/salary-selector"
import { CriteriaSelector } from "@/components/features/job-post/criteria-selector"
import { useNavigate } from "react-router-dom"

// Redux imports
import type { AppDispatch, RootState } from "@/store/store"
import { fetchCountries } from "@/store/slices/locations-slice"
import { fetchSkills } from "@/store/slices/skills-slice"
import { fetchLevels } from "@/store/slices/experience-levels-slice"
import { fetchEmploymentTypes, addJob, clearJobSelected, initializeJob } from "@/store/slices/jobs-slice"
import { fetchCurrencies, fetchPayPeriods } from "@/store/slices/salary-slice"

// Types and constants
import { DEFAULT_LEVEL_SIZE, DEFAULT_SKILL_SIZE, DEFAULT_PAGE } from "@/constants"

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/loading"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function JobPostPage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // Redux state
  const { status } = useSelector((state: RootState) => state.jobs)
  const request = useSelector((state: RootState) => state.jobs.request)

  // Local state
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize job data
  useEffect(() => {
    dispatch(initializeJob())
  }, [dispatch])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await Promise.all([
          dispatch(fetchCountries()),
          dispatch(fetchSkills({ page: DEFAULT_PAGE, size: DEFAULT_SKILL_SIZE })),
          dispatch(fetchLevels({ page: DEFAULT_PAGE, size: DEFAULT_LEVEL_SIZE })),
          dispatch(fetchEmploymentTypes()),
          dispatch(fetchCurrencies()),
          dispatch(fetchPayPeriods()),
        ])
        setIsLoading(false)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load necessary data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [dispatch])

  // Handle submission success/failure
  useEffect(() => {
    if (status === "succeeded") {
      dispatch(clearJobSelected())
      navigate("/jobs/manage")
    }
  }, [status, navigate, dispatch])

  // Validation functions based on Redux state
  const isFormValid = useCallback(() => {
    if (!request) return false

    const { title, detailedDescription, location, salary, employmentType } = request
    return (
      title?.trim() !== "" &&
      detailedDescription?.trim() !== "" &&
      location?.countryName &&
      salary?.payPeriod &&
      salary?.currency &&
      employmentType
    )
  }, [request])

  const isTabComplete = useCallback(
    (tab: string) => {
      if (!request) return false

      const { title, detailedDescription, location, salary, employmentType } = request
      switch (tab) {
        case "details":
          return title?.trim() !== "" && detailedDescription?.trim() !== ""
        case "location":
          return !!location?.countryName
        case "salary":
          return !!salary?.payPeriod && !!salary?.currency
        case "criteria":
          return !!employmentType
        default:
          return false
      }
    },
    [request],
  )

  // Event handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSubmit = async () => {
    if (!request || !isFormValid()) {
      return
    }

    setIsSubmitting(true)

    try {
      await dispatch(addJob(request))
    } catch (error) {
      console.error("Error submitting job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClearAll = useCallback(() => {
    dispatch(initializeJob())
  }, [dispatch])

  // Loading and error states
  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="container mx-auto py-12 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Employer</Badge>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Post a New Job</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Create a compelling job posting to attract qualified candidates for your company
          </p>
        </motion.div>

        <Card className="shadow-xl border-border/30 bg-background/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-4 border-b border-border/30 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  Job Details
                </CardTitle>
                <CardDescription className="mt-2">
                  Complete all sections to create an effective job posting
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate(-1)} className="border-border/50">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className={`bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 ${
                    !isFormValid() || isSubmitting ? "opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Post Job"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6 pt-6 pb-4 border-b border-border/30">
                <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto h-14 p-1 bg-muted/50 rounded-xl">
                  <TabsTrigger
                    value="details"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 ease-out data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      {isTabComplete("details") ? (
                        <motion.div
                          className="bg-green-500 text-white rounded-full p-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span>Details</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 ease-out data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      {isTabComplete("location") ? (
                        <motion.div
                          className="bg-green-500 text-white rounded-full p-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span>Location</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="salary"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 ease-out data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      {isTabComplete("salary") ? (
                        <motion.div
                          className="bg-green-500 text-white rounded-full p-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Coins className="h-4 w-4" />
                      )}
                      <span>Salary</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="criteria"
                    className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-500 ease-out data-[state=active]:shadow-lg"
                  >
                    <div className="flex items-center gap-2">
                      {isTabComplete("criteria") ? (
                        <motion.div
                          className="bg-green-500 text-white rounded-full p-0.5"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Briefcase className="h-4 w-4" />
                      )}
                      <span>Criteria</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 relative overflow-hidden">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TabsContent value="details" className="mt-0">
                    <DetailsForm onNext={() => handleTabChange("location")} onClearAll={handleClearAll} />
                  </TabsContent>

                  <TabsContent value="location" className="mt-0">
                    <LocationSelector
                      onClearAll={handleClearAll}
                      onNext={() => handleTabChange("salary")}
                      onBack={() => handleTabChange("details")}
                    />
                  </TabsContent>

                  <TabsContent value="salary" className="mt-0">
                    <SalarySelector
                      onClearAll={handleClearAll}
                      onNext={() => handleTabChange("criteria")}
                      onBack={() => handleTabChange("location")}
                    />
                  </TabsContent>

                  <TabsContent value="criteria" className="mt-0">
                    <CriteriaSelector
                      onClearAll={handleClearAll}
                      onBack={() => handleTabChange("salary")}
                      onSubmit={handleSubmit}
                    />
                  </TabsContent>
                </motion.div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10"
        >
          <Card className="border-border/30 bg-gradient-to-br from-muted/20 to-background shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                Effective Job Posting Tips
              </CardTitle>
              <Separator className="bg-gradient-to-r from-border/50 via-border/30 to-border/50" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 pl-5 list-disc text-muted-foreground">
                <li>Use clear, specific job titles that candidates are likely to search for</li>
                <li>Provide detailed information about responsibilities and day-to-day tasks</li>
                <li>Be transparent about salary range to attract serious candidates</li>
                <li>List required skills in order of priority, distinguishing between must-have and nice-to-have</li>
                <li>Include information about your company culture and benefits</li>
              </ul>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t border-border/30 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>Jobs with complete information receive up to 3x more qualified applicants</span>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
