"use client";
import React from "react";

function ReferralNodeSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-lg h-[42px] px-6 relative bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
}

export default function ReferralTreeSkeleton() {
  return (
    <div className="bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[95%] sm:w-[75%] border-standard rounded-xl bg-shadow-custom p-6 space-y-6">
      {/* Search Input Skeleton */}
      <div className="flex items-center justify-between px-2 sm:px-[2rem]">
        <div className="relative w-[300px] sm:block hidden">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-3" />

      {/* You Node Skeleton */}
      <div className="flex flex-col mt-2 relative pl-[2rem]">
        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
        <div className="h-4 w-12 mt-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="w-8 h-[2rem] border-l-[2px] border-dashed border-gray-400 dark:border-white/30 ml-[.85rem]" />
      </div>

      {/* Referral List Skeleton */}
      <div className="space-y-6 ml-[2rem]">
        {[...Array(3)].map((_, idx) => (
          <ReferralNodeSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
