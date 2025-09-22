"use client";
import UserInformationDetailPage from "@/components/modules/p-admin/users/UserInformationDetailPage";
import React from "react";
import { useParams } from "next/navigation";
import { UserDocumentsProvider } from "@/contextApi/DocumentContext";

export default function UserInformationDetail() {
  const params = useParams();
  const id: any = params?.id;

  return (
    <>
      <UserDocumentsProvider>
        <UserInformationDetailPage id={id} />
      </UserDocumentsProvider>
    </>
  );
}
