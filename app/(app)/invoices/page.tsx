"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { InvoicesTableActions } from "@/components/invoices/invoices-table-actions"
import { cn } from "@/lib/utils"
import type { Invoice } from "@/types/invoice"
import type { Client } from "@/types/client"
import { fetchInvoices } from "@/lib/api/invoices"
import { fetchClients } from "@/lib/api/clients"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Filters
  const [clientId, setClientId] = useState<string>("all")
  const [status, setStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await fetchClients({ limit: 100 })
        setClients(response?.clients || [])
      } catch (error) {
        console.error("Failed to fetch clients:", error)
        setClients([])
      }
    }

    getClients()
  }, [])

  useEffect(() => {
    const getInvoices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params: any = {
          page,
          limit,
        }

        if (clientId !== "all") {
          params.clientId = clientId
        }

        if (status !== "all") {
          params.status = status
        }

        if (dateRange.from) {
          params.startDate = format(dateRange.from, "yyyy-MM-dd")
        }

        if (dateRange.to) {
          params.endDate = format(dateRange.to, "yyyy-MM-dd")
        }

        const response = await fetchInvoices(params)
        setInvoices(response?.invoices || [])
        setTotalPages(Math.ceil((response?.total || 0) / limit))
      } catch (error) {
        console.error("Failed to fetch invoices:", error)
        setError("Failed to load invoices. Please try again later.")
        setInvoices([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    getInvoices()
  }, [page, clientId, status, dateRange])

  const resetFilters = () => {
    setClientId("all")
    setStatus("all")
    setDateRange({ from: undefined, to: undefined })
    setPage(1)
  }

  const handleInvoiceDeleted = (id: string) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id))
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

  const handleRetry = () => {
    setPage(1)
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="grid gap-2">
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              {clients &&
                clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal md:w-[300px]",
                  !dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button variant="ghost" onClick={resetFilters}>
          Reset filters
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading invoices...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-red-500">{error}</p>
                    <Button onClick={handleRetry} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No invoices found. Try different filters or{" "}
                  <Link href="/invoices/new" className="text-primary underline-offset-4 hover:underline">
                    create a new invoice
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{format(new Date(invoice.issueDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</TableCell>
                  <TableCell>${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <InvoicesTableActions invoice={invoice} onInvoiceDeleted={() => handleInvoiceDeleted(invoice.id)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && !error && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
