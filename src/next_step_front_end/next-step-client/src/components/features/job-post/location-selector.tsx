"use client"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Globe, Building2, Home, Hash, Loader2, X, ChevronLeft, ArrowRight } from "lucide-react"
import { fetchCountries, fetchCities } from "@/store/slices/locations-slice"
import { updateJobRequest, initializeJobRequest } from "@/store/slices/jobs-slice"
import type { AppDispatch, RootState } from "@/store/store"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { JobRequest } from "@/types/job-type"

interface LocationSelectorProps {
  onClearAll: () => void
  onNext: () => void
  onBack: () => void
}

export function LocationSelector({ onClearAll, onNext, onBack }: LocationSelectorProps) {
  const dispatch = useDispatch<AppDispatch>()

  // Redux State
  const countries = useSelector((state: RootState) => state.locations.countries || [])
  const cities = useSelector((state: RootState) => state.locations.cities || [])
  const statuses = useSelector((state: RootState) => state.locations.statuses)
  const request = useSelector((state: RootState) => state.jobs.request)

  // Local state for form fields
  const [formData, setFormData] = useState({
    locationId: 0,
    countryName: "",
    state: null as string | null,
    city: "",
    street: null as string | null,
    houseNumber: null as string | null,
  })

  // Initialize request if it doesn't exist
  useEffect(() => {
    if (!request) {
      dispatch(initializeJobRequest())
    } else if (request.location) {
      // Populate form with existing data if available
      setFormData({
        locationId: request.location.locationId || 0,
        countryName: request.location.countryName || "",
        state: request.location.state,
        city: request.location.city || "",
        street: request.location.street,
        houseNumber: request.location.houseNumber,
      })
    }
  }, [dispatch, request])

  const isCitiesLoading = statuses.fetching === "loading"
  const hasCities = cities.length > 0
  const hasLocationFilters =
    !!formData.countryName || !!formData.city || !!formData.state || !!formData.street || !!formData.houseNumber

  const handleFieldChange = (field: string, value: string | null) => {
    // Reset city when country changes
    if (field === "countryName" && value !== formData.countryName) {
      setFormData((prev) => ({
        ...prev,
        [field]: value || "",
        city: "", // Reset city when country changes
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value || "",
      }))
    }
  }

  const handleClearAll = () => {
    setFormData({
      locationId: 0,
      countryName: "",
      state: null,
      city: "",
      street: null,
      houseNumber: null,
    })
    onClearAll()
  }

  const handleNext = () => {
    // Only save to Redux when clicking Next
    const updatedJob = {
      ...request,
      location: formData,
    } as JobRequest

    dispatch(updateJobRequest(updatedJob))
    onNext()
  }

  // Check if form is complete for local validation
  const isFormComplete = !!formData.countryName

  useEffect(() => {
    dispatch(fetchCountries())
  }, [dispatch])

  useEffect(() => {
    if (formData.countryName) {
      dispatch(fetchCities({ country: formData.countryName }))
    }
  }, [formData.countryName, dispatch])

  return (
    <Card className="shadow-md border-border/30 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            Location Details
          </CardTitle>
          {hasLocationFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-primary text-xs hover:bg-primary/10 transition-colors rounded-full flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Clear all
            </Button>
          )}
        </div>
        <CardDescription className="mt-1.5">Specify where this job is located and any address details</CardDescription>
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
          <Select
            value={formData.countryName || ""}
            onValueChange={(value) => handleFieldChange("countryName", value || null)}
          >
            <SelectTrigger
              id="country"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            >
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] rounded-lg border-border/50">
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
            value={formData.city || ""}
            onValueChange={(value) => handleFieldChange("city", value || null)}
            disabled={!formData.countryName}
          >
            <SelectTrigger
              id="city"
              className={`bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg ${
                !formData.countryName ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                {isCitiesLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading cities...</span>
                  </>
                ) : (
                  <SelectValue placeholder={formData.countryName ? "Select city" : "Select country first"} />
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
                  {hasCities
                    ? cities.map((city) => (
                        <SelectItem key={city} value={city} className="flex items-center gap-2">
                          {city}
                        </SelectItem>
                      ))
                    : formData.countryName && (
                        <div className="p-4 text-center text-muted-foreground">
                          <Building2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm">No cities available for {formData.countryName}</p>
                        </div>
                      )}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <Label htmlFor="state" className="font-medium text-sm">
              State/Province
            </Label>
          </div>
          <Input
            id="state"
            value={formData.state || ""}
            onChange={(e) => handleFieldChange("state", e.target.value || null)}
            placeholder="Enter state or province"
            className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Home className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="street" className="font-medium text-sm">
                Street
              </Label>
            </div>
            <Input
              id="street"
              value={formData.street || ""}
              onChange={(e) => handleFieldChange("street", e.target.value || null)}
              placeholder="Enter street name"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <Label htmlFor="houseNumber" className="font-medium text-sm">
                House Number
              </Label>
            </div>
            <Input
              id="houseNumber"
              value={formData.houseNumber || ""}
              onChange={(e) => handleFieldChange("houseNumber", e.target.value || null)}
              placeholder="Enter number"
              className="bg-background/80 border-border/50 hover:border-primary/50 transition-all focus:ring-1 focus:ring-primary/30 h-10 rounded-lg"
            />
          </div>
        </div>

        {!formData.countryName && (
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

        <motion.div
          className="flex justify-between mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onBack}
            className="border-border/50 hover:bg-muted/50 transition-all duration-300"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className={`flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 ${
              !isFormComplete ? "opacity-70" : ""
            }`}
            disabled={!isFormComplete}
          >
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  )
}
