"use client";
import React from "react";

interface LoaderSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const LoaderSkeleton: React.FC<LoaderSkeletonProps> = ({
  rows = 5,
  columns = 5,
  className = "",
}) => {
  const rowArray = Array.from({ length: rows });
  const colArray = Array.from({ length: columns });

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-full border border-gray-700 rounded-lg">
        {rowArray.map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center border-b border-gray-700 last:border-b-0"
          >
            {colArray.map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-8 md:h-10 flex-1 bg-gray-700/40 animate-pulse m-2 rounded"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoaderSkeleton;
