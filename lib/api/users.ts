import { apiClient } from "./api-client"
import type { User } from "@/types/user"

export async function fetchUserProfile(): Promise<User> {
  const response = await apiClient.get("/users/profile")
  return response.data
}

export async function updateUserProfile(userData: Partial<User>): Promise<User> {
  const response = await apiClient.patch("/users/profile", userData)
  return response.data
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    await apiClient.put("/users/change-password", {
      currentPassword,
      newPassword,
    })
  } catch (error: any) {
    console.error("Error changing password:", error)
    throw new Error(error.response?.data?.message || "Failed to change password")
  }
}

export async function deleteUserAccount(): Promise<void> {
  try {
    await apiClient.delete("/users/profile")
  } catch (error: any) {
    console.error("Error deleting user account:", error)
    throw new Error(error.response?.data?.message || "Failed to delete account")
  }
}
