import { apiClient } from "./api-client"

export interface DashboardStats {
  totalHours: number
  totalEarnings: number
  totalMileage: number
  pendingInvoices: number
}

export interface EarningsDataPoint {
  date: string
  earnings: number
  hours: number
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get("/dashboard")
    return response.data
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return default values on error
    return {
      totalHours: 0,
      totalEarnings: 0,
      totalMileage: 0,
      pendingInvoices: 0,
    }
  }
}

export async function fetchEarningsData(): Promise<EarningsDataPoint[]> {
  try {
    const response = await apiClient.get("/dashboard")
    // Extract earnings chart data from dashboard response
    return response.data.earningsChart || []
  } catch (error) {
    console.error("Error fetching earnings data:", error)
    return []
  }
}