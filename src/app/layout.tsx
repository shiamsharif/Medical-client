import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  metadataBase: new URL("https://medicare-connect.example"),
  title: { default: "MediCare Connect | Care that stays connected", template: "%s | MediCare Connect" },
  description: "Find verified doctors, book appointments, pay securely, and manage your healthcare in one calm, connected place.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} min-h-screen font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
