import { apiClient } from "./api-client"
import type { Client } from "@/types/client"

export async function fetchClients(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<{ clients: Client[]; total: number; page: number; limit: number }> {
  try {
    const response = await apiClient.get("/clients", { params })

    // Ensure we always return the expected structure
    return {
      clients: response.data?.clients || response.data?.data || response.data || [],
      total: response.data?.total || response.data?.meta?.total || 0,
      page: response.data?.page || response.data?.meta?.page || params?.page || 1,
      limit: response.data?.limit || response.data?.meta?.limit || params?.limit || 10,
    }
  } catch (error) {
    console.error("Error fetching clients:", error)
    // Return safe defaults on error
    return {
      clients: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 10,
    }
  }
}

export async function fetchClient(id: string): Promise<Client> {
  try {
    const response = await apiClient.get(`/clients/${id}`)
    return response.data
  } catch (error: any) {
    console.error(`Error fetching client ${id}:`, error)

    // Re-throw with more context
    if (error.response?.status === 404) {
      throw new Error("Client not found")
    } else if (error.response?.status === 500) {
      throw new Error("Server error occurred")
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout")
    } else {
      throw new Error("Failed to fetch client")
    }
  }
}

export async function createClient(clientData: Partial<Client>): Promise<Client> {
  try {
    const response = await apiClient.post("/clients", clientData)
    return response.data
  } catch (error: any) {
    console.error("Error creating client:", error)
    throw new Error(error.response?.data?.message || "Failed to create client")
  }
}

export async function updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
  try {
    const response = await apiClient.patch(`/clients/${id}`, clientData)
    return response.data
  } catch (error: any) {
    console.error("Error updating client:", error)
    throw new Error(error.response?.data?.message || "Failed to update client")
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/clients/${id}`)
    return true
  } catch (error: any) {
    console.error(`Error deleting client ${id}:`, error)
    return false
  }
}