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
import { useToast } from "@/components/ui/use-toast"
import type { MileageEntry } from "@/types/mileage"
import type { Client } from "@/types/client"
import { createMileageEntry, updateMileageEntry } from "@/lib/api/mileage"
import { fetchClients } from "@/lib/api/clients"
import { useAuth } from "@/lib/auth/auth-provider"

const mileageFormSchema = z.object({
  clientId: z.string({
    required_error: "Please select a client",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  distance: z.coerce.number().min(0, {
    message: "Distance must be a positive number",
  }),
  mileageRate: z.coerce.number().min(0, {
    message: "Mileage rate must be a positive number",
  }),
  notes: z.string().optional(),
})

type MileageFormValues = z.infer<typeof mileageFormSchema>

interface MileageFormProps {
  mileageEntry?: MileageEntry
}

export function MileageForm({ mileageEntry }: MileageFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [totalReimbursement, setTotalReimbursement] = useState(0)

  const form = useForm<MileageFormValues>({
    resolver: zodResolver(mileageFormSchema),
    defaultValues: {
      clientId: mileageEntry?.clientId || "",
      date: mileageEntry ? new Date(mileageEntry.date) : new Date(),
      distance: mileageEntry?.distance || 0,
      mileageRate: mileageEntry?.mileageRate || user?.mileageRate || 0,
      notes: mileageEntry?.notes || "",
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

  // Calculate total reimbursement when form values change
  useEffect(() => {
    const { distance, mileageRate } = watchedValues
    const reimbursement = (distance || 0) * (mileageRate || 0)
    setTotalReimbursement(reimbursement)
  }, [watchedValues])

  async function onSubmit(data: MileageFormValues) {
    setIsLoading(true)
    try {
      const mileageData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
        totalReimbursement,
      }

      if (mileageEntry) {
        // Update existing mileage entry
        await updateMileageEntry(mileageEntry.id, mileageData)
        toast({
          title: "Mileage entry updated",
          description: `Mileage entry on ${format(data.date, "MMM dd, yyyy")} has been updated successfully.`,
        })
      } else {
        // Create new mileage entry
        await createMileageEntry(mileageData)
        toast({
          title: "Mileage entry created",
          description: `Mileage entry on ${format(data.date, "MMM dd, yyyy")} has been added successfully.`,
        })
      }

      // Navigate back to mileage list
      router.push("/mileage")
      router.refresh()
    } catch (error) {
      console.error("Failed to save mileage entry:", error)

      toast({
        title: "Error",
        description: "There was an error saving the mileage entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Add Mileage Entry</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="h-12 w-full justify-start bg-background pl-3 text-left font-normal"
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
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" min="0" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileageRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-border p-4">
            <div className="flex justify-between">
              <span>Total Reimbursement:</span>
              <span className="font-medium">${totalReimbursement.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Saving..." : "Save Mileage Entry"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
