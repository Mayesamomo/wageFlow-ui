"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Shift } from "@/types/shift"
import { fetchRecentShifts } from "@/lib/api/shifts"

export function RecentShifts() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getRecentShifts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchRecentShifts()
        setShifts(data)
      } catch (error: any) {
        console.error("Failed to fetch recent shifts:", error)
        setError(error.response?.data?.message || "Failed to load recent shifts")
      } finally {
        setIsLoading(false)
      }
    }

    getRecentShifts()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-lg border p-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
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

  if (shifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No recent shifts</h3>
        <p className="text-sm text-muted-foreground mb-4">You haven&apos;t logged any shifts recently.</p>
        <Button asChild size="sm">
          <Link href="/shifts/new">
            <Plus className="h-4 w-4 mr-2" />
            Log a shift
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{shift.clientName}</p>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground gap-1">
                <span>{new Date(shift.date).toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span>{shift.totalHours.toFixed(1)} hours</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right ml-2">
              <span className="font-medium text-sm">${shift.totalEarnings.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(shift.date), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/shifts">View all shifts</Link>
        </Button>
      </div>
    </div>
  )
}
