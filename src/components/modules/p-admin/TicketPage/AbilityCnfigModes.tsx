"use client";
import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AbilityConfigBox from "./AbilityConfigBox";

interface RankData {
  id: number;
  name: string;
  can_send_messages: boolean;
  level: number;
}

export default function AbilityCnfigModes() {
  const [configs, setConfigs] = useState<RankData[]>([]);
  const token = loadEncryptedData()?.token;

  const fetchConfigs = useCallback(async () => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getToggleMessaging`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) setConfigs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }, [token, setConfigs]);

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/rank/toggleMessaging/${id}`,
        "POST",
        { action_enabled: enabled },
        { Authorization: `Bearer ${token}` }
      );
      await fetchConfigs();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return (
    <div className="ability-configs-mode border-[2px] rounded-[.5rem] border-[#383C47] px-4 py-2">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {configs.map((config) => (
          <AbilityConfigBox
            key={config.id}
            title={config.name}
            enabled={config.can_send_messages}
            onToggle={(val) => handleToggle(config.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
