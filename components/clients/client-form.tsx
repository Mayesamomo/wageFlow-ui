"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import type { Client } from "@/types/client"
import { createClient, updateClient } from "@/lib/api/clients"

const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  province: z.string().min(2, {
    message: "Province must be at least 2 characters.",
  }),
  postalCode: z.string().min(5, {
    message: "Postal code must be at least 5 characters.",
  }),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

interface ClientFormProps {
  client?: Client
}

export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: client?.name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      address: client?.address || "",
      city: client?.city || "",
      province: client?.province || "",
      postalCode: client?.postalCode || "",
    },
  })

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true)
    try {
      if (client) {
        // Update existing client
        await updateClient(client.id, data)
        toast({
          title: "Client updated",
          description: `${data.name} has been updated successfully.`,
        })
      } else {
        // Create new client
        await createClient(data)
        toast({
          title: "Client created",
          description: `${data.name} has been added successfully.`,
        })
      }

      // Navigate back to clients list
      router.push("/clients")
      router.refresh()
    } catch (error) {
      console.error("Failed to save client:", error)

      toast({
        title: "Error",
        description: "There was an error saving the client. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-3xl font-bold">Add New Client</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client's full name" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client's email address" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client's phone number" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client's full address" {...field} className="h-12 bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Saving..." : "Save Client"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
