"use client";
import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { toast } from "react-toastify";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { motion, AnimatePresence } from "framer-motion";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface SpecialCommission {
  id: number;
  user: number;
  level: number;
  receive_percentage: string;
  rank: string;
}

interface SpecialCommissionListProps {
  commissionsLevel?: SpecialCommission[];
  onDelete?: () => void;
  refetch: () => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-[#1F2937] text-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-lg font-bold mb-4">{title || "Confirm Action"}</h2>
        <p className="mb-6">{message || "Are you sure?"}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SpecialCommissionList({
  commissionsLevel = [],
  onDelete,
  refetch,
}: SpecialCommissionListProps) {
  const token = loadEncryptedData()?.token;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCommission, setViewCommission] =
    useState<SpecialCommission | null>(null);

  const handleDelete = async (id: number) => {
    if (!token) return toast.error("User token not found");

    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteSpecialCommission/${id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        refetch();
        if (onDelete) onDelete();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setModalOpen(false);
      setDeleteId(null);
    }
  };

  const columns: TableColumn<SpecialCommission>[] = [
    { title: "Number", field: "id" },
    { title: "User", field: "user", render: (_, row) => `User ${row.user}` },
    {
      title: "Level",
      field: "level",
      render: (_, row) => `Level ${row.level} (${row.rank})`,
    },
    {
      title: "% Receive",
      field: "receive_percentage",
      render: (_, row) => `${formatToTwoDecimals(row.receive_percentage)}%`,
    },
    { title: "Rank", field: "rank" },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => setViewCommission(row)}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-red-500"
            onClick={() => {
              setDeleteId(row.id);
              setModalOpen(true);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<SpecialCommission>
        columns={columns}
        data={commissionsLevel}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Special Commission"
        message="Are you sure you want to delete this commission rule?"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setModalOpen(false)}
      />

      {/* View Commission Modal */}
      <AnimatePresence>
        {viewCommission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-[400px] text-white"
            >
              <h2 className="text-lg font-semibold mb-4">
                Special Commission Details
              </h2>
              <div className="space-y-2 text-sm">
                {Object.entries(viewCommission).map(([key, value]) => {
                  if (key === "receive_percentage") {
                    return (
                      <p key={key}>
                        <span className="font-semibold">
                          {key.replace("_", " ")}:
                        </span>{" "}
                        {formatToTwoDecimals(value)}%
                      </p>
                    );
                  }

                  return (
                    <p key={key}>
                      <span className="font-semibold">
                        {key.replace("_", " ")}:
                      </span>{" "}
                      {value}
                    </p>
                  );
                })}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setViewCommission(null)}
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
