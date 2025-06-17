"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { fetchSkills } from "@/store/slices/skills-slice"
import { fetchLevels } from "@/store/slices/experience-levels-slice"
import type { AppDispatch, RootState } from "@/store/store"
import ProfileTabs from "@/components/features/user/profile-tabs"
import Loading from "@/components/loading"
import ErrorPage from "@/pages/error-page"
import { DEFAULT_PAGE, DEFAULT_SKILL_SIZE, DEFAULT_LEVEL_SIZE } from "@/constants"
import { fetchUserProfile } from "@/store/slices/user-slice.ts"
import ProfileHeader from "@/components/features/user/profile-header.tsx"
import Header from "@/components/layout/header.tsx"
import Footer from "@/components/layout/footer.tsx"

export default function UserProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { username } = useParams<{ username: string }>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { profile, statuses } = useSelector((state: RootState) => state.user)

  // Check if the current user is viewing their own profile
  const isOwner = user?.username === username

  useEffect(() => {
    if (username) {
      dispatch(fetchUserProfile(username))
      dispatch(fetchSkills({ page: DEFAULT_PAGE, size: DEFAULT_SKILL_SIZE }))
      dispatch(fetchLevels({ page: DEFAULT_PAGE, size: DEFAULT_LEVEL_SIZE }))
    }
  }, [dispatch, username])

  if (statuses.fetching === "loading") {
    return <Loading />
  }

  if (statuses.fetching === "failed" || !profile) {
    return <ErrorPage message="Failed to load profile" />
  }

  return (
      <div>
        <Header />
        <div className="relative overflow-hidden">
          {/* Background gradient elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

          <div className="container mx-auto py-16 px-4 max-w-6xl relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
              <ProfileHeader isOwner={isOwner} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ProfileTabs isOwner={isOwner} />
            </motion.div>
          </div>
          <Footer />
        </div>
      </div>
  )
}
