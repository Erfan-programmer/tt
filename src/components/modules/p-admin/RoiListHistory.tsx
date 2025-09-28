"use client";
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AdminDynamicTable, { TableColumn } from "./AdminTable";
import { motion, AnimatePresence } from "framer-motion";

const formatToTwoDecimalsSafe = (value: string | number | null | undefined) => {
  const num = Number(value);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

const formatToInt = (value: string | number | null | undefined) => {
  const num = Number(value);
  if (isNaN(num)) return "0";
  return Math.round(num).toString();
};

export interface RoiStatement {
  id: number;
  user_id: number;
  year: string;
  month: number;
  average_percentage: string;
  roi_recipients_count: number;
  total_profit: string;
  total_loss: string;
  commission_recipients_count: number;
  total_commission: string;
  updated_at: string;
  created_at: string;
}

interface RoiListHistoryProps {
  data: RoiStatement[];
}

export default function RoiListHistory({ data }: RoiListHistoryProps) {
  const [selectedRoi, setSelectedRoi] = useState<RoiStatement | null>(null);

  const columns: TableColumn<RoiStatement>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Year", field: "year" },
    { title: "Month", field: "month" },
    {
      title: "Average %",
      field: "average_percentage",
      render: (_: any, row: RoiStatement) =>
        `${formatToInt(row.average_percentage)} %`,
    },
    { title: "ROI Recipients Count", field: "roi_recipients_count" },
    {
      title: "Total Profit",
      field: "total_profit",
      render: (_: any, row: RoiStatement) =>
        formatToTwoDecimalsSafe(row.total_profit),
    },
    {
      title: "Total Loss",
      field: "total_loss",
      render: (_: any, row: RoiStatement) =>
        formatToTwoDecimalsSafe(row.total_loss),
    },
    {
      title: "Commission Recipients Count",
      field: "commission_recipients_count",
    },
    {
      title: "Total Commission",
      field: "total_commission",
      render: (_: any, row: RoiStatement) =>
        formatToTwoDecimalsSafe(row.total_commission),
    },
    {
      title: "Action",
      field: "id",
      render: (_value, row) => (
        <button
          onClick={() => setSelectedRoi(row)}
          className="p-1 rounded text-[#6A6A6A] flex items-center gap-1"
        >
          <FaEye />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<RoiStatement> columns={columns} data={data} />

      <AnimatePresence>
        {selectedRoi && (
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
              className="bg-gray-800 p-6 rounded-xl shadow-lg w-[400px] max-h-[80vh] overflow-y-auto text-white"
            >
              <h2 className="text-lg font-semibold mb-4">ROI Preview</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Year:</span>{" "}
                  {selectedRoi.year}
                </p>
                <p>
                  <span className="font-semibold">Month:</span>{" "}
                  {selectedRoi.month}
                </p>
                <p>
                  <span className="font-semibold">Average:</span>{" "}
                  {formatToInt(selectedRoi.average_percentage)} %
                </p>
                <p>
                  <span className="font-semibold">ROI Recipients:</span>{" "}
                  {selectedRoi.roi_recipients_count}
                </p>
                <p>
                  <span className="font-semibold">Total Profit:</span>{" "}
                  {formatToTwoDecimalsSafe(selectedRoi.total_profit)}
                </p>
                <p>
                  <span className="font-semibold">Total Loss:</span>{" "}
                  {formatToTwoDecimalsSafe(selectedRoi.total_loss)}
                </p>
                <p>
                  <span className="font-semibold">Commission Recipients:</span>{" "}
                  {selectedRoi.commission_recipients_count}
                </p>
                <p>
                  <span className="font-semibold">Total Commission:</span>{" "}
                  {formatToTwoDecimalsSafe(selectedRoi.total_commission)}
                </p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedRoi(null)}
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
