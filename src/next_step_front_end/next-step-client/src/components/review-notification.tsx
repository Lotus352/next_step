"use client"

import { useEffect } from "react"
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

type NotificationType = "success" | "error" | "info" | "warning"

interface ReviewNotificationProps {
  isVisible: boolean
  type: NotificationType
  title: string
  message: string
  onClose: () => void
}

export function ReviewNotification({ isVisible, type, title, message, onClose }: ReviewNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // Auto close after 4 seconds

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    info: <Info className="h-5 w-5 text-sky-600" />,
  }

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    error: "bg-rose-50 border-rose-200",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-sky-50 border-sky-200",
  }

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
          <div
            className={`border shadow-lg rounded-lg p-4 max-w-sm flex items-center gap-3 backdrop-blur-md ${bgColors[type]}`}
          >
            <motion.div
              className="p-2 rounded-full bg-white/50"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {icons[type]}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800">{title}</p>
              <p className="text-xs text-gray-600 truncate">{message}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/50" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
