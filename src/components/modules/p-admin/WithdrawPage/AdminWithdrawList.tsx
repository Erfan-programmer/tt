"use client";
import React, { useState } from "react";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { formatToTwoDecimals } from "../../FormatToDecimal";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

export interface Transaction {
  id: number;
  client_id: number;
  amount: string;
  gross_amount: string;
  debt_settled: string;
  external_address: string;
  currency: string;
  status: string;
  transaction_hash: string | null;
  approved_by_admin_id: number | null;
  approved_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface Props {
  transactions: Transaction[];
  refetch: () => void;
}

export default function AdminWithdrawList({ transactions, refetch }: Props) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [modalType, setModalType] = useState<
    "approve" | "reject" | null
  >(null);
  const [inputValue, setInputValue] = useState("");

const handleApprove = async () => {
  if (!selectedTransaction?.id) return;
  try {
    const response = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/${selectedTransaction.id}/approve`,
      "POST",
      { transaction_hash: inputValue }
      ,
      { Authorization: `Bearer ${loadEncryptedData()?.token}` }
    );
    if (response.success) {
      toast.success(response.message || "Withdraw approved!");
      resetModal();
      refetch();
    } else {
      toast.error(response.message);
    }
  } catch (err: any) {
    toast.error("Error approving withdraw: " + err.message);
  }
};

const handleReject = async () => {
  if (!selectedTransaction?.id) return;
  try {
    const response = await apiRequest(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/withdrawals/${selectedTransaction.id}/reject`,
      "POST",
      { reason: inputValue }, 
      { Authorization: `Bearer ${loadEncryptedData()?.token}` }
    );
    if (response.success) {
      toast.success(response.message || "Withdraw rejected!");
      resetModal();
      refetch();
    } else {
      toast.error(response.message);
    }
  } catch (err: any) {
    toast.error("Error rejecting withdraw: " + err.message);
  }
};

 


  const resetModal = () => {
    setModalType(null);
    setSelectedTransaction(null);
    setInputValue("");
  };

  const columns: TableColumn<Transaction>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Client ID", field: "client_id" },
    {
      title: "Amount",
      field: "amount",
      render: (_, row) => formatToTwoDecimals(row.amount),
    },
    {
      title: "Gross Amount",
      field: "gross_amount",
      render: (_, row) => formatToTwoDecimals(row.gross_amount),
    },
    {
      title: "Debt Settled",
      field: "debt_settled",
      render: (_, row) => formatToTwoDecimals(row.debt_settled),
    },
    { title: "External Address", field: "external_address" },
    { title: "Currency", field: "currency" },
    {
      title: "Status",
      field: "status",
      render: (_, row) => {
        const statusStr = (row.status || "").toLowerCase();
        const color =
          statusStr === "approved"
            ? "#A8FFAE"
            : statusStr === "rejected"
            ? "#FF6060"
            : "#FED563";
        return <span style={{ color }}>{row.status}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded bg-green-600 hover:bg-green-500 text-white transition"
            onClick={() => {
              setSelectedTransaction(row);
              setModalType("approve");
            }}
          >
            <FaCheck className="text-white" />
          </button>
          <button
            className="p-1 rounded bg-red-600 hover:bg-red-500 text-white transition"
            onClick={() => {
              setSelectedTransaction(row);
              setModalType("reject");
            }}
          >
            <FaTimes className="text-white" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Transaction> columns={columns} data={transactions} title="Withdraw Request" />

      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetModal}
          >
            <motion.div
              className="bg-[#1C1E29] p-6 rounded w-[500px] max-h-[90vh] overflow-y-auto text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Transaction Details</h2>

              {(modalType === "approve") && (
                <>
                  <label className="block mt-4 mb-2">Transaction Hash:</label>
                  <input
                    type="text"
                    className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter transaction hash..."
                  />
                  <button
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded mr-2 transition"
                    onClick={
                      handleApprove 
                    }
                  >
                    Confirm
                  </button>
                </>
              )}

              {modalType === "reject" && (
                <>
                  <label className="block mt-4 mb-2">Reason:</label>
                  <input
                    type="text"
                    className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-700 rounded"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter rejection reason..."
                  />
                  <button
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded mr-2 transition"
                    onClick={handleReject}
                  >
                    Confirm
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
