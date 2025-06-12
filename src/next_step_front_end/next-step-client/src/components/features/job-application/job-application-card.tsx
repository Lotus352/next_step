"use client"

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {Button} from "@/components/ui/button"
import {useDispatch, useSelector} from "react-redux"
import {useState, useEffect} from "react"
import type {AppDispatch, RootState} from "@/store/store"
import {apply, resetApplying} from "@/store/slices/job-applications-slice"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Badge} from "@/components/ui/badge"
import {Progress} from "@/components/ui/progress"
import {motion, AnimatePresence} from "framer-motion"
import ErrorPage from "@/pages/error-page"
import {ApplicationNotification} from "@/components/notifications/application-notification.tsx"
import {
    Briefcase,
    Calendar,
    Users,
    Clock,
    Upload,
    FileText,
    CheckCircle,
    AlertCircle,
    Sparkles,
    BookmarkPlus,
} from "lucide-react"
import {clearJobError} from "@/store/slices/jobs-slice.ts";

export default function JobApplicationCard() {
    const dispatch = useDispatch<AppDispatch>()

    // Redux state
    const {
        statuses: {applying},
        info,
        error
    } = useSelector((state: RootState) => state.jobApplications)
    const {user} = useSelector((state: RootState) => state.auth)

    // Local state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [coverLetter, setCoverLetter] = useState("")
    const [resumeOption, setResumeOption] = useState("existing")
    const [uploadProgress, setUploadProgress] = useState(0)
    const [notification, setNotification] = useState({
        isVisible: false,
        type: "info" as "success" | "error" | "info" | "warning",
        title: "",
        message: "",
    })

    // Handle file upload progress simulation
    useEffect(() => {
        if (resumeFile && resumeOption === "upload") {
            setUploadProgress(0)
            const timer = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer)
                        return 100
                    }
                    return prev + 5
                })
            }, 100)
            return () => clearInterval(timer)
        }
    }, [resumeFile, resumeOption])

    // Handle application status notifications
    useEffect(() => {
        if (applying === "loading") {
            setNotification({
                isVisible: true,
                type: "info",
                title: "Submitting Application",
                message: "Your application is being processed...",
            })
        } else if (applying === "succeeded") {
            setNotification({
                isVisible: true,
                type: "success",
                title: "Application Submitted!",
                message: "Your job application has been successfully submitted!",
            })
            // Reset applying status sau khi hiển thị notification
            setTimeout(() => {
                dispatch(resetApplying())
            }, 3000)
        } else if (applying === "failed") {
            setNotification({
                isVisible: true,
                type: "error",
                title: "Submission Failed",
                message: error || "There was a problem submitting your application.",
            })
            // Reset applying status và clear error
            setTimeout(() => {
                dispatch(resetApplying())
                dispatch(clearJobError())
            }, 3000)
        }
    }, [applying, error, dispatch])

    const formattedDate = info?.expiryDate
        ? new Date(info.expiryDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Not specified"

    const daysRemaining = info?.expiryDate
        ? Math.max(0, Math.ceil((new Date(info.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0

    const handleApplyWithResume = () => {
        if (!info?.jobId || !user) {
            setNotification({
                isVisible: true,
                type: "error",
                title: "Application Error",
                message: "Please make sure you're logged in and a job is selected.",
            })
            return
        }

        if (resumeOption === "upload" && !resumeFile) {
            setNotification({
                isVisible: true,
                type: "warning",
                title: "Resume Required",
                message: "Please select a resume file to upload.",
            })
            return
        }

        setShowConfirmDialog(true)
    }

    const handleConfirmedSubmit = () => {
        // Close dialogs
        setShowConfirmDialog(false)
        setIsDialogOpen(false)

        // Dispatch the action with proper type handling
        if (user && info && (resumeFile || resumeOption === "existing")) {
            dispatch(
                apply({
                    file: resumeFile as File,
                    userId: user.userId,
                    jobId: info.jobId,
                    coverLetter,
                }),
            )
        }
    }

    const closeNotification = () => {
        setNotification((prev) => ({...prev, isVisible: false}))
    }

    return !info ? (
        <ErrorPage message="No job selected"/>
    ) : (
        <>
            <ApplicationNotification
                isVisible={notification.isVisible}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                onClose={closeNotification}
            />

            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{duration: 0.5}}>
                <Card
                    className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/95 overflow-hidden">
                    <CardHeader
                        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-primary/10 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Briefcase className="h-5 w-5 text-primary"/>
                                </div>
                                <span>Quick Apply</span>
                            </CardTitle>

                            {daysRemaining <= 7 && daysRemaining > 0 && (
                                <Badge variant="outline"
                                       className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
                                    <Clock className="h-3 w-3 mr-1"/>
                                    {daysRemaining} days left
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-5">
                        <div className="space-y-4">
                            <div
                                className="flex items-center justify-between group transition-all duration-300 hover:translate-x-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar
                                        className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300"/>
                                    <span>Application Deadline</span>
                                </div>
                                <span className="font-medium">{formattedDate}</span>
                            </div>

                            <div
                                className="flex items-center justify-between group transition-all duration-300 hover:translate-x-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users
                                        className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300"/>
                                    <span>Applicants</span>
                                </div>
                                <Badge variant="secondary" className="font-semibold">
                                    {info.countJobApplications} applied
                                </Badge>
                            </div>

                            <div
                                className="flex items-center justify-between group transition-all duration-300 hover:translate-x-1">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Sparkles
                                        className="h-4 w-4 text-primary/70 group-hover:text-primary transition-colors duration-300"/>
                                    <span>Interview Process</span>
                                </div>
                                <span className="font-medium">{info.interviewProcess} rounds</span>
                            </div>
                        </div>

                        <Separator className="my-2"/>

                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <p className="text-sm text-foreground leading-relaxed">
                                Apply now to join our team of talented developers building the future of technology.
                                We're looking for
                                passionate individuals who want to make a difference.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3 bg-gradient-to-t from-muted/30 to-transparent pt-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 group"
                                    disabled={applying === "loading"}
                                >
                                    <motion.div
                                        className="flex items-center gap-2"
                                        whileHover={{x: 5}}
                                        transition={{type: "spring", stiffness: 400, damping: 10}}
                                    >
                                        {applying === "loading" ? (
                                            <>
                                                <Clock className="h-5 w-5 animate-spin"/>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FileText
                                                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"/>
                                                <span>Apply with Resume</span>
                                            </>
                                        )}
                                    </motion.div>
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="sm:max-w-lg rounded-2xl border-primary/10 shadow-2xl backdrop-blur-sm">
                                <DialogHeader>
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                        <Briefcase className="h-5 w-5 text-primary"/>
                                        Apply for Job
                                    </DialogTitle>
                                    <DialogDescription>Complete your application details below.</DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-5 py-4">
                                    <div className="space-y-3">
                                        <Label
                                            htmlFor="coverLetter"
                                            className="text-sm font-semibold text-primary/80 flex items-center gap-2"
                                        >
                                            <FileText className="h-4 w-4"/>
                                            Cover Letter
                                        </Label>
                                        <Textarea
                                            id="coverLetter"
                                            placeholder="Tell us why you're a good fit for this position..."
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                            className="min-h-[120px] rounded-xl border-primary/20 focus:border-primary/40 focus:ring-primary/20 transition-all duration-300"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label
                                            className="text-sm font-semibold text-primary/80 flex items-center gap-2">
                                            <FileText className="h-4 w-4"/>
                                            Resume
                                        </Label>

                                        <RadioGroup value={resumeOption} onValueChange={setResumeOption}
                                                    className="space-y-3">
                                            <div
                                                className="flex items-center space-x-2 p-3 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                                                <RadioGroupItem value="existing" id="existing"/>
                                                <Label
                                                    htmlFor="existing"
                                                    className="text-sm font-semibold cursor-pointer flex items-center gap-2"
                                                >
                                                    <FileText className="h-4 w-4 text-primary/70"/>
                                                    Use my existing resume
                                                </Label>
                                            </div>

                                            <div
                                                className="flex items-center space-x-2 p-3 rounded-lg border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                                                <RadioGroupItem value="upload" id="upload"/>
                                                <Label
                                                    htmlFor="upload"
                                                    className="text-sm font-semibold cursor-pointer flex items-center gap-2"
                                                >
                                                    <Upload className="h-4 w-4 text-primary/70"/>
                                                    Upload a new resume
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        <AnimatePresence>
                                            {resumeOption === "upload" && (
                                                <motion.div
                                                    className="mt-3 space-y-3"
                                                    initial={{opacity: 0, height: 0}}
                                                    animate={{opacity: 1, height: "auto"}}
                                                    exit={{opacity: 0, height: 0}}
                                                    transition={{duration: 0.3}}
                                                >
                                                    <div
                                                        className={`border-2 border-dashed rounded-xl p-6 transition-all duration-300 relative overflow-hidden ${
                                                            resumeFile
                                                                ? "border-green-500 bg-green-50"
                                                                : "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                                                        }`}
                                                        onDragOver={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                        }}
                                                        onDrop={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                                                const file = e.dataTransfer.files[0]
                                                                if (
                                                                    file.type === "application/pdf" ||
                                                                    file.type === "application/msword" ||
                                                                    file.type ===
                                                                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                                ) {
                                                                    setResumeFile(file)
                                                                } else {
                                                                    setNotification({
                                                                        isVisible: true,
                                                                        type: "error",
                                                                        title: "Invalid File",
                                                                        message: "Please upload a PDF or Word document",
                                                                    })
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <div
                                                            className="flex flex-col items-center justify-center space-y-3 text-center">
                                                            {resumeFile ? (
                                                                <>
                                                                    <div className="p-3 bg-green-100 rounded-full">
                                                                        <CheckCircle
                                                                            className="h-6 w-6 text-green-600"/>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium">{resumeFile.name}</p>
                                                                        <p className="text-xs text-gray-500">
                                                                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                                                                        </p>
                                                                    </div>

                                                                    {uploadProgress < 100 ? (
                                                                        <div className="w-full space-y-2">
                                                                            <Progress value={uploadProgress}
                                                                                      className="h-2"/>
                                                                            <p className="text-xs text-primary/70">Uploading: {uploadProgress}%</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            className="flex items-center gap-1 text-green-600 text-sm">
                                                                            <CheckCircle className="h-4 w-4"/>
                                                                            <span>Upload complete</span>
                                                                        </div>
                                                                    )}

                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setResumeFile(null)}
                                                                        className="mt-2 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="p-3 bg-primary/10 rounded-full">
                                                                        <Upload className="h-6 w-6 text-primary"/>
                                                                    </div>
                                                                    <div className="flex flex-col space-y-1">
                                                                        <p className="font-medium">Drop your resume here
                                                                            or click to browse</p>
                                                                        <p className="text-xs text-muted-foreground">Supports
                                                                            PDF, DOC, DOCX (Max 5MB)</p>
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx"
                                                                        onChange={(e) => {
                                                                            const file = e.target.files?.[0]
                                                                            if (file) {
                                                                                if (file.size > 5 * 1024 * 1024) {
                                                                                    setNotification({
                                                                                        isVisible: true,
                                                                                        type: "error",
                                                                                        title: "File Too Large",
                                                                                        message: "File size should be less than 5MB",
                                                                                    })
                                                                                    return
                                                                                }
                                                                                setResumeFile(file)
                                                                            }
                                                                        }}
                                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                                        onClick={handleApplyWithResume}
                                    >
                                        Submit Application
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="outline"
                            className="w-full rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md group"
                        >
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{x: 5}}
                                transition={{type: "spring", stiffness: 400, damping: 10}}
                            >
                                <BookmarkPlus
                                    className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"/>
                                <span>Save Job</span>
                            </motion.div>
                        </Button>
                    </CardFooter>

                    {/* Decorative elements */}
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-xl"/>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-primary/10 rounded-full blur-lg"/>
                </Card>
            </motion.div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="rounded-2xl border-primary/10 shadow-2xl max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary"/>
                            Confirm Application
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to submit your application for this position? Once submitted, you
                            cannot edit your
                            application.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all duration-300"
                            onClick={handleConfirmedSubmit}
                        >
                            Submit Application
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
