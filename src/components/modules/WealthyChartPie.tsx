"use client";

import dynamic from "next/dynamic";


const CarouselPieChart = dynamic(() => import("./Chart/Pie"), { ssr: false });

export default function WealthyChartPie() {
  return (
    <div className="w-full md:w-[50%] mx-auto flex justify-center items-center">
      <CarouselPieChart/>
    </div>
  );
}
