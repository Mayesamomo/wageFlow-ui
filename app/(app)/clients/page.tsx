"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientsTableActions } from "@/components/clients/clients-table-actions"
import type { Client } from "@/types/client"
import { fetchClients } from "@/lib/api/clients"
import { Pagination } from "@/components/ui/pagination"

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    const getClients = async () => {
      setIsLoading(true)
      try {
        const response = await fetchClients({
          page,
          limit,
          search: searchQuery || undefined,
        })

        // Safely access the clients array
        setClients(response.clients || [])
        setTotalPages(Math.ceil((response.total || 0) / limit))
      } catch (error) {
        console.error("Failed to fetch clients:", error)
        // Set safe defaults on error
        setClients([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    getClients()
  }, [page, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading clients...
                </TableCell>
              </TableRow>
            ) : clients && clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No clients found. Try a different search or{" "}
                  <Link href="/clients/new" className="text-primary underline-offset-4 hover:underline">
                    add a new client
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.city}</TableCell>
                  <TableCell className="text-right">
                    <ClientsTableActions
                      client={client}
                      onClientDeleted={() => {
                        // Refresh the client list after deletion
                        setClients(clients.filter((c) => c.id !== client.id))
                      }}
                    />
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
