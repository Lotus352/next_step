"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pagination } from "@/components/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  CheckCircle,
  XCircle,
  Users,
  UserCheck,
  UserX,
} from "lucide-react"
import type UserType from "@/types/user-type"
import type { AppDispatch } from "@/store/store"
import { deleteUser } from "@/store/slices/user-slice"
import Loading from "@/components/loading"

// Import the new dialog components
import { UserViewDialog } from "./user-view-dialog"
import { UserEditDialog } from "./user-edit-dialog"

interface UserManagementTableProps {
  users: UserType[]
  loading: boolean
  currentPage: number
  totalPages: number
  totalElements: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  userRole: "admin" | "employer"
}

export function UserManagementTable({
                                      users,
                                      loading,
                                      currentPage,
                                      totalPages,
                                      totalElements,
                                      pageSize,
                                      onPageChange,
                                      onPageSizeChange,
                                      userRole,
                                    }: UserManagementTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // Add state for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)

  const handleDelete = async () => {
    if (selectedUserId) {
      await dispatch(deleteUser(selectedUserId))
      setDeleteDialogOpen(false)
      setSelectedUserId(null)
    }
  }

  // Add handlers for opening dialogs
  const handleViewUser = (user: UserType) => {
    setSelectedUser(user)
    setViewDialogOpen(true)
  }

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: {
        variant: "default" as const,
        icon: CheckCircle,
        className: "bg-green-100 text-green-700 border-green-300",
      },
      INACTIVE: {
        variant: "secondary" as const,
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-300",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ACTIVE
    const Icon = config.icon

    return (
        <Badge variant={config.variant} className={`${config.className} flex items-center gap-1 font-medium`}>
          <Icon className="h-3 w-3" />
          {status}
        </Badge>
    )
  }

  const getRoleBadges = (roles: UserType["roles"]) => {
    const roleColors = {
      ADMIN: "bg-purple-100 text-purple-700 border-purple-300",
      EMPLOYER: "bg-orange-100 text-orange-700 border-orange-300",
      CANDIDATE: "bg-blue-100 text-blue-700 border-blue-300",
    }

    return roles.slice(0, 2).map((role) => (
        <Badge
            key={role.roleId}
            variant="outline"
            className={`text-xs font-medium ${roleColors[role.roleName as keyof typeof roleColors] || "bg-gray-100 text-gray-700 border-gray-300"}`}
        >
          {role.roleName}
        </Badge>
    ))
  }

  if (loading) {
    return <Loading />
  }

  if (users.length === 0) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No users found</h3>
              <p className="text-muted-foreground text-sm">There are currently no users matching your criteria.</p>
            </CardContent>
          </Card>
        </motion.div>
    )
  }

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
      >
        <Card className="border-border/30 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-border/30">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold">User Accounts</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {totalElements} users
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/30 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground">User Details</TableHead>
                    <TableHead className="font-semibold text-foreground">Contact</TableHead>
                    <TableHead className="font-semibold text-foreground">Roles</TableHead>
                    <TableHead className="font-semibold text-foreground">Company</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                        <motion.tr
                            key={user.userId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-border/30 hover:bg-muted/20 transition-all duration-300 group"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 rounded-lg">
                                <AvatarImage src={user.avatarUrl || ""} alt={user.fullName || user.username} />
                                <AvatarFallback className="bg-primary/10 text-primary font-semibold rounded-lg">
                                  {(user.fullName || user.username)?.charAt(0)?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                  {user.fullName || user.username}
                                </div>
                                <div className="text-sm text-muted-foreground">@{user.username}</div>
                                {user.bio && (
                                    <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{user.bio}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-foreground">{user.email}</span>
                              </div>
                              {user.phoneNumber && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">{user.phoneNumber}</span>
                                  </div>
                              )}
                              {user.nationality && <div className="text-xs text-muted-foreground">{user.nationality}</div>}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {getRoleBadges(user.roles)}
                              {user.roles.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.roles.length - 2}
                                  </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            {user.company ? (
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{user.company.name}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-muted-foreground">No company</span>
                            )}
                          </TableCell>

                          <TableCell className="py-4">{getStatusBadge(user.status)}</TableCell>

                          <TableCell className="py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>

                                {/* Edit User - Available for both admin and employer */}
                                <DropdownMenuItem
                                    className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => handleEditUser(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>

                                {/* Admin-only actions */}
                                {userRole === "admin" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      {user.status === "ACTIVE" ? (
                                          <DropdownMenuItem className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700">
                                            <UserX className="h-4 w-4" />
                                            Deactivate User
                                          </DropdownMenuItem>
                                      ) : (
                                          <DropdownMenuItem className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700">
                                            <UserCheck className="h-4 w-4" />
                                            Activate User
                                          </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                          className="flex items-center gap-2 hover:bg-red-50 hover:text-red-700"
                                          onClick={() => {
                                            setSelectedUserId(user.userId)
                                            setDeleteDialogOpen(true)
                                          }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </>
                                )}

                                {/* Employer-specific actions (if any) */}
                                {userRole === "employer" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      {/* Add employer-specific actions here if needed */}
                                    </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pagination */}
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            showPageSizeSelector={true}
            pageSizeOptions={[5, 10, 20, 50]}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account and remove all associated
                data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add the dialog components */}
        <UserViewDialog
            user={selectedUser}
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            onEdit={() => {
              setViewDialogOpen(false)
              setEditDialogOpen(true)
            }}
            userRole={userRole}
        />

        <UserEditDialog user={selectedUser} open={editDialogOpen} onOpenChange={setEditDialogOpen} userRole={userRole} />
      </motion.div>
  )
}
