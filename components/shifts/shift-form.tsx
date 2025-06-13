"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { Shift } from "@/types/shift"
import type { Client } from "@/types/client"
import { createShift, updateShift } from "@/lib/api/shifts"
import { fetchClients } from "@/lib/api/clients"
import { useAuth } from "@/lib/auth/auth-provider"

const shiftFormSchema = z.object({
  clientId: z.string({
    required_error: "Please select a client",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please enter a start time",
  }),
  endTime: z.string({
    required_error: "Please enter an end time",
  }),
  breakDuration: z.coerce.number().min(0, {
    message: "Break duration must be a positive number",
  }),
  hourlyRate: z.coerce.number().min(0, {
    message: "Hourly rate must be a positive number",
  }),
  notes: z.string().optional(),
})

type ShiftFormValues = z.infer<typeof shiftFormSchema>

interface ShiftFormProps {
  shift?: Shift
}

export function ShiftForm({ shift }: ShiftFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [hstAmount, setHstAmount] = useState(0)

  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      clientId: shift?.clientId || "",
      date: shift ? new Date(shift.date) : new Date(),
      startTime: shift?.startTime || "09:00",
      endTime: shift?.endTime || "17:00",
      breakDuration: shift?.breakDuration || 30,
      hourlyRate: shift?.hourlyRate || user?.hourlyRate || 0,
      notes: shift?.notes || "",
    },
  })

  // Watch form values to calculate totals
  const watchedValues = form.watch()

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

  // Calculate totals when form values change
  useEffect(() => {
    const { startTime, endTime, breakDuration, hourlyRate } = watchedValues

    if (startTime && endTime) {
      // Parse times
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      // Calculate total minutes
      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute
      let totalMinutes = endMinutes - startMinutes

      // Handle overnight shifts
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60
      }

      // Subtract break
      totalMinutes -= breakDuration || 0

      // Convert to hours
      const hours = Math.max(0, totalMinutes / 60)
      setTotalHours(hours)

      // Calculate earnings
      const earnings = hours * (hourlyRate || 0)
      setTotalEarnings(earnings)

      // Calculate HST
      const hst = (earnings * (user?.hstPercentage || 0)) / 100
      setHstAmount(hst)
    }
  }, [watchedValues, user?.hstPercentage])

  async function onSubmit(data: ShiftFormValues) {
    setIsLoading(true)
    try {
      const shiftData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
        totalHours,
        totalEarnings,
        hstAmount,
      }

      if (shift) {
        // Update existing shift
        await updateShift(shift.id, shiftData)
        toast({
          title: "Shift updated",
          description: `Shift on ${format(data.date, "MMM dd, yyyy")} has been updated successfully.`,
        })
      } else {
        // Create new shift
        await createShift(shiftData)
        toast({
          title: "Shift created",
          description: `Shift on ${format(data.date, "MMM dd, yyyy")} has been added successfully.`,
        })
      }

      // Navigate back to shifts list
      router.push("/shifts")
      router.refresh()
    } catch (error) {
      console.error("Failed to save shift:", error)

      toast({
        title: "Error",
        description: "There was an error saving the shift. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">{shift ? "Edit Shift" : "Add Shift"}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-12 w-full justify-start bg-background pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Select Date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="h-12 bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} className="h-12 bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="breakDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Break Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay per Hour ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes about this shift..."
                    className="min-h-[100px] bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-border p-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Hours:</span>
              <span className="font-medium">{totalHours.toFixed(1)} hours</span>
            </div>
            <div className="flex justify-between">
              <span>Total Earnings:</span>
              <span className="font-medium">${totalEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>HST ({user?.hstPercentage || 0}%):</span>
              <span className="font-medium">${hstAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Saving..." : "Save Shift"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}