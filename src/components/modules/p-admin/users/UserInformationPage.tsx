"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "../LineTitle";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import UserInformationHistoryList from "./UserInformationHistoryList";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast, ToastContainer } from "react-toastify";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { FaTimes } from "react-icons/fa";

interface UserTransaction {
  id: number;
  date: string;
  name: string;
  user: string;
  deposit: string;
  email: string;
  position: string;
  income: string;
  rank: string;
  gender: string | null;
  action: string | null;
}

export default function UserInformationPage() {
  const [transactions, setTransactions] = useState<UserTransaction[]>([]);
  const [showLineTitle, setShowLineTile] = useState({
    users: true,
  });
  const fetchTransactions = async (
    filter_by?: string,
    filter_value?: string
  ) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<any>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/users?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setTransactions(res?.data?.data || []);
      } else {
        toast.error("Error fetching transactions: " + res.message);
      }
    } catch (err: any) {
      toast.error("Error fetching transactions: " + err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <>
      <ToastContainer
        closeButton={({ closeToast }) => (
          <button onClick={closeToast}>
            <FaTimes className="text-white" />
          </button>
        )}
      />
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            users: !showLineTitle.users,
          }));
        }}
        title="Users"
      />
      {showLineTitle.users && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "Name",
                value: "name",
                placeholder: "Enter Your Name...",
              },
              {
                label: "TID",
                value: "tid",
                placeholder: "Enter your TID...",
              },
              {
                label: "Email",
                value: "email",
                placeholder: "Enter your email...",
              },
              {
                label: "All",
                value: "all",
                placeholder: "select alll users ...",
              },
              {
                label: "Position",
                value: "position",
                placeholder: "Enter your position...",
              },
              {
                label: "Rank",
                value: "rank",
                placeholder: "Enter your rank...",
              },
            ]}
            onSearch={(filter, value) => fetchTransactions(filter, value)}
            onClear={() => fetchTransactions()}
          />
          <UserInformationHistoryList users={transactions} />
        </AnimationTemplate>
      )}
    </>
  );
}
