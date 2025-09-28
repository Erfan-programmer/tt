"use client";
import React from "react";
import { motion } from "framer-motion";

export interface TableColumn<T> {
  title: string;
  field: keyof T;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
}

interface AdminDynamicTableProps<T extends { id: number | string }> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  title?: string;
  onRowClick?: (row: T) => void;
}

export default function AdminDynamicTable<T extends { id: string | number }>({
  columns,
  data,
  title,
  loading = false,
  onRowClick,
}: AdminDynamicTableProps<T>) {
  return (
    <div className="my-6">
      <div className="table-title text-white">
        <span>{title ? title : "Table"}</span>
      </div>
      <div className="border-[2px] border-[#383C47] pt-4 px-6 text-center rounded-[.5rem] mt-2">
        <div className="overflow-x-auto transaction-payment-list">
          <table className="w-full text-white border-separate border-spacing-0 overflow-hidden rounded-xl table-auto">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={col.title}
                    className={`px-4 py-2 border-t border-b border-[#383C47] whitespace-nowrap ${
                      idx === 0 ? "border-l rounded-tl-xl rounded-bl-xl" : ""
                    } ${
                      idx === columns.length - 1
                        ? "border-r rounded-tr-xl rounded-br-xl"
                        : ""
                    }`}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-[#555]">
                    {columns.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-2 border-b border-[#555] whitespace-nowrap"
                      >
                        <div className="h-4 bg-[#383C47] rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-4 text-center text-gray-400"
                  >
                    Data is not found
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`hover:bg-[#2A2F3A] cursor-pointer ${
                      rowIndex % 2 !== 0 ? "text-white" : "text-[#6A6A6A]"
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((col) => {
                      const value = row[col.field];
                      return (
                        <td
                          key={col.title}
                          className="px-4 py-2 border-b border-[#555] whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.render
                            ? col.render(value, row, rowIndex + 1)
                            : value === null ||
                              value === undefined ||
                              value === ""
                            ? "-"
                            : (value as React.ReactNode)}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
