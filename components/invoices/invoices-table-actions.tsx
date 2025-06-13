"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, Edit, FileText, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Invoice } from "@/types/invoice"
import { deleteInvoice } from "@/lib/api/invoices"
import { exportData } from "@/lib/api/exports"

interface InvoicesTableActionsProps {
  invoice: Invoice
  onInvoiceDeleted: () => void
}

export function InvoicesTableActions({ invoice, onInvoiceDeleted }: InvoicesTableActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteInvoice(invoice.id)

      if (success) {
        toast({
          title: "Invoice deleted",
          description: `Invoice #${invoice.invoiceNumber} has been deleted successfully.`,
        })
        onInvoiceDeleted()
      } else {
        throw new Error("Failed to delete invoice")
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)

      toast({
        title: "Error",
        description: "There was an error deleting the invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleExportPdf = async () => {
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/invoices/${invoice.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          {invoice.status === "draft" && (
            <DropdownMenuItem asChild>
              <Link href={`/invoices/${invoice.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportPdf} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportExcel} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete Invoice #{invoice.invoiceNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
