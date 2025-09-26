"use client";

import { useEffect, useState } from "react";
import DepositStatusFilter from "./DepositStatusFilter";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface PaymentTransaction {
  id: number;
  pay_id: string;
  amount: string;
  cryptocurrency: string;
  txid: string | null;
  status:
    | "pending"
    | "completed"
    | "failed"
    | "processed"
    | "approved"
    | "rejected"
    | "expired"
    | "cancelled";
  created_at: string;
  date?: string;
}

interface PaymentListResponse {
  data: PaymentTransaction[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

const statusColors: Record<string, string> = {
  completed: "bg-green-500 text-[#383C47] dark:text-white",
  approved: "bg-green-500 text-[#383C47] dark:text-white",
  pending: "bg-yellow-400 text-black",
  processed: "bg-blue-400 text-[#383C47] dark:text-white",
  expired: "bg-orange-400 text-[#383C47] dark:text-white",
  cancelled: "bg-gray-400 text-[#383C47] dark:text-white",
  failed: "bg-red-500 text-[#383C47] dark:text-white",
  rejected: "bg-red-500 text-[#383C47] dark:text-white",
};

const ITEMS_PER_PAGE = 6;

export default function DepositHistoryList({
  value = "all",
  onChange,
}: {
  value?: string;
  onChange?: (val: string) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch with apiRequest
  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = loadUserData()?.access_token;

        const response = await apiRequest<PaymentListResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/wallet/depositList`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (response.success) {
          setTransactions(response?.data?.data);
          setTotal(response.data.meta.total);
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

  const pageCount = Math.ceil(total / ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <>
      <DepositStatusFilter
        value={selectedStatus}
        onChange={(val) => {
          setSelectedStatus(val);
          setPage(1);
          if (onChange) {
            onChange(val);
          }
        }}
      />

      <div className="team-account-content px-3 sm:px-4 md:px-[1rem] py-3 sm:py-4 md:py-[1rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-lg sm:rounded-xl mt-3 sm:mt-4 md:mt-5 pb-4 sm:pb-6 md:pb-[2rem]">
        <div className="team-claim-reward">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <p className="text-[var(--dark-color)] dark:text-white text-[.8rem] sm:text-sm md:text-base">
              All Transactions
            </p>
          </div>

          <div className="overflow-x-auto rounded-[1em] mt-6">
            <table className="w-full border-collapse rounded-lg">
              <thead>
                <tr className="bg-[#D9D9D9] rounded-t-lg">
                  <th className="text-center py-3 text-black font-medium px-4">
                    #
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Date
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Invoice Number
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Amount
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Currency
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Transaction ID
                  </th>
                  <th className="text-center py-3 text-black font-medium px-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-[#2A3246]"
                          : "bg-[#f9f9fe] dark:bg-[#222631]"
                      }`}
                    >
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                      </td>
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        #{item.pay_id}
                      </td>
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        ${item.amount}
                      </td>
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {item.cryptocurrency}
                      </td>
                      <td className="py-3 text-[var(--dark-color)] dark:text-white text-center px-4">
                        {item.txid || "-"}
                      </td>
                      <td className="py-3 text-center px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[.8rem] font-semibold ${
                            statusColors[item.status] ||
                            "bg-gray-300 text-black"
                          }`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, val) => {
                setPage(val as number);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
