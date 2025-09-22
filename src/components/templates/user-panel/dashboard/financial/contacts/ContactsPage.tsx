"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import TitanNotice from "@/components/modules/UserPanel/TitanNotice/TitanNotice";
import UserDetails from "./UserDetails";
import { ContactsProvider } from "@/contextApi/ContactsContext";
import UserActionHistory from "./UserActionHistory";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

export default function ContractPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", page],
    queryFn: async () => {
      const token = loadUserData()?.access_token;
      const response = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contacts?page=${page}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      const body = response.data || {};
      return {
        contacts: body?.data || [],
        totalCount: body?.meta?.total || 0,
        perPage: body?.meta?.per_page || 15,
        currentPage: body?.meta?.current_page || 1,
      };
    },
  });

  return (
    <>
      <TitanNotice
        title="Notice"
        description="You can save a user's name by entering their T-ID, allowing you to quickly and easily access your contact list or team members when needed"
      />
      <ContactsProvider>
        <UserDetails />
        <UserActionHistory
          contacts={data?.contacts || []}
          isLoading={isLoading}
          page={data?.currentPage || 1}
          onPageChange={setPage}
          totalCount={data?.totalCount || 0}
          perPage={data?.perPage || 15}
        />
      </ContactsProvider>
    </>
  );
}
