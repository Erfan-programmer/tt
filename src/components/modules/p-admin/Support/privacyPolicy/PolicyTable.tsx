"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminPagination from "../../AdminPagination";

export interface Privacy {
  id: number;
  title: string;
  description: string;
  created_at?: string;
}

interface PolicyTableProps {
  privacies: Privacy[];
  loading: boolean;
  page: number;
  lastPage: number;
  onPageChange?: (page: number) => void;
  onEdit: (faq: Privacy) => void;
  onDelete: (faq: Privacy) => void;
}

export default function PolicyTable({
  privacies,
  loading,
  page,
  lastPage,
  onPageChange,
  onEdit,
  onDelete,
}: PolicyTableProps) {
  const columns: TableColumn<Privacy>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Title", field: "title" },
    {
      title: "Description",
      field: "description",
      render: (_, privacy: any): React.ReactNode => (
        <span
          className="whitespace-nowrap"
          dangerouslySetInnerHTML={{ __html: privacy.description }}
        />
      ),
    },
    {
      title: "Created At",
      field: "created_at",
      render: (_, privacy: any): React.ReactNode => (
        <span className="whitespace-nowrap">
          {new Date(privacy.created_at).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_, privacy): React.ReactNode => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(privacy)}
            className="p-1 rounded text-blue-500"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(privacy)}
            className="p-1 rounded text-red-500"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable<any>
        columns={columns}
        data={privacies}
        loading={loading}
      />
      <AdminPagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={(p) => onPageChange && onPageChange(p)}
      />
    </>
  );
}
