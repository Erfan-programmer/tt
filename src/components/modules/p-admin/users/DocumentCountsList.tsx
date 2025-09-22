"use client";
import React, { useState } from "react";
import AdminDynamicTable, { TableColumn } from "../AdminTable";
import { FaEdit, FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";

interface Verifier {
  id: number;
  name: string;
  email: string;
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
  verifier?: Verifier;
}

interface User {
  id: number;
  tid: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

interface Props {
  documents: User[];
  onStatusChange: (docId: number, status: "approved" | "rejected") => void;
}

export default function DocumentVerificationList({
  documents,
  onStatusChange,
}: Props) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentDocId, setCurrentDocId] = useState<number | null>(null);

  const token = loadEncryptedData()?.token;

  const handleApprove = async (docId: number) => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents/${docId}/approve`,
        "POST",
        null,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Document approved");
        onStatusChange(docId, "approved");
        setSelectedImage(null);
      } else toast.error(res.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReject = async (docId: number, reason: string) => {
    try {
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/documents/${docId}/reject`,
        "POST",
        { reason },
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        toast.success("Document rejected");
        onStatusChange(docId, "rejected");
        setSelectedImage(null);
      } else toast.error(res.message);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns: TableColumn<User>[] = [
    { title: "TID", field: "tid" },
    {
      title: "First Name",
      field: "first_name",
      render: (_, row) => `${row.first_name}`,
    },
    {
      title: "Last Name",
      field: "last_name",
      render: (_, row) => `${row.last_name}`,
    },
    { title: "Email", field: "email" },
    {
      title: "Documents",
      field: "documents",
      render: (_, row) => (
        <div className="flex items-center">
          {row.documents.map((doc, index) => (
            <div key={doc.id} className="w-16 h-16 rounded-full overflow-hidden cursor-pointer -ml-3 first:ml-0">
              <Image
                width={64}
                height={64}
                src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${doc.path}`}
                alt={doc.type}
                className="object-cover w-full h-full border-2 border-white rounded-full"
                style={{ zIndex: row.documents.length - index }}
                onClick={() => {
                  setSelectedImage(doc.path);
                  setCurrentDocId(doc.id);
                }}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Status",
      field: "documents",
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          {row.documents.map((doc) => (
            <span
              key={doc.id}
              className={`font-semibold ${
                doc.status === "approved"
                  ? "text-green-500"
                  : doc.status === "rejected"
                  ? "text-red-500"
                  : "text-yellow-400"
              }`}
            >
              {doc.type}: {doc.status}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "Action",
      field: "id",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`user-information/${row.id}`)}
            className="p-1 rounded text-white hover:opacity-90 transition"
          >
            <FaEye />
          </button>
          <button
            onClick={() => router.push(`user-information/${row.id}`)}
            className="p-1 rounded text-white hover:opacity-90 transition"
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminDynamicTable
        columns={columns}
        data={documents}
        onRowClick={(row: User) => router.push(`/users-information/${row.id}`)}
      />

      {selectedImage && currentDocId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9998]">
          <div className="bg-gray-900 p-4 rounded-lg relative w-auto max-w-lg">
            <Image
              width={400}
              height={400}
              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${selectedImage}`}
              className="w-full h-80 object-cover rounded"
              alt="Document"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => currentDocId && handleApprove(currentDocId)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:opacity-90"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  currentDocId && handleReject(currentDocId, "reason")
                }
                className="px-4 py-2 bg-red-600 text-white rounded hover:opacity-90"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedImage(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
