"use client";
import React from "react";
import AdminVerificationStepBox from "./AdminVerificationStepBox";
import { useUserDocuments } from "@/contextApi/DocumentContext";

export default function UserDocumentResult() {
  const { documents, loading } = useUserDocuments();

  return (
    <div className="verification-document-type">
      <p className="text-white font-medium mb-2">Documents</p>
      <div className="verification-container mt-2 border-[2px] grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 rounded-[0.5rem] border-[#383C47] px-6 p-2">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : documents && documents.length > 0 ? (
          documents.map((doc: any) => (
            <AdminVerificationStepBox key={doc.id} data={doc} />
          ))
        ) : (
          <p className="text-gray-400">No documents found</p>
        )}
      </div>
    </div>
  );
}
