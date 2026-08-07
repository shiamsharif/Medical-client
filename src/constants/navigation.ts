import { BarChart3, CalendarClock, CalendarDays, ClipboardList, CreditCard, FileHeart, Heart, LayoutDashboard, MessageSquare, Settings, Stethoscope, UserRound, Users } from "lucide-react";
import type { UserRole } from "@/types";

export const dashboardNavigation: Record<UserRole, { label: string; href: string; icon: typeof LayoutDashboard }[]> = {
  patient: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard }, { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays }, { label: "Payments", href: "/dashboard/payments", icon: CreditCard }, { label: "Favorites", href: "/dashboard/favorites", icon: Heart }, { label: "Reviews", href: "/dashboard/reviews", icon: MessageSquare }, { label: "Prescriptions", href: "/dashboard/prescriptions", icon: FileHeart }, { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  doctor: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard }, { label: "Appointment requests", href: "/dashboard/requests", icon: ClipboardList }, { label: "Schedule", href: "/dashboard/schedule", icon: CalendarClock }, { label: "Prescriptions", href: "/dashboard/prescriptions", icon: FileHeart }, { label: "Professional profile", href: "/dashboard/profile", icon: Stethoscope },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard }, { label: "Users", href: "/dashboard/users", icon: Users }, { label: "Doctors", href: "/dashboard/doctors", icon: Stethoscope }, { label: "Appointments", href: "/dashboard/appointments", icon: CalendarDays }, { label: "Payments", href: "/dashboard/payments", icon: CreditCard }, { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 }, { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
};
