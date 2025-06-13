"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { Client } from "@/types/client"
import type { Shift } from "@/types/shift"
import type { MileageEntry } from "@/types/mileage"
import { createInvoice } from "@/lib/api/invoices"
import { fetchClients } from "@/lib/api/clients"
import { fetchShifts } from "@/lib/api/shifts"
import { fetchMileageEntries } from "@/lib/api/mileage"

const invoiceFormSchema = z.object({
  clientId: z.string({
    required_error: "Please select a client",
  }),
  issueDate: z.date({
    required_error: "Please select an issue date",
  }),
  dueDate: z.date({
    required_error: "Please select a due date",
  }),
  shifts: z.array(z.string()).optional(),
  mileageEntries: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

export function InvoiceForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([])
  const [availableMileage, setAvailableMileage] = useState<MileageEntry[]>([])
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([])
  const [selectedMileage, setSelectedMileage] = useState<MileageEntry[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [hstAmount, setHstAmount] = useState(0)
  const [total, setTotal] = useState(0)

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      shifts: [],
      mileageEntries: [],
      notes: "",
    },
  })

  // Watch client ID to load shifts and mileage
  const watchedClientId = form.watch("clientId")

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

  useEffect(() => {
    if (!watchedClientId) {
      setAvailableShifts([])
      setAvailableMileage([])
      return
    }

    const getClientData = async () => {
      try {
        // Fetch unbilled shifts for this client
        const { shifts } = await fetchShifts({
          clientId: watchedClientId,
          limit: 100,
        })
        setAvailableShifts(shifts.filter((shift) => !shift.invoiceId))

        // Fetch unbilled mileage for this client
        const { entries } = await fetchMileageEntries({
          clientId: watchedClientId,
          limit: 100,
        })
        setAvailableMileage(entries.filter((entry) => !entry.invoiceId))
      } catch (error) {
        console.error("Failed to fetch client data:", error)
      }
    }

    getClientData()
  }, [watchedClientId])

  // Calculate totals when selected items change
  useEffect(() => {
    // Calculate shift subtotal
    const shiftSubtotal = selectedShifts.reduce((sum, shift) => sum + shift.totalEarnings, 0)

    // Calculate mileage subtotal
    const mileageSubtotal = selectedMileage.reduce((sum, entry) => sum + entry.totalReimbursement, 0)

    // Calculate HST
    const shiftHst = selectedShifts.reduce((sum, shift) => sum + shift.hstAmount, 0)

    const subtotalAmount = shiftSubtotal + mileageSubtotal
    const hstAmount = shiftHst
    const totalAmount = subtotalAmount + hstAmount

    setSubtotal(subtotalAmount)
    setHstAmount(hstAmount)
    setTotal(totalAmount)
  }, [selectedShifts, selectedMileage])

  const handleShiftToggle = (shift: Shift, checked: boolean) => {
    if (checked) {
      setSelectedShifts([...selectedShifts, shift])
      const currentShifts = form.getValues("shifts") || []
      form.setValue("shifts", [...currentShifts, shift.id])
    } else {
      setSelectedShifts(selectedShifts.filter((s) => s.id !== shift.id))
      const currentShifts = form.getValues("shifts") || []
      form.setValue(
        "shifts",
        currentShifts.filter((id) => id !== shift.id),
      )
    }
  }

  const handleMileageToggle = (entry: MileageEntry, checked: boolean) => {
    if (checked) {
      setSelectedMileage([...selectedMileage, entry])
      const currentEntries = form.getValues("mileageEntries") || []
      form.setValue("mileageEntries", [...currentEntries, entry.id])
    } else {
      setSelectedMileage(selectedMileage.filter((e) => e.id !== entry.id))
      const currentEntries = form.getValues("mileageEntries") || []
      form.setValue(
        "mileageEntries",
        currentEntries.filter((id) => id !== entry.id),
      )
    }
  }

  async function onSubmit(data: InvoiceFormValues) {
    if (selectedShifts.length === 0 && selectedMileage.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one shift or mileage entry for this invoice.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const invoiceData = {
        ...data,
        issueDate: format(data.issueDate, "yyyy-MM-dd"),
        dueDate: format(data.dueDate, "yyyy-MM-dd"),
        subtotal,
        hstAmount,
        total,
        status: "draft",
      }

      const invoice = await createInvoice(invoiceData)

      toast({
        title: "Invoice created",
        description: `Invoice #${invoice.invoiceNumber} has been created successfully.`,
      })

      // Navigate to the invoice detail page
      router.push(`/invoices/${invoice.id}`)
    } catch (error) {
      console.error("Failed to create invoice:", error)

      toast({
        title: "Error",
        description: "There was an error creating the invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
        <CardDescription>
          Create a new invoice by selecting a client and adding shifts and mileage entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
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

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Issue Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Shifts</h3>
              {availableShifts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No unbilled shifts available for this client.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="w-12 px-4 py-3 text-center text-sm font-medium"></th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Hours</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {availableShifts.map((shift) => (
                        <tr key={shift.id} className="divide-x divide-border">
                          <td className="px-4 py-3 text-center">
                            <Checkbox onCheckedChange={(checked) => handleShiftToggle(shift, !!checked)} />
                          </td>
                          <td className="px-4 py-3 text-sm">{format(new Date(shift.date), "MMM d, yyyy")}</td>
                          <td className="px-4 py-3 text-sm">{shift.totalHours.toFixed(1)}</td>
                          <td className="px-4 py-3 text-right text-sm">${shift.totalEarnings.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Mileage</h3>
              {availableMileage.length === 0 ? (
                <p className="text-sm text-muted-foreground">No unbilled mileage entries available for this client.</p>
              ) : (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="divide-x divide-border">
                        <th className="w-12 px-4 py-3 text-center text-sm font-medium"></th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Distance</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {availableMileage.map((entry) => (
                        <tr key={entry.id} className="divide-x divide-border">
                          <td className="px-4 py-3 text-center">
                            <Checkbox onCheckedChange={(checked) => handleMileageToggle(entry, !!checked)} />
                          </td>
                          <td className="px-4 py-3 text-sm">{format(new Date(entry.date), "MMM d, yyyy")}</td>
                          <td className="px-4 py-3 text-sm">{entry.distance.toFixed(1)} km</td>
                          <td className="px-4 py-3 text-right text-sm">${entry.totalReimbursement.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information for this invoice..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>HST:</span>
                <span className="font-medium">${hstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>

            <CardFooter className="px-0 pb-0">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Invoice"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
