export default function MessageSkeleton() {
  return (
    <div className="bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] shadow-custom border-standard rounded-xl mt-5 p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Image Skeleton */}
        <div className="w-full sm:w-1/3 h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

        <div className="w-full sm:w-2/3 flex flex-col gap-3">
          {/* Title Skeleton */}
          <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          {/* Date Skeleton */}
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          {/* Description Skeleton */}
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function PaymentSkeleton() {
  return (
  <div className="payment-content px-2 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
    <div className="animate-pulse w-full max-w-3xl mx-auto bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 p-8 border-standard">
      {/* Payment wrapper skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
      <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-800 my-2 sm:my-2.5 md:my-3 rounded" />

      {/* Notice skeleton */}
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mb-6" />

      {/* Invoice Box skeleton */}
      <div className="w-[100%] lg:w-[80%] flex flex-wrap gap-x-2 sm:gap-x-4 justify-center items-center mx-auto border-standard bg-[#f9f9fe] dark:bg-[#0f163a] p-2 pt-[1rem] mt-[2rem] rounded-lg">
        <div className="twofacode-img min-w-[80px] bg-[#275EDF] p-2 rounded-lg max-w-[12rem] overflow-hidden min-h-[100px] hidden sm:flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
        </div>
        <div className="text-[var(--main-background)] dark:text-white flex-1 min-w-[200px]">
          <div className="scan-container text-left">
            <div className="flex flex-col gap-1 mb-2">
              <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="flex items-skretch my-4 sm:my-0">
            <div className="scan-code w-full border-standard overflow-x-auto p-2 text-left rounded-lg pr-[2rem] flex flex-wrap items-center rounded-g sm:mt-4">
              <div className="h-6 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
            <div className="flex sm:hidden justify-center gap-3 items-center bg-white p-2 px-4 rounded-lg">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
          <div className="titan-copy mt-4 hidden sm:flex">
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
          <div className="twofacode-img min-w-[80px] bg-[#275EDF] p-2 rounded-lg max-w-[12rem] overflow-hidden min-h-[100px] flex sm:hidden flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Additional notice skeleton */}
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded mt-6 mb-4" />
      <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-800 my-2 sm:my-2.5 md:my-3 rounded" />

      {/* TXID Input skeleton */}
      <div className="flex flex-col gap-2 rounded-xl p-4 mt-8 max-w-xl mx-auto">
        <div className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mt-4" />
      </div>
    </div>
  </div>
  )
}
