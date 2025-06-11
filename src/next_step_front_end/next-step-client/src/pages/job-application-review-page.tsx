import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Briefcase, Users, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import JobListings from "@/components/features/job/job-listings-employer"
import ApplicationList from "@/components/features/job-application/job-application-list"
import ApplicationDetail from "@/components/features/job-application/job-application-detail"
import JobInformation from "@/components/features/job/job-information"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

export default function JobApplicationReviewPage() {
  const job = useSelector((state: RootState) => state.jobs.selected)
  const application = useSelector((state: RootState) => state.jobApplications.selected)

  // Get application status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Candidate Ranking System</h1>
                <p className="text-muted-foreground mt-1">Review and manage job applications</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Job Listings */}
            <Card className="lg:col-span-1 h-fit shadow-md border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Job Listings
                </CardTitle>
                <CardDescription>Select a job to view applications</CardDescription>
                <Separator className="mt-2" />
              </CardHeader>
              <CardContent className="pt-0">
                <JobListings/>
              </CardContent>
            </Card>

            {/* Middle and Right Columns */}
            <div className="lg:col-span-2 space-y-6">
              {job ? (
                <Tabs defaultValue="applications" className="w-full">
                  <TabsList className="w-full mb-4 grid grid-cols-2">
                    <TabsTrigger
                      value="applications"
                      className="flex items-center justify-center data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Candidates
                    </TabsTrigger>
                    <TabsTrigger
                      value="job-details"
                      className="flex items-center justify-center data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Job Details
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="applications" className="space-y-6">
                    <Card className="shadow-md border-muted">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Candidates
                        </CardTitle>
                        <CardDescription>Review applications for this position</CardDescription>
                        <Separator className="mt-2" />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ApplicationList/>
                      </CardContent>
                    </Card>

                    {application && (
                      <Card className="shadow-md border-muted">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                Candidate Details
                              </CardTitle>
                              <CardDescription>Review candidate information and resume</CardDescription>
                            </div>
                            {getStatusBadge("pending")}
                          </div>
                          <Separator className="mt-2" />
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ApplicationDetail />
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="job-details">
                    <Card className="shadow-md border-muted">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Job Details
                        </CardTitle>
                        <CardDescription>View complete job information</CardDescription>
                        <Separator className="mt-2" />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <JobInformation jobId={job.jobId} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="shadow-md border-muted">
                  <CardContent className="p-12 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Briefcase className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Job Selected</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Select a job posting from the list to view candidates and details
                    </p>
                    <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      Browse Job Listings
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer/>
    </div>
  )
}
