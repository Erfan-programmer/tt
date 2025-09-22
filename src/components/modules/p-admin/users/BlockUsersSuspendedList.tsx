"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { motion, AnimatePresence } from "framer-motion";
import { SuspendedUser } from "@/components/templates/p-admin/users/BlockUsersPage";

interface Props {
  transactions?: SuspendedUser[];
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  transaction: SuspendedUser | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const TransactionModal: React.FC<ModalProps> = ({
  open,
  onClose,
  transaction,
}) => {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 text-white p-6 rounded-lg w-11/12 max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white p-1 text-xl"
              onClick={onClose}
            >
              &times;
            </button>
              <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className=" max-h-[50vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> {transaction.id}
                </p>
                <p>
                  <strong>TID:</strong> {transaction.tid}
                </p>
                <p>
                  <strong>First Name:</strong> {transaction.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {transaction.last_name}
                </p>
                <p>
                  <strong>Dial Code:</strong> {transaction.dial_code}
                </p>
                <p>
                  <strong>Mobile:</strong> {transaction.mobile}
                </p>
                <p>
                  <strong>Email:</strong> {transaction.email}
                </p>
                <p>
                  <strong>Status:</strong> {transaction.status}
                </p>
                <p>
                  <strong>Sales Volume:</strong> {transaction.sales_volume}
                </p>
                <p>
                  <strong>2FA Confirmed:</strong>{" "}
                  {transaction.two_factor_confirmed ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Sync Message:</strong>{" "}
                  {transaction.sync_message_status ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Gender:</strong> {transaction.gender}
                </p>
                <p>
                  <strong>User Type:</strong> {transaction.user_type}
                </p>
                <p>
                  <strong>Rank ID:</strong> {transaction.rank_id}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(transaction.created_at).toLocaleString("en-GB")}
                </p>
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(transaction.updated_at).toLocaleString("en-GB")}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-6 py-2 rounded-xl bg-gray-400"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function SuspendedUsersTable({ transactions = [] }: Props) {
  const [selectedTransaction, setSelectedTransaction] =
    useState<SuspendedUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const columns: TableColumn<SuspendedUser>[] = [
    {
      title: "TID",
      field: "tid",
    },
    {
      title: "First Name",
      field: "first_name",
    },
    {
      title: "Last Name",
      field: "last_name",
    },
    {
      title: "Mobile",
      field: "mobile",
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Status",
      field: "status",
      render: (value: any) => {
        const color = value.toLowerCase() === "suspend" ? "#FF6060" : "#A8FFAE";
        return <span style={{ color, fontWeight: 600 }}>{value}</span>;
      },
    },
    {
      title: "Created At",
      field: "created_at",
      render: (value: any) =>
        new Date(value).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => {
              setSelectedTransaction(row);
              setModalOpen(true);
            }}
          >
            <FaEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<SuspendedUser> columns={columns} data={transactions} />
      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
}
