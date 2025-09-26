"use client";

import React from "react";

interface ProgressBarProps {
    start_value: number;
    current_value: number;
    end_value: number;
}

const ProgressBar = ({ start_value, end_value , current_value }: ProgressBarProps) => {
    const total = end_value - start_value
  const percent = total > 0 ? ((current_value / total) * 100) : 20;

  return (
    <div className="w-full h-8 sm:h-12 bg-[#f9f9fe] dark:bg-[#D9D9D9] rounded-md overflow-hidden flex flex-row-reverse p-[3px] border border-black relative">
      <div
        className="absolute left-0 top-0 h-full bg-[#275EDF] transition-all duration-300"
        style={{ width: `${100 - percent}%` }}
      />
      <div className="w-full h-full opacity-0" />
    </div>
  );
};

function TeamRankBarSkeleton() {
  return (
    <div className="team-account-analytic-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5">
      <div className="border-standard rounded-xl bg-[#f9f9fe] dark:bg-[#0f163a] p-4 sm:p-6 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div className="text-[var(--dark-color)] dark:text-white">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
            <div className="w-40 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="relative mt-2">
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
          <div className="w-full h-8 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

interface CurrentRank {
  current_rank_name: string;
  total_annual_sales: number;
  time_remaining_until_reset: number;
  progress_bar: {
    start_value: number;
    current_value: number;
    end_value: number;
  };
}

interface TeamRankProps {
  currentRank?: CurrentRank;
  loading?: boolean;
}

export default function TeamRankProgessionBarContent({
  currentRank,
  loading,
}: TeamRankProps) {
  if (loading || !currentRank) return <TeamRankBarSkeleton />;

  return (
    <div className="team-account-analytic-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5">
      <div className="border-standard rounded-xl bg-[#f9f9fe] dark:bg-[#0f163a] p-4 sm:p-6 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
          <div className="text-[var(--dark-color)] dark:text-white">
            <p className="text-[.8rem] sm:text-sm">
              Your rank is{" "}
              <span className="text-[var(--gold)] font-semibold">
                {currentRank.current_rank_name}
              </span>
            </p>
            <p className="text-[.8rem] sm:text-sm mt-2">
              Total Annual Sales:{" "}
              <span className="text-[var(--dark-color)] dark:text-white font-semibold">
                $ {currentRank.total_annual_sales}
              </span>
            </p>
          </div>
        </div>
        <div className="relative mt-2">
          <p className="text-[var(--dark-color)] dark:text-white/50 text-[10px] sm:text-[.8rem] mb-2">
            ({currentRank.time_remaining_until_reset.toFixed(0)} Day/s) Time remaining until reset.
          </p>
          <div className="w-full">
            <ProgressBar
              end_value={currentRank.progress_bar.end_value}
              current_value={currentRank.progress_bar.current_value}
              start_value={Number(currentRank.progress_bar.start_value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
