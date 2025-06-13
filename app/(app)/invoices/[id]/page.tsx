"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Download, Edit, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { InvoicePaymentForm } from "@/components/invoices/invoice-payment-form"
import type { Invoice } from "@/types/invoice"
import type { Client } from "@/types/client"
import type { Shift } from "@/types/shift"
import type { MileageEntry } from "@/types/mileage"
import { fetchInvoice, updateInvoice } from "@/lib/api/invoices"
import { fetchClient } from "@/lib/api/clients"
import { fetchShift } from "@/lib/api/shifts"
import { fetchMileageEntry } from "@/lib/api/mileage"
import { exportData } from "@/lib/api/exports"

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [shifts, setShifts] = useState<Shift[]>([])
  const [mileageEntries, setMileageEntries] = useState<MileageEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const getInvoiceData = async () => {
      try {
        const invoiceData = await fetchInvoice(invoiceId)
        if (!invoiceData) {
          throw new Error("Invoice not found")
        }
        setInvoice(invoiceData)

        // Fetch client
        if (invoiceData.clientId) {
          const clientData = await fetchClient(invoiceData.clientId)
          setClient(clientData)
        }

        // Fetch shifts
        const shiftsData = await Promise.all((invoiceData.shifts || []).map((shiftId) => fetchShift(shiftId)))
        setShifts(shiftsData.filter(Boolean) as Shift[])

        // Fetch mileage entries
        const mileageData = await Promise.all(
          (invoiceData.mileageEntries || []).map((entryId) => fetchMileageEntry(entryId)),
        )
        setMileageEntries(mileageData.filter(Boolean) as MileageEntry[])
      } catch (error) {
        console.error("Failed to fetch invoice data:", error)
        toast({
          title: "Error",
          description: "Failed to load invoice data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    getInvoiceData()
  }, [invoiceId, toast])

  const handleMarkAsSent = async () => {
    if (!invoice) return

    setIsUpdating(true)
    try {
      const updatedInvoice = await updateInvoice(invoice.id, {
        status: "sent",
      })
      setInvoice(updatedInvoice)
      toast({
        title: "Invoice updated",
        description: "Invoice has been marked as sent.",
      })
    } catch (error) {
      console.error("Failed to update invoice:", error)
      toast({
        title: "Error",
        description: "Failed to update invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExportPdf = async () => {
    if (!invoice) return

    setIsExporting(true)
    try {
      const blob = await exportData({
        type: "invoices",
        format: "pdf",
        ids: [invoice.id],
      })

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF exported",
        description: `Invoice #${invoice.invoiceNumber} has been exported as PDF.`,
      })
    } catch (error) {
      console.error("Error exporting invoice as PDF:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the invoice as PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    if (!invoice) return

    setIsExporting(true)
    try {
      const blob = await exportData({
        type: "invoices",
        format: "excel",
        ids: [invoice.id],
      })

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${invoice.invoiceNumber}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Excel exported",
        description: `Invoice #${invoice.invoiceNumber} has been exported as Excel.`,
      })
    } catch (error) {
      console.error("Error exporting invoice as Excel:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the invoice as Excel. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "sent":
        return <Badge variant="secondary">Sent</Badge>
      case "paid":
        return <Badge variant="default">Paid</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div>Loading invoice...</div>
  }

  if (!invoice) {
    return <div>Invoice not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          {invoice.status === "draft" && (
            <>
              <Button variant="outline" asChild>
                <a href={`/invoices/${invoice.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </a>
              </Button>
              <Button onClick={handleMarkAsSent} disabled={isUpdating}>
                <Send className="mr-2 h-4 w-4" />
                Mark as Sent
              </Button>
            </>
          )}
          <Button variant="outline" onClick={handleExportPdf} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoice #{invoice.invoiceNumber}</CardTitle>
                <CardDescription>Created on {format(new Date(invoice.issueDate), "MMMM d, yyyy")}</CardDescription>
              </div>
              {getStatusBadge(invoice.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">From</h3>
                <div className="mt-1">
                  <p className="font-medium">Your Name</p>
                  <p>Your Address</p>
                  <p>Your City, Province</p>
                  <p>Your Email</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Bill To</h3>
                {client && (
                  <div className="mt-1">
                    <p className="font-medium">{client.name}</p>
                    <p>{client.address}</p>
                    <p>
                      {client.city}, {client.province} {client.postalCode}
                    </p>
                    <p>{client.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Invoice Date</h3>
                <p className="mt-1">{format(new Date(invoice.issueDate), "MMMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                <p className="mt-1">{format(new Date(invoice.dueDate), "MMMM d, yyyy")}</p>
              </div>
            </div>

            <Separator />

            {shifts.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Shifts</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Hours</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {shifts.map((shift) => (
                        <tr key={shift.id} className="divide-x divide-border">
                          <td className="px-4 py-3 text-sm">{format(new Date(shift.date), "MMM d, yyyy")}</td>
                          <td className="px-4 py-3 text-sm">{shift.totalHours.toFixed(1)}</td>
                          <td className="px-4 py-3 text-sm">${shift.hourlyRate.toFixed(2)}/hr</td>
                          <td className="px-4 py-3 text-right text-sm">${shift.totalEarnings.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {mileageEntries.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Mileage</h3>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Distance</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Rate</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mileageEntries.map((entry) => (
                        <tr key={entry.id} className="divide-x divide-border">
                          <td className="px-4 py-3 text-sm">{format(new Date(entry.date), "MMM d, yyyy")}</td>
                          <td className="px-4 py-3 text-sm">{entry.distance.toFixed(1)} km</td>
                          <td className="px-4 py-3 text-sm">${entry.mileageRate.toFixed(2)}/km</td>
                          <td className="px-4 py-3 text-right text-sm">${entry.totalReimbursement.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-col items-end space-y-2 pt-4">
              <div className="flex w-full justify-between md:w-1/2">
                <span className="font-medium">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex w-full justify-between md:w-1/2">
                <span className="font-medium">HST:</span>
                <span>${invoice.hstAmount.toFixed(2)}</span>
              </div>
              <div className="flex w-full justify-between border-t pt-2 md:w-1/2">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            {invoice.notes && (
              <div className="pt-4">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {invoice.status === "sent" && <InvoicePaymentForm invoice={invoice} onInvoiceUpdated={setInvoice} />}

          {invoice.status === "paid" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Payment Date</h3>
                  <p className="mt-1">
                    {invoice.paymentDate ? format(new Date(invoice.paymentDate), "MMMM d, yyyy") : "N/A"}
                  </p>
                </div>
                {invoice.paymentProofUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Proof</h3>
                    <div className="mt-2">
                      <Button variant="outline" asChild>
                        <a href={invoice.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          View Payment Proof
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
