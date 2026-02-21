import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRating(rating: number) {
  return rating.toFixed(1)
}

export function totalCost(treatment: {
  baseCost: number
  surgeryCost: number
  medicationCost: number
  hospitalStayCost: number
}) {
  return treatment.baseCost + treatment.surgeryCost + treatment.medicationCost + treatment.hospitalStayCost
}
