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
import { ShiftsTableActions } from "@/components/shifts/shifts-table-actions"
import { cn } from "@/lib/utils"
import type { Shift } from "@/types/shift"
import type { Client } from "@/types/client"
import { fetchShifts } from "@/lib/api/shifts"
import { fetchClients } from "@/lib/api/clients"

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
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
    const getShifts = async () => {
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

        const response = await fetchShifts(params)

        // Handle different response structures
        const shiftsData = response?.shifts || []
        const totalItems = response?.total || 0

        setShifts(shiftsData)
        setTotalPages(Math.ceil(totalItems / limit) || 1)
      } catch (error) {
        console.error("Failed to fetch shifts:", error)
        setError("Failed to load shifts. Please try again.")
        setShifts([])
      } finally {
        setIsLoading(false)
      }
    }

    getShifts()
  }, [page, clientId, dateRange])

  const resetFilters = () => {
    setClientId("all")
    setDateRange({ from: undefined, to: undefined })
    setPage(1)
  }

  const handleShiftDeleted = (id: string) => {
    setShifts(shifts.filter((shift) => shift.id !== id))
  }

  const handleRetry = () => {
    setPage(1)
    // This will trigger the useEffect to fetch shifts again
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shifts</h1>
        <Button asChild>
          <Link href="/shifts/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Shift
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
              <TableHead>Hours</TableHead>
              <TableHead>Earnings</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading shifts...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-red-500">{error}</p>
                    <Button variant="outline" onClick={handleRetry}>
                      Try Again
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : shifts && shifts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No shifts found. Try different filters or{" "}
                  <Link href="/shifts/new" className="text-primary underline-offset-4 hover:underline">
                    add a new shift
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              shifts &&
              shifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell>{format(new Date(shift.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{shift.clientName}</TableCell>
                  <TableCell>{shift.totalHours.toFixed(1)}</TableCell>
                  <TableCell>${shift.totalEarnings.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <ShiftsTableActions shift={shift} onShiftDeleted={() => handleShiftDeleted(shift.id)} />
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
