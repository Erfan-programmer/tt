"use client";

import { useEffect, useState } from "react";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import AccountList from "./AccountList";
import SponsorPlus from "./SponsorPlus";
import { StatementsProvider } from "@/contextApi/SponsorContext";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";

export default function FinancialSponsorPlus() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const token = loadUserData()?.access_token;
      if (!token) throw new Error("No access token found");

      const res = await apiRequest<{data:any}>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/sponsor-plus/list`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      setAccounts(res?.data?.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <>
      <TitanNotice
        title="Notice"
        description="Please enter your information carefully. Then, click on the 'Continue' button to proceed with the investment and registration process. In the deposit section, select your preferred payment method. Your investment account details will be sent to you as soon as possible based on the chosen payment method."
      />
      <StatementsProvider>
        <SponsorPlus refetch={fetchAccounts}/>
        {loading ? (
          <p className="text-[#383C47] dark:text-white">Loading accounts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <AccountList accounts={accounts} refetch={fetchAccounts}/>
        )}
      </StatementsProvider>
    </>
  );
}
