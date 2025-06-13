import { apiClient } from "./api-client"

export interface DashboardSummary {
  totalHours: number
  totalEarnings: number
  totalMileage: number
  pendingInvoices: number
  recentShifts: any[]
  upcomingInvoices: any[]
  earningsChart: any[]
  clientSummary: any[]
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiClient.get("/dashboard")
  return response.data
}
