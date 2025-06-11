"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store.ts"
import { useEffect, useState } from "react"
import Loading from "@/components/loading.tsx"
import DestructiveAlert from "@/components/destructive-alert"
import { fetchReviews, addReview, hasUserReviewedCompany, updateReview } from "@/store/slices/company-reviews-slice.ts"
import { DEFAULT_PAGE, DEFAULT_REVIEW_SIZE } from "@/constants"
import ReviewStar from "@/components/review-star"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Star, Edit2, Save, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import CompanyReview from "@/components/features/company-review/company-review"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import type CompanyReviewType from "@/types/company-review-type"
import { fetchCompany } from "@/store/slices/companies-slice"
import { ReviewNotification } from "@/components/review-notification"

type NotificationType = "success" | "error" | "info" | "warning"

interface NotificationState {
  isVisible: boolean
  type: NotificationType
  title: string
  message: string
}

function CompanyReviewsSection() {
  // Redux state
  const dispatch = useDispatch<AppDispatch>()
  const { items, status, totalElements } = useSelector((state: RootState) => state.companyReviews)
  const { selected } = useSelector((state: RootState) => state.jobs)
  const companyId = selected?.postedBy?.company?.companyId
  const user = useSelector((state: RootState) => state.auth.user)
  const company = useSelector((state: RootState) => state.companies.selected)

  const [visibleCount, setVisibleCount] = useState(5)
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState("")
  const [editingRating, setEditingRating] = useState(0)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)

  // Notification state
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: "info",
    title: "",
    message: "",
  })

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    })
  }

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  useEffect(() => {
    if (!companyId) return
    dispatch(fetchReviews({ companyId, page: DEFAULT_PAGE, size: DEFAULT_REVIEW_SIZE }))
  }, [companyId, dispatch])

  useEffect(() => {
    if (!companyId || !user) return
    const checkReviewStatus = async () => {
      const reviewed = await dispatch(hasUserReviewedCompany({ userId: user.userId, companyId })).unwrap()
      setHasReviewed(reviewed)
    }
    checkReviewStatus()
  }, [companyId, user, dispatch])

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompany(companyId))
    }
  }, [companyId, dispatch])

  const handleShowMore = () => {
    const remain = items.length - visibleCount
    if (remain > 0) {
      setVisibleCount((prev) => prev + (remain < 5 ? remain : 5))
    }
  }

  const filteredReviews = filterRating ? items.filter((review) => review.rating === filterRating) : items
  const visibleReviews = filteredReviews.slice(0, visibleCount)

  const handleAddReview = async () => {
    if (!companyId || !user) return
    if (!comment.trim()) {
      showNotification("error", "Validation Error", "Please enter a review comment")
      return
    }
    if (rating === 0) {
      showNotification("error", "Validation Error", "Please select a rating")
      return
    }

    setIsSubmitting(true)
    try {
      const hasReviewed = await dispatch(hasUserReviewedCompany({ userId: user.userId, companyId })).unwrap()

      if (hasReviewed) {
        showNotification("error", "Already Reviewed", "You have already reviewed this company.")
        return
      }

      await dispatch(
        addReview({
          companyId,
          rating,
          reviewText: comment,
          userId: user.userId,
        }),
      ).unwrap()

      showNotification("success", "Review Submitted", "Your review has been submitted successfully!")
      setComment("")
      setRating(0)
      setHasReviewed(true)
    } catch (error) {
      console.error("Failed to add review:", error)
      showNotification("error", "Submission Failed", "Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditDialog = (review: CompanyReviewType) => {
    setEditingReviewId(review.reviewId)
    setEditingComment(review.reviewText)
    setEditingRating(review.rating)
    setIsEditDialogOpen(true)
  }

  const closeEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingReviewId(null)
  }

  const handleEditReview = async () => {
    if (!user || !editingReviewId) return

    if (!editingComment.trim()) {
      showNotification("error", "Validation Error", "Review text cannot be empty")
      return
    }

    if (editingRating === 0) {
      showNotification("error", "Validation Error", "Please select a rating")
      return
    }

    setIsEditSubmitting(true)
    try {
      await dispatch(
        updateReview({
          reviewId: editingReviewId,
          rating: editingRating,
          reviewText: editingComment,
          userId: user.userId,
        }),
      ).unwrap()

      if (companyId) {
        await dispatch(fetchCompany(companyId)).unwrap()
      }

      showNotification("success", "Review Updated", "Your review has been updated successfully!")
      closeEditDialog()
    } catch (error) {
      console.error("Failed to update review:", error)
      showNotification("error", "Update Failed", "Failed to update review. Please try again.")
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const handleFilterChange = (rating: number | null) => {
    setFilterRating((prev) => (prev === rating ? null : rating))
    setVisibleCount(5) // Reset visible count when filter changes
  }

  return (
    <>
      <Card className="border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/95">
        <CardHeader className="pb-4 border-b border-primary/10 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Employee Reviews
              </CardTitle>
              {totalElements > 0 && (
                <CardDescription className="mt-1.5">
                  {totalElements} {totalElements === 1 ? "review" : "reviews"} from employees
                </CardDescription>
              )}
            </div>
            {totalElements > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-medium">{company?.averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">/ 5</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {status === "loading" && (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          )}

          {status === "failed" && <DestructiveAlert message="Failed to fetch reviews" />}

          {status === "idle" && (
            <>
              {!hasReviewed && user && (
                <motion.div
                  className="mb-8 p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-muted/5 to-muted/10 shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-semibold text-xl mb-6 flex items-center gap-3 text-primary">
                    <Star className="h-5 w-5 text-primary" />
                    Share Your Experience
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-primary/80">Your Rating</label>
                      <ReviewStar
                        averageRating={rating}
                        countReview={0}
                        onChange={setRating}
                        size="lg"
                        showText={false}
                      />
                      {rating > 0 && (
                        <Badge
                          variant="outline"
                          className="mt-3 bg-primary/10 hover:bg-primary/20 transition-colors border-primary/20 text-primary/80 rounded-full px-3 py-1"
                        >
                          {rating === 5
                            ? "Excellent"
                            : rating >= 4
                              ? "Very Good"
                              : rating >= 3
                                ? "Good"
                                : rating >= 2
                                  ? "Fair"
                                  : "Poor"}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
                        Your Review
                      </label>
                      <Textarea
                        id="review-comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience working at this company..."
                        className="min-h-[120px] resize-y rounded-xl border-primary/20 focus:border-primary/40 focus:ring-primary/20 transition-all duration-300"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {comment.length} characters | Minimum recommended: 50 characters
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddReview}
                        disabled={isSubmitting || !comment.trim() || rating === 0}
                        className="px-8 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="mr-2">Submitting</span>
                            <Loading />
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {items.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Filter by rating:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <Button
                        key={r}
                        variant={filterRating === r ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange(r)}
                        className={`rounded-full ${
                          filterRating === r ? "bg-primary text-white" : "border-primary/20 hover:bg-primary/5"
                        }`}
                      >
                        {r} <Star className="h-3 w-3 ml-1 fill-current" />
                      </Button>
                    ))}
                    {filterRating && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterRating(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Clear filter
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <AnimatePresence>
                  {visibleReviews.length > 0 ? (
                    visibleReviews.map((review, i) => (
                      <motion.div
                        key={review.reviewId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="relative"
                      >
                        <CompanyReview review={review} />

                        {user && user.userId === review.user.userId && (
                          <div className="absolute top-4 right-4 z-20">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-white hover:bg-primary/5 shadow-md"
                                    onClick={() => openEditDialog(review)}
                                  >
                                    <Edit2 className="h-4 w-4 text-primary" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit your review</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6 shadow-lg">
                        <MessageSquare className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        {filterRating ? `No ${filterRating}-star reviews yet` : "No reviews yet"}
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {filterRating
                          ? `There are no ${filterRating}-star reviews for this company yet.`
                          : "Be the first to share your experience working at this company and help others make informed decisions."}
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {visibleCount < filteredReviews.length && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleShowMore}
                    className="px-8 py-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Show more reviews ({filteredReviews.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>

        {/* Edit Review Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg rounded-2xl border-primary/10 shadow-2xl">
            <DialogHeader>
              <DialogTitle>Edit Your Review</DialogTitle>
              <DialogDescription>Update your rating and review for this company.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">Update Your Rating</label>
                <ReviewStar
                  averageRating={editingRating}
                  countReview={0}
                  onChange={setEditingRating}
                  size="lg"
                  showText={false}
                />
                {editingRating > 0 && (
                  <Badge variant="outline" className="mt-2 bg-primary/5">
                    {editingRating === 5
                      ? "Excellent"
                      : editingRating >= 4
                        ? "Very Good"
                        : editingRating >= 3
                          ? "Good"
                          : editingRating >= 2
                            ? "Fair"
                            : "Poor"}
                  </Badge>
                )}
              </div>

              <div>
                <label htmlFor="edit-review-comment" className="block text-sm font-medium mb-2">
                  Update Your Review
                </label>
                <Textarea
                  id="edit-review-comment"
                  value={editingComment}
                  onChange={(e) => setEditingComment(e.target.value)}
                  placeholder="Share your experience working at this company..."
                  className="min-h-[150px] resize-y"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {editingComment.length} characters | Minimum recommended: 50 characters
                </p>
              </div>
            </div>

            <DialogFooter className="flex sm:justify-between">
              <Button
                variant="outline"
                onClick={closeEditDialog}
                disabled={isEditSubmitting}
                className="rounded-xl border-primary/20 hover:bg-primary/5 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditReview}
                disabled={isEditSubmitting || !editingComment.trim() || editingRating === 0}
                className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isEditSubmitting ? (
                  <>
                    <span>Saving</span>
                    <Loading />
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Review Notification */}
      <ReviewNotification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={hideNotification}
      />
    </>
  )
}

export default CompanyReviewsSection
