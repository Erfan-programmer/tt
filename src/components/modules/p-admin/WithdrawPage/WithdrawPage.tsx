"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "../LineTitle";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import AdminWithdrawList, { Transaction } from "./AdminWithdrawList";
import WithdrawListFormat from "./WithdrawListFormat";
import WithdrawHistoryList, { TransactionHistory } from "./WithdrawHistoryList";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";

interface WithdrawSummary {
  total_withdrawn_amount: number;
  total_requests: number;
  total_pending: number;
}


export default function WithdrawPage() {
  const [summary, setSummary] = useState<WithdrawSummary>({
    total_withdrawn_amount: 0,
    total_requests: 0,
    total_pending: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [historyTransactions, setHistoryTransactions] = useState<TransactionHistory[]>([]);
  const [showLineTitle, setShowLineTile] = useState({ withdraw: true });

  const fetchWithdrawInfo = async () => {
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/summary`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) setSummary(res.data?.data);
      else toast.error("Error fetching withdrawal summary: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching withdrawal summary: " + err.message);
    }
  };

  const fetchWithdrawTransactions = async (filter_by?: string, filter_value?: string) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) setTransactions(res.data?.data || []);
      else toast.error("Error fetching withdrawals: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching withdrawals: " + err.message);
    }
  };

  const fetchWithdrawHistory = async (filter_by?: string, filter_value?: string) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/history?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) setHistoryTransactions(res.data?.data || []);
      else toast.error("Error fetching withdrawal history: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching withdrawal history: " + err.message);
    }
  };

  useEffect(() => {
    fetchWithdrawInfo();
    fetchWithdrawTransactions();
    fetchWithdrawHistory();
  }, []);

  return (
    <>
      <LineTitle
        onClick={() => setShowLineTile(prev => ({ ...prev, withdraw: !showLineTitle.withdraw }))}
        title="Withdraw"
      />

      {showLineTitle.withdraw && (
        <AnimationTemplate>
          <div className="flex items-center justify-center gap-4">
            <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
              <span>Total withdraw amount:</span>
              <span>$ {summary.total_withdrawn_amount}</span>
            </div>
            <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
              <span>Total request:</span>
              <span>{summary.total_requests}</span>
            </div>
            <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
              <span>Total Pending:</span>
              <span>{summary.total_pending}</span>
            </div>
          </div>

          <AdminSearchBox
            title="Search Withdraws"
            filterOptions={[
              { label: "Invoice Number", value: "invoice_number", placeholder: "Enter Invoice Number..." },
              { label: "To User TID", value: "to_user_tid", placeholder: "Enter To User TID..." },
              { label: "Currency", value: "currency", placeholder: "Enter Currency..." },
              { label: "TXID", value: "txid", placeholder: "Enter TXID..." },
              { label: "Status", value: "status", placeholder: "Enter Status..." },
            ]}
            onSearch={(filter_by, filter_value) => fetchWithdrawTransactions(filter_by, filter_value)}
            onClear={() => fetchWithdrawTransactions()}
          />

          <AdminWithdrawList transactions={transactions} refetch={fetchWithdrawTransactions}/>
        </AnimationTemplate>
      )}

      <WithdrawListFormat />

      <AdminSearchBox
        title="Search Withdrawal History"
        filterOptions={[
          { label: "Currency", value: "currency", placeholder: "Enter Currency..." },
          { label: "User TID", value: "user", placeholder: "Enter User TID..." },
          { label: "Full Name", value: "full_name", placeholder: "Enter Full Name..." },
          { label: "Wallet Address", value: "wallet_address", placeholder: "Enter Wallet Address..." },
        ]}
        onSearch={(filter_by, filter_value) => fetchWithdrawHistory(filter_by, filter_value)}
        onClear={() => fetchWithdrawHistory()}
      />

      <WithdrawHistoryList transactions={historyTransactions} />
    </>
  );
}
