export default function TitanFormSkeleton() {
  return (
    <div className="titan-form-container mt-[1rem] w-full border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg py-2">
      {/* Title Section */}
      <div className="titan-form-title w-[95%] mx-auto">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="bg-standard w-full h-[2px] my-4"></div>

      {/* Form Body */}
      <div className="titan-form-body mt-4 flex-wrap flex justify-between gap-[1rem] items-start w-[95%] mx-auto">
        {/* Position Select Skeleton */}
        <div className="w-[100%] sm:w-[47%]">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-[1.5rem] animate-pulse"></div>
        </div>

        {/* Deposit Input Skeleton */}
        <div className="w-[100%] sm:w-[47%]">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-[1.5rem] animate-pulse"></div>
        </div>

        {/* Investment Term Select Skeleton */}
        <div className="w-[100%] sm:w-[47%]">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-[1.5rem] animate-pulse"></div>
        </div>

        {/* 2FA Input Skeleton */}
        <div className="w-[100%] sm:w-[47%]">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-[1.5rem] animate-pulse"></div>
        </div>
      </div>

      {/* Footer Button Skeleton */}
      <div className="titan-form-footer flex justify-center sm:justify-end items-center my-[3rem] w-[95%] mx-auto">
        <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
} 