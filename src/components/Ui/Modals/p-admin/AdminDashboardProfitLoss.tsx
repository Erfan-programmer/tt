"use client";

import LineTitle from "@/components/modules/p-admin/LineTitle";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AnimationTemplate from "./AnimationTemplate";

const months = [
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
];

interface ApiResponse {
  meta: {
    current_year: number;
    available_years: number[];
  };
  report: {
    monthly_data: {
      [key: string]: number | null;
    };
    total: number;
  };
}

export default function AdminDashboardProfitLoss() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLineTitle, setShowLineTile] = useState({
    profit_loss: true,
  });
  const fetchData = async () => {
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/dashboard/company-pl-chart`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      const { meta, report } = res.data;

      const row: any = { year: meta.current_year };
      months.forEach((month) => {
        const value = report.monthly_data[month] ?? null;
        row[month] = value === null ? "-" : value;
      });

      setData((prev) => [...prev, row]);
    } catch (err) {
      console.error("Error fetching profit/loss data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="overflow-x-hidden">
      <LineTitle
        onClick={() =>
          setShowLineTile((prev) => ({
            ...prev,
            profit_loss: !prev.profit_loss,
          }))
        }
        title="Profit And Loss"
      />
      {showLineTitle.profit_loss && (
        <AnimationTemplate>
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] xl:w-full border overflow-hidden border-white/20 rounded-t-xl text-left">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400">
                    <th className="px-4 py-2 border border-white/20 sticky left-0 bg-gray-800 z-10">
                      Year
                    </th>
                    {months.map((month) => (
                      <th
                        key={month}
                        className="px-4 py-2 border border-white/20"
                      >
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row) => (
                    <tr
                      key={row.year}
                      className="hover:bg-white/10 transition-all text-white"
                    >
                      <td className="px-4 py-2 font-medium border border-white/20 sticky -left-1 bg-gray-800 inset-0 z-10">
                        {row.year}
                      </td>
                      {months.map((month) => {
                        const value = row[month];
                        if (value === "current") {
                          return (
                            <td
                              key={month}
                              className="w-6 h-4 border border-white/20 text-center"
                            >
                              <Image
                                width={800}
                                height={800}
                                src="/TradeDesk.png"
                                alt="current month"
                                className="w-full mx-auto"
                              />
                            </td>
                          );
                        } else if (value === "-") {
                          return (
                            <td
                              key={month}
                              className="px-4 py-2 border border-white/20 text-center text-gray-400"
                            >
                              -
                            </td>
                          );
                        } else {
                          return (
                            <td
                              key={month}
                              className={`px-4 py-2 border border-white/20 text-center ${
                                value >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {value}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AnimationTemplate>
      )}
    </div>
  );
}
