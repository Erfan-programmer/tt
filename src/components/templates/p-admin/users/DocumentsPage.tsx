"use client";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { apiRequest } from "@/libs/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DocumentVerificationList from "@/components/modules/p-admin/users/DocumentCountsList";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";

interface Verifier {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Document {
  id: number;
  client_id: number;
  type: string;
  path: string;
  status: "pending" | "approved" | "rejected";
  verified_by: number | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  verifier: Verifier;
}

interface User {
  id: number;
  tid: number;
  referrer_id: number | null;
  sponsor_id: number | null;
  first_name: string;
  last_name: string;
  dial_code: string;
  email: string;
  mobile: string;
  sales_volume: string;
  two_factor_confirmed: boolean;
  sync_message_status: boolean;
  gender: string;
  user_type: string;
  status: string;
  rank_id: number;
  verify_at: string;
  created_at: string;
  updated_at: string;
  documents: Document[];
}

interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface DocumentsResponse {
  success: boolean;
  message: string;
  data: User[];
  meta: Meta;
  errors: any;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);

  const findDocuments = async (
    filter_by?: string,
    filter_value?: string,
    pageNumber: number = 1
  ) => {
    try {
      const token = loadEncryptedData()?.token;
      let url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents?page=${pageNumber}`;
      if (filter_by && filter_value)
        url += `&filter_by=${filter_by}&filter_value=${filter_value}`;
      const res = await apiRequest<DocumentsResponse>(url, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      if (res.success) {
        setDocuments(res.data.data);
        setPageCount(res.data.meta.last_page);
        setPage(res.data.meta.current_page);
      } else toast.error("Error fetching documents: " + res.message);
    } catch (err: any) {
      toast.error("Error fetching documents: " + err.message);
    }
  };

  useEffect(() => {
    findDocuments();
  }, []);

  const handleStatusChange = (
    docId: number,
    status: "approved" | "rejected"
  ) => {
    setDocuments((prev) =>
      prev.map((user) => ({
        ...user,
        documents: user.documents.map((doc) =>
          doc.id === docId ? { ...doc, status } : doc
        ),
      }))
    );
  };

  const handlePageChange = (_: any, value: number) => {
    findDocuments(undefined, undefined, value);
  };

  return (
    <>
      <LineTitle onClick={() => {}} title="Documents" />
      <AdminSearchBox
        filterOptions={[
          { label: "Name", value: "name", placeholder: "Enter Name..." },
          { label: "TID", value: "tid", placeholder: "Enter TID..." },
          { label: "Email", value: "email", placeholder: "Enter Email..." },
          { label: "Status", value: "status", placeholder: "Enter Status..." },
        ]}
        onSearch={(filter_by, filter_value) =>
          findDocuments(filter_by, filter_value)
        }
        onClear={() => findDocuments()}
      />

      <DocumentVerificationList
        documents={documents}
        onStatusChange={handleStatusChange}
      />
      <div className="flex justify-center mt-4">
        <Pagination count={pageCount} page={page} onChange={handlePageChange} />
      </div>
    </>
  );
}
