"use client";
import { useState, useEffect } from "react";
import ProfitAndLossSkeleton from "@/skeletons/User-Panel/dashboard/ProfitAndLossSkeleton";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import Image from "next/image";

interface ProfitAndLossItem {
  value?: number;
}

interface MonthlyReport {
  [month: string]: ProfitAndLossItem | number | undefined;
  total: number;
}

interface LossCoverageData {
  [year: string]: MonthlyReport;
}

export default function TitanBonusShieldProfitAndLoss() {
  const [lossData, setLossData] = useState<LossCoverageData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLossCoverage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = loadUserData()?.access_token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/lossCoverage`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.success) {
        setError(response.error?.message || "Server connection error");
        setLossData(undefined);
        return;
      }

      setLossData(response.data?.data);
      console.log("res", response.data.data);
    } catch (err) {
      setError("Unexpected error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLossCoverage();
  }, []);

 const renderCell = (
  data: ProfitAndLossItem | number | string | undefined,
  isTotal: boolean = false
) => {
  let displayValue = "N/A";
  if (typeof data === "number") displayValue = data.toString();
  else if (typeof data === "object" && data?.value != null)
    displayValue = `$ ${data.value}`;
  else if (typeof data === "string") displayValue = data;

  const isNA = displayValue === "N/A";

  const bgClass = isTotal
    ? "bg-[#ddd] dark:bg-[#161616]"
    : "bg-gray-50 dark:bg-[#171b29]";

  const textClass = isTotal
    ? "text-blue-500 dark:text-blue-400"
    : isNA
    ? "text-gray-400 dark:text-gray-400"
    : "text-blue-500 dark:text-blue-400";

  const borderClass = isTotal ? "border-white" : "border-gray-300 dark:border-gray-600";

  const textShadowStyle = !isTotal && !isNA ? { textShadow: "2px 2px 40px #2A4D99" } : {};

  return (
    <div
      className={`h-16 border flex justify-center items-center rounded-lg ${bgClass} ${textClass} ${borderClass} font-semibold`}
      style={textShadowStyle}
    >
      {displayValue}
    </div>
  );
};


  if (isLoading) return <ProfitAndLossSkeleton />;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="profit-and-loss mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4">
      <div className="flex justify-between items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Image
            src="/0b910453f3055a293d84b2f5a91b6b887d6ac817.png"
            width={100}
            height={100}
            className="w-12 h-12"
            alt="Titan Logo"
          />
          <p className="text-[var(--main-background)] dark:text-white font-semibold text-lg">
            TITAN Loss Coverage Plan
          </p>
        </div>
      </div>

      {/* جدول */}
      <div className="bg-white dark:bg-[#171b29] rounded-lg text-[var(--main-background)] dark:text-white py-3 mt-[1rem] px-3 overflow-x-auto">
        <table className="w-full border-separate border-spacing-2 min-w-[1000px]">
          <thead>
            <tr>
              <th className="text-center w-[8rem]"></th>
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month) => (
                <th key={month} className="w-[8rem] text-center">
                  {month}
                </th>
              ))}
              <th className="text-center w-[8rem]">Total</th>
            </tr>
          </thead>
          <tbody>
            {lossData &&
              Object.entries(lossData).map(([year, months]) => (
                <tr key={year}>
                  <td className="rounded-lg text-center py-2 w-[8rem] font-semibold">
                    {year}
                  </td>
                  {months &&
                    Object.entries(months)
                      .filter(([key]) => key !== "total")
                      .map(([month, value]) => (
                        <td key={month} className="w-[8rem] rounded-lg mx-1">
                          {renderCell(value)}
                        </td>
                      ))}
                  {months && (
                    <td className="rounded-lg mx-1 w-[8rem]">
                      {renderCell(months.total, true)}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
