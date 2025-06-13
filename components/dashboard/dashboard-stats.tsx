"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, DollarSign, MapPin, Receipt } from "lucide-react"
import { fetchDashboardStats } from "@/lib/api/dashboard"

interface DashboardStatsData {
  totalHours: number
  totalEarnings: number
  totalMileage: number
  pendingInvoices: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchDashboardStats()
        setStats(data)
      } catch (error: any) {
        console.error("Failed to fetch dashboard stats:", error)
        setError(error.response?.data?.message || "Failed to load dashboard statistics")
      } finally {
        setIsLoading(false)
      }
    }

    getStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-600">No dashboard data available</p>
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Hours",
      value: `${stats.totalHours.toFixed(1)}h`,
      description: "Last 30 days",
      icon: Clock,
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      description: "Last 30 days",
      icon: DollarSign,
    },
    {
      title: "Total Mileage",
      value: `${stats.totalMileage.toFixed(1)} km`,
      description: "Last 30 days",
      icon: MapPin,
    },
    {
      title: "Pending Invoices",
      value: stats.pendingInvoices.toString(),
      description: "Awaiting payment",
      icon: Receipt,
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
