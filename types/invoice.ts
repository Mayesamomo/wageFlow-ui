export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName?: string
  issueDate: string
  dueDate: string
  shifts: string[] // Array of shift IDs
  mileageEntries: string[] // Array of mileage entry IDs
  subtotal: number
  hstAmount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue"
  paymentDate?: string
  paymentProofUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}
