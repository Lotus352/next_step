"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReviewStar from "@/components/review-star"
import type CompanyReviewType from "@/types/company-review-type"
import { fallbackInitials } from "@/lib/utils"
import { CalendarDays, Quote } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface Props {
  review: CompanyReviewType
}

export default function CompanyReview({ review }: Props) {
  const fallback = fallbackInitials(review.user.username)

  // Format date - assuming review has a date field, if not you can remove this
  const reviewDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently"


  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-3 -left-3 w-16 h-16 bg-primary/5 rounded-full blur-xl z-0"></div>
      <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-primary/5 rounded-full blur-xl z-0"></div>

      <motion.div
        className="relative z-10 p-6 rounded-xl border border-primary/10 bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
      >
        {/* Quote icon */}
        <div className="absolute -top-4 -left-2 bg-white rounded-full p-1 shadow-md">
          <Quote className="h-6 w-6 text-primary/60" />
        </div>

        {/* Header with user info and rating */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-md"></div>
              <Avatar className="h-16 w-16 border-2 border-white rounded-full shadow-xl relative">
                <AvatarImage src={review.user.avatarUrl || undefined} alt={`${review.user.username} avatar`} />
                <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                  {fallback}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <h4 className="font-bold text-xl tracking-tight text-primary">
                {review.user.fullName || review.user.username}
              </h4>

              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {review.user.experienceLevel && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-3 py-1 bg-primary/5 hover:bg-primary/10 transition-colors border-primary/20 text-primary/80 rounded-full"
                  >
                    {review.user.experienceLevel.experienceName}
                  </Badge>
                )}

                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                  {reviewDate}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-1 sm:mt-0">
            <div className="bg-gradient-to-r from-primary/10 to-transparent px-4 py-2 rounded-full">
              <ReviewStar averageRating={review.rating} countReview={1} />
            </div>
          </div>
        </div>

        {/* Review content */}
        <div className="relative">
          <div className="text-base leading-relaxed bg-gradient-to-br from-white to-primary/5 p-6 rounded-xl border border-primary/5 shadow-inner">
            <p className="italic text-gray-600">{review.reviewText}</p>
          </div>
        </div>

      </motion.div>
    </div>
  )
}
