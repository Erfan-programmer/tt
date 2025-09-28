"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { AnimatePresence, motion } from "framer-motion";
import { formatToTwoDecimals } from "../../FormatToDecimal";

export interface Payment {
  id: number;
  position: number;
  date: string;
  invoice_number: string;
  amount: string;
  from: string | null;
  to: string | null;
  account_type: string;
  invoice_currency: string;
  txid: string | null;
  status: string;
}

export default function AdminTranactionsPayment({ data }: { data: Payment[] }) {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const columns: TableColumn<Payment>[] = [
    {
      title: "ID",
      field: "position",
    },
    { title: "Date", field: "date" },
    { title: "Invoice Number", field: "invoice_number" },
    {
      title: "Amount",
      field: "amount",
      render: (_, value) => formatToTwoDecimals(value.amount),
    },
    { title: "From", field: "from" },
    { title: "To", field: "to" },
    { title: "Account Type", field: "account_type" },
    { title: "Invoice Currency", field: "invoice_currency" },
    { title: "TxID", field: "txid" },
    {
      title: "Status",
      field: "status",
      render: (_, row: Payment) => {
        const status = row.status?.toLowerCase() || "";
        const color =
          status === "success"
            ? "#A8FFAE"
            : status === "failed"
            ? "#FF6060"
            : "#FED563";
        return <span style={{ color }}>{row.status}</span>;
      },
    },
    {
      title: "Action",
      field: "id",
      render: (_, row: Payment) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setSelectedPayment(row)}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable columns={columns} data={data} />

      <AnimatePresence>
        {selectedPayment && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1E1E2F] rounded-lg p-6 w-96 relative text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-2 right-2 text-white text-lg"
                onClick={() => setSelectedPayment(null)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">Payment Details</h2>
              <div className="space-y-2">
                {Object.entries(selectedPayment).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-600 py-1"
                  >
                    <span className="font-semibold capitalize">
                      {key.replace("_", " ")}
                    </span>
                    <span>
                      {key === "amount"
                        ? formatToTwoDecimals(value as string | number)
                        : value?.toString() || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
