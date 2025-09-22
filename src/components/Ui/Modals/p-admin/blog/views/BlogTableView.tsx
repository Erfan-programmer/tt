"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React from "react";
import Image from "next/image";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import {  BlogInlineBoxViewProps } from "@/types/p-admin/dashoard";

export default function BlogTableView({
  blogs,
  onEdit,
  onDelete,
}: BlogInlineBoxViewProps) {
  const columns: TableColumn<any>[] = [
    { title: "#", field: "id" },
    {
      title: "Image",
      field: "image",
      render: (_, row) =>
        row.image ? (
          <div className="w-16 h-16 relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${row.image}`}
              alt={row.title || "Blog"}
              fill
              className="object-cover rounded"
            />
          </div>
        ) : (
          "-"
        ),
    },
    { title: "Title", field: "title" },
    { title: "Short Description", field: "short_description" },
    { title: "Created At", field: "created_at" },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2 mt-4 items-center justify-end">
          <button onClick={() => onEdit?.(row)}>
            <FaEye className="text-blue-500 hover:text-blue-600 transition" />
          </button>
          <button onClick={() => onEdit?.(row)}>
            <FaEdit className=" text-yellow-500 rounded hover:text-yellow-600 " />
          </button>
          <button onClick={() => onDelete?.(row)}>
            <FaTrash className=" text-red-500 rounded hover:text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return <AdminDynamicTable columns={columns} data={blogs} />;
}
