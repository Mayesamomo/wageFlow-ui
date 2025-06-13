import { apiClient } from "./api-client"
import type { User } from "@/types/user"

export async function fetchUserProfile(): Promise<User> {
  try {
    const response = await apiClient.get("/users/profile")
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch user profile")
  }
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.patch("/users/profile", userData)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update profile")
  }
}
