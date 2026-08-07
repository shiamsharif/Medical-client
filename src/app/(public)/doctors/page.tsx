import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/core";
import { DoctorSearch } from "@/features/doctors/doctor-search";

export const metadata: Metadata = { title: "Find Doctors", description: "Search and compare verified doctors by specialty, availability, experience, and fee." };
export default function Page() { return <Suspense fallback={<div className="container-shell section-space"><Skeleton className="h-[600px]" /></div>}><DoctorSearch /></Suspense>; }
