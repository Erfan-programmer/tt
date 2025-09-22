"use client";

import { usePathname } from "next/navigation";
import HeaderTest from "@/components/modules/Header/HeaderTest";
import Stars from "@/components/modules/Star";
import React from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isHidden =
    pathname?.includes("hrtaamst2025") || pathname?.includes("dashboard");

  return (
    <>
      <HeaderTest />
      {!isHidden && <Stars />}ِِِِِِ{!isHidden && <Stars />}ِِِِِِ
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </>
  );
}
