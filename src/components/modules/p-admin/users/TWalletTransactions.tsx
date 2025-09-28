"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../AdminTable";

export interface Transaction {
  id: number;
  date: string;
  amount: string;
  from_user: number;
  to_user: number;
  type: string;
  details: string;
  status: string;
}

interface TWalletTransactionHistoyProps {
  transactions?: Transaction[];
}

export default function TWalletTransactionHistoy({
  transactions = [],
}: TWalletTransactionHistoyProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const columns: TableColumn<Transaction>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Date", field: "date" },
    { title: "Amount", field: "amount" },
    { title: "From User", field: "from_user" },
    { title: "To User", field: "to_user" },
    { title: "Type", field: "type" },
    { title: "Details", field: "details" },
    {
      title: "Status",
      field: "status",
      render: (_, row) => {
        const color =
          row.status.toLowerCase() === "success"
            ? "#A8FFAE"
            : row.status.toLowerCase() === "pending"
            ? "#FED563"
            : "#FF6060";
        return <span style={{ color }}>{row.status}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
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
              className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-lg font-semibold">
                Transaction Details
              </h2>
              <div className="text-white space-y-2">
                <p>
                  <strong>ID:</strong> {selectedTransaction.id}
                </p>
                <p>
                  <strong>Date:</strong> {selectedTransaction.date}
                </p>
                <p>
                  <strong>Amount:</strong> {selectedTransaction.amount}
                </p>
                <p>
                  <strong>From User:</strong> {selectedTransaction.from_user}
                </p>
                <p>
                  <strong>To User:</strong> {selectedTransaction.to_user}
                </p>
                <p>
                  <strong>Type:</strong> {selectedTransaction.type}
                </p>
                <p>
                  <strong>Details:</strong> {selectedTransaction.details}
                </p>
                <p>
                  <strong>Status:</strong> {selectedTransaction.status}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600 transition"
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
