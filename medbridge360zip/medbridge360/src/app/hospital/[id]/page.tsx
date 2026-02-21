'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hospital, Treatment } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { InlineLoader } from '@/components/ui/LoadingScreen'

const TIMELINE_STEPS = [
  { step: 1, phase: 'Initial Consultation', desc: 'Remote consultation with hospital specialists to review your case and confirm treatment plan.', days: '1-2 weeks before' },
  { step: 2, phase: 'Medical Visa & Travel', desc: 'Obtain medical visa, book flights, and arrange accommodation near the hospital.', days: '1-2 weeks before' },
  { step: 3, phase: 'Pre-operative Evaluation', desc: 'Arrive at hospital for comprehensive diagnostics, bloodwork, and imaging studies.', days: '2-3 days before' },
  { step: 4, phase: 'Procedure / Surgery', desc: 'The primary treatment or surgical procedure is performed by specialists.', days: 'Day 0' },
  { step: 5, phase: 'ICU / Post-op Care', desc: 'Immediate monitoring in ICU or recovery ward, with round-the-clock medical care.', days: 'Day 1-3' },
  { step: 6, phase: 'Hospital Recovery', desc: 'Transition to general ward, begin physical therapy and initial rehabilitation.', days: 'Day 4-10' },
  { step: 7, phase: 'Discharge Planning', desc: 'Final check-up, medication briefing, and preparation for travel back home.', days: 'Day 10-14' },
  { step: 8, phase: 'Post-procedure Follow-up', desc: 'Remote follow-up consultations and monitoring of recovery progress.', days: '4-8 weeks after' },
]

export default function HospitalDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [hospital, setHospital] = useState<Hospital | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTimeline, setShowTimeline] = useState(false)
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('compareIds')
    if (stored) setCompareIds(JSON.parse(stored))
  }, [])

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await fetch(`/api/hospital/${id}`)
        const data = await res.json()
        setHospital(data.hospital)
        if (data.hospital?.treatments?.length > 0) {
          setSelectedTreatment(data.hospital.treatments[0])
        }
      } catch {
        setHospital(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchHospital()
  }, [id])

  const addToCompare = () => {
    if (!hospital) return
    const ids = compareIds.includes(hospital.id)
      ? compareIds.filter(i => i !== hospital.id)
      : [...compareIds, hospital.id].slice(0, 4)
    setCompareIds(ids)
    localStorage.setItem('compareIds', JSON.stringify(ids))
  }

  if (loading) return <div className="min-h-screen pt-16"><InlineLoader /></div>

  if (!hospital) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500 mb-4">Hospital not found</p>
        <Link href="/results" className="text-blue-600 hover:underline">Browse all hospitals</Link>
      </div>
    </div>
  )

  const totalCostAmt = selectedTreatment
    ? selectedTreatment.baseCost + selectedTreatment.surgeryCost + selectedTreatment.medicationCost + selectedTreatment.hospitalStayCost
    : 0

  const isInCompare = compareIds.includes(hospital.id)

  const costItems = selectedTreatment ? [
    { label: 'Base / Consultation Cost', value: selectedTreatment.baseCost, color: 'bg-blue-50 text-blue-700' },
    { label: 'Surgery Cost', value: selectedTreatment.surgeryCost, color: 'bg-purple-50 text-purple-700' },
    { label: 'Medication Cost', value: selectedTreatment.medicationCost, color: 'bg-amber-50 text-amber-700' },
    { label: 'Hospital Stay Cost', value: selectedTreatment.hospitalStayCost, color: 'bg-green-50 text-green-700' },
  ] : []

  return (
    <div className="min-h-screen bg-surface pt-16">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src={hospital.imageUrl}
          alt={hospital.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        
        {/* Hospital Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-5xl mx-auto flex items-end justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-lg">{hospital.name}</h1>
              <div className="flex items-center gap-3 text-white/90">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-sm">{hospital.city}, {hospital.state}, {hospital.country}</span>
                </div>
              </div>
            </div>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 text-center shadow-xl">
              <div className="flex items-center gap-1.5 mb-0.5">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-2xl font-black text-slate-800">{hospital.rating}</span>
              </div>
              <p className="text-xs text-slate-500">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Description + Treatment Selector */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-3">About {hospital.name}</h2>
              <p className="text-slate-600 leading-relaxed">{hospital.description}</p>
            </div>

            {/* Treatments */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h2 className="text-xl font-black text-slate-900 mb-4">Available Treatments</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {hospital.treatments.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTreatment(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedTreatment?.id === t.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {t.treatmentName}
                  </button>
                ))}
              </div>
              
              {selectedTreatment && (
                <div className="mt-2 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <span className="font-semibold">Duration:</span> {selectedTreatment.durationDays} days estimated stay
                </div>
              )}
            </div>
          </div>

          {/* Right: Cost Breakdown + Actions */}
          <div className="space-y-5">
            {selectedTreatment && (
              <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-24">
                <h2 className="text-xl font-black text-slate-900 mb-1">{selectedTreatment.treatmentName}</h2>
                <p className="text-sm text-slate-500 mb-5">Cost breakdown</p>

                <div className="space-y-3 mb-5">
                  {costItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${item.color}`}>
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                    <span className="font-bold text-slate-900">Total Estimate</span>
                    <span className="text-xl font-black text-blue-700">{formatCurrency(totalCostAmt)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setShowTimeline(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Treatment Timeline
                  </button>
                  <button
                    onClick={addToCompare}
                    className={`w-full py-3 font-bold rounded-xl transition-all text-sm ${
                      isInCompare
                        ? 'bg-green-50 text-green-700 border-2 border-green-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-2 border-transparent'
                    }`}
                  >
                    {isInCompare ? '✓ Added to Compare' : '+ Add to Compare'}
                  </button>
                  {compareIds.length >= 2 && (
                    <Link
                      href={`/compare?ids=${compareIds.join(',')}`}
                      className="block w-full text-center py-2.5 bg-amber-50 text-amber-700 font-semibold rounded-xl text-sm hover:bg-amber-100 transition-colors border border-amber-200"
                    >
                      Compare {compareIds.length} hospitals →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Modal */}
      {showTimeline && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTimeline(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-black text-xl text-slate-900">Treatment Timeline</h3>
                <p className="text-sm text-slate-500 mt-0.5">{selectedTreatment?.treatmentName}</p>
              </div>
              <button
                onClick={() => setShowTimeline(false)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100"></div>
                <div className="space-y-6">
                  {TIMELINE_STEPS.map((item, i) => (
                    <div key={item.step} className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 z-10 shadow-md shadow-blue-200">
                        {item.step}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm">{item.phase}</h4>
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{item.days}</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-xs text-amber-700"><span className="font-semibold">Disclaimer:</span> This is a general timeline. Actual steps may vary based on your specific case, hospital protocol, and medical team's recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
