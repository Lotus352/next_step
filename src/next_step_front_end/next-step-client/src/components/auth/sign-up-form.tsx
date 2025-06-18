"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Lock,
  Mail,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield,
  Phone,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusNotification } from "@/components/notifications/status-notification";
import type { RootState, AppDispatch } from "@/store/store";
import { register } from "@/store/slices/auth-slice";
import {
  validateSignUp,
  type SignUpFormData,
  type ValidationError,
} from "@/lib/validation";
import NotificationState from "@/types/notification-state-type.ts";

export default function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  });

  const isLoading = status === "loading";

  // Handle successful registration
  useEffect(() => {
    if (status === "idle") {
      setNotification({
        isVisible: true,
        type: "info",
        title: "Join NEXT .STEP Today",
        message:
          "Create your account to access thousands of job opportunities and career resources.",
      });
    } else if (status === "loading") {
      setNotification({
        isVisible: true,
        type: "loading",
        title: "Creating your account...",
        message:
          "Please wait while we set up your profile and verify your information.",
      });
    } else if (status === "failed") {
      setNotification({
        isVisible: true,
        type: "error",
        title: "Registration Failed",
        message: error ? error : "Unable to create your account. Please check your information and try again.",
      });
    } else if (status === "authenticated") {
      setNotification({
        isVisible: true,
        type: "success",
        title: "Account Created Successfully!",
        message:
          "Welcome to NEXT .STEP! Your account has been created and you're now signed in.",
      });

      // Redirect after showing notification
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [status, navigate]);

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific errors when user starts typing
    if (errors.some((error) => error.field === field)) {
      setErrors((prev) => prev.filter((error) => error.field !== field));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show info notification for validation
    setNotification({
      isVisible: true,
      type: "info",
      title: "Validating registration data...",
      message:
        "Checking all fields for completeness and security requirements.",
    });

    // Validate form
    const validationErrors = validateSignUp(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);

      // Show warning notification for validation errors
      setNotification({
        isVisible: true,
        type: "warning",
        title: "Please complete all required fields",
        message: `Found ${validationErrors.length} error${validationErrors.length > 1 ? "s" : ""} that need to be fixed before creating your account.`,
      });
      return;
    }

    try {
      await dispatch(
        register({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      ).unwrap();
    } catch (error: any) {
      console.error("Registration error:", error);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find((error) => error.field === field)?.message;
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <>
      <StatusNotification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
        autoCloseTime={notification.type === "loading" ? 0 : 5000}
        showProgress={notification.type !== "loading"}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
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
            className="absolute bottom-0 -left-40 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
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
          className="w-full max-w-lg relative"
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
                    <UserPlus className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
              </motion.div>

              <CardTitle className="text-2xl font-bold">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Join NEXT.STEP and start your career journey today
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Label htmlFor="fullName" className="text-sm font-semibold">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className={`pl-10 transition-all duration-300 ${
                        getFieldError("fullName")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                  <AnimatePresence>
                    {getFieldError("fullName") && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-500 font-medium"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {getFieldError("fullName")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Username Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
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
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      className={`pl-10 transition-all duration-300 ${
                        getFieldError("username")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="username"
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

                {/* Email Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`pl-10 transition-all duration-300 ${
                        getFieldError("email")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <AnimatePresence>
                    {getFieldError("email") && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-500 font-medium"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {getFieldError("email")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Phone Number Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-semibold"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      className={`pl-10 transition-all duration-300 ${
                        getFieldError("phoneNumber")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>
                  <AnimatePresence>
                    {getFieldError("phoneNumber") && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-500 font-medium"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {getFieldError("phoneNumber")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className={`pl-10 pr-10 transition-all duration-300 ${
                        getFieldError("password")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength >= 4 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : passwordStrength >= 2 ? (
                          <Info className="h-4 w-4 text-yellow-500" />
                        ) : (
                          <Shield className="h-4 w-4 text-red-500" />
                        )}
                        <p
                          className={`text-xs font-medium ${
                            passwordStrength <= 2
                              ? "text-red-500"
                              : passwordStrength <= 3
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {passwordStrength <= 2
                            ? "Weak password - needs improvement"
                            : passwordStrength <= 3
                              ? "Medium password - consider strengthening"
                              : "Strong password - excellent security"}
                        </p>
                      </div>
                    </div>
                  )}

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

                {/* Confirm Password Field */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                >
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className={`pl-10 pr-10 transition-all duration-300 ${
                        getFieldError("confirmPassword")
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : formData.confirmPassword &&
                              formData.password === formData.confirmPassword
                            ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                            : "focus:border-primary focus:ring-primary/20"
                      }`}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {getFieldError("confirmPassword") && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-sm text-red-500 font-medium"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {getFieldError("confirmPassword")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full gap-2 rounded-xl font-semibold py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        Create Account
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
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/sign-in"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300 relative group"
                  >
                    Sign in here
                    <motion.div
                      className="absolute -bottom-0.5 left-0 h-0.5 bg-primary rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </div>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
