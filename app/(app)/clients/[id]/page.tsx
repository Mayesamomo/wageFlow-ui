"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ClientForm } from "@/components/clients/client-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Client } from "@/types/client"
import { fetchClient } from "@/lib/api/clients"

export default function EditClientPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // If the ID is "new", redirect to the proper new client page
    if (clientId === "new") {
      router.replace("/clients/new")
      return
    }

    // Validate that we have a proper ID (not empty, not "undefined", etc.)
    if (!clientId || clientId === "undefined" || clientId === "null") {
      setError("Invalid client ID")
      setIsLoading(false)
      return
    }

    const getClient = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchClient(clientId)
        setClient(data)
      } catch (error: any) {
        console.error("Failed to fetch client:", error)

        // Handle different types of errors
        if (error.response?.status === 404) {
          setError("Client not found")
        } else if (error.response?.status === 500) {
          setError("Server error. Please try again later.")
        } else if (error.code === "ECONNABORTED") {
          setError("Request timeout. Please check your connection.")
        } else {
          setError("Failed to load client. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    getClient()
  }, [clientId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading client...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Error Loading Client</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => router.back()}>
                  Go Back
                </Button>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Client Not Found</h3>
              <p className="text-muted-foreground mb-4">The client you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/clients")}>Back to Clients</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Client</h1>
            <p className="text-muted-foreground">Update client information and settings.</p>
          </div>
        </div>
        <ClientForm client={client} />
      </div>
    </div>
  )
}
