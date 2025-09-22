"use client";
import AdminDynamicTable, {
  TableColumn,
} from "@/components/modules/p-admin/AdminTable";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminPagination from "../../AdminPagination";

export interface Term {
  id: number;
  title: string;
  description: string;
  created_at?: string;
}

interface TermTableProps {
  terms: Term[];
  loading: boolean;
  page: number;
  lastPage: number;
  onPageChange?: (page: number) => void;
  onEdit: (faq: Term) => void;
  onDelete: (faq: Term) => void;
}

export default function TermsTable({
  terms,
  loading,
  page,
  lastPage,
  onPageChange,
  onEdit,
  onDelete,
}: TermTableProps) {
  const columns: TableColumn<Term>[] = [
    { title: "ID", field: "id" },
    { title: "Title", field: "title" },
 {
      title: "Description",
      field: "description",
      render: (_ , term: any): React.ReactNode =>
          <span className="whitespace-nowrap" dangerouslySetInnerHTML={{__html:term.description}} />
            
    },    {
      title: "Created At",
      field: "created_at",
      render: (_ ,term: any): React.ReactNode =>
          <span className="whitespace-nowrap">
            {new Date(term.created_at).toLocaleDateString("en-GB")}
          </span>
    },
    {
      title: "Action",
      field:"id",
      render: (_ ,term): React.ReactNode => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(term)}
            className="p-1 rounded text-blue-500"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(term)}
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
      <AdminDynamicTable<any> columns={columns} data={terms} loading={loading} />
      <AdminPagination
        currentPage={page}
        lastPage={lastPage}
        onPageChange={(p) => onPageChange && onPageChange(p)}
      />
    </>
  );
}
