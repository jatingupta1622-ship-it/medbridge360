'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hospital } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { InlineLoader } from '@/components/ui/LoadingScreen'

function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const idsParam = searchParams.get('ids') || ''
  
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true)
      const ids = idsParam ? idsParam.split(',').filter(Boolean) : []
      
      if (ids.length === 0) {
        // Load from localStorage or all
        const stored = localStorage.getItem('compareIds')
        if (stored) {
          const storedIds = JSON.parse(stored)
          if (storedIds.length >= 2) {
            router.replace(`/compare?ids=${storedIds.join(',')}`)
            return
          }
        }
        // Fetch all hospitals to let user pick
        const res = await fetch('/api/hospitals')
        const data = await res.json()
        setHospitals(data.hospitals?.slice(0, 4) || [])
        setLoading(false)
        return
      }

      try {
        const results = await Promise.all(
          ids.map(id => fetch(`/api/hospital/${id}`).then(r => r.json()))
        )
        setHospitals(results.map(r => r.hospital).filter(Boolean))
      } catch {
        setHospitals([])
      } finally {
        setLoading(false)
      }
    }
    fetchHospitals()
  }, [idsParam, router])

  if (loading) return <div className="min-h-screen pt-16"><InlineLoader /></div>

  if (hospitals.length < 2) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Select Hospitals to Compare</h2>
          <p className="text-slate-500 mb-6">Select at least 2 hospitals from the results page to compare them side by side.</p>
          <Link
            href="/results"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Browse Hospitals
          </Link>
        </div>
      </div>
    )
  }

  // Find lowest costs and highest rating for highlighting
  const getTotalCost = (h: Hospital) => {
    const t = h.treatments[0]
    if (!t) return Infinity
    return t.baseCost + t.surgeryCost + t.medicationCost + t.hospitalStayCost
  }

  const lowestCostId = hospitals.reduce((min, h) => getTotalCost(h) < getTotalCost(min) ? h : min, hospitals[0]).id
  const highestRatingId = hospitals.reduce((max, h) => h.rating > max.rating ? h : max, hospitals[0]).id

  const rows = [
    { label: 'Rating', getValue: (h: Hospital) => `${h.rating} ★`, isHighest: (h: Hospital) => h.id === highestRatingId, format: 'text' as const },
    { label: 'Base Cost', getValue: (h: Hospital) => h.treatments[0]?.baseCost || 0, format: 'currency' as const },
    { label: 'Surgery Cost', getValue: (h: Hospital) => h.treatments[0]?.surgeryCost || 0, format: 'currency' as const },
    { label: 'Medication Cost', getValue: (h: Hospital) => h.treatments[0]?.medicationCost || 0, format: 'currency' as const },
    { label: 'Hospital Stay', getValue: (h: Hospital) => h.treatments[0]?.hospitalStayCost || 0, format: 'currency' as const },
    { label: 'Total Cost', getValue: (h: Hospital) => getTotalCost(h), isLowest: (h: Hospital) => h.id === lowestCostId, format: 'currency' as const, bold: true },
    { label: 'Duration (Days)', getValue: (h: Hospital) => h.treatments[0]?.durationDays || 'N/A', format: 'text' as const },
  ]

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Hospital Comparison</h1>
            <p className="text-slate-500">Comparing {hospitals.length} hospitals side by side</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/results"
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition-colors"
            >
              ← Edit Selection
            </Link>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200"></div>
            <span className="text-slate-600">Lowest Total Cost</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-200"></div>
            <span className="text-slate-600">Highest Rating</span>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <th className="text-left px-6 py-4 text-white font-bold text-sm w-40">Feature</th>
                  {hospitals.map((h) => (
                    <th key={h.id} className="px-6 py-4 text-center text-white">
                      <div className="flex flex-col items-center gap-2">
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white/30"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&q=80'
                          }}
                        />
                        <div>
                          <p className="font-bold text-sm leading-tight">{h.name}</p>
                          <p className="text-blue-200 text-xs mt-0.5">{h.city}, {h.country}</p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={row.label} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600 border-r border-slate-100">{row.label}</td>
                    {hospitals.map((h) => {
                      const value = row.getValue(h)
                      const displayValue = row.format === 'currency' && typeof value === 'number'
                        ? formatCurrency(value)
                        : String(value)
                      
                      const isLowest = row.isLowest?.(h)
                      const isHighestR = row.isHighest?.(h)
                      
                      let cellClass = 'px-6 py-4 text-center text-sm '
                      if (isLowest) cellClass += 'highlight-lowest '
                      else if (isHighestR) cellClass += 'highlight-rating '
                      else cellClass += 'text-slate-700 '
                      if (row.bold) cellClass += 'font-black text-base '

                      return (
                        <td key={h.id} className={cellClass}>
                          {displayValue}
                          {isLowest && <span className="block text-xs font-medium mt-0.5 text-green-600">Best Price</span>}
                          {isHighestR && <span className="block text-xs font-medium mt-0.5 text-amber-600">Top Rated</span>}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                {/* Action Row */}
                <tr className="bg-slate-50 border-t border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-600 border-r border-slate-100">Actions</td>
                  {hospitals.map((h) => (
                    <td key={h.id} className="px-6 py-4 text-center">
                      <Link
                        href={`/hospital/${h.id}`}
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation Banner */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-1">Need personalized advice?</h3>
              <p className="text-slate-600 text-sm">Our AI assistant can help you analyze these options based on your budget, treatment urgency, and preferences. Click the chat button below!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16"><InlineLoader /></div>}>
      <CompareContent />
    </Suspense>
  )
}
