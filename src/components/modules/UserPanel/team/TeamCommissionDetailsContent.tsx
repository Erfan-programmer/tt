"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/libs/api";
import TeamCommissionDetailsContentStatement, { Statement } from "@/skeletons/User-Panel/dashboard/TeamCommissionDetailsContentStatement";
import { loadUserData } from "../../EncryptData/SavedEncryptData";

interface CommissionResponse {
  status: string;
  message: string;
  data: {
    statement: Statement[];
    total_received_commissions: number;
  };
}

export default function TeamCommissionDetailsContent() {
  const [commissionData, setCommissionData] =
    useState<CommissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // const { data: permissions } = usePermissions();

  // let permissionArray: string[] = [];

  // if (typeof permissions?.data?.body === "string") {
  //   permissionArray = permissions.data.body.split(",");
  // } else if (Array.isArray(permissions?.data?.body)) {
  //   permissionArray = permissions.data.body;
  // }

  useEffect(() => {
    const fetchCommissions = async () => {
      setIsLoading(true);
      setError(null);
      const token = loadUserData()?.access_token;
      try {
        const res = await apiRequest<CommissionResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/commissions`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setCommissionData(res.data);
        } else {
          setError(res.message || "Failed to fetch commissions");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  if (isLoading) {
    return <div className="text-center py-6">Loading commissions...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-4">
      {/* {permissionArray.includes("network.commission_details.commissions") && ( */}
        <div className="border-standard team-commission-detail px-[2rem] font-[600] py-[1.5rem] bg-shadow-custom bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] rounded-lg text-[var(--main-background)] dark:text-white">
          <p>
            Total Received Commissions: ${" "}
            {commissionData?.data?.total_received_commissions || 0}
          </p>
        </div>
      {/* // )} */}

      {/* {permissionArray.includes("network.commission_details.statement") && ( */}
        <TeamCommissionDetailsContentStatement
          statements={commissionData?.data?.statement || []}
          total_resivied_commission={
            commissionData?.data?.total_received_commissions || 0
          }
        />
      {/* )} */}
    </div>
  );
}
