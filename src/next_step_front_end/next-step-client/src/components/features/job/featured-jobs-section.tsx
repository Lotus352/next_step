"use client"

import FeaturedJobs from "@/components/features/job/featured-jobs"
import { ArrowRight, Briefcase, Clock, MapPin, Sparkles, TrendingUp, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"

export default function FeaturedJobsSection() {
  const [activeTab, setActiveTab] = useState("all")

  const tabItems = [
    {
      id: "all",
      label: "Featured",
      icon: Sparkles,
      count: "120+",
      description: "Top picks for you",
    },
    {
      id: "full-time",
      label: "Full Time",
      icon: Briefcase,
      count: "85+",
      description: "Permanent positions",
    },
    {
      id: "part-time",
      label: "Part Time",
      icon: Clock,
      count: "45+",
      description: "Flexible hours",
    },
    {
      id: "remote",
      label: "Remote",
      icon: MapPin,
      count: "90+",
      description: "Work from anywhere",
    },
  ]

  const stats = [
    { icon: TrendingUp, label: "Success Rate", value: "94%" },
    { icon: Users, label: "Companies", value: "500+" },
    { icon: Star, label: "Rating", value: "4.9" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

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
        <motion.div
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary/6 rounded-full blur-3xl"
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
        className="absolute top-20 left-[10%] w-4 h-4 rounded-full bg-primary/20 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-[15%] w-3 h-3 rounded-full bg-primary/30 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-[20%] w-5 h-5 rounded-full bg-primary/15 hidden lg:block"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <div className="container px-4 md:px-6 relative">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <Briefcase className="h-4 w-4" />
            <span className="text-sm font-semibold">Latest Opportunities</span>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              New
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Featured
            </span>
            <br />
            <span className="text-foreground">Jobs</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover amazing career opportunities from world-class companies. Find your perfect match and take the next
            step in your professional journey.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <div className="mb-12">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            {/* Enhanced Tab Navigation */}
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-transparent p-0 h-auto">
                {tabItems.map((tab, index) => (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  >
                    <TabsTrigger
                      value={tab.id}
                      className={`
                        relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-500
                        min-w-[140px] min-h-[120px] group
                        bg-background/60 backdrop-blur-sm
                        border-border/50 hover:border-primary/30
                        data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary
                        data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                        hover:shadow-md hover:scale-105
                      `}
                    >
                      {/* Icon */}
                      <div
                        className={`
                        flex items-center justify-center w-12 h-12 rounded-xl mb-3 transition-all duration-300
                        ${
                          activeTab === tab.id
                            ? "bg-primary-foreground/20 scale-110"
                            : "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-105"
                        }
                      `}
                      >
                        <tab.icon
                          className={`
                          h-6 w-6 transition-all duration-300
                          ${
                            activeTab === tab.id
                              ? "text-primary-foreground"
                              : "text-primary group-hover:text-primary/80"
                          }
                        `}
                        />
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <div
                          className={`
                          text-sm font-bold mb-1 transition-colors duration-300
                          ${
                            activeTab === tab.id
                              ? "text-primary-foreground"
                              : "text-foreground group-hover:text-primary"
                          }
                        `}
                        >
                          {tab.label}
                        </div>
                        <div
                          className={`
                          text-xs mb-2 transition-colors duration-300
                          ${activeTab === tab.id ? "text-primary-foreground/80" : "text-muted-foreground"}
                        `}
                        >
                          {tab.description}
                        </div>
                        <Badge
                          variant={activeTab === tab.id ? "secondary" : "outline"}
                          className={`
                            text-xs transition-all duration-300
                            ${
                              activeTab === tab.id
                                ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                                : "border-primary/30 text-primary"
                            }
                          `}
                        >
                          {tab.count}
                        </Badge>
                      </div>

                      {/* Active indicator */}
                      {activeTab === tab.id && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"
                          layoutId="activeTab"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <TabsContent value="all" className="mt-0">
                <FeaturedJobs filter={""} />
              </TabsContent>
              <TabsContent value="part-time" className="mt-0">
                <FeaturedJobs filter={"PART_TIME"} />
              </TabsContent>
              <TabsContent value="full-time" className="mt-0">
                <FeaturedJobs filter={"FULL_TIME"} />
              </TabsContent>
              <TabsContent value="remote" className="mt-0">
                <FeaturedJobs filter={"REMOTE"} />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative inline-block">
            {/* Decorative background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-full blur-xl opacity-60 animate-pulse" />

            <Button
              size="lg"
              className="group relative px-10 py-6 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border-2 border-primary/20 hover:border-primary/40"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 100%",
                }}
              />

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />

              {/* Button content */}
              <span className="relative z-10 flex items-center gap-3">
                <Briefcase className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span className="transition-all duration-300 group-hover:tracking-wide">View All Jobs</span>
                <div className="relative">
                  <ArrowRight className="h-6 w-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
                  <ArrowRight className="absolute inset-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 translate-x-1" />
                </div>
              </span>

              {/* Floating particles effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary-foreground/60 rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      y: [-5, -15, -5],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </Button>

            {/* Additional decorative elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary/40 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          {/* Supporting text */}
          <motion.p
            className="mt-6 text-sm text-muted-foreground font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Discover thousands of opportunities from top companies worldwide
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
