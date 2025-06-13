"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { MileageTableActions } from "@/components/mileage/mileage-table-actions"
import { cn } from "@/lib/utils"
import type { MileageEntry } from "@/types/mileage"
import type { Client } from "@/types/client"
import { fetchMileageEntries } from "@/lib/api/mileage"
import { fetchClients } from "@/lib/api/clients"

export default function MileagePage() {
  const [entries, setEntries] = useState<MileageEntry[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  // Filters
  const [clientId, setClientId] = useState<string>("all")
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
        const { clients } = await fetchClients({ limit: 100 })
        setClients(clients)
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      }
    }

    getClients()
  }, [])

  const getMileageEntries = async () => {
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

      if (dateRange.from) {
        params.startDate = format(dateRange.from, "yyyy-MM-dd")
      }

      if (dateRange.to) {
        params.endDate = format(dateRange.to, "yyyy-MM-dd")
      }

      const response = await fetchMileageEntries(params)

      // Handle different response structures
      if (Array.isArray(response)) {
        setEntries(response)
        setTotalPages(1)
      } else if (response && typeof response === "object") {
        const entriesData = response.entries || response.data || []
        const total = response.total || 0
        setEntries(Array.isArray(entriesData) ? entriesData : [])
        setTotalPages(Math.ceil(total / limit))
      } else {
        setEntries([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Failed to fetch mileage entries:", error)
      setError("Failed to load mileage entries. Please try again.")
      setEntries([])
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getMileageEntries()
  }, [page, clientId, dateRange])

  const resetFilters = () => {
    setClientId("all")
    setDateRange({ from: undefined, to: undefined })
    setPage(1)
  }

  const handleEntryDeleted = (id: string) => {
    setEntries((prevEntries) => (prevEntries ? prevEntries.filter((entry) => entry.id !== id) : []))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mileage</h1>
        <Button asChild>
          <Link href="/mileage/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Mileage
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
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
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
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead>Reimbursement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-red-600">{error}</p>
                    <Button variant="outline" onClick={getMileageEntries}>
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading mileage entries...
                </TableCell>
              </TableRow>
            ) : entries && entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No mileage entries found. Try different filters or{" "}
                  <Link href="/mileage/new" className="text-primary underline-offset-4 hover:underline">
                    add a new mileage entry
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{entry.clientName}</TableCell>
                  <TableCell>{entry.distance.toFixed(1)}</TableCell>
                  <TableCell>${entry.totalReimbursement.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <MileageTableActions entry={entry} onEntryDeleted={() => handleEntryDeleted(entry.id)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  )
}
