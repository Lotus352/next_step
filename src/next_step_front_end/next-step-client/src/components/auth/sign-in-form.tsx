"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, LogIn, User, Lock, Sparkles, ArrowRight, Loader2, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusNotification } from "@/components/notification-state/status-notification"
import type { RootState, AppDispatch } from "@/store/store"
import { login } from "@/store/slices/auth-slice"
import { validateSignIn, type SignInFormData, type ValidationError } from "@/lib/validation"
import type NotificationState from "@/types/notification-state-type.ts"

export default function SignInForm() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { status } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState<ValidationError[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  })

  const isLoading = status === "loading"

  useEffect(() => {
    if (status === "idle") {
      setNotification({
        isVisible: true,
        type: "info",
        title: "Welcome to NEXT .STEP",
        message: "Sign in to access your personalized job recommendations and saved applications.",
      })
    } else if (status === "loading") {
      setNotification({
        isVisible: true,
        type: "loading",
        title: "Signing you in...",
        message: "Please wait while we verify your credentials.",
      })
    } else if (status === "failed") {
      setNotification({
        isVisible: true,
        type: "error",
        title: "Sign In Failed",
        message: "There was an error signing you in. Please try again.",
      })
    } else if (status === "authenticated") {
      setNotification({
        isVisible: true,
        type: "success",
        title: "Welcome back!",
        message: "You have successfully signed in to your account.",
      })

      // Redirect after showing notification
      setTimeout(() => {
        navigate("/")
      }, 1500)
    }
  }, [status, navigate])

  const handleInputChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific errors when user starts typing
    if (errors.some((error) => error.field === field)) {
      setErrors((prev) => prev.filter((error) => error.field !== field))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Show info notification for validation
    if (formData.username || formData.password) {
      setNotification({
        isVisible: true,
        type: "info",
        title: "Validating form...",
        message: "Checking your input for any errors.",
      })
    }

    // Validate form
    const validationErrors = validateSignIn(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)

      // Show warning notification for validation errors
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Please check your input",
        message: `Found ${validationErrors.length} error${validationErrors.length > 1 ? "s" : ""} in the form.`,
      })
      return
    }

    try {
      await dispatch(login(formData)).unwrap()
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred"
      let errorTitle = "Sign In Failed"

      // Handle different types of errors
      if (error.message) {
        if (error.message.includes("Invalid credentials") || error.message.includes("Unauthorized")) {
          errorTitle = "Invalid Credentials"
          errorMessage = "The username or password you entered is incorrect. Please try again."
        } else if (error.message.includes("Account locked") || error.message.includes("locked")) {
          errorTitle = "Account Locked"
          errorMessage = "Your account has been temporarily locked. Please contact support or try again later."
        } else if (error.message.includes("Network") || error.message.includes("fetch")) {
          errorTitle = "Connection Error"
          errorMessage = "Unable to connect to our servers. Please check your internet connection and try again."
        } else {
          errorMessage = error.message
        }
      }

      setNotification({
        isVisible: true,
        type: "error",
        title: errorTitle,
        message: errorMessage,
      })
    }
  }

  const getFieldError = (field: string) => {
    return errors.find((error) => error.field === field)?.message
  }

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  return (
      <>
        <StatusNotification
            isVisible={notification.isVisible}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={closeNotification}
            autoCloseTime={notification.type === "loading" ? 0 : 4000} // Don't auto-close loading notifications
            showProgress={notification.type !== "loading"}
        />

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-1/2 -right-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
            />
          </div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md relative"
          >
            <Card className="overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="text-center pb-6 bg-gradient-to-br from-muted/20 via-transparent to-transparent">
                <motion.div
                    className="flex justify-center mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="relative">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                      <LogIn className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-primary/60 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                    />
                  </div>
                </motion.div>

                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription className="text-base">
                  Sign in to your account to continue your career journey
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Username Field */}
                  <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Label htmlFor="username" className="text-sm font-semibold">
                      Username
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className={`pl-10 transition-all duration-300 ${
                              getFieldError("username")
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : "focus:border-primary focus:ring-primary/20"
                          }`}
                          disabled={isLoading}
                      />
                    </div>
                    <AnimatePresence>
                      {getFieldError("username") && (
                          <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2 text-sm text-red-500 font-medium"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            {getFieldError("username")}
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Label htmlFor="password" className="text-sm font-semibold">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                      </div>
                      <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                          autoComplete="current-password"
                          className={`pl-10 pr-10 transition-all duration-300 ${
                              getFieldError("password")
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                  : "focus:border-primary focus:ring-primary/20"
                          }`}
                          disabled={isLoading}
                      />
                      <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                      >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {getFieldError("password") && (
                          <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex items-center gap-2 text-sm text-red-500 font-medium"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            {getFieldError("password")}
                          </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Button
                        type="submit"
                        className="w-full gap-2 rounded-xl font-semibold py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                        disabled={isLoading}
                    >
                      {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Signing In...
                          </>
                      ) : (
                          <>
                            <LogIn className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            Sign In
                            <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-2 group-hover:ml-0" />
                          </>
                      )}

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-0">
                <Separator />

                <motion.div
                    className="text-center space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        to="/sign-up"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300 relative group"
                    >
                      Sign up here
                      <motion.div
                          className="absolute -bottom-0.5 left-0 h-0.5 bg-primary rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </div>

                  <Link
                      to="/forgot-password"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <Sparkles className="h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />
                    Forgot your password?
                  </Link>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </>
  )
}
