import React from "react";

export default function InvestmentTermSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 bg-gray-200 dark:bg-gray-700 rounded-[2rem]"
        />
      ))}
    </div>
  );
}
