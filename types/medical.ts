import { ContactInfoData } from "@/components/common/ContactInformationSection"

export interface MedicalPatient {
  id: string
  full_name: string
  gender: string
  date_of_birth: string
  nationality: string
  marital_status: string
  passport_number: string
  national_id: string
  driving_license: string
  other_id: string
  current_address: string
  permanent_address: string
  city: string
  district: string
  state_region: string
  country: string
  postal_code: string
  emergency_contact_name: string
  emergency_contact_relation: string
  emergency_contact_phone: string
}

export interface MedicalAttendant {
  id: string
  name: string
  relationship: string
  gender: string
  age: number | ''
  passport_number: string
  national_id: string
  mobile_number: string
  whatsapp_number: string
  email: string
  nationality: string
}

export interface MedicalDocument {
  id: string
  file: File | null
  category: string
  sub_category: string
  name: string
  url?: string
}

export interface MedicalFormData extends ContactInfoData {
  // Patient Info (Step 1)
  patient: MedicalPatient
  
  // Medical Info (Step 2)
  medical_problem: string
  symptoms: string
  existing_diagnosis: string
  previous_diagnosis: string
  department_required: string
  existing_conditions: string[]
  previous_surgery: string
  current_medicines: string
  allergies: string
  blood_group: string
  height: string
  weight: string

  // Hospital Preference (Step 3)
  preferred_hospital_id: string
  preferred_doctor_id: string
  preferred_consultation: string
  preferred_language: string

  // Travel Info (Step 4)
  expected_travel_date: string
  expected_return_date: string
  visa_status: string
  arrival_airport: string
  arrival_city: string
  needs_pickup: boolean
  needs_hotel: boolean
  needs_translator: boolean
  needs_local_transport: boolean
  accommodation_preference: string

  // Attendants (Step 5)
  attendants: MedicalAttendant[]

  // Documents (Step 6)
  documents: MedicalDocument[]

  // Additional Info (Step 7)
  special_requests: string
}

export const initialMedicalFormData: MedicalFormData = {
  // Contact
  contact_name: '',
  contact_mobile: '',
  contact_whatsapp: '',
  contact_email: '',
  preferred_contact_method: 'WhatsApp',
  preferred_contact_time: 'Anytime',
  sameAsMobile: false,

  // Patient
  patient: {
    id: '',
    full_name: '',
    gender: '',
    date_of_birth: '',
    nationality: '',
    marital_status: '',
    passport_number: '',
    national_id: '',
    driving_license: '',
    other_id: '',
    current_address: '',
    permanent_address: '',
    city: '',
    district: '',
    state_region: '',
    country: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_relation: '',
    emergency_contact_phone: '',
  },

  // Medical
  medical_problem: '',
  symptoms: '',
  existing_diagnosis: '',
  previous_diagnosis: '',
  department_required: '',
  existing_conditions: [],
  previous_surgery: '',
  current_medicines: '',
  allergies: '',
  blood_group: '',
  height: '',
  weight: '',

  // Hospital
  preferred_hospital_id: '',
  preferred_doctor_id: '',
  preferred_consultation: '',
  preferred_language: '',

  // Travel
  expected_travel_date: '',
  expected_return_date: '',
  visa_status: 'Not Applied',
  arrival_airport: '',
  arrival_city: '',
  needs_pickup: false,
  needs_hotel: false,
  needs_translator: false,
  needs_local_transport: false,
  accommodation_preference: '',

  // Attendants
  attendants: [],

  // Documents
  documents: [],

  // Additional Info
  special_requests: '',
}
