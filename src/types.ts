export interface Treatment {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  tagline: string;
  badge?: string;
  duration?: string;
}

export interface AppointmentRequest {
  id?: string;
  patient_name: string;
  phone: string;
  email?: string;
  treatment?: string;
  preferred_date?: string;
  preferred_time?: string;
  message?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}
