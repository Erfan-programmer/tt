"use client"
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  Plugin,
} from "chart.js";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

interface LineChartProps {
  data: ChartData;
  activeDataset: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, activeDataset }) => {
  const { resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
  }, [resolvedTheme]);

  const chartBackgroundPlugin: Plugin<"line"> = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      ctx.save();
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: getColorForLabel(dataset.label),
      backgroundColor: `${getColorForLabel(dataset.label)}`,
      borderWidth: index === activeDataset ? 2 : 1,
      opacity: index === activeDataset ? 1 : 0.3,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointBorderWidth: 0,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDark ? "#f0f0f0" : "#f0f0f0",
          font: {
            weight: 500,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDark ? "rgba(0, 0, 0, 0.8)" : "#f0f0f0",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function (context) {
            const dataset = context.dataset;
            const value = context.parsed.y;
            return `${dataset.label}: ${value}`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          color: resolvedTheme ? "#888" : "#888",
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        min: 0, 
        ticks: {
          color: isDark ? "#888" : "#888",
          font: {
            weight: 500,
          },
          callback: (value: string | number) => {
            if (typeof value === "number") {
              if (value >= 1_000_000) {
                return value / 1_000_000 + "M";
              } else if (value >= 1_000) {
                return value / 1_000 + "K";
              }
            }
            return value;
          },
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "#ccc",
          lineWidth: 1,
          tickBorderDash: [10, 10],
          tickBorderDashOffset: 4,
        },
        border: {
          dash: [20, 10],
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <div className="relative mt-8 rounded-lg" style={{ height: "400px" }}>
      <div className="w-full h-full overflow-x-auto overflow-y-hidden">
        <div className="min-w-[800px] line-chart-container h-full">
          <Line
            data={chartData}
            options={options}
            plugins={[chartBackgroundPlugin]}
          />
        </div>
      </div>
    </div>
  );
};

const getColorForLabel = (label: string) => {
  switch (label) {
    case "ROI":
      return "#4CAF50";
    case "Commission":
      return "#FFA500";
    case "Ref":
      return "#0088cc";
    default:
      return "#4CAF50";
  }
};

export default LineChart;
