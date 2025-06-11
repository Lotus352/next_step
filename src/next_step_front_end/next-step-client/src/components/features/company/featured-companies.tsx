"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { useEffect } from "react"
import { fetchFeatured } from "@/store/slices/companies-slice"
import Loading from "@/components/loading"
import AlertDestructive from "@/components/destructive-alert"
import { FEATURED_COMPANIES_LIMIT } from "@/constants"
import { Building2, Users, Star } from "lucide-react"
import { motion } from "framer-motion"

export default function FeaturedCompanies() {
  // Redux state
  const dispatch = useDispatch<AppDispatch>()
  const { featured, status } = useSelector((state: RootState) => state.companies)

  useEffect(() => {
    dispatch(fetchFeatured(FEATURED_COMPANIES_LIMIT))
  }, [dispatch])

  if (status === "loading") {
    return <Loading />
  }
  if (status === "failed") return <AlertDestructive message="Failed to fetch featured companies" />

  if (featured.length === 0) {
    return (
      <div className="text-center py-20 animate-in fade-in-50 duration-500">
        <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6 animate-in zoom-in-50 duration-700 delay-200">
          <Building2 className="h-8 w-8 text-muted-foreground animate-pulse" />
        </div>
        <h3 className="text-2xl font-semibold mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
          No companies found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 duration-500 delay-500">
          We couldn't find any companies at the moment. Please check back later for new opportunities.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {featured.map((company, index) => (
        <motion.div
          key={company.companyId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Company Avatar */}
                <div className="relative">
                  <Avatar className="h-16 w-16 border-none rounded-xl p-0.5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <AvatarImage
                      src={company.logoUrl || ""}
                      alt={`${company.name} logo`}
                      className="object-cover transition-all duration-300 group-hover:brightness-110"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg rounded-xl transition-all duration-300 group-hover:bg-primary/90">
                      {company.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Verified Badge */}
                  <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Star className="h-3 w-3 text-white fill-white" />
                  </div>
                </div>

                {/* Company Info */}
                <div className="space-y-3 text-center w-full">
                  <h3 className="font-bold text-lg truncate group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1">
                    {company.name}
                  </h3>

                  {/* Job Count */}
                  <div className="flex items-center justify-center gap-2 text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                    <Users className="h-4 w-4 transition-all duration-300 group-hover:text-primary" />
                    <span className="text-sm font-medium">{company.countJobOpening} open positions</span>
                  </div>

                  {/* Company Description */}
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed transition-all duration-300 group-hover:text-foreground">
                    {company.description}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/50 px-6 py-4 border-t transition-all duration-300 group-hover:bg-muted/70">
              <Button
                variant="ghost"
                className="w-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md transform active:scale-95 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <span className="transition-all duration-300 group-hover:translate-x-1">View Jobs</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
