"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminPagination from "../../AdminPagination";

export interface Faq {
  id: number;
  title: string;
  description: string;
  created_at?: string;
}

interface FaqsTableProps {
  faqs: Faq[];
  loading: boolean;
  page: number;
  lastPage: number;
  onPageChange?: (page: number) => void;
  onEdit: (faq: Faq) => void;
  onDelete: (faq: Faq) => void;
}

export default function FaqsTable({
  faqs,
  loading,
  page,
  lastPage,
  onPageChange,
  onEdit,
  onDelete,
}: FaqsTableProps) {
  const columns: TableColumn<Faq>[] = [
    {
      title: "ID",
      field: "id",
      render: (_value, _row, index) => index,
    },
    { title: "Title", field: "title" },
    {
      title: "Description",
      field: "description",
      render: (_, faq: any): React.ReactNode => (
        <span
          className="whitespace-nowrap"
          dangerouslySetInnerHTML={{ __html: faq.description }}
        />
      ),
    },
    {
      title: "Created At",
      field: "created_at",
      render: (_, faq: any): React.ReactNode => (
        <span className="whitespace-nowrap">
          {new Date(faq.created_at).toLocaleDateString("en-GB")}
        </span>
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_, faq): React.ReactNode => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(faq)}
            className="p-1 rounded text-blue-500"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(faq)}
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
      <AdminDynamicTable<any> columns={columns} data={faqs} loading={loading} />
      <AdminPagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={(p) => onPageChange && onPageChange(p)}
      />
    </>
  );
}
