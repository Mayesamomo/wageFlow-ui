import { apiClient } from "./api-client"

export async function exportData(data: {
  type: "shifts" | "invoices" | "mileages" | "expenses"
  format: "pdf" | "excel"
  startDate?: string
  endDate?: string
  clientId?: string
  ids?: string[]
}): Promise<Blob> {
  const response = await apiClient.post("/exports", data, {
    responseType: "blob",
  })
  return response.data
}

export async function getTaxSummary(year: number): Promise<any> {
  const response = await apiClient.get(`/exports/tax-summary/${year}`)
  return response.data
}

export async function exportTaxReport(year: number): Promise<Blob> {
  const response = await apiClient.post(
    `/exports/tax-report/${year}`,
    {},
    {
      responseType: "blob",
    },
  )
  return response.data
}
