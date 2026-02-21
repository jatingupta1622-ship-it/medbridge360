import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: params.id },
      include: { treatments: true },
    })

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 })
    }

    return NextResponse.json({ hospital })
  } catch (error) {
    console.error('GET /api/hospital/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch hospital' }, { status: 500 })
  }
}
