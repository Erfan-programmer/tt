"use client";
import React, { useState } from "react";
import CustomAdminInput from "../CustomAdminInput";
import AdminTemplateBox from "../AdminTemplateBox";
import { useUserDocuments } from "@/contextApi/DocumentContext";

interface ContractInfo {
  investment_amount?: number;
  capital_health?: number;
  start_date?: string | null;
  end_date?: string | null;
}

export default function UserFinanceDeposit() {
  const { userInfo } = useUserDocuments();
  const contractInfo: ContractInfo = userInfo?.contract_info || {};

  const [amount, setAmount] = useState<string>(String(contractInfo.investment_amount) || "0");
  const [capitalHealth, setCapitalHealth] = useState<string>(String(contractInfo.capital_health) || "0");

  const startDate = contractInfo.start_date ? new Date(contractInfo.start_date) : new Date();
  const endDate = contractInfo.end_date ? new Date(contractInfo.end_date) : new Date();
  const now = new Date();

  const totalDays = Math.max(
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    1
  );

  const passedDays = Math.min(
    Math.max(Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 0),
    totalDays
  );

  const remainingDays = Math.max(totalDays - passedDays, 0);

  const remainingPercentage = (remainingDays / totalDays) * 100;

  return (
    <AdminTemplateBox title="Deposit">
      <CustomAdminInput title="Amount" value={String(amount)} onChange={setAmount} />
      <CustomAdminInput
        title="Capital Health"
        readOnly={true}
        value={capitalHealth}
        onChange={setCapitalHealth}
      />

      <div className="flex flex-col gap-2 mt-4">
        <label className="text-white mb-1">Tournament</label>
        <div className="relative w-full h-9 bg-[#b9bcc781] rounded-lg overflow-hidden">
          <div
            className="absolute top-0 h-full left-0 bg-[#D7FE63] transition-all duration-500"
            style={{ width: `${remainingPercentage}%` }}
          ></div>
          <div className="absolute w-full h-full flex items-center justify-center font-bold pointer-events-none text-lg text-black">
            {remainingDays} Days
          </div>
        </div>
      </div>
    </AdminTemplateBox>
  );
}
