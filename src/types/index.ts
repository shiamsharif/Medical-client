export type UserRole = "patient" | "doctor" | "admin";

export interface Doctor {
  id: string;
  name: string;
  image?: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  hospital: string;
  consultationFee: number;
  biography: string;
  averageRating: number;
  reviewCount: number;
  verified: boolean;
  availableDays?: string[];
}

export interface Review {
  id: string;
  patientName: string;
  patientAvatar?: string;
  doctorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PlatformStatistics {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalReviews: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface Appointment {
  id: string;
  doctorName: string;
  patientName?: string;
  specialization: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  paymentStatus: "unpaid" | "pending" | "paid" | "refunded" | "failed";
  amount?: number;
}
