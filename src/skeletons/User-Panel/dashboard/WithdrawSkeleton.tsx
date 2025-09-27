"use client";

import { motion } from "framer-motion";

export default function WithdrawSkeleton() {
  const options = Array(3).fill(null);

  return (
    <div className="withdraw-container border-standard rounded-xl py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2 px-[2rem] mb-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Options */}
      <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 md:gap-3 px-4 my-4">
        {options.map((_, i) => (
          <motion.div
            key={i}
            className="register-inputs-reward flex justify-between rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-3 border-standard px-2 sm:px-3 items-center gap-2 cursor-pointer bg-gray-200 dark:bg-gray-700 w-full sm:w-auto"
          >
            <div className="flex items-center flex-wrap gap-2">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
          </motion.div>
        ))}

        {/* Total */}
        <motion.div className="register-inputs-reward-special bg-gray-300 dark:bg-gray-600 flex justify-between rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] py-3 border-standard px-2 sm:px-3 items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="h-4 w-12 bg-gray-400 dark:bg-gray-500 rounded"></div>
          <div className="h-4 w-10 bg-gray-400 dark:bg-gray-500 rounded"></div>
        </motion.div>
      </div>

      {/* Company Fee */}
      <div className="px-[2rem] mx-auto my-2">
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      <div className="w-full h-[1px] bg-standard my-3"></div>

      {/* Form Fields */}
      <div className="px-[2rem] space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full sm:w-[50%] h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end p-[2rem]">
        <div className="h-10 w-[90%] sm:w-[50%] md:w-[30%] bg-gray-400 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}
