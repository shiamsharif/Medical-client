import { apiRequest } from "@/lib/api-client";
import type { Appointment, Doctor, Paginated, PlatformStatistics, Review } from "@/types";

export interface ApiDoctor {
  _id: string;
  doctorName: string;
  profileImage?: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  hospitalName: string;
  consultationFee: number;
  biography?: string;
  averageRating: number;
  reviewCount: number;
  verificationStatus: "pending" | "verified" | "rejected";
  availableDays?: string[];
}

interface ApiStatistics {
  verifiedDoctors: number;
  patients: number;
  appointments: number;
  reviews: number;
}

interface AvailabilityResponse {
  date: string;
  slots: string[];
}

interface ApiAppointment {
  _id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentStatus: string;
  paymentStatus: Appointment["paymentStatus"];
}

export function mapDoctor(doctor: ApiDoctor): Doctor {
  return {
    id: doctor._id,
    name: doctor.doctorName,
    image: doctor.profileImage,
    specialization: doctor.specialization,
    qualifications: doctor.qualifications,
    experience: doctor.experience,
    hospital: doctor.hospitalName,
    consultationFee: doctor.consultationFee,
    biography: doctor.biography ?? "Biography has not been added yet.",
    averageRating: doctor.averageRating,
    reviewCount: doctor.reviewCount,
    verified: doctor.verificationStatus === "verified",
    availableDays: doctor.availableDays,
  };
}

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
  doctors: async (query: DoctorQuery, signal?: AbortSignal) => {
    const result = await apiRequest<Paginated<ApiDoctor>>("/api/doctors", {
      query: { ...query },
      signal,
    });
    return { ...result, data: result.data.map(mapDoctor) };
  },
  featuredDoctors: async (signal?: AbortSignal) => {
    const result = await apiRequest<Paginated<ApiDoctor>>("/api/doctors", {
      query: { limit: 6, sort: "rating_desc" },
      signal,
    });
    return result.data.map(mapDoctor);
  },
  doctor: async (id: string, signal?: AbortSignal) =>
    mapDoctor(await apiRequest<ApiDoctor>(`/api/doctors/${id}`, { signal })),
  statistics: async (signal?: AbortSignal): Promise<PlatformStatistics> => {
    const value = await apiRequest<ApiStatistics>("/api/analytics/public", { signal });
    return {
      totalDoctors: value.verifiedDoctors,
      totalPatients: value.patients,
      totalAppointments: value.appointments,
      totalReviews: value.reviews,
    };
  },
  reviews: (query: Record<string, string | number> = {}, signal?: AbortSignal) => apiRequest<Review[]>("/api/reviews", { query, signal }),
  appointments: async (signal?: AbortSignal) => {
    const value = await apiRequest<Paginated<ApiAppointment>>("/api/appointments/mine", {
      signal,
    });
    return value.data.map(
      (item): Appointment => ({
        id: item._id,
        doctorName: `Doctor #${item.doctorId.slice(-6)}`,
        specialization: "—",
        date: item.appointmentDate,
        time: item.appointmentTime,
        status: (item.appointmentStatus === "accepted"
          ? "confirmed"
          : item.appointmentStatus) as Appointment["status"],
        paymentStatus: item.paymentStatus,
      }),
    );
  },
  availability: async (doctorId: string, date: string, signal?: AbortSignal) => {
    const value = await apiRequest<AvailabilityResponse>(
      `/api/schedules/doctor/${doctorId}/availability`,
      { query: { date }, signal },
    );
    return value.slots.map((time) => ({ time, available: true }));
  },
};
