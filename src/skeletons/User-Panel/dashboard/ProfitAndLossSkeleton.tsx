export default function ProfitAndLossSkeleton() {
  return (
    <div className="profit-and-loss mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4 border-standard">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="sm:hidden h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#171b29] rounded-lg py-3 mt-[1rem] px-3 overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Table Header */}

          {/* Table Rows */}
          {[...Array(3)].map((_, rowIndex) => (
            <div key={rowIndex} className="gap-2 mb-2">
              {/* Desktop View - 12 months */}
              <div className="grid grid-cols-12 gap-2 col-span-12 overflow-x-auto">
                {[...Array(12)].map((_, colIndex) => (
                  <div key={colIndex} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
     
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 