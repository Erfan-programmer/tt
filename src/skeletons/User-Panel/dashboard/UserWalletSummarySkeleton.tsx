export default function UserWalletSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 sm:justify-between items-center gap-5 mt-[1rem]">
      {/* First Wallet Card */}
      <div className="t-wallet-container border-standard rounded-xl px-3 py-2 pb-4 w-[100%] sm:h-[17vh] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)]">
        <div className="h-[5vh] flex gap-4 items-center mb-4 sm:mb-0">
          <div className="block sm:hidden">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between flex-wrap gap-4 sm:mt-0">
          <div className="flex justify-center gap-5">
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Second Wallet Card */}
      <div className="hidden sm:block t-wallet-container border-standard rounded-xl px-3 py-2 pb-4 w-[100%] sm:h-[17vh] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)]">
        <div className="h-[5vh] flex gap-4 items-center mb-4 sm:mb-0">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex justify-between flex-wrap gap-4 sm:mt-0">
          <div className="flex justify-center gap-5">
            <div className="hidden sm:block">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 