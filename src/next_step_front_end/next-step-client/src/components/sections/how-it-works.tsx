"use client"

import { Search, Users, Briefcase, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function HowItWorks() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Search Jobs",
      desc: "Browse thousands of job listings tailored to your skills and preferences.",
      details: [
        "Filter by location, salary, and job type",
        "Save favorite listings",
        "Get personalized recommendations",
      ],
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Apply Online",
      desc: "Create your profile and apply easily with just a few clicks.",
      details: ["One-click applications", "Track application status", "Receive interview invitations"],
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: "Get Hired",
      desc: "Land your dream job and start your new career journey.",
      details: ["Receive offer letters", "Negotiate compensation", "Onboarding assistance"],
    },
  ]

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-background to-muted/10" />

      {/* Animated Background Elements */}
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
          className="absolute bottom-0 right-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-32 right-[10%] w-4 h-4 rounded-full bg-primary/20 hidden lg:block"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-60 left-[20%] w-5 h-5 rounded-full bg-primary/15 hidden lg:block"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >

          {/* Main Title */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              How It
            </span>{" "}
            <span className="text-foreground">Works</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Follow these simple steps to find your dream job or the perfect candidate
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid gap-8 md:grid-cols-3 md:gap-10 mt-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={item} transition={{ duration: 0.5 }} className="group relative border rounded-xl">
              {/* Connection Line */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[50%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent hidden md:block" />
              )}

              <div className="flex flex-col items-center space-y-6 rounded-2xl border border-border/30 bg-background/80 backdrop-blur-sm p-8 text-center hover:shadow-lg transition-all duration-300 relative">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300 shadow-sm">
                    {step.icon}
                    <div className="absolute top-3 right-3 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:text-primary/90 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground font-medium">{step.desc}</p>
                </div>

                {/* Details */}
                <div className="space-y-2 w-full">
                  {step.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-left group/item">
                      <div className="p-1 rounded-full bg-primary/10 group-hover/item:bg-primary/20 transition-colors duration-300">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 font-medium">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
