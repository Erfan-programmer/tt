"use client";
// VerificationListContext.tsx
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/libs/api";
import { useVerify } from "./TitanContext";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

type VerificationItem = {
  id: number;
  client_id: number;
  type: "passport" | "national_id" | "driver_license";
  path?: string;
  status?: "pending" | "approved" | "rejected";
  reject_reason?: string | null;
  created_at?: string;
  updated_at?: string;
  verifier?: any;
  key?: string;
  title?: string;
  file?: File;
};

interface VerificationListContextType {
  verificationList: VerificationItem[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

const VerificationListContext = createContext<VerificationListContextType | undefined>(undefined);

export const VerificationListProvider = ({ children }: { children: React.ReactNode }) => {
  const { setFileSectionPairs } = useVerify();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<VerificationItem[]>({
    queryKey: ["verification_list"],
    queryFn: async () => {
      const token = loadUserData()?.access_token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/documents`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        const normalized = res.data.data.map((item:any, index:number) => ({
          ...item,
          path:item.status.toLowerCase() === "rejected" ? "" : item.path,
          key: `document[${index}]`,
          title: item.type, 
        }));
      console.log("normalaized =>" , normalized)
        setFileSectionPairs(normalized);
        return normalized;
      } else {
        throw new Error(res.error?.message || "Failed to fetch verification list");
      }
    },
  });

  return (
    <VerificationListContext.Provider
      value={{ verificationList: data, isLoading, error, refetch }}
    >
      {children}
    </VerificationListContext.Provider>
  );
};

export const useVerificationList = () => {
  const context = useContext(VerificationListContext);
  if (context === undefined) {
    throw new Error("useVerificationList must be used within a VerificationListProvider");
  }
  return context;
};
