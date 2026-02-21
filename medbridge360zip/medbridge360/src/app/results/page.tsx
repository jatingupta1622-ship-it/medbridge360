'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hospital } from '@/types'
import { HospitalCard } from '@/components/ui/HospitalCard'
import { CardSkeleton } from '@/components/ui/LoadingScreen'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const treatment = searchParams.get('treatment') || ''
  const location = searchParams.get('location') || ''

  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'cost'>('rating')
  const [searchTreatment, setSearchTreatment] = useState(treatment)
  const [searchLocation, setSearchLocation] = useState(location)

  const fetchHospitals = async (t: string, l: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (t) params.set('treatment', t)
      if (l) params.set('location', l)
      const res = await fetch(`/api/hospitals?${params.toString()}`)
      const data = await res.json()
      setHospitals(data.hospitals || [])
    } catch {
      setHospitals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHospitals(treatment, location)
  }, [treatment, location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTreatment) params.set('treatment', searchTreatment)
    if (searchLocation) params.set('location', searchLocation)
    router.push(`/results?${params.toString()}`)
    fetchHospitals(searchTreatment, searchLocation)
  }

  const toggleCompare = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    )
  }

  const goToCompare = () => {
    if (selectedIds.length >= 2) {
      router.push(`/compare?ids=${selectedIds.join(',')}`)
    }
  }

  const sortedHospitals = [...hospitals].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    const getMinCost = (h: Hospital) => {
      const t = h.treatments[0]
      if (!t) return Infinity
      return t.baseCost + t.surgeryCost + t.medicationCost + t.hospitalStayCost
    }
    return getMinCost(a) - getMinCost(b)
  })

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex gap-2 flex-1 w-full">
              <input
                type="text"
                placeholder="Treatment"
                value={searchTreatment}
                onChange={(e) => setSearchTreatment(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <input
                type="text"
                placeholder="Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {loading ? 'Searching...' : `${hospitals.length} Hospitals Found`}
            </h1>
            {(treatment || location) && (
              <p className="text-sm text-slate-500 mt-1">
                {treatment && <span className="font-medium text-blue-600">{treatment}</span>}
                {treatment && location && ' in '}
                {location && <span className="font-medium text-blue-600">{location}</span>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <span className="text-xs text-slate-500">Sort:</span>
              <button
                onClick={() => setSortBy('rating')}
                className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${sortBy === 'rating' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Rating
              </button>
              <button
                onClick={() => setSortBy('cost')}
                className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${sortBy === 'cost' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Cost
              </button>
            </div>
            <Link
              href="/map"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Map View
            </Link>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : sortedHospitals.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No hospitals found</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => { setSearchTreatment(''); setSearchLocation(''); fetchHospitals('', '') }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700"
            >
              Show All Hospitals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sortedHospitals.map((hospital, i) => (
              <div
                key={hospital.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                <HospitalCard
                  hospital={hospital}
                  showCompare={true}
                  isSelected={selectedIds.includes(hospital.id)}
                  onCompareToggle={toggleCompare}
                  searchedTreatment={treatment}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compare Floating Bar */}
      {selectedIds.length >= 2 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {selectedIds.map(id => (
                <div key={id} className="w-2 h-2 bg-blue-400 rounded-full"></div>
              ))}
            </div>
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
          </div>
          <button
            onClick={goToCompare}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Compare Now →
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderWidth: '3px' }}></div>
          <p className="text-slate-500 text-sm">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
