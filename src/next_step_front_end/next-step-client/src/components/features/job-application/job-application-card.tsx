"use client"

import type React from "react"
import { useEffect } from "react"

import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Send, FileText, Upload, Clock, CheckCircle2, AlertCircle, Briefcase, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import type { AppDispatch, RootState } from "@/store/store"
import {
  apply,
  checkCanWithdraw,
  checkHasApplied,
  deleteApplication,
  fetchApplicationInfoByJob,
} from "@/store/slices/job-applications-slice"
import { StatusNotification, type NotificationType } from "@/components/notification-state/status-notification"
import { useNavigate } from "react-router-dom"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function JobApplicationCard() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redux state
  const { info: applicationInfo } = useSelector((state: RootState) => state.jobApplications)
  const { selected: selectedJob } = useSelector((state: RootState) => state.jobs)
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile } = useSelector((state: RootState) => state.user)
  const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")
  const { hasApplied, canWithdraw } = useSelector((state: RootState) => state.jobApplications)

  // Local state
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeOption, setResumeOption] = useState<"existing" | "upload">("existing")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add after the existing state declarations
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // Notification state
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "info" as NotificationType,
    title: "",
    message: "",
  })

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    })
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate("/sign-in")
      return
    }
    setShowApplicationForm(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = [".pdf", ".doc", ".docx"]
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

      if (!allowedTypes.includes(fileExtension)) {
        showNotification("error", "Invalid File Type", "Please upload a PDF, DOC, or DOCX file.")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("error", "File Too Large", "Please upload a file smaller than 5MB.")
        return
      }

      setUploadedFile(file)
      showNotification("success", "File Selected", `${file.name} is ready to upload.`)
    }
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob || !applicationInfo || !user) return

    setIsSubmitting(true)
    showNotification("loading", "Submitting Application", "Please wait while we process your application...")

    try {
      let fileToSubmit: File | null = null

      if (resumeOption === "upload" && uploadedFile) {
        // Use the uploaded file directly
        fileToSubmit = uploadedFile
      } else if (resumeOption === "existing" && profile?.resumeUrl) {
        // For existing resume, we need to fetch it and convert to File
        // Since the API expects a File object, we'll need to handle this case
        // For now, we'll create a placeholder file or modify the API call
        try {
          const response = await fetch(profile.resumeUrl)
          const blob = await response.blob()
          const fileName = profile.resumeUrl.split("/").pop() || "resume.pdf"
          fileToSubmit = new File([blob], fileName, { type: blob.type })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          showNotification("error", "Resume Error", "Failed to load existing resume. Please upload a new one.")
          setIsSubmitting(false)
          return
        }
      }

      if (!fileToSubmit) {
        showNotification("error", "Resume Required", "Please select or upload a resume file.")
        setIsSubmitting(false)
        return
      }

      // Submit application using the apply thunk
      await dispatch(
          apply({
            file: fileToSubmit,
            userId: user.userId,
            jobId: selectedJob.jobId,
            coverLetter: coverLetter.trim(),
          }),
      ).unwrap()

      // Refresh application info to get updated count
      await dispatch(fetchApplicationInfoByJob(selectedJob.jobId))

      // Refresh the hasApplied status to update UI
      await dispatch(checkHasApplied(selectedJob.jobId))

      showNotification("success", "Application Submitted!", "Your application has been sent successfully.")
      setShowApplicationForm(false)
      setCoverLetter("")
      setUploadedFile(null)
      setResumeOption("existing")
    } catch (error: any) {
      showNotification(
          "error",
          "Application Failed",
          error.message || "Failed to submit application. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add this function after handleSubmitApplication
  const handleWithdrawApplication = async () => {
    if (!hasApplied || !selectedJob) return

    setIsWithdrawing(true)
    showNotification("loading", "Withdrawing Application", "Please wait while we process your withdrawal...")

    try {
      await dispatch(deleteApplication({ id: hasApplied.applicationId })).unwrap()

      // Refresh application info
      await dispatch(fetchApplicationInfoByJob(selectedJob.jobId))
      await dispatch(checkHasApplied(selectedJob.jobId))

      showNotification("success", "Application Withdrawn", "Your application has been successfully withdrawn.")
      setShowWithdrawDialog(false)
    } catch (error: any) {
      showNotification(
          "error",
          "Withdrawal Failed",
          error.message || "Failed to withdraw application. Please try again.",
      )
    } finally {
      setIsWithdrawing(false)
    }
  }

  const isExpired = applicationInfo?.expiryDate && new Date(applicationInfo.expiryDate) < new Date()
  const hasExistingResume = profile?.resumeUrl

  useEffect(() => {
    if (selectedJob?.jobId) {
      dispatch(checkHasApplied(selectedJob.jobId))
          .unwrap()
          .then((result) => {
            if (result) {
              dispatch(checkCanWithdraw(result.applicationId))
            }
          })
    }
  }, [dispatch, selectedJob?.jobId, hasApplied])

  if (!applicationInfo || !selectedJob) {
    return (
        <Card className="border-border/30 bg-background/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-2">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">Application information not available</p>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <>
        <StatusNotification
            isVisible={notification.isVisible}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={closeNotification}
        />

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
            {/* Enhanced top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

            <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold">Apply for this Job</CardTitle>
                  <CardDescription className="text-base mt-1">Submit your application and join the team</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Application Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    className="group/item relative overflow-hidden"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                >
                  <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-4 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold">Applicants</span>
                    </div>
                    <div className="text-2xl font-bold text-primary">{applicationInfo.countJobApplications}</div>
                    <div className="text-xs text-muted-foreground">people applied</div>
                  </div>
                </motion.div>

                {applicationInfo.interviewProcess && (
                    <motion.div
                        className="group/item relative overflow-hidden"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                      <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-4 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold">Interview</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">{applicationInfo.interviewProcess}</div>
                        <div className="text-xs text-muted-foreground">stage process</div>
                      </div>
                    </motion.div>
                )}

                {applicationInfo.expiryDate && (
                    <motion.div
                        className="group/item relative overflow-hidden"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                    >
                      <div
                          className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${
                              isExpired
                                  ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                                  : "bg-gradient-to-br from-muted/20 to-muted/10 border-border/30"
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold">Deadline</span>
                        </div>
                        <div className={`text-sm font-bold ${isExpired ? "text-red-600" : "text-primary"}`}>
                          {isExpired
                              ? "Expired"
                              : formatDistanceToNow(new Date(applicationInfo.expiryDate), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(applicationInfo.expiryDate).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                )}
              </div>

              {/* Application Status */}
              {isExpired && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-700">Application Deadline Passed</p>
                      <p className="text-sm text-red-600">This job posting is no longer accepting applications.</p>
                    </div>
                  </div>
              )}

              {/* Resume Status */}
              {isAuthenticated && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-foreground">Your Resume</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    </div>

                    {hasExistingResume ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-semibold text-green-700">Resume Ready</p>
                              <p className="text-xs text-green-600">You have a resume on file</p>
                            </div>
                          </div>
                          <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 text-green-700 border-green-300 hover:bg-green-100"
                              onClick={() => window.open(profile?.resumeUrl ? profile?.resumeUrl : "/", "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm font-semibold text-amber-700">No Resume Found</p>
                              <p className="text-xs text-amber-600">Upload a resume to apply</p>
                            </div>
                          </div>
                        </div>
                    )}
                  </div>
              )}
            </CardContent>

            <CardFooter className="bg-muted/50 px-6 py-4 border-t transition-all duration-300 group-hover:bg-muted/70">
              {hasApplied && canWithdraw ? (
                  <div className="w-full space-y-3">
                    <Button
                        onClick={() => setShowWithdrawDialog(true)}
                        variant="destructive"
                        className="w-full gap-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base font-semibold"
                    >
                      <AlertCircle className="h-5 w-5" />
                      Withdraw Application
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      You applied on {new Date(hasApplied.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
              ) : (
                  <>
                    <Button
                        onClick={handleApplyClick}
                        disabled={isExpired || isSubmitting || !!hasApplied}
                        className="w-full gap-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base font-semibold relative overflow-hidden group/btn bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                    >
                      <Send className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      {isExpired ? "Application Closed" : hasApplied ? "Already Applied" : "Apply Now"}

                      {/* Shimmer effect */}
                      {!isExpired && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/btn:translate-x-[200%] transition-transform duration-700" />
                      )}
                    </Button>
                  </>
              )}
            </CardFooter>
          </Card>
        </motion.div>

        {/* Application Form Dialog */}
        <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                Apply for {selectedJob?.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                Complete your application by providing a cover letter and selecting your resume.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Cover Letter */}
              <div className="space-y-3">
                <Label htmlFor="coverLetter" className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Cover Letter *
                </Label>
                <Textarea
                    id="coverLetter"
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="min-h-[120px] resize-none"
                    required
                />
                <p className="text-xs text-muted-foreground">{coverLetter.length}/500 characters</p>
              </div>

              <Separator />

              {/* Resume Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Resume *
                </Label>

                <RadioGroup value={resumeOption} onValueChange={(value: "existing" | "upload") => setResumeOption(value)}>
                  {/* Existing Resume Option */}
                  {hasExistingResume && (
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="existing" id="existing" />
                        <Label htmlFor="existing" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Use existing resume</p>
                              <p className="text-sm text-muted-foreground">Resume already uploaded to your profile</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={(e) => {
                                  e.preventDefault()
                                  window.open(profile?.resumeUrl ? profile.resumeUrl : "/", "_blank")
                                }}
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          </div>
                        </Label>
                      </div>
                  )}

                  {/* Upload New Resume Option */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="upload" id="upload" />
                    <Label htmlFor="upload" className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">Upload new resume</p>
                        <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX (max 5MB)</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {/* File Upload Section */}
                <AnimatePresence>
                  {resumeOption === "upload" && (
                      <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                      >
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                          <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              className="hidden"
                          />

                          {uploadedFile ? (
                              <div className="space-y-3">
                                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                                <div>
                                  <p className="font-medium text-green-700">{uploadedFile.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                  Choose Different File
                                </Button>
                              </div>
                          ) : (
                              <div className="space-y-3">
                                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                                <div>
                                  <p className="font-medium">Click to upload resume</p>
                                  <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX up to 5MB</p>
                                </div>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                  Choose File
                                </Button>
                              </div>
                          )}
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button variant="outline" onClick={() => setShowApplicationForm(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                  onClick={handleSubmitApplication}
                  disabled={
                      isSubmitting ||
                      !coverLetter.trim() ||
                      (resumeOption === "existing" && !hasExistingResume) ||
                      (resumeOption === "upload" && !uploadedFile)
                  }
                  className="gap-2 relative overflow-hidden"
              >
                {isSubmitting ? (
                    <>
                      <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                      >
                        <Clock className="h-4 w-4" />
                      </motion.div>
                      Submitting...
                    </>
                ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Application
                    </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Confirmation Dialog */}
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                Withdraw Application
              </DialogTitle>
              <DialogDescription className="text-base">
                Are you sure you want to withdraw your application for {selectedJob?.title}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-700">Warning</p>
                  <p className="text-xs text-amber-600">You will need to reapply if you change your mind later.</p>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button variant="outline" onClick={() => setShowWithdrawDialog(false)} disabled={isWithdrawing}>
                Cancel
              </Button>
              <Button
                  variant="destructive"
                  onClick={handleWithdrawApplication}
                  disabled={isWithdrawing}
                  className="gap-2"
              >
                {isWithdrawing ? (
                    <>
                      <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                      >
                        <Clock className="h-4 w-4" />
                      </motion.div>
                      Withdrawing...
                    </>
                ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Withdraw Application
                    </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
  )
}
