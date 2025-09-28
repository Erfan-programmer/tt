"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { Rank } from "@/types/p-admin/dashoard";
import EditRankForm from "./EditRankForm";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface RanksListHistoryProps {
  ranks: Rank[];
  loading: boolean;
  refetch: () => void;
}

export default function RanksListHistory({
  ranks,
  loading,
  refetch,
}: RanksListHistoryProps) {
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState<{
    status: boolean;
    id: number | null;
  }>({
    status: false,
    id: null,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState<{
    status: boolean;
    id: number | null;
  }>({
    status: false,
    id: null,
  });

  const handleDelete = async (id: number) => {
    const token = loadEncryptedData()?.token;
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/deleteRank/${id}`,
        "POST",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Rank deleted successfully");
        refetch();
      } else toast.error("Failed to delete rank");
    } catch {
      toast.error("Failed to delete rank");
    }
    setIsDeleteOpen({ status: false, id: null });
  };

  const columns: TableColumn<Rank>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Name", field: "name" },
    { title: "Level", field: "level" },
    {
      title: "Icon",
      field: "icon_path",
      render: (_, row) =>
        row.icon_path ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${row.icon_path}`}
            alt={row.name}
            width={60}
            height={60}
            className="rounded"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Min Sales Volume",
      field: "min_sales_volume",
      render: (_, rowData: any) =>
        `$${formatToTwoDecimals(rowData.min_sales_volume)}`,
    },
    { title: "Prize Description", field: "prize_description" },
    { title: "Required Downline Rank", field: "required_downline_rank_id" },
    { title: "Downline Count", field: "required_downline_rank_count" },
    {
      title: "Tournament Prize",
      field: "tournament_prize_amount",
      render: (_, rowData: any) =>
        `${formatToTwoDecimals(rowData.tournament_prize_amount)}`,
    },
    { title: "Description", field: "description" },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => {
              setSelectedRank(row);
              setIsViewOpen(true);
            }}
          >
            <FaEye />
          </button>
          <button
            className="p-1 rounded text-[#6A6A6A]"
            onClick={() => {
              setSelectedRank(row);
              setIsEditOpen({ status: true, id: row.id });
            }}
          >
            <FaEdit />
          </button>
          <button
            className="p-1 rounded text-red-500"
            onClick={() => setIsDeleteOpen({ status: true, id: row.id })}
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<Rank>
        columns={columns}
        data={ranks}
        loading={loading}

        title={`Ranks List: ${ranks.length}`}
      />
      <AnimatePresence>
        {isViewOpen && selectedRank && (
          <motion.div
            key="view-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40  bg-opacity-50 flex justify-center items-center z-[9999]"
            onClick={() => setIsViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E2D] p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4 font-bold">Rank Details</h2>

              <div className="space-y-2">
                {Object.entries(selectedRank).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between bg-[#2A2A3B] p-2 rounded"
                  >
                    <span className="font-semibold capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span>
                      {value === null || value === "" ? "-" : value.toString()}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsViewOpen(false)}
                className="mt-4 bg-red-500 px-4 py-2 rounded"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditOpen.status && selectedRank && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40  bg-opacity-50 flex justify-center items-center z-[9999]"
            onClick={() => setIsEditOpen({ status: false, id: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E2D] p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4 font-bold">Edit Rank</h2>
              <EditRankForm
                initialData={selectedRank}
                refetch={refetch}
                id={isEditOpen.id!}
                onClose={() => setIsEditOpen({ status: false, id: null })}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen.status && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40  bg-opacity-50 flex justify-center items-center z-[9999]"
            onClick={() => setIsDeleteOpen({ status: false, id: null })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1E1E2D] p-6 rounded-lg w-[400px] max-h-[50vh] overflow-y-auto text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl mb-4 font-bold">Confirm Delete</h2>
              <p>Are you sure you want to delete this rank?</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteOpen({ status: false, id: null })}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    isDeleteOpen.id && handleDelete(isDeleteOpen.id)
                  }
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
