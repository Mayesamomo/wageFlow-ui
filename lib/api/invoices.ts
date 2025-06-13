import { apiClient } from "./api-client"
import type { Invoice } from "@/types/invoice"

export async function fetchInvoices(params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  clientId?: string
  status?: string
}): Promise<{ invoices: Invoice[]; total: number; page: number; limit: number }> {
  try {
    const response = await apiClient.get("/invoices", { params })

    // Handle different response structures
    if (response.data.invoices) {
      return response.data
    } else if (Array.isArray(response.data)) {
      return {
        invoices: response.data,
        total: response.data.length,
        page: params?.page || 1,
        limit: params?.limit || 10,
      }
    } else {
      return {
        invoices: response.data.data || [],
        total: response.data.total || response.data.meta?.total || 0,
        page: params?.page || 1,
        limit: params?.limit || 10,
      }
    }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return {
      invoices: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
    }
  }
}

export async function fetchInvoice(id: string): Promise<Invoice | null> {
  try {
    const response = await apiClient.get(`/invoices/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching invoice ${id}:`, error)
    return null
  }
}

export async function createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const response = await apiClient.post("/invoices", invoiceData)
    return response.data
  } catch (error: any) {
    console.error("Error creating invoice:", error)
    throw new Error(error.response?.data?.message || "Failed to create invoice")
  }
}

export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  try {
    const response = await apiClient.patch(`/invoices/${id}`, invoiceData)
    return response.data
  } catch (error: any) {
    console.error("Error updating invoice:", error)
    throw new Error(error.response?.data?.message || "Failed to update invoice")
  }
}

export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/invoices/${id}`)
    return true
  } catch (error) {
    console.error(`Error deleting invoice ${id}:`, error)
    return false
  }
}

export async function markInvoiceAsPaid(id: string, paymentDate: string): Promise<Invoice> {
  try {
    const response = await apiClient.patch(`/invoices/${id}/mark-as-paid`, { paymentDate })
    return response.data
  } catch (error: any) {
    console.error("Error marking invoice as paid:", error)
    throw new Error(error.response?.data?.message || "Failed to mark invoice as paid")
  }
}

export async function uploadPaymentProof(id: string, file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await apiClient.post(`/invoices/${id}/payment-proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data.url
  } catch (error: any) {
    console.error("Error uploading payment proof:", error)
    throw new Error(error.response?.data?.message || "Failed to upload payment proof")
  }
}

export async function getPaymentProofUrl(id: string): Promise<string> {
  try {
    const response = await apiClient.get(`/invoices/${id}/payment-proof`)
    return response.data.url
  } catch (error: any) {
    console.error("Error getting payment proof URL:", error)
    throw new Error(error.response?.data?.message || "Failed to get payment proof")
  }
}

export async function sendInvoice(id: string, email?: string): Promise<void> {
  try {
    await apiClient.post(`/invoices/${id}/send`, { email })
  } catch (error: any) {
    console.error("Error sending invoice:", error)
    throw new Error(error.response?.data?.message || "Failed to send invoice")
  }
}

export async function downloadInvoicePdf(id: string): Promise<Blob> {
  try {
    const response = await apiClient.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    })
    return response.data
  } catch (error: any) {
    console.error("Error downloading invoice PDF:", error)
    throw new Error(error.response?.data?.message || "Failed to download invoice PDF")
  }
}

export async function fetchUpcomingInvoices(limit = 5): Promise<Invoice[]> {
  try {
    const response = await apiClient.get("/invoices", {
      params: {
        limit,
        status: "sent,overdue",
        sort: "dueDate:asc",
      },
    })

    if (response.data.invoices) {
      return response.data.invoices
    } else if (Array.isArray(response.data)) {
      return response.data
    } else {
      return response.data.data || []
    }
  } catch (error) {
    console.error("Error fetching upcoming invoices:", error)
    return []
  }
}