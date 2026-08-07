import type { Metadata } from "next";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <DashboardShell>{children}</DashboardShell>; }
