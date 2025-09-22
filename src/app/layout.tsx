import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import LayoutWrapper from "@/components/Layouts/LayoutWrapper";

const geistClash = localFont({
  src: [
    { path: "./fonts/ClashDisplay-Light.otf" },
    { path: "./fonts/ClashDisplay-Medium.otf" },
    { path: "./fonts/ClashDisplay-Semibold.otf" },
    { path: "./fonts/ClashDisplay-Extralight.otf" },
    { path: "./fonts/ClashDisplay-Regular.otf" },
  ],
  variable: "--font-clash",
  weight: "100 900",
});
const geistJakarta = localFont({
  src: [
    { path: "./fonts/PlusJakartaSans-Medium.ttf" },
    { path: "./fonts/PlusJakartaSans-Light.ttf" },
    { path: "./fonts/PlusJakartaSans-Bold.ttf" },
    { path: "./fonts/PlusJakartaSans-SemiBold.ttf" },
  ],
  variable: "--font-jakarta",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "titan investment",
  description: "titan",
  icons: {
    icon: "/titan.investments-white-trans-3.png",
    shortcut: "/titan.investments-white-trans-3.png",
    apple: "/titan.investments-white-trans-3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistJakarta.variable} ${geistClash.variable} antialiased`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
