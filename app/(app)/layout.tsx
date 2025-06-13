import type React from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto bg-[#f8f9fa] p-4 md:p-6">{children}</main>
    </div>
  )
}