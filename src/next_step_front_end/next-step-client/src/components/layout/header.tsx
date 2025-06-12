"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Menu,
  X,
  Search,
  Building2,
  BookOpen,
  DollarSign,
  LogIn,
  PlusCircle,
  ChevronDown,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Bell,
  Building,
  Users,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { logout } from "@/store/slices/auth-slice"

export default function Header() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const isAuthenticated = useSelector((state: RootState) => state.auth.status === "authenticated")

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          {/* Enhanced Logo with Floating Animation */}
          <Link to="/" className="flex items-center gap-3 relative group">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Logo Icon with Enhanced Animation */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Briefcase className="h-5 w-5 text-primary-foreground" />
                  </motion.div>
                  <motion.div
                    className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-foreground/60 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>

                {/* Floating particles around logo */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/40 rounded-full"
                    style={{
                      left: `${-10 + i * 15}px`,
                      top: `${-5 + (i % 2) * 10}px`,
                    }}
                    animate={{
                      y: [-2, -8, -2],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.7,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Logo Text with Enhanced Animation */}
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center gap-1">
                  <motion.span
                    className="font-bold text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    NEXT
                  </motion.span>
                  <motion.span
                    className="font-bold text-lg text-foreground"
                    whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
                    transition={{ duration: 0.2 }}
                  >
                    .STEP
                  </motion.span>
                </div>
                <motion.div
                  className="text-xs text-muted-foreground font-medium -mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Career Platform
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Enhanced Hover Effect */}
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/60 rounded-full"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          <motion.nav
            className="hidden md:flex gap-8 pl-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { to: "/jobs", icon: Search, label: "Find Jobs" },
              { to: "/companies", icon: Building2, label: "Companies" },
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={item.to}
                  className="text-sm font-semibold hover:text-primary flex items-center gap-2 relative group py-2 transition-all duration-300"
                >
                  <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
                    <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  </motion.div>
                  <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                    {item.label}
                  </motion.span>
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}

            {/* Enhanced dropdown for Candidates and Employers */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                onClick={toggleUserMenu}
                className="text-sm font-semibold hover:text-primary flex items-center gap-2 relative group py-2 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </motion.div>
                <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                  For Users
                </motion.span>
                <motion.div animate={{ rotate: userMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="h-3 w-3 transition-transform duration-300" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Enhanced dropdown menu with staggered animations */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-background/95 backdrop-blur-md rounded-xl shadow-lg border border-border/50 z-50 overflow-hidden"
                  >
                    <motion.div
                      className="py-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.05,
                          },
                        },
                      }}
                    >
                      {/* Candidates Section */}
                      <motion.div
                        className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border/30"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          For Candidates
                        </div>
                      </motion.div>
                      {[
                        { to: "/candidate/profile", icon: User, label: "My Profile" },
                        { to: "/candidate/resume", icon: FileText, label: "My Resume" },
                        { to: "/candidate/applications", icon: Briefcase, label: "My Applications" },
                        { to: "/candidate/courses", icon: GraduationCap, label: "Training Courses" },
                        { to: "/candidate/notifications", icon: Bell, label: "Job Alerts" },
                      ].map((item) => (
                        <motion.div
                          key={item.to}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-all duration-200 group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <motion.div
                              className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-200"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <item.icon className="h-4 w-4 text-primary" />
                            </motion.div>
                            <motion.span
                              className="font-medium group-hover:text-primary transition-colors duration-200"
                              whileHover={{ x: 3 }}
                            >
                              {item.label}
                            </motion.span>
                          </Link>
                        </motion.div>
                      ))}

                      {/* Employers Section */}
                      <motion.div
                        className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-t border-border/30 mt-1"
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Building className="h-3 w-3" />
                          For Employers
                        </div>
                      </motion.div>
                      {[
                        { to: "/employer/post-job", icon: PlusCircle, label: "Post a Job" },
                        { to: "/employer/manage-jobs", icon: Building, label: "Manage Jobs" },
                        { to: "/employer/candidates", icon: Users, label: "Browse Candidates" },
                        { to: "/employer/messages", icon: MessageSquare, label: "Messages" },
                      ].map((item) => (
                        <motion.div
                          key={item.to}
                          variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-all duration-200 group"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <motion.div
                              className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-200"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <item.icon className="h-4 w-4 text-primary" />
                            </motion.div>
                            <motion.span
                              className="font-medium group-hover:text-primary transition-colors duration-200"
                              whileHover={{ x: 3 }}
                            >
                              {item.label}
                            </motion.span>
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.nav>
        </div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="hidden md:flex gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 font-semibold border-border/50"
                  onClick={() => dispatch(logout())}
                >
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 font-semibold border-border/50"
                  onClick={() => navigate("/sign-in")}
                >
                  <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                    <LogIn className="h-4 w-4" />
                  </motion.div>
                  Sign In
                </Button>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
            >
              <Button
                size="sm"
                className="gap-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 font-semibold bg-gradient-to-r from-primary to-primary/90 relative overflow-hidden group"
              >
                <motion.div whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.3 }}>
                  <PlusCircle className="h-4 w-4" />
                </motion.div>
                <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
                  Post a Job
                </motion.span>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300"
              onClick={toggleMobileMenu}
            >
              <motion.div animate={{ rotate: mobileMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t bg-background/95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-6 space-y-6">
              <nav className="flex flex-col gap-2">
                {[
                  { to: "/jobs", icon: Search, label: "Find Jobs" },
                  { to: "/companies", icon: Building2, label: "Companies" },
                  { to: "/career-advice", icon: BookOpen, label: "Career Advice" },
                  { to: "/salary-guide", icon: DollarSign, label: "Salary Guide" },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-200">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold group-hover:text-primary transition-colors duration-200">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Mobile Candidate Section */}
              <div className="border-t pt-4">
                <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  For Candidates
                </div>
                <div className="space-y-1">
                  {[
                    { to: "/candidate/profile", icon: User, label: "My Profile" },
                    { to: "/candidate/resume", icon: FileText, label: "My Resume" },
                    { to: "/candidate/notifications", icon: Bell, label: "Job Alerts" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-200">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium group-hover:text-primary transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Employer Section */}
              <div className="border-t pt-4">
                <div className="p-3 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  For Employers
                </div>
                <div className="space-y-1">
                  {[
                    { to: "/employer/post-job", icon: PlusCircle, label: "Post a Job" },
                    { to: "/employer/manage-jobs", icon: Building, label: "Manage Jobs" },
                    { to: "/employer/candidates", icon: Users, label: "Browse Candidates" },
                    { to: "/employer/messages", icon: MessageSquare, label: "Messages" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-all duration-200 group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-200">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium group-hover:text-primary transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 border-t">
                {!isAuthenticated && (
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl font-semibold border-border/50"
                    onClick={() => {
                      navigate("/sign-in")
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Button>
                )}

                <Button
                  className="w-full justify-start gap-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PlusCircle className="h-5 w-5" />
                  Post a Job
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
