"use client";

import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { apiRequest } from "@/libs/api";
import { useCallback, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AnimationTemplate from "./AnimationTemplate";
import YearPagination from "@/components/modules/UserPanel/dashboard/YearPagination";

interface DatasetType {
  label: string;
  data: Record<string, number>;
}

interface PaginationType {
  current_year: number;
  available_years: number[];
}

interface ApiStatusChart {
  data: {
    labels: string[];
    datasets: DatasetType[];
  };
  meta?: PaginationType;
}

interface ChartRow {
  month: string;
  [key: string]: string | number;
}

export default function DashboardCompareLineChart() {
  const [selectedMetric, setSelectedMetric] = useState<string>("Users");
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [showLineTitle, setShowLineTile] = useState({
    statusCart: true,
  });

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
    getStatusChart(year); 
  };

  const axisColor = "#E5E7EB";
  const gridColor = "#FFFFFF22";
  const axisLineColor = "#E5E7EB33";


const getStatusChart = useCallback(
  async (year: number) => {
    const token = loadEncryptedData()?.token;
    const response = await apiRequest<ApiStatusChart>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/dashboard/status-chart?year=${year}`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (response.success && response.data) {
      setDatasets(response.data.data.datasets);
      setAvailableYears(response?.data?.meta?.available_years || []);

      const transformed: ChartRow[] = response.data.data.labels.map(
        (month: string) => {
          const row: ChartRow = { month };
          response.data.data.datasets.forEach((ds: DatasetType) => {
            row[ds.label] = ds.data[month] ?? 0;
          });
          return row;
        }
      );

      setChartData(transformed);

      if (response.data.meta) {
        setPagination(response.data.meta);
      }
    }
  },
  [setDatasets, setAvailableYears, setChartData, setPagination]
);


  useEffect(() => {
    getStatusChart(currentYear);
  }, [getStatusChart , currentYear]);

  return (
    <>
      <div className="w-full rounded-2xl shadow-md overflow-x-auto focus:outline-none focus:ring-0">
        <div className="flex flex-col gap-4 mb-4 justify-between">
          <LineTitle
            onClick={() =>
              setShowLineTile((prev) => ({
                ...prev,
                statusCart: !prev.statusCart,
              }))
            }
            title="Status Chart"
          />
          {showLineTitle.statusCart && (
            <AnimationTemplate>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                <span className="text-white text-lg sm:text-xl">
                  {currentYear}
                </span>
                <div className="flex flex-wrap gap-2 items-center overflow-x-auto">
                  {datasets.map((ds) => {
                    const active = selectedMetric === ds.label;
                    return (
                      <button
                        key={ds.label}
                        onClick={() => setSelectedMetric(ds.label)}
                        className={`px-3 py-2 rounded-xl text-sm sm:text-base font-medium transition-all border backdrop-blur-sm focus:outline-none focus:ring-0
                    ${
                      active
                        ? "bg-white/20 text-white border-white/30 shadow"
                        : "bg-white/10 text-gray-100 border-white/15 hover:bg-white/15"
                    }
                  `}
                      >
                        {ds.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimationTemplate>
          )}
        </div>
        {showLineTitle.statusCart && (
          <AnimationTemplate>
            <div className="w-full border border-white/20 rounded-2xl flex flex-col justify-between overflow-x-auto p-4 focus:outline-none focus:ring-0">
              <div className="flex-1 min-w-[720px]">
                <ResponsiveContainer width="100%" height={480}>
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: axisColor, fontSize: 16, dy: 20 }}
                      axisLine={{ stroke: axisLineColor }}
                      tickLine={{ stroke: axisLineColor }}
                    />
                    <YAxis
                      tick={{ fill: axisColor, fontSize: 12, dx: -5 }}
                      axisLine={{ stroke: axisLineColor }}
                      tickLine={{ stroke: axisLineColor }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(17, 24, 39, 0.9)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 12,
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />

                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      name={`${selectedMetric} (${currentYear})`}
                      stroke={"#23FB18"}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AnimationTemplate>
        )}
      </div>

      {pagination && (
        <div className="flex justify-center mt-6">
          <YearPagination
            years={availableYears}
            currentYear={currentYear}
            onYearChange={handleYearChange}
          />
        </div>
      )}
    </>
  );
}
