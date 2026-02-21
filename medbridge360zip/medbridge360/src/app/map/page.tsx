'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Hospital } from '@/types'

export default function MapPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch('/api/hospitals')
        const data = await res.json()
        setHospitals(data.hospitals || [])
      } catch {
        setHospitals([])
      } finally {
        setLoading(false)
      }
    }
    fetchHospitals()
  }, [])

  useEffect(() => {
    if (!loading && hospitals.length > 0 && mapRef.current && !mapInstanceRef.current) {
      // Dynamically load Leaflet
      const loadLeaflet = async () => {
        // Load CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Load JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          const L = (window as unknown as { L: { map: (...args: unknown[]) => unknown; tileLayer: (...args: unknown[]) => unknown; marker: (...args: unknown[]) => unknown; divIcon: (...args: unknown[]) => unknown } }).L
          if (!L || !mapRef.current) return

          // Calculate center
          const avgLat = hospitals.reduce((sum, h) => sum + h.latitude, 0) / hospitals.length
          const avgLng = hospitals.reduce((sum, h) => sum + h.longitude, 0) / hospitals.length

          const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
          mapInstanceRef.current = map

          // @ts-expect-error - Leaflet types are loaded dynamically
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          // @ts-expect-error - addTo
          }).addTo(map)

          // @ts-expect-error - Leaflet map setView
          map.setView([avgLat, avgLng], 6)

          // Add markers
          hospitals.forEach((hospital) => {
            const icon = L.divIcon({
              html: `<div style="
                width: 36px; height: 36px;
                background: linear-gradient(135deg, #2563eb, #06b6d4);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid white;
                box-shadow: 0 4px 12px rgba(37,99,235,0.4);
                display: flex; align-items: center; justify-content: center;
              "></div>`,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
            })

            const marker = L.marker([hospital.latitude, hospital.longitude], { icon })
            // @ts-expect-error - Leaflet marker addTo
            marker.addTo(map)
            // @ts-expect-error - Leaflet marker on click
            marker.on('click', () => {
              setSelectedHospital(hospital)
            })
          })

          setMapLoaded(true)
        }
        document.head.appendChild(script)
      }
      loadLeaflet()
    }
  }, [loading, hospitals])

  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">Hospital Map</h1>
            <p className="text-slate-500 text-sm">{hospitals.length} hospitals across India</p>
          </div>
          <Link
            href="/results"
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 text-sm font-medium rounded-xl transition-colors"
          >
            List View →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              {(loading || !mapLoaded) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
                  <div className="text-center">
                    <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: '3px' }}></div>
                    <p className="text-slate-500 text-sm">Loading map...</p>
                  </div>
                </div>
              )}
              <div ref={mapRef} className="w-full h-[500px] lg:h-[600px]"></div>
            </div>
          </div>

          {/* Sidebar: Hospital List + Selected */}
          <div className="space-y-4">
            {selectedHospital && (
              <div className="bg-white rounded-2xl border-2 border-blue-500 p-4 shadow-lg shadow-blue-100 animate-fade-in">
                <img
                  src={selectedHospital.imageUrl}
                  alt={selectedHospital.name}
                  className="w-full h-32 object-cover rounded-xl mb-3"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80'
                  }}
                />
                <h3 className="font-black text-slate-900 mb-1">{selectedHospital.name}</h3>
                <p className="text-slate-500 text-xs mb-2">{selectedHospital.city}, {selectedHospital.state}</p>
                <div className="flex items-center gap-1 mb-3">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700">{selectedHospital.rating}</span>
                </div>
                <Link
                  href={`/hospital/${selectedHospital.id}`}
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  View Details
                </Link>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-sm font-bold text-slate-700">All Hospitals</p>
              </div>
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                {hospitals.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHospital(h)}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                      selectedHospital?.id === h.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{h.name}</p>
                      <p className="text-xs text-slate-500">{h.city} • {h.rating}★</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
