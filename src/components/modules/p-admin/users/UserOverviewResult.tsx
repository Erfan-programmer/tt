"use client";
import React, { useState } from "react";
import CustomAdminInput from "../CustomAdminInput";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

interface Wallet {
  id: string | number;
  accountType: string;
  rank: string;
  startDate: string;
  tWallet: string;
  roi: string;
  commission: string;
  referral: string;
  totalIncome: string;
  annualSell: string;
  subsets: string;
}

export default function UserOverviewResult() {
  const { userInfo, fetchUserInfo } = useUserDocuments();
  const [wallet, setWallet] = useState<Wallet>({
    id: 1,
    accountType: userInfo?.personal_info?.user_type || "",
    rank: userInfo?.contract_info?.rank || "",
    startDate: userInfo?.contract_info?.start_date || "",
    tWallet: userInfo?.balances?.t_wallet || "",
    roi: userInfo?.balances?.roi || "",
    commission: userInfo?.balances?.commission || "",
    referral: userInfo?.balances?.referral || "",
    totalIncome: userInfo?.contract_info?.total_income || "",
    annualSell: userInfo?.personal_info?.sales_volume || "",
    subsets: "",
  });

  const fields = [
    { key: "tWallet", label: "T-Wallet" },
    { key: "roi", label: "ROI" },
    { key: "commission", label: "Commission" },
    { key: "referral", label: "Referral" },
    { key: "totalIncome", label: "Total Income" },
    { key: "annualSell", label: "Annual Sell" },
  ];

  const handleAmountChange = async (field: keyof Wallet, value: string) => {
    setWallet((prev) => ({ ...prev, [field]: value }));

    if (!userInfo?.tid) return;

    try {
      const token = loadEncryptedData()?.token;
      if (!token) throw new Error("Token not found");

      const apiFieldMap: Record<keyof Wallet, string> = {
        tWallet: "t_wallet",
        roi: "roi",
        commission: "commission",
        referral: "referral",
        totalIncome: "total_income",
        annualSell: "annual_sell",
        accountType: "",
        rank: "",
        startDate: "",
        subsets: "",
        id: "",
      };

      const apiField = apiFieldMap[field];
      if (!apiField) return;

      const body = { [apiField]: value };

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/updateUserAmount/${userInfo.tid}`,
        "POST",
        body,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(`${field} updated successfully`);
        fetchUserInfo(userInfo.tid);
      } else {
        toast.error(res.message || "Update failed");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
    }
  };

  return (
    <div className="user-overview-container mt-12">
      <p className="text-white text-lg font-semibold mb-3">User Overview</p>
      <div className="border-[2px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 rounded-[.5rem] border-[#383C47] px-2 p-3 flex flex-col gap-3">
        {fields.map((field) => (
          <CustomAdminInput
            key={field.key}
            title={field.label}
            value={String(wallet[field.key as keyof Wallet] || "")}
            onChange={(val) => handleAmountChange(field.key as keyof Wallet, val)}
          />
        ))}
      </div>
    </div>
  );
}
