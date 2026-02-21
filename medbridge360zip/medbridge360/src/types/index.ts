export interface Hospital {
  id: string
  name: string
  city: string
  state: string
  country: string
  rating: number
  imageUrl: string
  description: string
  latitude: number
  longitude: number
  treatments: Treatment[]
  createdAt: string
  updatedAt: string
}

export interface Treatment {
  id: string
  hospitalId: string
  treatmentName: string
  baseCost: number
  surgeryCost: number
  medicationCost: number
  hospitalStayCost: number
  durationDays: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface HospitalWithMinCost extends Hospital {
  minCost?: number
  matchedTreatment?: Treatment
}
