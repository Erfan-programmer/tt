"use client";
import React, { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { motion, AnimatePresence } from "framer-motion";

export interface InvoiceTransaction {
  id: number;
  date: string;
  invoice_number: string;
  amount: string;
  user: number;
  email: string;
  status: "Pending" | "Completed" | "Failed";
}

interface InvoiceTransactionsTableProps {
  holdAccounts: InvoiceTransaction[];
  onFetch: () => void;
}

export default function InvoiceTransactionsTable({
  holdAccounts,
  onFetch,
}: InvoiceTransactionsTableProps) {
  const [viewTransaction, setViewTransaction] = useState<InvoiceTransaction | null>(null);
  const [editTransaction, setEditTransaction] = useState<InvoiceTransaction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRelease = async () => {
    if (!editTransaction) return;
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/releaseSingleHoldingAccounts/${editTransaction.id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success(`Account #${editTransaction.id} released successfully`);
        onFetch();
        setEditTransaction(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to release account");
    } finally {
      setLoading(false);
    }
  };

  const columns: TableColumn<InvoiceTransaction>[] = [
    { title: "Date", field: "date" },
    { title: "Invoice #", field: "invoice_number" },
    { title: "Amount", field: "amount" },
    { title: "User ID", field: "user" },
    { title: "Email", field: "email" },
    {
      title: "Status",
      field: "status",
      render: (value: any) => {
        const color =
          value.toLowerCase() === "completed"
            ? "#A8FFAE"
            : value.toLowerCase() === "failed"
            ? "#FF6060"
            : "#FED563";
        return <span style={{ color, fontWeight: 600 }}>{value}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_value, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setViewTransaction(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setEditTransaction(row)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<InvoiceTransaction>
        columns={columns}
        data={holdAccounts}
      />

      <AnimatePresence>
        {viewTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewTransaction(null)}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-[400px] text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">
                Transaction Details #{viewTransaction.id}
              </h2>
              <div className="space-y-2 mb-6">
                <p><strong>Date:</strong> {viewTransaction.date}</p>
                <p><strong>Invoice #:</strong> {viewTransaction.invoice_number}</p>
                <p><strong>Amount:</strong> {viewTransaction.amount}</p>
                <p><strong>User ID:</strong> {viewTransaction.user}</p>
                <p><strong>Email:</strong> {viewTransaction.email}</p>
                <p><strong>Status:</strong> {viewTransaction.status}</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setViewTransaction(null)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditTransaction(null)}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-[400px] text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">
                Release Account #{editTransaction.id}
              </h2>
              <p className="mb-6">
                Are you sure you want to release this account?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditTransaction(null)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRelease}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white"
                >
                  {loading ? "Releasing..." : "Confirm Release"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
