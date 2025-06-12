"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import ErrorPage from "@/pages/error-page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CompanyLocation() {
  // Redux state
  const { selected } = useSelector((state: RootState) => state.jobs)

  const company = selected?.postedBy.company
  const location = company?.location

  // Function to generate Google Maps URL
  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/search/${encodeURIComponent(
      `${company?.name} ${location?.city} ${location?.countryName}`,
    )}`
  }

  // Function to open directions in Google Maps
  const openDirections = () => {
    window.open(getGoogleMapsUrl(), "_blank")
  }

  return !selected ? <ErrorPage message="No job selected" /> : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="animate-in fade-in-50 slide-in-from-bottom-8"
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Company Location</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <motion.div
            className="relative overflow-hidden"
            whileHover={{ scale: 1.01, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="aspect-video bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center relative">
              {/* Static map image */}
              <img
                src="/placeholder.svg?height=300&width=600"
                alt="Map location"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />

              {/* Grid overlay to simulate map grid */}
              <div className="absolute inset-0">
                <div className="h-full w-full grid grid-cols-8 grid-rows-4">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="border border-gray-400/20"></div>
                  ))}
                </div>

                {/* Road-like lines */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-400/40"></div>
                <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-gray-400/30"></div>
                <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-gray-400/30"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-400/40"></div>
                <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-gray-400/30"></div>
                <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-gray-400/30"></div>
              </div>

              {/* Location pin */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-3 shadow-lg border-2 border-white/50">
                  <MapPin className="h-10 w-10 text-primary drop-shadow-sm" />
                </div>
                <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg border border-white/20 text-center max-w-[85%]">
                  <h3 className="font-semibold text-primary">{company?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {location?.city}, {location?.countryName}
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 gap-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 hover:bg-white text-primary border border-primary/20 hover:border-primary/40 backdrop-blur-sm"
                onClick={openDirections}
              >
                <Navigation className="h-4 w-4" />
                Get Directions
              </Button>
            </div>
          </motion.div>

          <div className="p-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-16 w-16 border-none rounded-2xl p-1 shadow-lg bg-background transition-all duration-300 hover:scale-110 hover:rotate-3">
                <AvatarImage
                  src={company?.logoUrl || "/placeholder.svg?height=64&width=64"}
                  alt={`${company?.name} logo`}
                  className="object-cover transition-all duration-300 hover:brightness-110 p-0.5"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary font-bold text-2xl rounded-2xl transition-all duration-300 hover:bg-primary/90">
                  {company?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="font-semibold text-xl mb-2">{company?.name}</h4>

                <div className="mt-3 space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-3">
    
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {location?.city}, {location?.countryName}
                      </p>
                      {location?.state && <p className="text-sm">{location?.state}</p>}
                      {location?.street && (
                        <p className="text-sm">
                          {location?.street}
                          {location?.houseNumber && `, ${location?.houseNumber}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full gap-2 rounded-xl hover:bg-primary/5 hover:text-primary transition-all duration-300 border-primary/20 hover:border-primary/40 shadow-sm hover:shadow-md mt-6"
              onClick={openDirections}
            >
              <ExternalLink className="h-4 w-4" />
              View on Google Maps
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
