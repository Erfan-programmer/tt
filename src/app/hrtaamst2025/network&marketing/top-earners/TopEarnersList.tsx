"use client";
import { formatToTwoDecimals } from "@/components/modules/FormatToDecimal";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaEye, FaTimes } from "react-icons/fa";

export interface ProfitableUser {
  id: number;
  start_date: string;
  tid: string;
  income: string;
  position: string;
  full_name: string;
  rank: string;
  account_type: string;
  renewed: boolean;
}

interface TopEarnersListProps {
  users: ProfitableUser[];
}

export default function TopEarnersList({ users }: TopEarnersListProps) {
  const [selectedUser, setSelectedUser] = useState<ProfitableUser | null>(null);

  const columns: TableColumn<ProfitableUser>[] = [
    { title: "Position", field: "position" },

    { title: "TID", field: "tid" },
    { title: "Start Date", field: "start_date" },
    { title: "Full Name", field: "full_name" },
    {
      title: "Income",
      field: "income",
      render: (_, row) => <span>{formatToTwoDecimals(row.income)}</span>,
    },
    { title: "Rank", field: "rank" },
    { title: "Account Type", field: "account_type" },
    {
      title: "Renewed",
      field: "renewed",
      render: (_, rowData) => (rowData.renewed ? "Yes" : "No"),
    },
    {
      title: "Action",
      field: "id",
      render: (_, rowData) => (
        <button
          className="p-1 rounded text-[#6A6A6A]"
          onClick={() => setSelectedUser(rowData)}
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<ProfitableUser> columns={columns} data={users} />

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-[#1F2028] p-6 rounded-md w-96 relative text-white shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-red-500 text-lg font-bold"
                onClick={() => setSelectedUser(null)}
              >
                <FaTimes />
              </button>
              <h2 className="text-xl font-bold mb-4">User Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>TID:</strong> {selectedUser.tid}
                </p>
                <p>
                  <strong>Start Date:</strong> {selectedUser.start_date}
                </p>
                <p>
                  <strong>Full Name:</strong> {selectedUser.full_name}
                </p>
                <p>
                  <strong>Income:</strong>{" "}
                  {formatToTwoDecimals(selectedUser.income)}
                </p>
                <p>
                  <strong>Rank:</strong> {selectedUser.rank}
                </p>
                <p>
                  <strong>Account Type:</strong> {selectedUser.account_type}
                </p>
                <p>
                  <strong>Renewed:</strong>{" "}
                  {selectedUser.renewed ? "Yes" : "No"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
