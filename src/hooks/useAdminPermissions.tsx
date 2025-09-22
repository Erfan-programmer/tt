"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

export interface PermissionItem {
  id: number;
  name: string;
  label: string;
}

export interface PermissionGroup {
  breadName: string;
  subtitle?: string;
  items: PermissionItem[];
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const token = await loadEncryptedData()?.token;
      const response = await apiRequest<any>("/v1/admin/permissions", "GET", {}, token);
      
      const groups: PermissionGroup[] = response?.data?.data.map((perm: any) => ({
        breadName: perm.label,
        subtitle: `Permission: ${perm.name}`,
        items: [
          {
            id: perm.id,
            name: perm.name,
            label: perm.label,
          },
        ],
      }));

      setPermissionGroups(groups);

      const perms: Record<string, boolean> = {};
      response?.data?.data.forEach((perm: any) => {
        perms[perm.name] = true; 
      });
      setPermissions(perms);

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
    setPermissions((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return {
    permissions,
    permissionGroups,
    togglePermission,
    fetchPermissions,
    loading,
  };
};
