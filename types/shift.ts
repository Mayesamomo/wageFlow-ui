export interface Shift {
  id: string
  clientId: string
  clientName?: string
  date: string
  startTime: string
  endTime: string
  breakDuration: number
  notes?: string
  hourlyRate: number
  totalHours: number
  totalEarnings: number
  hstAmount: number
  createdAt: string
  updatedAt: string
}
