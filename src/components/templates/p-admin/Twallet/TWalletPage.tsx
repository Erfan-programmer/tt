"use client";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import IncreaseTWalletTransaction, {
  IncreaseTWalletType,
} from "@/components/modules/p-admin/IncreaseTWalletTransaction";
import TWalletTransactionHistory  from "@/components/modules/p-admin/IncreaseTWalletTransaction/IncreaseTWalletTransaction";
import React, { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";

interface Transaction {
  date: string;
  amount: number;
  from_user: string;
  type: string;
  to_user: string;
  details: string;
  status: string;
  id: number;
}

interface WalletSummary {
  total_t_wallet_balance: string;
  pending_count: number;
  pending_amount: number;
}

interface walletTransactionProps {
  success: boolean;
  message: string;
  data: Transaction[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  errors: null;
}

interface summaryProp {
  success: boolean;
  message: string;
  data: {
    total_t_wallet_balance: string;
    pending_count: number;
    pending_amount: number;
  };
  meta: null;
  errors: null;
}

export default function TWalletPage() {
  const [summary, setSummary] = useState<WalletSummary>({
    total_t_wallet_balance: "0.00",
    pending_count: 0,
    pending_amount: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<IncreaseTWalletType[]>([]);

  // Pagination state
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const token = loadEncryptedData()?.token;

  // ---------- Fetch Summary ----------
  const fetchSummary = useCallback(async () => {
  try {
    const res = await apiRequest<summaryProp>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/wallet/summary`,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    );

    if (res.success) {
      setSummary(res?.data?.data);
    } else {
      toast.error("Error fetching wallet summary: " + res.message);
    }
  } catch (err: any) {
    toast.error("Error fetching wallet summary: " + err.message);
  }
}, [token]);

const fetchTransactions = useCallback(
  async (
    filter_by?: string,
    filter_value?: string,
    page?: number
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }
      if (page) queryParams.append("page", page.toString());

      const res = await apiRequest<walletTransactionProps>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/search/tWalletTransactions?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` } 
      );

      if (res.success) {
        setTransactions(res?.data?.data);
        setTotalTransactions(
          res?.data?.meta.total || res?.data?.data.length || 0
        );
      } else toast.error("Error fetching transactions: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching transactions: " + err.message);
    }
  },
  [token] 
);


  // ---------- Fetch Pending Deposits ----------
 const fetchPendingDeposits = useCallback(
  async (filter_by?: string, filter_value?: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<any>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/wallet/pending-deposits?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) setPendingDeposits(res?.data?.data || []);
      else toast.error("Error fetching pending deposits: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching pending deposits: " + err.message);
    }
  },
  [token] 
);

  useEffect(() => {
    fetchSummary();
    fetchTransactions(undefined, undefined, transactionPage);
    fetchPendingDeposits();
  }, [transactionPage , fetchSummary , fetchTransactions , fetchPendingDeposits]);

  // ---------- Pagination handler ----------
  const handleTransactionPageChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setTransactionPage(value);
  };

  return (
    <>
      {/* Search for pending deposits */}
      <AdminSearchBox
        title="Pending Deposits Search"
        filterOptions={[
          {
            label: "Invoice Number",
            value: "invoice_number",
            placeholder: "Enter Invoice Number...",
          },
          { label: "User", value: "user", placeholder: "Enter User..." },
          { label: "Email", value: "email", placeholder: "Enter Email..." },
          { label: "TXID", value: "txid", placeholder: "Enter TXID..." },
        ]}
        onSearch={(filter_by, filter_value) =>
          fetchPendingDeposits(filter_by, filter_value)
        }
        onClear={() => fetchPendingDeposits()}
      />

      {/* Wallet summary */}
      <div className="flex items-center flex-wrap justify-center gap-4 mt-12">
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Total T-wallet Balance:</span>
          <span>$ {summary.total_t_wallet_balance}</span>
        </div>
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Pending : </span>
          <span>{summary.pending_count}</span>
        </div>
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Amount:</span>
          <span>$ {summary.pending_amount}</span>
        </div>
      </div>

      {/* Pending deposits table */}
      <IncreaseTWalletTransaction  transactions={pendingDeposits}/>

      {/* Search for all transactions */}
      <AdminSearchBox
        title="T-Wallet Transactions Search"
        filterOptions={[
          {
            label: "From User",
            value: "from_user",
            placeholder: "Enter From User...",
          },
          {
            label: "To User",
            value: "to_user",
            placeholder: "Enter To User...",
          },
        ]}
        onSearch={(filter_by, filter_value) =>
          fetchTransactions(filter_by, filter_value, 1)
        }
        onClear={() => fetchTransactions(undefined, undefined, 1)}
      />

      {/* Transactions table */}
      <TWalletTransactionHistory transactions={transactions} />

      {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Pagination
            count={Math.ceil(totalTransactions / transactionPerPage)}
            page={transactionPage}
            onChange={handleTransactionPageChange}
          />
        </div>
    </>
  );
}
