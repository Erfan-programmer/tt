"use client";

import React, { useEffect, useState } from "react";
import "./Chart.css";
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
} from "chart.js";
import { motion } from "framer-motion";

// Dynamic import for Lottie to avoid SSR issues
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import LottieDesctap from "@/../public/animations/chart.json";
import LottieMobile from "@/../public/animations/chart-mobile.json";

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

const data = {
  labels: ["Page A", "Page B", "Page C", "Page D", "Page E", "Page F", "Page G"],
  datasets: [
    {
      label: "Titan",
      data: [100, 3000, 2000, 2780, 4890, 5390, 8000],
      borderColor: "#1A68FF",
      backgroundColor: "rgba(0, 123, 255, 0.2)",
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: (context: any) =>
        context.dataIndex === 0 ||
        context.dataIndex === context.dataset.data.length - 1
          ? 5
          : 0,
    },
    {
      label: "Bitcoin",
      data: [100, 1398, 2800, 1908, 2800, 1800, 5000],
      borderColor: "#F2C94C",
      backgroundColor: "rgba(40, 167, 69, 0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: (context: any) =>
        context.dataIndex === 0 ||
        context.dataIndex === context.dataset.data.length - 1
          ? 5
          : 0,
    },
  ],
};

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: "Chart Title",
    },
  },
  scales: {
    y: { position: "right", min: 0, max: 10000 },
    x: { type: "category", ticks: { display: false } },
  },
  animation: { duration: 1500, easing: "easeOutQuad" },
};

interface BusinessChartProps {
  queryCondition: string;
}

const BusinessChart: React.FC<BusinessChartProps> = ({ queryCondition }) => {
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  useEffect(() => {
    setIsLottieLoaded(true);
  }, []);

  return (
    <motion.div
      viewport={{ once: true }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="w-full lg:w-[50%]"
    >
      <div style={{ position: "relative" }}>
        {isLottieLoaded ? (
          queryCondition === "mobile" ? (
            <div className="block lg:hidden titan_chart">
              <Lottie animationData={LottieMobile} loop style={{ width: 100, height: 100 }} />
            </div>
          ) : (
            <div className="hidden lg:flex titan_chart">
              <Lottie animationData={LottieDesctap} loop style={{ width: "100%", height: "auto" }} />
            </div>
          )
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </motion.div>
  );
};

export default BusinessChart;
