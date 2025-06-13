"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/types/user"
import { login as loginApi, register as registerApi, logout as logoutApi } from "@/lib/api/auth"
import { toast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          setIsLoading(false)
          return
        }

        // Try to parse user data
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (parseError) {
          console.error("Failed to parse user data:", parseError)
          // Clear invalid data
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect logic
  useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith("/auth")) {
      router.push("/auth/login")
    } else if (!isLoading && user && pathname.startsWith("/auth")) {
      router.push("/dashboard")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, accessToken, refreshToken } = await loginApi(email, password)

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${user.name}`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const { user, accessToken, refreshToken } = await registerApi(firstName, lastName, email, password)

      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(user))

      setUser(user)

      toast({
        title: "Welcome to WageFlow!",
        description: `Account created successfully for ${user.name}`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different credentials",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch (error) {
      console.error("Logout API error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/auth/login")

      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
