import type { User } from "@/types/user"
import { apiClient } from "./api-client"

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
  })
  return response.data
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/login", { email, password })
  return response.data
}

export async function refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await apiClient.post("/auth/refresh-token", { refreshToken: token })
  return response.data
}

export async function logout(token: string): Promise<void> {
  await apiClient.post("/auth/logout", { refreshToken: token })
}

export async function verifyEmail(token: string): Promise<void> {
  await apiClient.post("/auth/verify-email", { token })
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await apiClient.post("/auth/forgot-password", { email })
  return response.data
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await apiClient.post("/auth/reset-password", { token, password })
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  const response = await apiClient.post("/auth/resend-verification", { email })
  return response.data
}
