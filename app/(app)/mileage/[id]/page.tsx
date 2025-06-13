"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MileageForm } from "@/components/mileage/mileage-form"
import type { MileageEntry } from "@/types/mileage"
import { fetchMileageEntry } from "@/lib/api/mileage"

export default function EditMileagePage() {
  const params = useParams()
  const entryId = params.id as string

  const [entry, setEntry] = useState<MileageEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getMileageEntry = async () => {
      try {
        const data = await fetchMileageEntry(entryId)
        setEntry(data)
      } catch (error) {
        console.error("Failed to fetch mileage entry:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getMileageEntry()
  }, [entryId])

  if (isLoading) {
    return <div>Loading mileage entry...</div>
  }

  if (!entry) {
    return <div>Mileage entry not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Mileage Entry</h1>
      <MileageForm entry={entry} />
    </div>
  )
}
