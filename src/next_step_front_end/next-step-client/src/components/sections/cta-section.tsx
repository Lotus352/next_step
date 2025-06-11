"use client"

import { Button } from "@/components/ui/button"
import { Users, Building2, ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function CTASection() {
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

  const ctaItems = [
    {
      title: "For Job Seekers",
      icon: <Users className="h-8 w-8 text-primary" />,
      desc: "Create a free account, build your profile, and apply for jobs easily. Get matched with employers looking for your skills.",
      color: "from-primary/20 to-primary/5",
      buttonText: "Find Jobs",
      benefits: ["Free profile creation", "Easy job applications", "Personalized job matches"],
    },
    {
      title: "For Employers",
      icon: <Building2 className="h-8 w-8 text-primary" />,
      desc: "Post jobs, review applications, and connect with qualified candidates. Find the perfect talent for your company.",
      color: "from-primary/20 to-primary/5",
      buttonText: "Post a Job",
      benefits: ["Targeted job listings", "Candidate screening tools", "Applicant tracking system"],
    },
  ]

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 6,
          }}
        />
      </div>

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
              Ready to Take
            </span>{" "}
            <span className="text-foreground">the Next.Step?</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Whether you're looking for your dream job or searching for the perfect candidate, we've got you covered.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 lg:grid-cols-2 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {ctaItems.map((cta, i) => (
            <motion.div
              key={i}
              variants={item}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden border rounded-xl"
            >
              {/* Card Background with Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl transform transition-transform duration-500 group-hover:scale-105 -z-10" />

              <div className="flex flex-col h-full border border-border/30 p-8 rounded-2xl bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start gap-5 mb-6">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-sm opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md">
                      {cta.icon}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/60 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
                      {cta.title}
                    </h3>
                    <div className="h-1 w-20 bg-gradient-to-r from-primary/50 to-transparent rounded-full mt-2" />
                  </div>
                </div>

                <p className="text-muted-foreground text-lg mb-6 flex-grow font-medium leading-relaxed">{cta.desc}</p>

                {/* Benefits List */}
                <div className="space-y-3 mb-8">
                  {cta.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 group/item">
                      <div className="p-1 rounded-full bg-primary/5 group-hover/item:bg-primary/10 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="mt-auto self-start gap-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 group-hover:translate-x-1 bg-gradient-to-r from-primary to-primary/90 font-semibold"
                >
                  {cta.buttonText}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
