export default function TutorialBoxSkeleton() {
  return (
    <div className="support-tutorial-content border-standard mt-3 sm:mt-4 md:mt-[2rem] rounded-lg sm:rounded-xl bg-[#d9d9d9] dark:bg-[#0B102D] p-2 sm:p-3 flex flex-col sm:flex-row justify-between pl-3 sm:pl-4 md:pl-[3rem] items-center gap-2 sm:gap-4 w-full sm:w-[80%] md:w-[45%] text-[var(--main-background)] dark:text-white animate-pulse">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
        <div className="support-download w-full sm:w-auto flex flex-col gap-1">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full flex justify-center items-center">
        <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
} 