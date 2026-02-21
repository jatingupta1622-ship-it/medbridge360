import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const treatment = searchParams.get('treatment')
    const location = searchParams.get('location')

    const where: Record<string, unknown> = {}

    if (location) {
      const locationLower = location.toLowerCase()
      where.OR = [
        { city: { contains: locationLower, mode: 'insensitive' } },
        { state: { contains: locationLower, mode: 'insensitive' } },
        { country: { contains: locationLower, mode: 'insensitive' } },
      ]
    }

    const hospitals = await prisma.hospital.findMany({
      where,
      include: {
        treatments: true,
      },
      orderBy: { rating: 'desc' },
    })

    // Filter by treatment if provided
    let filtered = hospitals
    if (treatment) {
      const treatmentLower = treatment.toLowerCase()
      filtered = hospitals.filter((h) =>
        h.treatments.some((t) =>
          t.treatmentName.toLowerCase().includes(treatmentLower)
        )
      )

      // If no exact match, return all (fallback)
      if (filtered.length === 0) {
        filtered = hospitals
      }
    }

    return NextResponse.json({ hospitals: filtered })
  } catch (error) {
    console.error('GET /api/hospitals error:', error)
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 })
  }
}
