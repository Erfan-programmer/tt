// DepositHistoryList.tsx
"use client";

import { useEffect, useState } from "react";
import DepositStatusFilter from "./DepositStatusFilter";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface PaymentTransaction {
  id: number;
  position: number;
  transaction_id: string;
  amount: string;
  currency: string;
  transaction_hash: string | null;
  status: "pending" | "success" | "failed" 
  created_at: string;
}

interface PaymentListResponse {
  data: PaymentTransaction[];
  meta: { total: number; per_page: number; current_page: number };
}

const statusColors: Record<string, string> = {
  success: "bg-[#00cb08] text-black",
  failed: "bg-[#ff6060] text-black",
  pending: "bg-[#ffcc00] text-black",
};


export default function DepositHistoryList({ value = "all", onChange }: { value?: string; onChange?: (val: string) => void }) {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [total, setTotal] = useState(1);
  const [per_page, set_perPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = loadUserData()?.access_token;
        const queryParams = new URLSearchParams();
        if (selectedStatus && selectedStatus !== "all") queryParams.append("filter", selectedStatus);
        queryParams.append("page", page.toString());
        queryParams.append("per_page", per_page.toString());

        const response = await apiRequest<PaymentListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/depositList?${queryParams.toString()}`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (response.success) {
          setTransactions(response.data.data);
          setTotal(response.data.meta.total);
          set_perPage(response.data.meta.per_page);
        } else {
          setError(response.message || "Failed to load deposit list");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [page, selectedStatus]);

  const pageCount = Math.ceil(total / per_page);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <>
      <DepositStatusFilter
        value={selectedStatus}
        onChange={(val) => {
          setSelectedStatus(val);
          setPage(1);
          if (onChange) onChange(val);
        }}
      />

      <div className="team-account-content px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
        <div className="team-claim-reward">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[var(--main-background)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
              All Transactions
            </p>
          </div>

          <div className="overflow-x-auto rounded-[1em] mt-6">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-[#D9D9D9] rounded-t-lg">
                  <th className="text-center py-3 text-black font-medium px-4">#</th>
                  <th className="text-center py-3 text-black font-medium px-4">Date</th>
                  <th className="text-center py-3 text-black font-medium px-4">Invoice Number</th>
                  <th className="text-center py-3 text-black font-medium px-4">Amount</th>
                  <th className="text-center py-3 text-black font-medium px-4">Currency</th>
                  <th className="text-center py-3 text-black font-medium px-4">Transaction ID</th>
                  <th className="text-center py-3 text-black font-medium px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-red-500">{error}</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${idx % 2 === 0 ? "bg-white dark:bg-[#2A3246]" : "bg-[#f9f9fe] dark:bg-[#222631]"}`}
                    >
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">{item.position}</td>
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">{formatDate(item.created_at)}</td>
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">#{item.transaction_id}</td>
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">${item.amount}</td>
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">{item.currency}</td>
                      <td className="py-3 text-[var(--main-background)] dark:text-white text-center px-4">{item.transaction_hash || "-"}</td>
                      <td className="py-3 text-center px-4">
                        <span className={`px-3 py-1 rounded-full text-[.8rem] font-semibold ${statusColors[item.status] || "bg-gray-300 text-black"}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <Pagination count={pageCount} page={page} onChange={(_, val) => setPage(val as number)} />
          </div>
        </div>
      </div>
    </>
  );
}
