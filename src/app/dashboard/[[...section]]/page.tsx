import { DashboardContent } from "@/features/dashboard/dashboard-content";
import type { Metadata } from "next";

const pageTitles: Record<string, string> = { overview: "Dashboard", appointments: "My Appointments", requests: "Appointment Requests", payments: "Payment History", favorites: "Favorite Doctors", reviews: "My Reviews", prescriptions: "Prescriptions", schedule: "Schedule Management", profile: "My Profile", users: "Manage Users", doctors: "Manage Doctors", analytics: "Admin Analytics", settings: "Settings" };
export async function generateMetadata({ params }: PageProps<"/dashboard/[[...section]]">): Promise<Metadata> { const { section } = await params; return { title: pageTitles[section?.[0] ?? "overview"] ?? "Dashboard" }; }
export default async function Page({ params }: PageProps<"/dashboard/[[...section]]">) { const { section } = await params; return <DashboardContent section={section?.[0] ?? "overview"} />; }
