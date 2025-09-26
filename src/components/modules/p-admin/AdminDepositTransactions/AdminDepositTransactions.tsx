"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { formatToTwoDecimals } from "../../FormatToDecimal";

export interface Investment {
  id: number;
  date: string;
  amount: string;
  user: number;
  first_name: string;
  last_name: string;
  email: string;
  account_type: string;
  expire_date: string;
  status: string;
  cancel_date: string;
}

export default function AdminDepositTransactions({
  data,
}: {
  data: Investment[];
}) {
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);

  const columns: TableColumn<Investment>[] = [
    { title: "ID", field: "id" },
    { title: "Date", field: "date" },
    {
      title: "Amount",
      field: "amount",
      render: (_: any, row: Investment) => formatToTwoDecimals(row.amount),
    },
    { title: "User ID", field: "user" },
    {
      title: "Full Name",
      field: "first_name",
      render: (_: any, row: Investment) => `${row.first_name} ${row.last_name}`,
    },
    { title: "Email", field: "email" },
    { title: "Account Type", field: "account_type" },
    { title: "Expire Date", field: "expire_date" },
    {
      title: "Status",
      field: "status",
      render: (value: any) => {
        const status = value.toLowerCase();
        const color =
          status === "active" || status === "completed"
            ? "#A8FFAE"
            : status === "expired"
            ? "#FF6060"
            : "#FED563";
        return <span style={{ color }}>{value}</span>;
      },
    },
    { title: "Cancel Date", field: "cancel_date" },
    {
      title: "Action",
      field: "id",
      render: (_: any, row: Investment) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setSelectedInvestment(row)}
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

      {/* Modal */}
      <AnimatePresence>
        {selectedInvestment && (
          <motion.div
            className="fixed inset-0 bg-black/40  bg-opacity-50 flex items-center justify-center z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInvestment(null)} 
          >
            <motion.div
              className="bg-gray-900 p-6 rounded-xl w-[500px] space-y-4 text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">
                Investment Details
              </h2>

              <div className="space-y-3">
                {Object.entries(selectedInvestment).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-gray-700 pb-2"
                  >
                    <span className="font-semibold capitalize">
                      {key.replace("_", " ")}
                    </span>
                    <span>
                      {key === "amount"
                        ? formatToTwoDecimals(value)
                        : value?.toString() || "-"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="px-4 py-2 bg-gray-700 rounded text-white"
                  onClick={() => setSelectedInvestment(null)}
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
