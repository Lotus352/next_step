"use client"

import { Star } from "lucide-react"
import { calStarReview } from "@/lib/utils.ts"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ReviewStarProps {
  averageRating: number
  countReview: number
  onChange?: (newRating: number) => void
  showText?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  interactive?: boolean
}

function ReviewStar({
  averageRating,
  countReview,
  onChange,
  showText = true,
  size = "sm",
  className,
  interactive = true,
}: ReviewStarProps) {

  const { fullStars, hasHalfStar } = calStarReview(averageRating)
  const [hoverRating, setHoverRating] = useState(0)

  const displayRating = Number.isInteger(averageRating) ? averageRating.toFixed(1) : averageRating.toFixed(1)

  const handleStarClick = (newRating: number) => {
    if (onChange && interactive) {
      onChange(newRating)
    }
  }

  const handleMouseEnter = (rating: number) => {
    if (onChange && interactive) {
      setHoverRating(rating)
    }
  }

  const handleMouseLeave = () => {
    if (onChange && interactive) {
      setHoverRating(0)
    }
  }

  // Determine star size based on the size prop
  const starSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const starSize = starSizes[size]
  const textSize = size === "lg" ? "text-sm" : "text-xs"

  // Determine if a star should appear filled based on hover state or actual rating
  const isStarFilled = (index: number) => {
    if (hoverRating > 0) {
      return index < hoverRating
    }
    return index < fullStars || (index === fullStars && hasHalfStar)
  }

  // Determine if a star should appear half-filled
  const isStarHalfFilled = (index: number) => {
    if (hoverRating > 0) {
      return false // No half stars during hover
    }
    return index === fullStars && hasHalfStar
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div
        className={cn("flex items-center", onChange && interactive ? "cursor-pointer" : "")}
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "relative transition-transform",
              onChange && interactive ? "hover:scale-110" : "",
              isStarFilled(i) && !isStarHalfFilled(i) ? "text-amber-500" : "text-amber-200",
            )}
            onClick={() => handleStarClick(i + 1)}
            onMouseEnter={() => handleMouseEnter(i + 1)}
          >
            {isStarHalfFilled(i) ? (
              <div className={cn("relative", starSize)}>
                <Star className={cn("absolute inset-0", starSize, "text-amber-200")} />
                <Star
                  className={cn("absolute inset-0", starSize, "text-amber-500")}
                  style={{
                    clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
                  }}
                />
              </div>
            ) : (
              <Star className={cn(starSize, isStarFilled(i) ? "fill-amber-500" : "")} />
            )}
          </div>
        ))}
      </div>

      {showText && (
        <span className={cn("ml-1.5 text-muted-foreground font-medium", textSize)}>
          {displayRating}
          <span className="text-muted-foreground/70 font-normal ml-0.5">
            {countReview > 0 && ` (${countReview} ${countReview === 1 ? "review" : "reviews"})`}
          </span>
        </span>
      )}
    </div>
  )
}

export default ReviewStar
