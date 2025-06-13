"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Clock, FileText, Home, Map, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Shifts",
      href: "/shifts",
      icon: Clock,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
    },
    {
      name: "Mileage",
      href: "/mileage",
      icon: Map,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart,
    },
  ]

  return (
    <div className="w-[280px] border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-full bg-blue-600 p-1.5">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">WageFlow</span>
        </Link>
      </div>
      <div className="p-4">
        <nav className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || pathname.startsWith(`${route.href}/`)
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <route.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
                {route.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
