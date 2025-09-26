"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "@/components/modules/p-admin/AdminTable";

export interface TransactionPending {
  id: number;
  date: string;
  invoice_number: string;
  amount: string;
  user: number;
  email: string;
  wallet_type: string;
  status: string;
}

interface PendingDepositsListProps {
  transactions?: TransactionPending[];
}

export default function PendingDepositsList({
  transactions = [],
}: PendingDepositsListProps) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionPending | null>(null);

  const columns: TableColumn<TransactionPending>[] = [
    { title: "Date", field: "date" },
    { title: "Invoice", field: "invoice_number" },
    { title: "Amount", field: "amount" },
    { title: "User", field: "user" },
    { title: "Email", field: "email" },
    { title: "Wallet Type", field: "wallet_type" },
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
      <AdminDynamicTable<TransactionPending> columns={columns} data={transactions} />

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
                <p><strong>ID:</strong> {selectedTransaction.id}</p>
                <p><strong>Date:</strong> {selectedTransaction.date}</p>
                <p><strong>Invoice:</strong> {selectedTransaction.invoice_number}</p>
                <p><strong>Amount:</strong> {selectedTransaction.amount}</p>
                <p><strong>User:</strong> {selectedTransaction.user}</p>
                <p><strong>Email:</strong> {selectedTransaction.email}</p>
                <p><strong>Wallet Type:</strong> {selectedTransaction.wallet_type}</p>
                <p><strong>Status:</strong> {selectedTransaction.status}</p>
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
