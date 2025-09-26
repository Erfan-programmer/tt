"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequest, ApiResponse } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

interface ContactsResponse {
  data: any[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

interface ContactsContextType {
  contacts: any[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalCount: number;
  perPage: number;
  refreshContacts: () => void;
  setPage: (page: number) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = loadUserData()?.access_token;

      const response: ApiResponse<ContactsResponse> = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contacts?page=${pageNumber}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.success) {
        throw new Error(response.error?.message || "Failed to fetch contacts");
      }

      setContacts(response.data?.data || []);
      setTotalCount(response.data?.meta?.total || 0);
      setPerPage(response.data?.meta?.per_page || 15);
      setPage(response.data?.meta?.current_page || 1);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
  }, [page]);

  const refreshContacts = () => {
    fetchContacts(page);
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        isLoading,
        error,
        page,
        totalCount,
        perPage,
        refreshContacts,
        setPage,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = (): ContactsContextType => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};
