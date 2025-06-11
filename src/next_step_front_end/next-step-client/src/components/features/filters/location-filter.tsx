"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { setFilter } from "@/store/slices/jobs-slice"
import { useEffect } from "react"
import { fetchCities } from "@/store/slices/locations-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Globe, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { DEFAULT_CITY, DEFAULT_COUNTRY } from "@/constants"

export default function LocationFilter() {
  const dispatch = useDispatch<AppDispatch>()

  const cities = useSelector((state: RootState) => state.locations.cities || [])
  const countries = useSelector((state: RootState) => state.locations.countries || [])
  const filter = useSelector((state: RootState) => state.jobs.filter || [])
  const citiesStatus = useSelector((state: RootState) => state.locations.status)

  // Handle country selection
  const handleCountryChange = (value: string) => {
    const countryValue = value === "all" ? DEFAULT_COUNTRY : value
    dispatch(setFilter({ ...filter, country: countryValue, city: DEFAULT_COUNTRY }))
  }

  // Handle city selection
  const handleCityChange = (value: string) => {
    const cityValue = value === "all" ? DEFAULT_CITY : value
    dispatch(setFilter({ ...filter, city: cityValue }))
  }

  // Reset all location-related filters
  const handleClearAll = () => {
    dispatch(setFilter({ ...filter, country: DEFAULT_COUNTRY, city: DEFAULT_CITY }))
  }

  // UI state helpers
  const hasLocationFilters = !!filter.country || !!filter.city
  const isCitiesLoading = citiesStatus === "loading"
  const hasCities = cities.length > 0

  useEffect(() => {
    if (filter.country && filter.country !== "all") {
      dispatch(fetchCities(filter.country))
    }
  }, [dispatch, filter.country])

  return (
    <Card className="shadow-md border-border/30 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">Location</CardTitle>
          {hasLocationFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full"
            >
              Clear all
            </Button>
          )}
        </div>
        <Separator className="bg-border/30" />
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="country" className="font-medium text-sm">
              Country <span className="text-destructive">*</span>
            </Label>
          </div>
          <Select value={filter.country || "all"} onValueChange={handleCountryChange}>
            <SelectTrigger
              id="country"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country} className="flex items-center gap-2">
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="city" className="font-medium text-sm">
              City
            </Label>
            {isCitiesLoading && (
              <div className="flex items-center gap-1 ml-auto">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Loading...</span>
              </div>
            )}
          </div>
          <Select
            value={filter.city || "all"}
            onValueChange={handleCityChange}
            disabled={!filter.country || filter.country === "all"}
          >
            <SelectTrigger
              id="city"
              className={`bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg ${
                !filter.country || filter.country === "all" ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                {isCitiesLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading cities...</span>
                  </>
                ) : (
                  <SelectValue
                    placeholder={filter.country && filter.country !== "all" ? "Select city" : "Select country first"}
                  />
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
              {isCitiesLoading ? (
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading cities...</span>
                  </div>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded" />
                  ))}
                </div>
              ) : (
                <>
                  <SelectItem value="all">All cities</SelectItem>
                  {hasCities
                    ? cities.map((city) => (
                        <SelectItem key={city} value={city} className="flex items-center gap-2">
                          {city}
                        </SelectItem>
                      ))
                    : filter.country &&
                      filter.country !== "all" && (
                        <div className="p-4 text-center text-muted-foreground">
                          <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm">No cities available for {filter.country}</p>
                        </div>
                      )}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {(!filter.country || filter.country === "all") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-4 text-center p-4 bg-muted/30 rounded-lg border border-dashed border-border/50"
          >
            <div className="relative">
              <Globe className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Select a country to see available cities</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
