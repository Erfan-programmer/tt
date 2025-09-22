"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface HeaderUserData {
  deposit: string;
  rank_icon: string;
  t_id: number;
  t_wallet: number;
  verified: number;
  transform_to_twallet: number;
}

interface HeaderContextType {
  headerData: HeaderUserData | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
const locationRef =
  typeof window !== "undefined" ? window.location.pathname : "";
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const isAuthRoute = authRoutes.includes(locationRef);


  const fetchHeaderData = async (): Promise<HeaderUserData> => {
    const token = loadUserData()?.access_token;

    const res = await apiRequest<any>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/header/data`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (!res.success) {
      throw new Error(res.error?.message || "Failed to fetch header data");
    }

    return res.data.data; 
  };

  const {
    data: headerData,
    isLoading,
    error,
    refetch,
  } = useQuery<HeaderUserData>({
    queryKey: ["headerData"],
    queryFn: fetchHeaderData,
    enabled: !isAuthRoute,
  });

  return (
    <HeaderContext.Provider value={{ headerData, isLoading, error, refetch }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
