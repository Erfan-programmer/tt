"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: number;
  date: string;
  tid: number;
  fullname: string;
  account_type: string;
  deposit: string;
  dd_percent: string;
  balance: string;
  capital_health: string;
  account_in_trade: string;
  capital_return_request: string;
}

interface Props {
  data: Transaction[];
  loading?: boolean;
}

export default function DrawDownHistoryList({ data }: Props) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const columns: TableColumn<Transaction>[] = [
    { title: "Date", field: "date" },
    { title: "TID", field: "tid" },
    { title: "Full Name", field: "fullname" },
    { title: "Account Type", field: "account_type" },
    {
      title: "Deposit",
      field: "deposit",
      render: (_value, row) => Number(row.deposit).toFixed(2),
    },
    {
      title: "DD Percent",
      field: "dd_percent",
      render: (_value, row) => Number(row.dd_percent).toFixed(0) + "%",
    },
    {
      title: "Balance",
      field: "balance",
      render: (_value, row) => Number(row.balance).toFixed(2),
    },
    { title: "Capital Health", field: "capital_health" },
    { title: "Account In Trade", field: "account_in_trade" },
    { title: "Capital Return Request", field: "capital_return_request" },
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
      <AdminDynamicTable<Transaction> columns={columns} data={data} />

      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-xl w-[500px] max-h-[80vh] overflow-y-auto text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
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
                      {["deposit", "balance"]
                        .includes(key)
                        ? Number(value).toFixed(2)
                        : key === "dd_percent"
                        ? Number(value).toFixed(0) + "%"
                        : value?.toString() || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 rounded bg-red-500 text-white"
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
