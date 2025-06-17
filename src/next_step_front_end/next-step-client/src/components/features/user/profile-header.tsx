"use client";

import type React from "react";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Flag,
} from "lucide-react";
import {
  uploadAvatar,
  uploadResume,
  fetchUserProfile,
} from "@/store/slices/user-slice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  StatusNotification,
  type NotificationType,
} from "@/components/notifications/status-notification";

interface ProfileHeaderProps {
  isOwner: boolean;
}

export default function ProfileHeader({ isOwner }: ProfileHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, statuses } = useSelector((state: RootState) => state.user);

  const [, setAvatarFile] = useState<File | null>(null);
  const [, setResumeFile] = useState<File | null>(null);

  // Notification state
  const [notification, setNotification] = useState<{
    isVisible: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  });

  if (!profile) return null;

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string,
  ) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    });
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      // Show loading notification
      showNotification(
        "loading",
        "Uploading Avatar",
        "Please wait while we upload your profile picture...",
      );

      // Use the file directly from event, not from state
      dispatch(uploadAvatar({ id: profile.userId, file: file }))
        .unwrap()
        .then(() => {
          // Show success notification
          showNotification(
            "success",
            "Avatar Updated",
            "Your profile picture has been updated successfully",
          );
          setTimeout(() => {
            dispatch(fetchUserProfile(profile.username));
          }, 1500);

          setAvatarFile(null);
        })
        .catch((error) => {
          // Show error notification
          showNotification(
            "error",
            "Upload Failed",
            error?.message ||
              "There was a problem uploading your profile picture",
          );
          setAvatarFile(null);
        });
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwner) return;

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);

      // Show loading notification
      showNotification(
        "loading",
        "Uploading Resume",
        "Please wait while we upload your resume...",
      );

      // Use the file directly from event, not from state
      dispatch(uploadResume({ id: profile.userId, file: file }))
        .unwrap()
        .then(() => {
          // Refresh user profile to get updated resume URL
          dispatch(fetchUserProfile(profile.username));

          // Show success notification
          showNotification(
            "success",
            "Resume Updated",
            "Your resume has been uploaded successfully",
          );
          setResumeFile(null);
        })
        .catch((error) => {
          // Show error notification
          showNotification(
            "error",
            "Upload Failed",
            error?.message || "There was a problem uploading your resume",
          );
          setResumeFile(null);
        });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return profile.username.substring(0, 2).toUpperCase();
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Header Section with Background */}
            <div className="h-40 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40 relative">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-xl transition-all duration-300 group-hover:scale-105">
                    <AvatarImage
                      src={profile.avatarUrl || ""}
                      alt={profile.fullName || profile.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                      {getInitials(profile.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Only show upload button for profile owner */}
                  {isOwner && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:scale-110">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleAvatarChange}
                              disabled={statuses.uploadingAvatar === "loading"}
                            />
                            {statuses.uploadingAvatar === "loading" ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              >
                                <Upload className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                          </label>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Upload profile picture</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
            </div>

            {/* User Info Section */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1 leading-tight group-hover:text-primary transition-all duration-300">
                      {profile.fullName || profile.username}
                    </h1>
                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                      <User className="h-4 w-4" />@{profile.username}
                    </p>
                  </div>

                  {/* Bio Section */}
                  {profile.bio && (
                    <div className="mt-3 max-w-2xl">
                      <p className="text-muted-foreground italic border-l-4 border-primary/30 pl-3 py-1">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {profile.experiences
                      ?.slice() // Create a shallow copy to avoid mutating the original array
                      .sort((a, b) => {
                        // Convert startDate strings to Date objects for comparison
                        const dateA = new Date(a.startDate);
                        const dateB = new Date(b.startDate);

                        // Sort from latest to earliest (descending order)
                        return dateB.getTime() - dateA.getTime();
                      })
                      .map((exp, index) => (
                        <Badge
                          key={`experience-${exp.id || index}-${exp.title}-${exp.company}-${exp.startDate}`}
                          variant="outline"
                          className="flex items-center gap-1 border-primary/20 bg-gradient-to-r from-background to-muted/30"
                        >
                          <GraduationCap className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs">
                            {exp.title} at {exp.company}
                            {exp.endDate === null && " (Current)"}
                          </span>
                        </Badge>
                      ))}
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground">
                      <Mail className="h-4 w-4 mr-3 text-primary" />
                      <span className="text-sm font-medium">
                        {profile.email}
                      </span>
                    </div>

                    {profile.phoneNumber && (
                      <div className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground">
                        <Phone className="h-4 w-4 mr-3 text-primary" />
                        <span className="text-sm font-medium">
                          {profile.phoneNumber}
                        </span>
                      </div>
                    )}

                    {profile.nationality && (
                      <div className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground">
                        <Flag className="h-4 w-4 mr-3 text-primary" />
                        <span className="text-sm font-medium">
                          {profile.nationality}
                        </span>
                      </div>
                    )}

                    {profile.company && (
                      <div className="flex items-center text-muted-foreground transition-all duration-300 hover:text-foreground">
                        <Briefcase className="h-4 w-4 mr-3 text-primary" />
                        <span className="text-sm font-medium">
                          {profile.company.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume Section */}
                <div className="flex flex-col items-center gap-3 bg-muted/30 p-6 rounded-xl border border-border/40 min-w-[200px]">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Resume</h3>

                  {profile.resumeUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        Resume Available
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          asChild
                        >
                          <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </Button>
                        {/* Only show update button for profile owner */}
                        {isOwner && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <label className="inline-flex h-8 px-3 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-xs cursor-pointer">
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    onChange={handleResumeUpload}
                                    disabled={
                                      statuses.uploadingResume === "loading"
                                    }
                                  />
                                  {statuses.uploadingResume === "loading"
                                    ? "Uploading..."
                                    : "Update"}
                                </label>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Update your resume</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {isOwner ? (
                        <>
                          <p className="text-xs text-muted-foreground text-center">
                            Upload your resume to apply for jobs faster
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            asChild
                          >
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                                onChange={handleResumeUpload}
                                disabled={
                                  statuses.uploadingResume === "loading"
                                }
                              />
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              {statuses.uploadingResume === "loading"
                                ? "Uploading..."
                                : "Upload Resume"}
                            </label>
                          </Button>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center">
                          No resume uploaded
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status notification - only show for profile owner */}
      {isOwner && (
        <StatusNotification
          isVisible={notification.isVisible}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
          showProgress={notification.type !== "loading"}
        />
      )}
    </>
  );
}
