"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/types/invoice"
import { fetchUpcomingInvoices } from "@/lib/api/invoices"

export function UpcomingInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUpcomingInvoices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchUpcomingInvoices()
        setInvoices(data)
      } catch (error: any) {
        console.error("Failed to fetch upcoming invoices:", error)
        setError(error.response?.data?.message || "Failed to load upcoming invoices")
      } finally {
        setIsLoading(false)
      }
    }

    getUpcomingInvoices()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse rounded-lg border p-3">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No upcoming invoices</h3>
        <p className="text-sm text-muted-foreground mb-4">You don&apos;t have any invoices due soon.</p>
        <Button asChild size="sm">
          <Link href="/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            Create invoice
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{invoice.clientName}</p>
              <div className="flex flex-col sm:flex-row sm:items-center text-xs text-muted-foreground gap-1">
                <span>#{invoice.invoiceNumber}</span>
                <span className="hidden sm:inline">•</span>
                <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right ml-2">
              <span className="font-medium text-sm">${invoice.total.toFixed(2)}</span>
              <Badge variant={getStatusVariant(invoice.status)} className="text-xs">
                {invoice.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/invoices">View all invoices</Link>
        </Button>
      </div>
    </div>
  )
}

function getStatusVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "paid":
      return "default"
    case "sent":
      return "secondary"
    case "draft":
      return "outline"
    case "overdue":
      return "destructive"
    default:
      return "outline"
  }
}
