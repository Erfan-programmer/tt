"use client";
import { usePathname } from "next/navigation";
import React from "react";
import "./AdminBreadCrumb.css"
export default function AdminBreadCrumb() {
  const pathname = usePathname()

  const pathSegments = pathname
    ?.replace("/hrtaamst2025/", "") 
    .split("/") 
    ?.filter(Boolean); 

  return (
    <div className="flex admin-breadcrumb overflow-x-auto text-[.9rem] sm:text-md xl:text-lg text-nowrap md:text-md items-center w-[97%] sm:w-[95%] mx-auto mb-8 gap-2 text-white">
      {pathSegments?.map((segment, index) => (
        <React.Fragment key={index}>
          <span>{segment}</span>
          {index < pathSegments.length - 1 && <span>-</span>}
        </React.Fragment>
      ))}
      <div className="flex-1 h-[1px] w-full bg-[#383C47] ml-2"></div>
    </div>
  );
}
