import type { Metadata } from "next";
import { BookingFlow } from "@/features/appointments/booking-flow";
export const metadata: Metadata = { title: "Book Appointment" };
export default async function Page({ params }: PageProps<"/book/[doctorId]">) { const { doctorId } = await params; return <BookingFlow doctorId={doctorId} />; }
