export interface Client {
  id: string
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
  email: string
  notes?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt: string
}
