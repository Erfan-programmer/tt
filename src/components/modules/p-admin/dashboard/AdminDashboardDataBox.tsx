import { AdminDashboardDataBoxType } from "@/types/p-admin/dashoard";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminDashboardDataBox({
  title,
  subTitle,
  status,
  chart,
  bgColor
}: AdminDashboardDataBoxType) {
  const borderColors: Record<string, string> = {
    blue: "border-[#275EDF]",
    green: "border-[#A8FFAE]",
    red: "border-[#FF6060]",
    yellow: "border-[#FFD700]",
    normal: "border-gray-400",
  };

  const borderClass = status ? borderColors[status] || "border-gray-400" : "border-gray-400";
  const router = useRouter()
  return (
    <div
    onClick={()=> router.push("/hrtaamst2025/network&marketing/ranks")}
      className={`admin-dashboard-data cursor-pointer min-w-52 border-2 py-4 ${bgColor ? `bg-[${bgColor}]` : ""} ${borderClass} rounded-xl p-2 px-4`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[#9A9A9A] text-base sm:text-lg md:text-lg">{title}</span>
        {chart && (
          <span className={`${chart.startsWith("+") ? "text-[#A8FFAE]" : "text-[#FF6060]"} text-sm sm:text-base md:text-base`}>
            {chart}
          </span>
        )}
      </div>
      <div>
        <span className="text-lg sm:text-xl md:text-xl text-white">{subTitle}</span>
      </div>
    </div>
  );
}
