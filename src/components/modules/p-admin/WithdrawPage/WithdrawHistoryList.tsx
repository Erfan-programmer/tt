"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { formatToTwoDecimals } from "../../FormatToDecimal";
import { motion, AnimatePresence } from "framer-motion";

export interface TransactionHistory {
  id: number;
  date: string;
  amount: string;
  user: number | string;
  full_name: string;
  wallet_type: string;
  wallet_address: string;
  txid: string;
  status:
    | "Pending"
    | "Completed"
    | "Expired"
    | "completed"
    | "pending"
    | "expired";
}

interface Props {
  transactions: TransactionHistory[];
}

export default function WithdrawHistoryList({ transactions }: Props) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionHistory | null>(null);

  const columns: TableColumn<TransactionHistory>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Date", field: "date" },
    {
      title: "Amount",
      field: "amount",
      render: (_: any, row: TransactionHistory) =>
        formatToTwoDecimals(row.amount),
    },
    { title: "User", field: "user" },
    { title: "Full Name", field: "full_name" },
    { title: "Wallet Type", field: "wallet_type" },
    { title: "Wallet Address", field: "wallet_address" },
    { title: "TxID", field: "txid" },
    {
      title: "Status",
      field: "status",
      render: (value: string | number | null) => {
        const statusStr = (value || "").toString().toLowerCase();
        const color =
          statusStr === "expired"
            ? "#FF6060"
            : statusStr === "completed"
            ? "#A8FFAE"
            : "#FED563";
        return <span style={{ color }}>{value}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_: any, row: TransactionHistory) => (
        <button
          className="p-1 rounded text-blue-500 "
          onClick={() => setSelectedTransaction(row)}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<TransactionHistory>
        columns={columns}
        data={transactions}
        title="Withdraw History"
      />

      {/* Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              className="bg-[#1C1E29] p-6 rounded w-[500px] max-h-[80vh] overflow-y-auto text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
              <div className="space-y-2">
                {Object.entries(selectedTransaction).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-700 pb-2"
                  >
                    <span className="font-semibold capitalize">
                      {key.replace("_", " ")}
                    </span>
                    <span>
                      {["amount"].includes(key)
                        ? formatToTwoDecimals(value)
                        : value?.toString() || "-"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-500 px-4 py-2 rounded"
                  onClick={() => setSelectedTransaction(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
