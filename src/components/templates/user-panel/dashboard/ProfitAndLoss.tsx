"use client";
import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import ProfitAndLossSkeleton from "@/skeletons/User-Panel/dashboard/ProfitAndLossSkeleton";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import Image from "next/image";
import { FaArrowsLeftRight } from "react-icons/fa6";

interface ProfitAndLossItem {
  value: number;
  status: string;
  is_loss_covered: boolean;
  empty: boolean;
  outside: boolean;
  current_data?: any[];
}

interface ProfitAndLossData {
  [key: string]: {
    [key: string]: ProfitAndLossItem | number;
    total: number;
  };
}

interface ProfitAndLossResponse {
  yearly_report: ProfitAndLossData;
  overall_performance_percentage: number;
}

export default function ProfitAndLoss() {
  const [profitAndLossData, setProfitAndLossData] =
    useState<ProfitAndLossResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfitAndLoss = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = loadUserData()?.access_token;
      const response =
        await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/profitLossReport`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

      if (!response.success) {
        setError(response.error?.message || "Server connection error");
        setProfitAndLossData(undefined);
        return;
      }

      setProfitAndLossData(response.data.data);
    } catch (err) {
      setError("Unexpected error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfitAndLoss();
  }, []);

  const renderCell = (data: ProfitAndLossItem | number) => {
    if (typeof data === "number") {
      return (
        <div className="h-[4rem] border-1 relative bg-[var(--success)] overflow-hidden border-[#fff] flex justify-center items-center rounded-lg">
          <span className="text-[var(--main-background)] font-[600]">
            {data === null ? "empty" : data}
          </span>
        </div>
      );
    }

    if (data?.current_data?.length) {
      return (
        <div className="h-[4rem] border border-1 relative overflow-hidden border-[#fff] flex justify-center items-center rounded-lg">
          <Image
            width={200}
            height={200}
            src="/images/TradeDesk.png"
            className="w-full h-full object-cover"
            alt=""
          />
        </div>
      );
    }

    return (
      <div
        className={`h-[4rem] border border-1 relative overflow-hidden flex justify-center items-center rounded-lg ${
          data === null
            ? " bg-gray-300 dark:bg-[#393939] border-white"
            : data?.value > 0
            ? "shadow-[inset_0_0_10px_#00CB08] bg-transparent border-[#00CB08]"
            : data?.value < 0 ? "shadow-[inset_0_0_10px_#FF6060] border-[#FF6060] bg-transparent" : "shadow-[inset_0_0_10px_#ffcc00] border-[var(--normal)] bg-transparent"
        }`}
      >
        {!data?.outside && !data?.empty && data?.value ? (
          <>
            <span className="absolute left-0 top-0">
              <Image
                src={"/0b910453f3055a293d84b2f5a91b6b887d6ac817.png"}
                width={200}
                height={200}
                alt=""
                className="w-8"
              />
            </span>
            <span
              className={`${
                data === null
                  ? ""
                  : data?.value > 0
                  ? "text-[var(--success)] dark:text-[#65FFD9]"
                  : "textr-[var(--loss)] dark:text-[#FF6060]"
              }`}
            >
              {data?.status?.toLowerCase() === "completed" ? (
                data?.value > 0 ? (
                  "+" + data?.value
                ) : (
                  "" + data?.value
                )
              ) : (
                <Image src={"/TradeDesk.png"} width={300} height={300} alt="" />
              )}
            </span>
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

  if (isLoading) return <ProfitAndLossSkeleton />;
  if (error)
    return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="profit-and-loss mt-[1rem] w-full bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg p-4">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <p className="text-[var(--main-background)] dark:text-white">
            Profit and Loss
          </p>
          <div className="profit-and-loss-numers flex jusfity-center gap-1 items-center ">
            {profitAndLossData &&
            profitAndLossData?.overall_performance_percentage > 0 ? (
              <>
                <FaArrowRight className="text-[var(--profit)] rotate-315" />
                <span className="text-[var(--profit)]">
                  +{profitAndLossData.overall_performance_percentage}%
                </span>
              </>
            ) : profitAndLossData?.overall_performance_percentage === 0 ?  (
              <>
                <FaArrowsLeftRight className="text-[var(--normal)] " />
                <span className="!text-[var(--normal)]">
                  {profitAndLossData.overall_performance_percentage}%
                </span>
              </>

            ): (
              <>
                <FaArrowRight className="text-[var(--loss)] rotate-30" />
                <span className="text-[var(--loss)]">
                  -
                  {Math.abs(
                    profitAndLossData?.overall_performance_percentage || 0
                  )}
                  %
                </span>
              </>
            )}
          </div>
        </div>
      </div>

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
            {profitAndLossData?.yearly_report &&
              Object.entries(profitAndLossData.yearly_report).map(
                ([category, data]) => (
                  <tr key={category}>
                    <td className="rounded-lg text-center py-2 w-[8rem]">
                      {category}
                    </td>
                    {Object.entries(data.months)
                      ?.filter(([key]) => key !== "total")
                      .map(([month, value]) => (
                        <td key={month} className="w-[8rem] rounded-lg mx-1">
                          {renderCell(value as ProfitAndLossItem)}
                        </td>
                      ))}
                    <td className="rounded-lg mx-1 w-[8rem]">
                      {renderCell(data.total)}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
