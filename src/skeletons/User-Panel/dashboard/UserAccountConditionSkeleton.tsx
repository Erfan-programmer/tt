export default function UserAccountConditionSkeleton() {
  return (
    <>
      <div className="user-account-condition-wrapper bg-[#ECECED] dark:bg-[#0d092b] shadow-[0_0_50px_rgba(0,74,218,0.3)_inset_0_0_30px_rgba(0,74,218,0.4)] overflow-hidden px-4 py-3 border-l-2 border-l-white sm:border-2 sm:border-[#585966] sm:border-l-none sm:min-h-[30vh] rounded-xl relative">
        {/* Desktop View Skeleton */}
        <div className="hidden md:flex justify-between items-start w-full">
          {/* Left Section - Price and Rank */}
          <div className="w-[30%] lg:border-r-2 border-[var(--main-background)] dark:lg:border-white">
            <div className="flex gap-4 items-center mb-4">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-start gap-2 items-center mb-4">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-start gap-2 mt-[1rem] items-center">
              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="ml-[2.5rem] mt-4">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Right Section - Account Info */}
          <div className="w-[60%] pt-4">
            {/* Verified Status */}
            <div className="h-[14vh] relative">
              <div className="absolute right-0 h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            {/* Account Details Grid */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View Skeleton */}
        <div className="md:hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col pl-4">
              <div className="h-16 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Cards Skeleton */}
      <div className="grid sm:hidden grid-cols-2 gap-4 mt-8">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-gradient-to-b to-[#d9d9d9] dark:to-[#090d23] from-[#fff] dark:from-[#275edf] border border-[#1E3A8A] rounded-xl p-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </>
  );
} 