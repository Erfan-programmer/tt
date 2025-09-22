import ThemeSwitcher from "@/components/modules/UserPanel/ThemeSwitcher/ThemeSwitcher";

const HeaderSkeleton = () => (
  <header className="dashboard-header z-[999] relative">
    <div className="w-[97%] sm:w-[95%] mx-auto flex justify-between items-center h-[12vh] sm:gap-4">
      <div className="hidden md:flex justify-center gap-4 items-center">
        <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between gap-4 items-center">
        <div className="border-standard rounded-[2rem] flex sm:hidden justify-between items-center p-1 px-2 mr-2 flex-1">
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <ThemeSwitcher />
        <div className="w-fit px-2 sm:px-3 py-1 rounded-lg flex gap-2 justify-evenly items-center relative border border-1 border-[#707070]">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  </header>
);

export default HeaderSkeleton;