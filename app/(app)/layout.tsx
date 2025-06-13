import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">{children}</main>
    </div>
  )
}
