"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { JobManagementPage } from "@/pages/job-management-page.tsx";
import Header from "@/components/layout/header.tsx";
import Footer from "@/components/layout/footer.tsx";

export default function JobManagementPageRoute() {
  // Get user from auth state
  const user = useSelector((state: RootState) => state.auth.user);

  // Check if user has admin role in their roles array
  const isAdmin =
    user?.roles?.some((role) => role.roleName === "ADMIN") || false;

  const userRole = isAdmin ? "admin" : "employer";

  return (
    <>
      <Header/>
      <JobManagementPage userRole={userRole} />
      <Footer/>
    </>
  );
}
