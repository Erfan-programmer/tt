"use client";

import { useEffect, useState } from "react";
import TeamRankProgessionBarContent from "./TeamRankProgessionBarContent";
import TeamRankProgessionContent from "./TeamRankProgessionContent";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";


export default function RankProgressionPage() {
  const [ranks, setRanks] = useState<any[]>([]);
  const [currentRank, setCurrentRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //   const { data: permissions } = usePermissions();
  //   let permissionArray: string[] = [];

  //   if (typeof permissions?.data?.body === "string") {
  //     permissionArray = permissions.data.body.split(",");
  //   } else if (Array.isArray(permissions?.data?.body)) {
  //     permissionArray = permissions.data.body;
  //   }

  useEffect(() => {
    const fetchRanks = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = loadUserData()?.access_token;
        const response = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/rank-progression`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response.success) {
          setRanks(response.data?.data?.all_ranks || []);
          setCurrentRank(response.data?.data?.user_progress || null);
        } else {
          setError(response.message || "Failed to load ranks");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRanks();
  }, []);

  return (
    <>
      {/* {permissionArray.includes("network.rank_progression.your_rank") && ( */}
      {/* )} */}

      {/* {permissionArray.includes("network.rank_progression.ranks_list") && ( */}
      <TeamRankProgessionBarContent
        currentRank={currentRank}
        loading={loading}
      />
      <TeamRankProgessionContent ranks={ranks} loading={loading} />
      {/* )} */}

      {error && <div className="text-red-500">{error}</div>}
    </>
  );
}
