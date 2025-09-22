"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface StatementsContextType {
  statements: any[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchStatements: (page?: number) => Promise<void>;
}

const StatementsContext = createContext<StatementsContextType | undefined>(undefined);

export const StatementsProvider = ({ children }: { children: ReactNode }) => {
  const [statements, setStatements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchStatements = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest<{
        data: any[];
        total: number;
        per_page: number;
      }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/sponsor-plus/list?page=${page}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      setStatements(res?.data?.data || []);
      setCurrentPage(page);

      const totalItems = res?.data?.total || res?.data?.data?.length || 0;
      const perPage = res?.data?.per_page || 10; 
      setTotalPages(Math.ceil(totalItems / perPage));
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <StatementsContext.Provider
      value={{
        statements,
        isLoading,
        error,
        currentPage,
        totalPages,
        fetchStatements,
      }}
    >
      {children}
    </StatementsContext.Provider>
  );
};

export const useStatements = () => {
  const context = useContext(StatementsContext);
  if (!context) {
    throw new Error("useStatements must be used within a StatementsProvider");
  }
  return context;
};
