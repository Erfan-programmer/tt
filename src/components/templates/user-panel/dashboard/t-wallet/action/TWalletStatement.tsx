"use client";
import React from "react";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import TWalletStatementSkeleton from "@/skeletons/User-Panel/dashboard/TWalletStatementSkeleton";
import { useWalletStatement } from "@/contextApi/WalletStatementContext";
import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";

export default function TWalletStatement() {
  const { data, loading, page, setPage } = useWalletStatement();

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
                <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              items.map((transaction, index) => (
                <tr
                  key={transaction.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-[#2A3246]" : "bg-[#f9f9fe] dark:bg-[#222631]"
                  }`}
                >
                  <td className="text-center py-3 px-4 text-[var(--main-background)] dark:text-white">
                    {transaction.position}
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
        <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} />
      </div>
    </div>
  );
}
