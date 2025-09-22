"use client";
import React from 'react';
import ChartBox from '../Chart/ChartBox';
import BusinessChart from '@/components/modules/Chart/Chart';

export default function EarthChartContainer() {
  return (
    <div className="w-[90%] my-[10rem] sm:my-auto flex flex-col lg:flex-row justify-center items-center gap-8">
      <ChartBox />
      <BusinessChart queryCondition="desktop" />
    </div>
  );
}
