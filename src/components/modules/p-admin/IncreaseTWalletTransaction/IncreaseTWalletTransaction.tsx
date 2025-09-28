"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { formatToTwoDecimals } from "../../FormatToDecimal";

export interface Transaction {
  date: string;
  amount: number;
  from_user: string;
  type: string;
  to_user: string;
  details: string;
  status: string;
  id: number;
}

interface IncreaseTWalletTransactionProps {
  transactions?: Transaction[];
}

export default function IncreaseTWalletTransaction({
  transactions = [],
}: IncreaseTWalletTransactionProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const columns: TableColumn<Transaction>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Date", field: "date" },
    {
      title: "Amount",
      field: "amount",
      render: (_, row) => formatToTwoDecimals(row.amount),
    },
    {
      title: "From User",
      field: "from_user",
      render: (_, row) => {
        if (row.type === "transfer_in") {
          return row.from_user;
        } else if (row.type === "transfer_out") {
          return row.to_user;
        }
        return row.from_user;
      },
    },
    {
      title: "To User",
      field: "to_user",
      render: (_, row) => {
        if (row.type === "transfer_in") {
          return row.to_user;
        } else if (row.type === "transfer_out") {
          return row.from_user;
        }
        return row.to_user;
      },
    },
    { title: "Wallet type", field: "type" },
    { title: "TXid", field: "details" },
    {
      title: "Status",
      field: "status",
      render: (_, row) => {
        const color =
          row.status.toLowerCase() === "expired"
            ? "#FF6060"
            : row.status.toLowerCase() === "completed"
            ? "#A8FFAE"
            : "#FED563";
        return <span style={{ color }}>{row.status}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_value, row) => (
        <button
          className="p-1 rounded text-[#6A6A6A]"
          onClick={() => setSelectedTransaction(row)}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Transaction> columns={columns} data={transactions} />

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
              className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-lg font-semibold">
                Transaction Details
              </h2>
              <div className="text-white">
                <p>
                  <strong>Date:</strong> {selectedTransaction.date}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {formatToTwoDecimals(selectedTransaction.amount)}
                </p>
                <p>
                  <strong>From:</strong>{" "}
                  {selectedTransaction.type === "transfer_in"
                    ? selectedTransaction.from_user || "-"
                    : selectedTransaction.to_user || "-"}
                </p>
                <p>
                  <strong>To:</strong>{" "}
                  {selectedTransaction.type === "transfer_in"
                    ? selectedTransaction.to_user || "-"
                    : selectedTransaction.from_user || "-"}
                </p>
                <p>
                  <strong>Wallet Type:</strong> {selectedTransaction.type}
                </p>
                <p>
                  <strong>TXid:</strong> {selectedTransaction.details}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-white"
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
