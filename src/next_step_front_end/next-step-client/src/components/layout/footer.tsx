"use client"

import {
  Briefcase,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ]

  const jobSeekerLinks = ["Browse Jobs", "Browse Companies", "Salary Calculator", "Career Advice", "Resume Builder"]

  const employerLinks = ["Post a Job", "Browse Resumes", "Recruiting Solutions", "Pricing Plans", "Employer Resources"]

  const companyLinks = ["About Us", "Contact Us", "Privacy Policy", "Terms of Service", "Help Center"]

  return (
    <footer className="relative border-t bg-gradient-to-br from-muted/20 via-background to-muted/10 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/3 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container px-4 py-16 md:px-6 md:py-20 lg:py-24 relative">
        <motion.div
          className="grid gap-12 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info with Enhanced Logo */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            {/* Enhanced Logo - Same as Header */}
            <div className="flex items-center gap-3 mb-6 group">
              {/* Logo Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Briefcase className="h-5 w-5 text-primary-foreground" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary-foreground/60 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Logo Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    NEXT
                  </span>
                  <span className="font-bold text-lg text-foreground">.STEP</span>
                </div>
                <div className="text-xs text-muted-foreground font-medium -mt-1">Career Platform</div>
              </div>
            </div>

            <p className="text-muted-foreground max-w-sm leading-relaxed mb-6 font-medium">
              Connecting talented individuals with great companies. Find your dream job or the perfect candidate with
              Next Step.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span>contact@nextstep.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="p-3 rounded-xl bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* For Job Seekers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
              For Job Seekers
            </h3>
            <ul className="space-y-4">
              {jobSeekerLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium group flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* For Employers */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
              For Employers
            </h3>
            <ul className="space-y-4">
              {employerLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium group flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full" />
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium group flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors duration-300" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="mt-16 pt-12 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="text-center max-w-md mx-auto">
            <h4 className="text-lg font-bold mb-3">Stay Updated</h4>
            <p className="text-muted-foreground text-sm mb-6">
              Get the latest job opportunities and career insights delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              />
              <Button className="px-6 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary/90">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-2">
            © 2025 Next Step. All rights reserved. Made with
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            for job seekers and employers.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
