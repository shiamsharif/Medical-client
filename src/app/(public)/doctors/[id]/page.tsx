import type { Metadata } from "next";
import { DoctorProfile } from "@/features/doctors/doctor-profile";
import { healthcareService } from "@/services/healthcare-service";

export async function generateMetadata({ params }: PageProps<"/doctors/[id]">): Promise<Metadata> {
  const { id } = await params;
  try {
    const doctor = await healthcareService.doctor(id);
    return { title: doctor.name, description: `View ${doctor.name}'s profile, experience, reviews, and current availability.` };
  } catch {
    return { title: "Doctor Profile" };
  }
}
export default async function Page({ params }: PageProps<"/doctors/[id]">) { const { id } = await params; return <DoctorProfile id={id} />; }
