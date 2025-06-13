import { apiClient } from "./api-client"

export interface Expense {
  id: string
  date: string
  amount: number
  category: string
  description: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export async function fetchExpenses(params?: {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  category?: string
}): Promise<{ expenses: Expense[]; total: number; page: number; limit: number }> {
  const response = await apiClient.get("/expenses", { params })
  return response.data
}

export async function fetchExpense(id: string): Promise<Expense> {
  const response = await apiClient.get(`/expenses/${id}`)
  return response.data
}

export async function createExpense(expenseData: Partial<Expense>): Promise<Expense> {
  const response = await apiClient.post("/expenses", expenseData)
  return response.data
}

export async function updateExpense(id: string, expenseData: Partial<Expense>): Promise<Expense> {
  const response = await apiClient.patch(`/expenses/${id}`, expenseData)
  return response.data
}

export async function deleteExpense(id: string): Promise<void> {
  await apiClient.delete(`/expenses/${id}`)
}

export async function uploadReceipt(id: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await apiClient.post(`/expenses/${id}/receipt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data.url
}

export async function getExpenseSummary(year: number): Promise<any> {
  const response = await apiClient.get(`/expenses/summary/${year}`)
  return response.data
}

export async function getTotalExpenses(year: number): Promise<number> {
  const response = await apiClient.get(`/expenses/total/${year}`)
  return response.data.total
}
