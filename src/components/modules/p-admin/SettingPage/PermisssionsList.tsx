"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SettingToggleSwitch from "./SettingToggleSwitch";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

interface PermissionItem {
  id: number;
  name: string;
  label: string;
}

export default function PermissionsList() {
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const disabled = true
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const token = loadEncryptedData()?.token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/permissions`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (response?.data?.data) {
        setPermissions(response.data.data);
        const status: Record<string, boolean> = {};
        response.data.data.forEach((perm: PermissionItem) => {
          status[perm.name] = true;
        });
        setPermissionStatus(status);
      }
    } catch (error) {
      console.error("Failed to fetch permissions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const togglePermission = (name: string) => {
    setPermissionStatus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <p>Loading permissions...</p>;

  return (
    <div className="space-y-4 mt-10">
      <AnimatePresence>
        {permissions.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-b border-[#DEDEDE] pb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {/* <span className="text-white">{item.label}</span> */}
                <p className="text-[1rem] text-[#9A9A9A] whitespace-nowrap overflow-ellipsis overflow-hidden">
                  {item.name}
                </p>
              </div>
              <SettingToggleSwitch
                checked={permissionStatus[item.name]}
                disabled={disabled}
                onChange={() => togglePermission(item.name)}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
