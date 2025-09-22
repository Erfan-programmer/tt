"use client";

import React, { ReactNode } from "react";
import "./../../styles/AdminDashboardLayout.css";
import localFont from "next/font/local";
import { VerifyProvider } from "@/contextApi/TitanContext";
import AdminLayout from "@/components/Layouts/AdminLayout";

// Fonts
const geistClash = localFont({
  src: [
    { path: "./../fonts/ClashDisplay-Light.otf" },
    { path: "./../fonts/ClashDisplay-Medium.otf" },
    { path: "./../fonts/ClashDisplay-Semibold.otf" },
    { path: "./../fonts/ClashDisplay-Extralight.otf" },
    { path: "./../fonts/ClashDisplay-Regular.otf" },
  ],
  variable: "--font-clash",
  weight: "100 900",
});

const geistJakarta = localFont({
src: [
    { path: "./../fonts/PlusJakartaSans-Medium.ttf" },
    { path: "./../fonts/PlusJakartaSans-Light.ttf" },
    { path: "./../fonts/PlusJakartaSans-Bold.ttf" },
    { path: "./../fonts/PlusJakartaSans-SemiBold.ttf" },
  ],
  variable: "--font-jakarta",
  weight: "100 900",
});

export default function Layout({ children }: { children: ReactNode }) {

  return (
    <VerifyProvider>
       <AdminLayout  geistClash={geistClash} geistJakarta={geistJakarta}>{children}</AdminLayout>
    </VerifyProvider>
  );
}
