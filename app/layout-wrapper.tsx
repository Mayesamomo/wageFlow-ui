"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/auth-provider"
import { AppShell } from "@/components/layout/app-shell"
import { usePathname } from "next/navigation"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is not authenticated and not on auth pages, redirect will be handled by AuthProvider
  if (!user && !pathname.startsWith("/auth")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is authenticated, show the app shell
  if (user) {
    return <AppShell>{children}</AppShell>
  }

  // For auth pages, just render children without app shell
  return <>{children}</>
}
