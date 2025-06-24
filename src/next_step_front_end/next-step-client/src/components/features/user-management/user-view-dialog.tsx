"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Edit,
  XCircle,
  X,
  FileText,
  Briefcase,
  Calendar,
  GraduationCap,
  Lightbulb,
  Shield,
  Download,
} from "lucide-react";
import type UserType from "@/types/user-type";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogBody,
} from "@/components/ui/custom-dialog";

interface UserViewDialogProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  userRole: "admin" | "employer";
}

export function UserViewDialog({
  user,
  open,
  onOpenChange,
  onEdit,
}: UserViewDialogProps) {
  if (!user) return null;

  const getStatusBadge = (status: string) => {
    const isActive = status === "ACTIVE";
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className={`flex items-center gap-1 font-semibold ${
          isActive
            ? "bg-green-100 text-green-700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300"
        }`}
      >
        {isActive ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {status}
      </Badge>
    );
  };

  const getRoleBadges = (roles: UserType["roles"]) => {
    const roleColors = {
      ADMIN: "bg-purple-100 text-purple-700 border-purple-300",
      EMPLOYER: "bg-orange-100 text-orange-700 border-orange-300",
      CANDIDATE: "bg-blue-100 text-blue-700 border-blue-300",
    };

    return roles.map((role) => (
      <Badge
        key={role.roleId}
        variant="outline"
        className={`font-medium ${roleColors[role.roleName as keyof typeof roleColors] || "bg-gray-100 text-gray-700 border-gray-300"}`}
      >
        <Shield className="h-3 w-3 mr-1" />
        {role.roleName}
      </Badge>
    ));
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <CustomDialog open={open} onOpenChange={onOpenChange} className="max-w-5xl">
      <CustomDialogContent showCloseButton={false}>
        {/* Header - User Info */}
        <CustomDialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-16 w-16 rounded-xl border-2 border-border/30 shadow-md">
                <AvatarImage
                  src={user.avatarUrl || ""}
                  alt={`${user.fullName || user.username} avatar`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg rounded-xl">
                  {(user.fullName || user.username)?.charAt(0)?.toUpperCase() ||
                    "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <CustomDialogTitle className="line-clamp-2 mb-2">
                  {user.fullName || user.username}
                </CustomDialogTitle>
                <CustomDialogDescription className="text-lg flex items-center gap-2 mb-3 font-medium">
                  <User className="h-5 w-5 text-primary" />@{user.username}
                </CustomDialogDescription>

                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(user.status)}
                  {getRoleBadges(user.roles)}
                  {user.company && (
                    <Badge
                      variant="outline"
                      className="bg-primary/5 border-primary/20 text-primary"
                    >
                      <Building2 className="h-3 w-3 mr-1" />
                      {user.company.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CustomDialogHeader>

        {/* Scrollable Content */}
        <CustomDialogBody>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Personal Information Card */}
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    Personal Information
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        Contact Details
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          {user.email}
                        </span>
                      </div>

                      {user.phoneNumber && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            {user.phoneNumber}
                          </span>
                        </div>
                      )}

                      {user.nationality && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            {user.nationality}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-lg font-bold text-foreground">
                        Additional Info
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                          Send Notifications:{" "}
                          {user.isSend ? "Enabled" : "Disabled"}
                        </span>
                      </div>

                      {user.resumeUrl && (
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-primary hover:bg-primary/10"
                          >
                            <a
                              href={user.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Download Resume
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {user.bio && (
                  <>
                    <Separator className="my-6 bg-border/50" />
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-lg font-bold text-foreground">
                          Bio
                        </span>
                      </div>
                      <div className="bg-gradient-to-br from-muted/20 to-muted/10 p-4 rounded-xl border border-border/30">
                        <p className="text-foreground leading-relaxed">
                          {user.bio}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            {user.skills && user.skills.length > 0 && (
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Skills</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <div
                        key={skill.skillId}
                        className="group/skill relative overflow-hidden animate-in fade-in-50 slide-in-from-bottom-2"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationDuration: "400ms",
                        }}
                      >
                        <Badge
                          variant="outline"
                          className="relative text-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-sm font-semibold px-3 py-2 border-primary/20 bg-gradient-to-r from-background to-muted/30"
                        >
                          <span className="relative z-10 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                            {skill.skillName}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300" />
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            {user.experiences && user.experiences.length > 0 && (
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-500 border-border/30 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-br from-muted/20 via-transparent to-transparent border-b border-border/30 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      Work Experience
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="space-y-6">
                    {user.experiences.map((experience, index) => (
                      <motion.div
                        key={experience.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-br from-muted/20 to-muted/10 p-6 rounded-xl border border-border/30 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {experience.title}
                            </h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span className="font-medium">
                                {experience.company}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <MapPin className="h-4 w-4" />
                              <span>{experience.location}</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-primary/5 border-primary/20 text-primary"
                          >
                            <GraduationCap className="h-3 w-3 mr-1" />
                            {experience.experienceLevel.experienceName}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {experience.startDate} -{" "}
                            {experience.endDate || "Present"}
                          </span>
                        </div>

                        {experience.description && (
                          <p className="text-foreground leading-relaxed">
                            {experience.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </CustomDialogBody>
      </CustomDialogContent>
    </CustomDialog>
  );
}
