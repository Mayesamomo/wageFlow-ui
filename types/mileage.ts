export interface MileageEntry {
  id: string
  clientId: string
  clientName?: string
  date: string
  distance: number
  notes?: string
  mileageRate: number
  totalReimbursement: number
  createdAt: string
  updatedAt: string
}
