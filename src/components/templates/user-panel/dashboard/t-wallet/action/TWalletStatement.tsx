"use client";
import React, { useEffect, useState } from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";

interface Transaction {
  id: number;
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

function TWalletStatementSkeleton() {
  return (
    <div className="withdraw-transaction-container border-standard rounded-lg px-4 py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4 w-full animate-pulse">
      <div className="withdraw-transaction-header flex items-center justify-between text-[var(--main-background)] dark:text-white mb-6">
        <div className="team-claim-reward flex items-center gap-2">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-white text-black text-sm font-medium">
              <th className="text-center py-3 px-4">#</th>
              <th className="text-center py-3 px-4">Type</th>
              <th className="text-center py-3 px-4">Amount</th>
              <th className="text-center py-3 px-4">Commission Fee</th>
              <th className="text-center py-3 px-4">Receiver</th>
              <th className="text-center py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr
                key={i}
                className={`transition-colors ${
                  i % 2 === 0
                    ? "bg-white dark:bg-[#2A3246]"
                    : "bg-[#f9f9fe] dark:bg-[#222631]"
                }`}
              >
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-6 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export default function TWalletStatement() {
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState<WalletListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const fetchTransactions = async (pageNumber: number) => {
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
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const items = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const itemsPerPage = data?.per_page ?? 10;
  const pageCount = Math.ceil(totalItems / itemsPerPage);

  if (loading || !data) return <TWalletStatementSkeleton />;

  return (
    <div className="withdraw-transaction-container border-standard rounded-lg px-4 py-4 bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] mt-4 w-full">
      <div className="withdraw-transaction-header flex items-center justify-between text-[var(--main-background)] dark:text-white mb-6">
        <div className="team-claim-reward flex items-center gap-2">
          <p className="text-base font-medium">Statements</p>
        </div>
      </div>
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-white text-black text-sm font-medium">
              <th className="text-center py-3 px-4">#</th>
              <th className="text-center py-3 px-4">Date</th>
              <th className="text-center py-3 px-4">Operation</th>
              <th className="text-center py-3 px-4">Description</th>
              <th className="text-center py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              items.map((transaction: Transaction, index: number) => (
                <tr
                  key={transaction.id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-[#2A3246]"
                      : "bg-[#f9f9fe] dark:bg-[#222631]"
                  }`}
                >
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {(page - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {new Date(transaction.created_at).toLocaleString()}
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {transaction.type}
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {transaction.description}
                  </td>
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {formatToTwoDecimals(transaction.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-6">
        <Pagination count={pageCount} page={page} onChange={handlePageChange} />
      </div>
    </div>
  );
}
