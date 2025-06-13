export interface MileageEntry {
  id: string
  clientId: string
  clientName?: string
  date: string
  distance: number
  notes?: string
  mileageRate: number
  totalReimbursement: number
  invoiceId?: string
  createdAt: string
  updatedAt: string
}