"use client"

import { useEffect } from "react"
import { Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import { motion, AnimatePresence } from "framer-motion"

export interface NotificationState {
  isVisible: boolean
  jobTitle: string
  type: "added" | "removed"
}

interface FavoriteNotificationProps {
  isVisible: boolean
  jobTitle: string
  onClose: () => void
  type: "added" | "removed"
}

export function FavoriteNotification({ isVisible, jobTitle, onClose, type }: FavoriteNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto close after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-20 right-4 z-[100]"
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-card border shadow-lg rounded-lg p-4 max-w-sm flex items-center gap-3 backdrop-blur-md bg-background/95">
            <motion.div
              className={`p-2 rounded-full ${type === "added" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {type === "added" ? <Heart className="h-5 w-5 fill-current" /> : <Heart className="h-5 w-5" />}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">
                {type === "added" ? "Added to Favorites!" : "Removed from Favorites"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{jobTitle}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-accent" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
