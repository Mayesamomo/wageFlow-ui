import { apiClient } from "./api-client"
import type { MileageEntry } from "@/types/mileage"

export async function fetchMileageEntries(params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  clientId?: string
}): Promise<{ entries: MileageEntry[]; total: number; page: number; limit: number }> {
  try {
    const response = await apiClient.get("/mileages", { params })

    // Handle different response structures
    if (Array.isArray(response.data)) {
      return {
        entries: response.data,
        total: response.data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
      }
    } else if (response.data && typeof response.data === "object") {
      return {
        entries: response.data.entries || response.data.data || response.data.mileages || [],
        total: response.data.total || response.data.count || 0,
        page: response.data.page || params?.page || 1,
        limit: response.data.limit || params?.limit || 10,
      }
    } else {
      return {
        entries: [],
        total: 0,
        page: 1,
        limit: 10,
      }
    }
  } catch (error) {
    console.error("Error fetching mileage entries:", error)
    return {
      entries: [],
      total: 0,
      page: 1,
      limit: 10,
    }
  }
}

export async function fetchMileageEntry(id: string): Promise<MileageEntry> {
  try {
    const response = await apiClient.get(`/mileages/${id}`)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching mileage entry ${id}:`, error)
    throw new Error(error.response?.data?.message || "Failed to fetch mileage entry")
  }
}

export async function createMileageEntry(entryData: Partial<MileageEntry>): Promise<MileageEntry> {
  try {
    const response = await apiClient.post("/mileages", entryData)
    return response.data
  } catch (error: any) {
    console.error("Error creating mileage entry:", error)
    throw new Error(error.response?.data?.message || "Failed to create mileage entry")
  }
}

export async function updateMileageEntry(id: string, entryData: Partial<MileageEntry>): Promise<MileageEntry> {
  try {
    const response = await apiClient.patch(`/mileages/${id}`, entryData)
    return response.data
  } catch (error: any) {
    console.error("Error updating mileage entry:", error)
    throw new Error(error.response?.data?.message || "Failed to update mileage entry")
  }
}

export async function deleteMileageEntry(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/mileages/${id}`)
    return true
  } catch (error: any) {
    console.error(`Error deleting mileage entry ${id}:`, error)
    return false
  }
}