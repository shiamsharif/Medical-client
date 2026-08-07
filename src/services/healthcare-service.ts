import { apiRequest } from "@/lib/api-client";
import type { Appointment, Doctor, Paginated, PlatformStatistics, Review } from "@/types";

export interface DoctorQuery {
  search?: string;
  specialization?: string;
  hospital?: string;
  availability?: string;
  minFee?: number;
  maxFee?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const healthcareService = {
  doctors: (query: DoctorQuery, signal?: AbortSignal) => apiRequest<Paginated<Doctor>>("/api/doctors", { query: { ...query }, signal }),
  featuredDoctors: (signal?: AbortSignal) => apiRequest<Doctor[]>("/api/doctors/featured", { query: { limit: 6, verified: true }, signal }),
  doctor: (id: string, signal?: AbortSignal) => apiRequest<Doctor>(`/api/doctors/${id}`, { signal }),
  statistics: (signal?: AbortSignal) => apiRequest<PlatformStatistics>("/api/statistics/public", { signal }),
  reviews: (query: Record<string, string | number> = {}, signal?: AbortSignal) => apiRequest<Review[]>("/api/reviews", { query, signal }),
  appointments: (signal?: AbortSignal) => apiRequest<Appointment[]>("/api/appointments/me", { signal }),
  availability: (doctorId: string, date: string, signal?: AbortSignal) => apiRequest<{ time: string; available: boolean }[]>(`/api/doctors/${doctorId}/availability`, { query: { date }, signal }),
};
