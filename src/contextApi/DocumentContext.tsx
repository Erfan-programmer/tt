"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

export interface DocumentItem {
  id: number;
  client_id: number;

  type: string;
  path: string;
  status: "pending" | "approved" | "rejected";
  verified_by: number | null;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  verifier: string | null;
}

export interface UserInfo {
  tid: number;
  status: string;
  contract_info?: {
      rank: string;
  total_income: string;
    plan?: {
      name: string;
    };
    start_date?: string;
    end_date?: string;
  };
  documents?: DocumentItem[];
  [key: string]: any; 
}

interface UserDocumentsContextType {
  documents: DocumentItem[];
  userInfo: UserInfo | null;
  loading: boolean;
  fetchUserInfo: (userId: number) => Promise<void>;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}

const UserDocumentsContext = createContext<UserDocumentsContextType>({
  documents: [],
  userInfo: null,
  loading: false,
  fetchUserInfo: async () => {},
  setDocuments: () => {},
  setUserInfo: () => {},
});

export const useUserDocuments = () => useContext(UserDocumentsContext);

export function UserDocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

 const fetchUserInfo = useCallback(async (userId: number) => {
  try {
    setLoading(true);
    const token = loadEncryptedData()?.token;
    if (!token) return console.error("Token not found");

    const res = await apiRequest<{ data: UserInfo }>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/showUser/${userId}`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (res.success) {
      const userData = res.data?.data;
      setUserInfo(userData); 
      setDocuments(userData?.documents ?? []); 
    } else {
      console.error("Error fetching user info:", res.message);
    }
  } catch (err: any) {
    console.error("Fetch error:", err.message);
  } finally {
    setLoading(false);
  }
}, [])

  return (
    <UserDocumentsContext.Provider
      value={{
        documents,
        userInfo,
        loading,
        fetchUserInfo,
        setDocuments,
        setUserInfo,
      }}
    >
      {children}
    </UserDocumentsContext.Provider>
  );
}
