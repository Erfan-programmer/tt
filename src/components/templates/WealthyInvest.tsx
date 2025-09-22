"use client";
import { WealthyProvider } from "@/contextApi/PieContext";

import React from "react";
import WealthyInvestIntroduction from "../modules/WealthyInvestIntroduction";
import WealthyChartPie from "../modules/WealthyChartPie";

export default function WealthyInvest() {

  return (
    <div className="w-[90%] my-[10rem] sm:my-[15rem] flex flex-col lg:flex-row justify-center items-center">
      <WealthyProvider>
        <WealthyInvestIntroduction />
        <WealthyChartPie />
      </WealthyProvider>
    </div>
  );
}
