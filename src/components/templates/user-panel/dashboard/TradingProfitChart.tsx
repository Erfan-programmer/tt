"use client";

import { useState, useEffect } from "react";
import TradingProfitChartSkeleton from "@/skeletons/User-Panel/dashboard/TradingProfitChartSkeleton";
import ProfitTabs from "@/components/modules/UserPanel/dashboard/ProfitTabs";
import LineChart from "@/components/modules/UserPanel/dashboard/LineChart";
import YearPagination from "@/components/modules/UserPanel/dashboard/YearPagination";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface ChartDataset {
  label: string;
  data: number[];
  increase?: number;
}
interface ProfitMeta {
  total: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  currentYear: number;
  available_years: number[];
}

interface ProfitResponse {
  labels: string[];
  datasets: ChartDataset[];
}

export default function TradingProfitChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<ProfitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDataset, setActiveDataset] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const fetchChartData = async (year?: number) => {
    try {
      const token = loadUserData()?.access_token;
      setIsLoading(true);

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/v1/client/dashboard/profit-chart${year ? `?year=${year}` : ""}`;

      const response = await apiRequest<{ data: ProfitResponse, meta: ProfitMeta }>(
        url,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.success) {
        setError(response.error?.message || "Server connection error");
        setChartData(null);
        return;
      }

      const { labels, datasets } = response.data.data;
      const { meta } = response.data;

      setChartData({ labels, datasets });

      if (meta.available_years) {
        setAvailableYears(meta.available_years);
      } else {
        const now = new Date().getFullYear();
        setAvailableYears(Array.from({ length: 6 }, (_, i) => now - i));
      }
    } catch {
      setError("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(currentYear);
  }, [currentYear]);

  const handleTabChange = (index: number) => setActiveDataset(index);
  const handleYearChange = (year: number) => setCurrentYear(year);

  if (isLoading) {
    return <TradingProfitChartSkeleton />;
  }

  return (
    <div className="trade-overview mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4">
      <div className="flex justify-between items-center gap-4">
        <p className="text-[#333] dark:text-white">
          Profit & Network Expansion
        </p>
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          className="stroke-[#333] dark:stroke-[#D9D9D9]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 17.1111C1 16.3333 1 15.9443 1.15138 15.6472C1.28454 15.3859 1.49701 15.1734 1.75835 15.0403C2.05545 14.8889 2.44437 14.8889 3.22222 14.8889H4.33333C5.11118 14.8889 5.50011 14.8889 5.79721 15.0403C6.05854 15.1734 6.27102 15.3859 6.40418 15.6472C6.55556 15.9443 6.55556 16.3333 6.55556 17.1111V23.7778C6.55556 24.5556 6.55556 24.9446 6.40418 25.2417C6.27102 25.503 6.05854 25.7155 5.79721 25.8486C5.50011 26 5.11118 26 4.33333 26H3.22222C2.44437 26 2.05545 26 1.75835 25.8486C1.49701 25.7155 1.28454 25.503 1.15138 25.2417C1 24.9446 1 24.5556 1 23.7778V17.1111Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.7222 3.22222C10.7222 2.44437 10.7222 2.05545 10.8736 1.75835C11.0068 1.49701 11.2192 1.28454 11.4806 1.15138C11.7777 1 12.1666 1 12.9444 1H14.0556C14.8334 1 15.2223 1 15.5194 1.15138C15.7808 1.28454 15.9932 1.49701 16.1264 1.75835C16.2778 2.05545 16.2778 2.44437 16.2778 3.22222V23.7778C16.2778 24.5556 16.2778 24.9446 16.1264 25.2417C15.9932 25.503 15.7808 25.7155 15.5194 25.8486C15.2223 26 14.8334 26 14.0556 26H12.9444C12.1666 26 11.7777 26 11.4806 25.8486C11.2192 25.7155 11.0068 25.503 10.8736 25.2417C10.7222 24.9446 10.7222 24.5556 10.7222 23.7778V3.22222Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.4444 11.5556C20.4444 10.7777 20.4444 10.3888 20.5958 10.0917C20.729 9.83034 20.9415 9.61787 21.2028 9.48471C21.4999 9.33333 21.8888 9.33333 22.6667 9.33333H23.7778C24.5556 9.33333 24.9446 9.33333 25.2417 9.48471C25.503 9.61787 25.7155 9.83034 25.8486 10.0917C26 10.3888 26 10.7777 26 11.5556V23.7778C26 24.5556 26 24.9446 25.8486 25.2417C25.7155 25.503 25.503 25.7155 25.2417 25.8486C24.9446 26 24.5556 26 23.7778 26H22.6667C21.8888 26 21.4999 26 21.2028 25.8486C20.9415 25.7155 20.729 25.503 20.5958 25.2417C20.4444 24.9446 20.4444 24.5556 20.4444 23.7778V11.5556Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="border border-[#e0e2e7] dark:border-[#171b29] px-3 py-3 mt-[1rem] rounded-lg text-[#333] dark:text-white">
        {error ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">{error}</p>
          </div>
        ) : chartData ? (
          <>
            <ProfitTabs
              datasets={chartData.datasets}
              activeDataset={activeDataset}
              onTabChange={handleTabChange}
            />
            <LineChart data={chartData} activeDataset={activeDataset} />
            <div className="flex justify-center mt-4">
              <YearPagination
                years={availableYears}
                currentYear={currentYear}
                onYearChange={handleYearChange}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}