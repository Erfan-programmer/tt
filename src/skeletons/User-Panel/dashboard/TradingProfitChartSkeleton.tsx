export default function TradingProfitChartSkeleton() {
  return (
    <div className="trading-profit-chart mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-[#171b29] rounded-lg py-3 mt-[1rem] px-3">
        {/* Chart Area */}
        <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

        {/* Legend Section */}
        <div className="flex justify-center gap-4 mt-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 