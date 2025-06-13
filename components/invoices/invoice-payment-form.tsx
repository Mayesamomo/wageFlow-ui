"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import type { Invoice } from "@/types/invoice"
import { markInvoiceAsPaid, uploadPaymentProof } from "@/lib/api/invoices"

const paymentFormSchema = z.object({
  paymentDate: z.date({
    required_error: "Please select a payment date",
  }),
  paymentProof: z.instanceof(FileList).optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface InvoicePaymentFormProps {
  invoice: Invoice
  onInvoiceUpdated: (invoice: Invoice) => void
}

export function InvoicePaymentForm({ invoice, onInvoiceUpdated }: InvoicePaymentFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentDate: new Date(),
    },
  })

  async function onSubmit(data: PaymentFormValues) {
    setIsLoading(true)
    try {
      // Mark invoice as paid
      const updatedInvoice = await markInvoiceAsPaid(invoice.id, format(data.paymentDate, "yyyy-MM-dd"))

      // Upload payment proof if provided
      if (data.paymentProof && data.paymentProof.length > 0) {
        const file = data.paymentProof[0]
        await uploadPaymentProof(invoice.id, file)
      }

      toast({
        title: "Invoice marked as paid",
        description: `Invoice #${invoice.invoiceNumber} has been marked as paid.`,
      })

      onInvoiceUpdated(updatedInvoice)
    } catch (error) {
      console.error("Failed to mark invoice as paid:", error)

      toast({
        title: "Error",
        description: "There was an error marking the invoice as paid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mark as Paid</CardTitle>
        <CardDescription>Record payment information for this invoice</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Payment Date</FormLabel>
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
              name="paymentProof"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Payment Proof (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => onChange(e.target.files)}
                      {...rest}
                    />
                  </FormControl>
                  <FormDescription>Upload a receipt or proof of payment (PDF or image)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Mark as Paid"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
