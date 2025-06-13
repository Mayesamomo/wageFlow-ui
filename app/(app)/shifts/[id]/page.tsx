"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShiftForm } from "@/components/shifts/shift-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import type { Shift } from "@/types/shift"
import { fetchShift } from "@/lib/api/shifts"

export default function EditShiftPage() {
  const params = useParams()
  const router = useRouter()
  const shiftId = params.id as string

  const [shift, setShift] = useState<Shift | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getShift = async () => {
      // Don't fetch if ID is invalid
      if (!shiftId || shiftId.length < 1) {
        setError("Invalid shift ID")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchShift(shiftId)

        if (!data) {
          setError("Shift not found")
        } else {
          setShift(data)
        }
      } catch (error: any) {
        console.error("Failed to fetch shift:", error)

        // Handle different types of errors
        if (error.message === "Shift not found") {
          setError("Shift not found")
        } else if (error.message === "Server error occurred") {
          setError("Server error occurred. Please try again later.")
        } else if (error.code === "ECONNABORTED") {
          setError("Request timeout. Please check your connection.")
        } else {
          setError("Failed to load shift. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if we have a valid ID (not "new")
    if (shiftId && shiftId !== "new") {
      getShift()
    }
  }, [shiftId])

  const handleRetry = () => {
    const getShift = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchShift(shiftId)

        if (!data) {
          setError("Shift not found")
        } else {
          setShift(data)
        }
      } catch (error: any) {
        console.error("Failed to fetch shift:", error)
        setError("Failed to load shift. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    getShift()
  }

  // Early redirect for "new" ID - don't render anything else
  if (shiftId === "new") {
    router.replace("/shifts/new")
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting...</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading shift...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">{error}</div>
            <div className="space-x-2">
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => router.push("/shifts")} variant="default">
                Back to Shifts
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!shift) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-gray-500 text-lg font-semibold mb-2">Shift not found</div>
            <Button onClick={() => router.push("/shifts")} variant="default">
              Back to Shifts
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Shift</h1>
      <ShiftForm shift={shift} />
    </div>
  )
}
