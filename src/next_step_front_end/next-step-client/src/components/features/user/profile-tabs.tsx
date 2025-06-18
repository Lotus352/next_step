"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { User, Briefcase, Settings, Sparkles } from "lucide-react"
import ProfileInformation from "@/components/features/user/profile-information"
import ProfileSkills from "@/components/features/user/profile-skills"
import ProfileExperience from "@/components/features/user/profile-experience"
import ProfileSettings from "@/components/features/user/profile-settings"

interface ProfileTabsProps {
    isOwner: boolean
}

export default function ProfileTabs({ isOwner }: ProfileTabsProps) {
    const [activeTab, setActiveTab] = useState("information")

    return (
        <Tabs defaultValue="information" className="w-full" onValueChange={setActiveTab}>
            <div className="mb-8">
                {/* Enhanced tab header */}
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 shadow-sm border border-primary/20">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold">{isOwner ? "Profile Information" : "User Profile"}</span>
                </div>

                <TabsList
                    className={`w-full h-auto p-2 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/30 shadow-lg ${
                        isOwner ? "grid-cols-4" : "grid-cols-3"
                    } grid gap-2`}
                >
                    <TabsTrigger
                        value="information"
                        className={`
                          flex flex-col items-center justify-center gap-3 py-6 px-4
                          rounded-xl transition-all duration-500 ease-out relative overflow-hidden
                          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                          data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                          hover:bg-muted/50 group
                        `}
                    >
                        {/* Background glow for active state */}
                        {activeTab === "information" && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                                layoutId="activeTabBg"
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div
                                className={`
                  p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${
                                    activeTab === "information"
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                                }
                `}
                            >
                                <User className="h-6 w-6" />
                            </div>
                            <span
                                className={`
                  text-sm font-semibold transition-all duration-300
                  ${
                                    activeTab === "information"
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-primary"
                                }
                `}
                            >
                Information
              </span>

                            {activeTab === "information" && (
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                                    layoutId="tabIndicator"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </div>
                    </TabsTrigger>

                    <TabsTrigger
                        value="skills"
                        className={`
              flex flex-col items-center justify-center gap-3 py-6 px-4
              rounded-xl transition-all duration-500 ease-out relative overflow-hidden
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
              hover:bg-muted/50 group
            `}
                    >
                        {/* Background glow for active state */}
                        {activeTab === "skills" && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                                layoutId="activeTabBg"
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div
                                className={`
                  p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${
                                    activeTab === "skills"
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                                }
                `}
                            >
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <span
                                className={`
                  text-sm font-semibold transition-all duration-300
                  ${
                                    activeTab === "skills"
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-primary"
                                }
                `}
                            >
                Skills
              </span>

                            {activeTab === "skills" && (
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                                    layoutId="tabIndicator"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </div>
                    </TabsTrigger>

                    <TabsTrigger
                        value="experience"
                        className={`
                          flex flex-col items-center justify-center gap-3 py-6 px-4
                          rounded-xl transition-all duration-500 ease-out relative overflow-hidden
                          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                          data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
                          hover:bg-muted/50 group
                        `}
                    >
                        {/* Background glow for active state */}
                        {activeTab === "experience" && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                                layoutId="activeTabBg"
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div
                                className={`
                  p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${
                                    activeTab === "experience"
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : "bg-primary/10 text-primary group-hover:bg-primary/15"
                                }
                `}
                            >
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <span
                                className={`
                  text-sm font-semibold transition-all duration-300
                  ${
                                    activeTab === "experience"
                                        ? "text-primary-foreground"
                                        : "text-muted-foreground group-hover:text-primary"
                                }
                `}
                            >
                Experience
              </span>

                            {activeTab === "experience" && (
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-primary-foreground/80"
                                    layoutId="tabIndicator"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </div>
                    </TabsTrigger>

                    {/* Only show Settings tab for profile owner */}
                    {isOwner && (
                        <TabsTrigger
                            value="settings"
                            className={`
              flex flex-col items-center justify-center gap-3 py-6 px-4
              rounded-xl transition-all duration-500 ease-out relative overflow-hidden
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
              data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20
              hover:bg-muted/50 group
            `}
                        >
                            {/* Background glow for active state */}
                            {activeTab === "settings" && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"
                                    layoutId="activeTabBg"
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div
                                    className={`
                  p-3 rounded-xl transition-all duration-300 group-hover:scale-110
                  ${
                                        activeTab === "settings"
                                            ? "bg-primary-foreground/20 text-primary-foreground"
                                            : "bg-primary/10 text-primary group-hover:bg-primary/15"
                                    }
                `}
                                >
                                    <Settings className="h-6 w-6" />
                                </div>
                                <span
                                    className={`
                  text-sm font-semibold transition-all duration-300
                  ${
                                        activeTab === "settings"
                                            ? "text-primary-foreground"
                                            : "text-muted-foreground group-hover:text-primary"
                                    }
                `}
                                >
                  Settings
                </span>

                                {activeTab === "settings" && (
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-primary-foreground/80"
                                        layoutId="tabIndicator"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </div>
                        </TabsTrigger>
                    )}
                </TabsList>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                >
                    <TabsContent value="information" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <ProfileInformation />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <ProfileSkills isOwner={isOwner} />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <ProfileExperience />
                    </TabsContent>

                    {/* Only render Settings tab content for profile owner */}
                    {isOwner && (
                        <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                            <ProfileSettings />
                        </TabsContent>
                    )}
                </motion.div>
            </AnimatePresence>
        </Tabs>
    )
}
