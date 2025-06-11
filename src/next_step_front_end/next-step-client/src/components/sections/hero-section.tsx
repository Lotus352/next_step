"use client"

import { ArrowRight, CheckCircle, Search, MapPin, Building2, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { useEffect, useState } from "react"
import { fetchCities, fetchCountries } from "@/store/slices/locations-slice"
import { fetchIndustries } from "@/store/slices/industries-slice"
import { motion } from "framer-motion"

export default function HeroSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { countries, cities } = useSelector((state: RootState) => state.locations)
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")

  useEffect(() => {
    dispatch(fetchCountries())
    dispatch(fetchIndustries({ page: 0, size: 9999 }))
  }, [dispatch])

  useEffect(() => {
    if (selectedCountry) {
      dispatch(fetchCities(selectedCountry))
    }
  }, [selectedCountry, dispatch])

  useEffect(() => {
    if (cities.length > 0) {
      setSelectedCity(cities[0])
    }
  }, [cities])

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
  }

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

  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-muted/10" />

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
        className="absolute top-40 right-[15%] w-3 h-3 rounded-full bg-primary/30 hidden lg:block"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute bottom-40 left-[20%] w-5 h-5 rounded-full bg-primary/15 hidden lg:block"
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

      <div className="container px-4 md:px-6 relative">
        <div className="grid gap-10 lg:grid-cols-[1fr_450px] lg:gap-16 xl:grid-cols-[1fr_550px]">
          {/* Left Content */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo Badge */}
            <motion.div
              className="inline-flex items-center gap-3 self-start"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
              </div>
              <span className="text-sm font-semibold text-primary">Next Step Career Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Find Your{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent px-2">
                    Dream Job
                  </span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 rounded-full -z-10"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </span>{" "}
                Today
              </h1>

              <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                Take your next step toward success. Discover thousands of job opportunities with all the information you
                need.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col gap-3 sm:flex-row" variants={itemVariants}>
              <Button
                size="lg"
                className="gap-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 font-semibold text-base"
              >
                Browse Jobs
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full hover:bg-primary/5 hover:text-primary transition-all duration-300 border-border/50 font-semibold text-base"
              >
                For Employers
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-2"
              variants={itemVariants}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: CheckCircle, label: "10,000+ Jobs" },
                { icon: CheckCircle, label: "500+ Companies" },
                { icon: CheckCircle, label: "Free to Join" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/30 shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <stat.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search Card */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card className="w-full border-border/30 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm bg-background/80">
              <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent pb-4 border-b border-border/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 shadow-sm">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Find Your Perfect Job
                    </CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                      Search jobs based on your preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <Input
                    type="search"
                    placeholder="Job title, keywords, or company"
                    className="pl-10 py-6 rounded-xl border-border/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {/* Location Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Location</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                        <Select onValueChange={handleCountryChange}>
                          <SelectTrigger className="rounded-xl border-border/30 py-5 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium">
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/30">
                            {countries.map((country, index) => (
                              <SelectItem key={index} value={country} className="font-medium">
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                        <Select
                          value={selectedCity}
                          onValueChange={setSelectedCity}
                          disabled={!selectedCountry || cities.length === 0}
                        >
                          <SelectTrigger className="rounded-xl border-border/30 py-5 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/30">
                            {cities.map((city, index) => (
                              <SelectItem key={index} value={city} className="font-medium">
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Job Details</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                        <Select>
                          <SelectTrigger className="rounded-xl border-border/30 py-5 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium">
                            <SelectValue placeholder="Job Type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/30">
                            <SelectItem value="full-time" className="font-medium">
                              Full-time
                            </SelectItem>
                            <SelectItem value="part-time" className="font-medium">
                              Part-time
                            </SelectItem>
                            <SelectItem value="contract" className="font-medium">
                              Contract
                            </SelectItem>
                            <SelectItem value="internship" className="font-medium">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                        <Select>
                          <SelectTrigger className="rounded-xl border-border/30 py-5 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-medium">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/30">
                            <SelectItem value="technology" className="font-medium">
                              Technology
                            </SelectItem>
                            <SelectItem value="healthcare" className="font-medium">
                              Healthcare
                            </SelectItem>
                            <SelectItem value="education" className="font-medium">
                              Education
                            </SelectItem>
                            <SelectItem value="finance" className="font-medium">
                              Finance
                            </SelectItem>
                            <SelectItem value="marketing" className="font-medium">
                              Marketing
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gradient-to-br from-muted/30 to-transparent pt-4 pb-6 px-6">
                <Button className="w-full rounded-xl py-6 shadow-md hover:shadow-lg transition-all duration-300 text-base font-semibold bg-gradient-to-r from-primary to-primary/90">
                  <Search className="h-5 w-5 mr-2" />
                  Search Jobs
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
