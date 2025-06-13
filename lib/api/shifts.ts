import { apiClient } from "./api-client"
import type { Shift } from "@/types/shift"

export async function fetchShifts(params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  clientId?: string
}): Promise<{ shifts: Shift[]; total: number; page: number; limit: number }> {
  try {
    const response = await apiClient.get("/shifts", { params })

    // Handle different response structures
    if (Array.isArray(response.data)) {
      return {
        shifts: response.data,
        total: response.data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
      }
    }

    // Handle object with shifts property
    if (response.data && response.data.shifts) {
      return response.data
    }

    // Handle object with data property containing shifts
    if (response.data && response.data.data) {
      return {
        shifts: response.data.data,
        total: response.data.total || response.data.data.length,
        page: response.data.page || params?.page || 1,
        limit: response.data.limit || params?.limit || 10,
      }
    }

    // Default fallback
    return {
      shifts: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
    }
  } catch (error) {
    console.error("Error fetching shifts:", error)
    return {
      shifts: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
    }
  }
}

export async function fetchShift(id: string): Promise<Shift | null> {
  try {
    // Basic validation - just check if ID exists and is not empty
    if (!id || id.trim().length === 0) {
      throw new Error("Invalid shift ID")
    }

    const response = await apiClient.get(`/shifts/${id}`)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching shift ${id}:`, error)

    // Re-throw the error so the component can handle it
    if (error.response?.status === 404) {
      throw new Error("Shift not found")
    } else if (error.response?.status === 500) {
      throw new Error("Server error occurred")
    } else if (error.message === "Invalid shift ID") {
      throw error
    } else {
      throw new Error("Failed to fetch shift")
    }
  }
}

export async function createShift(shiftData: Partial<Shift>): Promise<Shift> {
  try {
    const response = await apiClient.post("/shifts", shiftData)
    return response.data
  } catch (error: any) {
    console.error("Error creating shift:", error)
    throw new Error(error.response?.data?.message || "Failed to create shift")
  }
}

export async function updateShift(id: string, shiftData: Partial<Shift>): Promise<Shift> {
  try {
    const response = await apiClient.patch(`/shifts/${id}`, shiftData)
    return response.data
  } catch (error: any) {
    console.error("Error updating shift:", error)
    throw new Error(error.response?.data?.message || "Failed to update shift")
  }
}

export async function deleteShift(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/shifts/${id}`)
    return true
  } catch (error) {
    console.error(`Error deleting shift ${id}:`, error)
    return false
  }
}

export async function clockIn(clientId: string, notes?: string): Promise<Shift> {
  try {
    const response = await apiClient.post("/shifts/clock-in", { clientId, notes })
    return response.data
  } catch (error: any) {
    console.error("Error clocking in:", error)
    throw new Error(error.response?.data?.message || "Failed to clock in")
  }
}

export async function clockOut(notes?: string): Promise<Shift> {
  try {
    const response = await apiClient.post("/shifts/clock-out", { notes })
    return response.data
  } catch (error: any) {
    console.error("Error clocking out:", error)
    throw new Error(error.response?.data?.message || "Failed to clock out")
  }
}

export async function getCurrentShift(): Promise<Shift | null> {
  try {
    const response = await apiClient.get("/shifts/current")
    return response.data
  } catch (error) {
    console.error("Error fetching current shift:", error)
    return null
  }
}

export async function fetchRecentShifts(limit = 5): Promise<Shift[]> {
  try {
    const response = await apiClient.get("/shifts", {
      params: {
        limit,
        sort: "date:desc",
      },
    })

    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data.slice(0, limit)
    }

    if (response.data && response.data.shifts) {
      return response.data.shifts
    }

    if (response.data && response.data.data) {
      return response.data.data
    }

    return []
  } catch (error) {
    console.error("Error fetching recent shifts:", error)
    return []
  }
}
