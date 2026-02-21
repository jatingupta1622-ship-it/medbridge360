export interface Hospital {
  id: number;
  name: string;
  city: string;
  country: string;
  specializations: string[];
  rating: number;
  treatmentCostRange: {
    min: number;
    max: number;
    currency: string;
  };
  internationalPatientsSupported: boolean;
  contact: {
    email: string;
    phone: string;
  };
  image: string;
}

export const mockHospitals: Hospital[] = [
  {
    id: 1,
    name: "Apollo Hospitals Enterprise",
    city: "Chennai",
    country: "India",
    specializations: ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
    rating: 4.8,
    treatmentCostRange: { min: 2000, max: 15000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "intl@apollo.in", phone: "+91-44-2829-0200" },
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 2,
    name: "Bumrungrad International Hospital",
    city: "Bangkok",
    country: "Thailand",
    specializations: ["Cardiology", "Gastroenterology", "Plastic Surgery", "Checkup"],
    rating: 4.9,
    treatmentCostRange: { min: 3000, max: 20000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "info@bumrungrad.com", phone: "+66-2066-8888" },
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 3,
    name: "Mount Elizabeth Hospital",
    city: "Singapore",
    country: "Singapore",
    specializations: ["Cardiology", "Neurology", "Oncology", "Transplants"],
    rating: 4.9,
    treatmentCostRange: { min: 8000, max: 45000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "mpac@parkwaypantai.com", phone: "+65-6731-2222" },
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 4,
    name: "Acibadem Healthcare Group",
    city: "Istanbul",
    country: "Turkey",
    specializations: ["Oncology", "Hair Transplant", "Plastic Surgery", "IVF"],
    rating: 4.7,
    treatmentCostRange: { min: 1500, max: 12000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "international@acibadem.com", phone: "+90-216-544-4664" },
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 5,
    name: "Cleveland Clinic",
    city: "Abu Dhabi",
    country: "UAE",
    specializations: ["Cardiology", "Neurology", "Endocrinology"],
    rating: 4.8,
    treatmentCostRange: { min: 5000, max: 35000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "contactus@clevelandclinicabudhabi.ae", phone: "+971-800-82223" },
    image: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 6,
    name: "Fortis Escorts Heart Institute",
    city: "New Delhi",
    country: "India",
    specializations: ["Cardiology", "Cardiothoracic Surgery"],
    rating: 4.6,
    treatmentCostRange: { min: 2500, max: 14000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "contactus@fortishealthcare.com", phone: "+91-11-4713-5000" },
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 7,
    name: "Asan Medical Center",
    city: "Seoul",
    country: "South Korea",
    specializations: ["Organ Transplant", "Oncology", "Cardiology", "Plastic Surgery"],
    rating: 4.9,
    treatmentCostRange: { min: 4000, max: 30000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "intlasangw@amc.seoul.kr", phone: "+82-2-3010-5001" },
    image: "https://images.unsplash.com/photo-1504439468489-c8920d786a2b?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 8,
    name: "Severance Hospital",
    city: "Seoul",
    country: "South Korea",
    specializations: ["Oncology", "Robotic Surgery", "Cardiology"],
    rating: 4.8,
    treatmentCostRange: { min: 4500, max: 32000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "sevint@yuhs.ac", phone: "+82-2-2228-5800" },
    image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 9,
    name: "Gleneagles Hospital",
    city: "Kuala Lumpur",
    country: "Malaysia",
    specializations: ["Cardiology", "Oncology", "Orthopedics"],
    rating: 4.7,
    treatmentCostRange: { min: 2500, max: 18000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "my.gkl.inquiry@parkwaypantai.com", phone: "+60-3-4141-3000" },
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800&h=500"
  },
  {
    id: 10,
    name: "Helios Hospital",
    city: "Berlin",
    country: "Germany",
    specializations: ["Oncology", "Neurology", "Orthopedics", "Cardiology"],
    rating: 4.8,
    treatmentCostRange: { min: 6000, max: 40000, currency: "USD" },
    internationalPatientsSupported: true,
    contact: { email: "international@helios-gesundheit.de", phone: "+49-30-31003-333" },
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=800&h=500"
  }
];

export const specializations = Array.from(new Set(mockHospitals.flatMap(h => h.specializations))).sort();
export const countries = Array.from(new Set(mockHospitals.map(h => h.country))).sort();
