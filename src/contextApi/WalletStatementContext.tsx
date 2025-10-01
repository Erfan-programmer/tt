"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface Transaction {
  id: number;
  position: number;
  amount: string;
  type: string;
  description: string;
  created_at: string;
}

interface WalletListResponse {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface WalletStatementContextType {
  data: WalletListResponse | null;
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  fetchTransactions: (pageNumber?: number) => void;
}

const WalletStatementContext = createContext<
  WalletStatementContextType | undefined
>(undefined);

export const WalletStatementProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<WalletListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const fetchTransactions = useCallback(
    async (pageNumber: number = page) => {
      try {
        const token = loadUserData()?.access_token;
        setLoading(true);
        const res = await apiRequest<WalletListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/walletStatements?page=${pageNumber}`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    fetchTransactions(page);
  }, [page, fetchTransactions]);
  return (
    <WalletStatementContext.Provider
      value={{ data, loading, page, setPage, fetchTransactions }}
    >
      {children}
    </WalletStatementContext.Provider>
  );
};

export const useWalletStatement = () => {
  const context = useContext(WalletStatementContext);
  if (!context) {
    throw new Error(
      "useWalletStatement must be used within WalletStatementProvider"
    );
  }
  return context;
};
