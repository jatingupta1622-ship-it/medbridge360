import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const hospitals = [
  {
    name: 'Apollo Hospitals',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
    description: 'Apollo Hospitals is one of Asia\'s largest integrated healthcare groups, pioneering the private healthcare revolution in India. With world-class infrastructure, cutting-edge technology, and a team of highly skilled specialists, Apollo delivers exceptional care across 70+ specialties.',
    latitude: 13.0827,
    longitude: 80.2707,
    treatments: [
      { treatmentName: 'Cardiac Bypass Surgery', baseCost: 8000, surgeryCost: 12000, medicationCost: 2000, hospitalStayCost: 3000, durationDays: 14 },
      { treatmentName: 'Knee Replacement', baseCost: 5000, surgeryCost: 7000, medicationCost: 1500, hospitalStayCost: 2000, durationDays: 10 },
      { treatmentName: 'Cancer Treatment', baseCost: 15000, surgeryCost: 20000, medicationCost: 8000, hospitalStayCost: 5000, durationDays: 30 },
      { treatmentName: 'Liver Transplant', baseCost: 25000, surgeryCost: 35000, medicationCost: 10000, hospitalStayCost: 8000, durationDays: 45 },
    ],
  },
  {
    name: 'Fortis Memorial Research Institute',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
    description: 'Fortis Memorial Research Institute is a 1000-bed quaternary care hospital that combines advanced medical technology with world-class patient care. A JCI accredited facility, it is one of the most modern hospitals in India offering over 55+ specialties.',
    latitude: 28.4595,
    longitude: 77.0266,
    treatments: [
      { treatmentName: 'Cardiac Bypass Surgery', baseCost: 7500, surgeryCost: 11000, medicationCost: 1800, hospitalStayCost: 2800, durationDays: 12 },
      { treatmentName: 'Kidney Transplant', baseCost: 18000, surgeryCost: 25000, medicationCost: 7000, hospitalStayCost: 6000, durationDays: 30 },
      { treatmentName: 'Spine Surgery', baseCost: 9000, surgeryCost: 14000, medicationCost: 3000, hospitalStayCost: 3500, durationDays: 15 },
      { treatmentName: 'Bone Marrow Transplant', baseCost: 30000, surgeryCost: 40000, medicationCost: 12000, hospitalStayCost: 10000, durationDays: 60 },
    ],
  },
  {
    name: 'Medanta - The Medicity',
    city: 'Gurugram',
    state: 'Haryana',
    country: 'India',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    description: 'Medanta is a multi-super-speciality institute founded with the goal of providing the best medical care in an environment of clinical research, education, and training. It is a 1,500 bed hospital with advanced medical technology and internationally trained specialists.',
    latitude: 28.4506,
    longitude: 77.0392,
    treatments: [
      { treatmentName: 'Heart Surgery', baseCost: 9000, surgeryCost: 15000, medicationCost: 2500, hospitalStayCost: 3500, durationDays: 14 },
      { treatmentName: 'Cancer Treatment', baseCost: 12000, surgeryCost: 18000, medicationCost: 7000, hospitalStayCost: 4500, durationDays: 28 },
      { treatmentName: 'Knee Replacement', baseCost: 4800, surgeryCost: 6500, medicationCost: 1200, hospitalStayCost: 1800, durationDays: 8 },
      { treatmentName: 'Robotic Surgery', baseCost: 11000, surgeryCost: 16000, medicationCost: 3000, hospitalStayCost: 4000, durationDays: 12 },
    ],
  },
  {
    name: 'Max Super Speciality Hospital',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    description: 'Max Super Speciality Hospital is one of the finest healthcare institutions in India, offering world-class medical care through a network of highly qualified and experienced medical professionals, cutting-edge technology, and patient-centric services across 35+ specialties.',
    latitude: 28.6139,
    longitude: 77.2090,
    treatments: [
      { treatmentName: 'Cardiac Bypass Surgery', baseCost: 6500, surgeryCost: 10000, medicationCost: 1600, hospitalStayCost: 2500, durationDays: 11 },
      { treatmentName: 'Hip Replacement', baseCost: 5500, surgeryCost: 8000, medicationCost: 1400, hospitalStayCost: 2200, durationDays: 10 },
      { treatmentName: 'Spine Surgery', baseCost: 8500, surgeryCost: 13000, medicationCost: 2800, hospitalStayCost: 3200, durationDays: 14 },
      { treatmentName: 'Neurosurgery', baseCost: 14000, surgeryCost: 20000, medicationCost: 5000, hospitalStayCost: 5000, durationDays: 20 },
    ],
  },
  {
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
    description: 'Kokilaben Dhirubhai Ambani Hospital is Mumbai\'s premier quaternary care hospital. It brings together a team of over 700 specialists and super-specialists with state-of-the-art technology. The hospital is known for complex procedures and breakthrough treatments.',
    latitude: 19.1073,
    longitude: 72.8263,
    treatments: [
      { treatmentName: 'Heart Surgery', baseCost: 10000, surgeryCost: 16000, medicationCost: 2800, hospitalStayCost: 4000, durationDays: 15 },
      { treatmentName: 'Cancer Treatment', baseCost: 14000, surgeryCost: 22000, medicationCost: 8500, hospitalStayCost: 5500, durationDays: 35 },
      { treatmentName: 'Organ Transplant', baseCost: 22000, surgeryCost: 30000, medicationCost: 9000, hospitalStayCost: 7000, durationDays: 40 },
      { treatmentName: 'Robotic Surgery', baseCost: 12000, surgeryCost: 18000, medicationCost: 3500, hospitalStayCost: 4500, durationDays: 13 },
    ],
  },
  {
    name: 'Narayana Health City',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=800&q=80',
    description: 'Narayana Health is a chain of multi-speciality hospitals that delivers high-quality, affordable care to patients. Founded with the mission of making world-class healthcare accessible to all, it is one of the largest healthcare providers in Asia with 24 hospitals across India.',
    latitude: 12.9716,
    longitude: 77.5946,
    treatments: [
      { treatmentName: 'Cardiac Bypass Surgery', baseCost: 5500, surgeryCost: 8500, medicationCost: 1400, hospitalStayCost: 2000, durationDays: 10 },
      { treatmentName: 'Kidney Transplant', baseCost: 15000, surgeryCost: 22000, medicationCost: 6000, hospitalStayCost: 5000, durationDays: 28 },
      { treatmentName: 'Cancer Treatment', baseCost: 11000, surgeryCost: 17000, medicationCost: 6500, hospitalStayCost: 4000, durationDays: 25 },
      { treatmentName: 'Pediatric Surgery', baseCost: 6000, surgeryCost: 9000, medicationCost: 2000, hospitalStayCost: 2500, durationDays: 8 },
    ],
  },
  {
    name: 'AIIMS New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    description: 'All India Institute of Medical Sciences (AIIMS) New Delhi is India\'s premier medical institution and one of the most prestigious healthcare facilities in Asia. It combines research, education, and patient care with the highest medical standards, serving millions annually.',
    latitude: 28.5672,
    longitude: 77.2100,
    treatments: [
      { treatmentName: 'Cardiac Bypass Surgery', baseCost: 3000, surgeryCost: 6000, medicationCost: 1000, hospitalStayCost: 1500, durationDays: 12 },
      { treatmentName: 'Neurosurgery', baseCost: 8000, surgeryCost: 14000, medicationCost: 3000, hospitalStayCost: 3500, durationDays: 18 },
      { treatmentName: 'Cancer Treatment', baseCost: 8000, surgeryCost: 14000, medicationCost: 5000, hospitalStayCost: 3000, durationDays: 30 },
      { treatmentName: 'Liver Transplant', baseCost: 18000, surgeryCost: 28000, medicationCost: 8000, hospitalStayCost: 6000, durationDays: 45 },
    ],
  },
  {
    name: 'Wockhardt Hospitals',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=800&q=80',
    description: 'Wockhardt Hospitals is a chain of super-speciality tertiary care hospitals providing clinical excellence through world-class technology, evidence-based medicine, and highly trained specialists. Known for cardiac care, orthopedics, and neurosciences.',
    latitude: 19.0760,
    longitude: 72.8777,
    treatments: [
      { treatmentName: 'Heart Surgery', baseCost: 8500, surgeryCost: 13000, medicationCost: 2200, hospitalStayCost: 3200, durationDays: 12 },
      { treatmentName: 'Knee Replacement', baseCost: 4500, surgeryCost: 6000, medicationCost: 1100, hospitalStayCost: 1700, durationDays: 8 },
      { treatmentName: 'Spine Surgery', baseCost: 7500, surgeryCost: 12000, medicationCost: 2500, hospitalStayCost: 2800, durationDays: 12 },
      { treatmentName: 'Bariatric Surgery', baseCost: 5000, surgeryCost: 8000, medicationCost: 1500, hospitalStayCost: 2000, durationDays: 7 },
    ],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.treatment.deleteMany()
  await prisma.hospital.deleteMany()

  for (const hospitalData of hospitals) {
    const { treatments, ...hospitalInfo } = hospitalData
    const hospital = await prisma.hospital.create({
      data: {
        ...hospitalInfo,
        treatments: {
          create: treatments,
        },
      },
    })
    console.log(`✅ Created hospital: ${hospital.name}`)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
