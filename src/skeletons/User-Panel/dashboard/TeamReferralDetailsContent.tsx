"use client";

import { useEffect, useState } from "react";
import TeamReferalDetailsContentStatement from "./TeamReferalDetailsContentStatement";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface ReferralDetailResponse {
  totalReferralIncome: string;
  directSalesCount: number;
  referrals: any[];
}

export default function TeamReferralDetailsContent() {
  const [data, setData] = useState<ReferralDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReferralDetails = async () => {
    setIsLoading(true);
    setError(null);
    const token = loadUserData()?.access_token;

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/referralDetail`,
        "GET",
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        setData(res.data.data);
      } else {
        setError(res.message || "Failed to fetch referral details");
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-4 animate-pulse">
        <div className="border-standard px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg">
          <div className="w-40 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="border-standard px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom mt-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg">
          <div className="w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded" />
        </div>
        <div className="mt-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-full h-8 bg-gray-300 dark:bg-gray-600 rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data) return <div>No data found</div>;

  const totalDirectSales = data.directSalesCount;
  const totalReferralIncome = data.totalReferralIncome;
  const referralList = data.referrals || [];

  return (
    <div className="mt-4">
      <div className="team-refferal-detail border-standard px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--dark-color)] dark:text-white">
        <p>Total Number of Direct Sales: {totalDirectSales}</p>
      </div>
      <div className="team-refferal-detail border-standard px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom mt-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--dark-color)] dark:text-white">
        <p>Total referral income: $ {totalReferralIncome}</p>
      </div>

      <TeamReferalDetailsContentStatement list={referralList} />
    </div>
  );
}
