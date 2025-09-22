import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";
import Image from "next/image";

interface InfoProps {
  main_stats: {
    tid: number;
    rank: string;
    rank_icon: string;
    position: string;
    start_date: string;
    total_deposit: number;
    total_referral: number;
    total_commission: number;
    total_annual_sales: number;
    next_rank_needed: number;
    next_rank_name: string;
    turnover_reset_date: string;
    total_organization_size: number;
    total_income: number;
  };
  isLoading: boolean;
  error: any;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString();
};

function TeamAccountAnalyticsSkeleton() {
  return (
    <div className="team-account-analytic-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 animate-pulse">
      <div className="bg-[#D9D9D9] rounded-xl p-2">
        <div className="bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-full p-2 flex items-center gap-2 sm:gap-4">
          <div className="w-[3rem] sm:w-[5rem] h-[3rem] sm:h-[5rem] rounded-full bg-gray-300 dark:bg-gray-600" />
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="mt-4 text-[var(--dark-color)] dark:text-white text-sm sm:text-base space-y-2">
          {[...Array(9)].map((_, idx) => (
            <div
              key={idx}
              className={
                (idx % 2 === 0
                  ? "bg-white dark:bg-[#3B3F45]"
                  : "bg-[#f9f9fe] dark:bg-[#2E3239]") +
                " rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1"
              }
            >
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 account-analytics-container bg-white p-2 px-3 sm:px-[2rem] font-[600] rounded-xl flex justify-between items-center text-[var(--sidear-bg)] text-sm sm:text-base">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export default function TeamAccountAnalyticsContent({
  main_stats,
  isLoading,
  error,
}: InfoProps) {
  if (isLoading) return <TeamAccountAnalyticsSkeleton />;
  if (error) return <div>Error loading data</div>;
  return (
    <div className="team-account-analytic-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5">
      <div className="bg-[#D9D9D9] rounded-xl p-2">
        <div className="bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-full p-2 flex items-center gap-2 sm:gap-4">
          <Image
            width={200}
            height={200}
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${main_stats?.rank_icon}`}
            className="w-[3rem] sm:w-[5rem] h-[3rem] sm:h-[5rem] rounded-full"
            alt=""
          />
          <p className="text-[var(--dark-color)] dark:text-white text-sm sm:text-base">
            TID ${main_stats?.tid}
          </p>
        </div>
        <div className="mt-4 text-[var(--dark-color)] dark:text-white text-sm sm:text-base">
          <div className="bg-white dark:bg-[#3B3F45] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Your Rank</p>
            <p>{main_stats?.rank ?? "-"}</p>
          </div>
          <div className="bg-[#f9f9fe] dark:bg-[#2E3239] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Your Position</p>
            <p>{main_stats?.position ?? "-"}</p>
          </div>
          <div className="bg-white dark:bg-[#3B3F45] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Start Date</p>
            <p>{formatDate(main_stats?.start_date)}</p>
          </div>
          <div className="bg-[#f9f9fe] dark:bg-[#2E3239] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Total Referral</p>
            <p>{main_stats?.total_referral ?? "-"}</p>
          </div>
          <div className="bg-white dark:bg-[#3B3F45] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Total Commission</p>
            <p>{main_stats?.total_commission ?? "-"}</p>
          </div>
          <div className="bg-[#f9f9fe] dark:bg-[#2E3239] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Total Annual Sales</p>
            <p>{formatToTwoDecimals(main_stats?.total_annual_sales) ?? "-"}</p>
          </div>
          <div className="bg-white dark:bg-[#3B3F45] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Next Rank</p>
            <p>{main_stats?.next_rank_name ?? "-"}</p>
          </div>
          <div className="bg-[#f9f9fe] dark:bg-[#2E3239] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center mb-1">
            <p>Turnover Reset Date</p>
            <p>{formatDate(main_stats?.turnover_reset_date) ?? "-"}</p>
          </div>
          <div className="bg-white dark:bg-[#3B3F45] rounded-xl px-3 sm:px-[2rem] py-2 flex justify-between items-center">
            <p>Total Organization Size</p>
            <p>{main_stats?.total_organization_size ?? "-"}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 account-analytics-container bg-white text-black p-2 px-3 sm:px-[2rem] font-[600] rounded-xl flex justify-between items-center text-[var(--sidear-bg)] text-sm sm:text-base">
        <p>Total Income</p>
        <p>$ {formatToTwoDecimals(main_stats.total_income)}</p>
      </div>
    </div>
  );
}
