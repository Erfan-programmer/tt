"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { UserType } from "@/app/hrtaamst2025/users/not-active-accounts/page";
import Flag from "react-world-flags";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: UserType[];
}

export default function NotActiveAccountsList({ data }: Props) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedUser(null), 300); 
  };

  const columns: TableColumn<UserType>[] = [
    { title: "Date", field: "date" },
    { title: "Email", field: "email" },
    { title: "Account Type", field: "account_type" },
    { title: "Full Name", field: "full_name" },
    {
      title: "Country",
      field: "country",
      render: (country: any) => (
        <div className="flex flex-col rounded-xl items-center my-1">
          <Flag code={country.code} className="w-6 h-4 rounded-sm" />
          <span>{country.name}</span>
        </div>
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A] hover:text-white transition-colors"
            onClick={() => handleViewDetails(row)}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<UserType> columns={columns} data={data} />

      <AnimatePresence>
        {showModal && selectedUser && (
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal} 
          >
            <motion.div
              className="bg-gray-900 text-white p-6 rounded-lg w-[400px] shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن modal هنگام کلیک داخل آن
            >
              <h2 className="text-2xl font-bold mb-4">User Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Full Name:</span>{" "}
                  {selectedUser.full_name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedUser.email}
                </p>
                <p>
                  <span className="font-semibold">Account Type:</span>{" "}
                  {selectedUser.account_type}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {selectedUser.date}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Country:</span>
                  <Flag
                    code={selectedUser.country.code as any}
                    className="w-6 h-4 rounded-sm"
                  />
                  {selectedUser.country.name}
                </p>
              </div>
              <button
                className="mt-4 w-full bg-gray-700 hover:bg-gray-600 py-2 rounded text-white transition-colors"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
