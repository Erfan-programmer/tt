"use client";

import { useEffect, useState } from "react";
import TeamAccountAnalyticsContent from "./TeamAccountAnalyticsContent";
import TeamAccountAnalyticsCountries from "./TeamAccountAnalyticsCountries";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import TitanNotice from "../../TitanNotice/TitanNotice";

export default function AccountAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = loadUserData()?.access_token;
      try {
        setIsLoading(true);
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/dashboard/analytics`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setData(res.data?.data);
        } else {
          setError(res.message || "Failed to fetch analytics");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const info = data?.main_stats;
  const countries = data?.country_stats || [];

  //   const { data: permissions } = usePermissions();
  //   let permissionArray: string[] = [];

  //   if (typeof permissions?.data?.body === "string") {
  //     permissionArray = permissions.data.body.split(",");
  //   } else if (Array.isArray(permissions?.data?.body)) {
  //     permissionArray = permissions.data.body;
  //   }

  return (
    <>
      <TitanNotice
        title="Notice"
        description={`If your contract has expired, you may either renew your account or cancel it and request withdrawal.
For users with Silver rank or above, renewal requires a 5% fee based on your total income.
For users below Silver rank, renewal is free of charge.
The renewal fee can be either automatically deducted from your account balance or paid directly by you.
Upon renewal, the system will automatically issue a two-year contract for your account.
If your total income exceeds 5 times your initial investment, your initial capital will no longer be refundable.
If you choose not to renew, you must follow the official account cancellation process.
`}
warning="Warning: If you do not renew or cancel your contract within the next six months, your account will be permanently closed and inaccessible."
      />
      {/* {permissionArray.includes("network.account_analytics.account_analytics") && ( */}
      <TeamAccountAnalyticsContent
        main_stats={info}
        isLoading={isLoading}
        error={error}
      />
      {/* )} */}

      {/* {permissionArray.includes("network.account_analytics.countries") && ( */}
      <TeamAccountAnalyticsCountries
        countries={countries}
        isLoading={isLoading}
        error={error}
      />
      {/* )} */}
    </>
  );
}
