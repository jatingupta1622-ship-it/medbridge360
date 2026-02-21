'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Hospital } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface HospitalCardProps {
  hospital: Hospital
  showCompare?: boolean
  isSelected?: boolean
  onCompareToggle?: (id: string) => void
  searchedTreatment?: string
}

export function HospitalCard({
  hospital,
  showCompare = false,
  isSelected = false,
  onCompareToggle,
  searchedTreatment,
}: HospitalCardProps) {
  const matchedTreatment = searchedTreatment
    ? hospital.treatments.find((t) =>
        t.treatmentName.toLowerCase().includes(searchedTreatment.toLowerCase())
      )
    : hospital.treatments[0]

  const minCost = matchedTreatment
    ? matchedTreatment.baseCost + matchedTreatment.surgeryCost + matchedTreatment.medicationCost + matchedTreatment.hospitalStayCost
    : null

  return (
    <div className={`hospital-card bg-white rounded-2xl overflow-hidden border transition-all ${
      isSelected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-30' : 'border-slate-100 hover:border-blue-200'
    }`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
        <img
          src={hospital.imageUrl}
          alt={hospital.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-bold text-slate-800">{hospital.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 text-base leading-tight mb-1">{hospital.name}</h3>
        
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span>{hospital.city}, {hospital.state}, {hospital.country}</span>
        </div>

        {matchedTreatment && minCost && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-slate-500 mb-0.5">{matchedTreatment.treatmentName}</p>
            <p className="text-lg font-bold text-blue-700">
              {formatCurrency(minCost)}
            </p>
            <p className="text-xs text-slate-500">Est. {matchedTreatment.durationDays} days</p>
          </div>
        )}

        <div className="flex gap-2">
          <Link
            href={`/hospital/${hospital.id}`}
            className="flex-1 text-center px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            View Details
          </Link>
          
          {showCompare && onCompareToggle && (
            <button
              onClick={() => onCompareToggle(hospital.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                isSelected
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-400'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent'
              }`}
            >
              {isSelected ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
              {isSelected ? 'Added' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
