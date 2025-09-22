"use client";
import React, { useState, useEffect, useCallback } from "react";
import LineTitle from "../LineTitle";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import CancelRequestList from "./CancelRequestList";
import ExportFormatBox from "./ExportFormatBox";
import CancelAccountHistoryList from "./CancelAccountHistoryList";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import Pagination from "../../UserPanel/Pagination/Pagination";

export interface CancelRequest {
  id: number;
  date: string;
  name: string;
  t_id: number;
  position: string;
  deposit: string;
  balance: string;
  income: string;
  cancel_reason: string;
  penalty: string;
  to_be_received: string;
  wallet_type: string;
  email: string;
  phone: string;
  wallet_address: string;
  cancel_date: string;
  cancel_doc_url: string;
  txid: string;
  status: "pending_review" | "approved" | "rejected";
}

export interface CancelRequestMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CancelRequestApiResponse {
  success: boolean;
  message: string;
  data: CancelRequest[];
  meta: CancelRequestMeta;
  errors: null | any;
}

export default function CancelAccountPage() {
  const [cancelAccounts, setCancelAccounts] = useState<CancelRequest[]>([]);
  const [historyAccounts, setHistoryAccounts] = useState<CancelRequest[]>([]);

  const [cancelPage, setCancelPage] = useState(1);
  const [cancelPerPage, setCancelPerPage] = useState(15);
  const [cancelTotal, setCancelTotal] = useState(1);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(15);
  const [historyTotal, setHistoryTotal] = useState(1);

  const filterOptions = [
    { label: "Name", value: "name", placeholder: "Enter Name..." },
    { label: "User", value: "user", placeholder: "Enter User ID..." },
    { label: "Position", value: "position", placeholder: "Enter Position..." },
    {
      label: "Wallet Type",
      value: "wallet_type",
      placeholder: "Enter Wallet Type...",
    },
    { label: "Status", value: "status", placeholder: "Enter Status..." },
  ];
  const filterHistoryOptions = [
    { label: "Name", value: "name", placeholder: "Enter Name..." },
    { label: "User", value: "user", placeholder: "Enter User ID..." },
    { label: "Position", value: "position", placeholder: "Enter Position..." },
    {
      label: "Wallet Type",
      value: "wallet_type",
      placeholder: "Enter Wallet Type...",
    },
    { label: "Status", value: "status", placeholder: "Enter Status..." },
  ];

  const fetchCancelAccounts = useCallback(
    async (page = 1, filter_by?: string, filter_value?: string) => {
      try {
        const token = loadEncryptedData()?.token;
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        if (filter_by && filter_value) {
          queryParams.append("filter_by", filter_by);
          queryParams.append("filter_value", filter_value);
        }

        const res = await apiRequest<CancelRequestApiResponse>(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/v1/admin/cancellations?${queryParams.toString()}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (res.data.success) {
          setCancelAccounts(res.data.data);
          setCancelTotal(res.data.meta.total);
          setCancelPerPage(res.data.meta.per_page);
          setCancelPage(page);
        } else {
          toast.error("Error fetching transactions: " + res.data.message);
        }
      } catch (err: any) {
        toast.error("Error fetching transactions: " + err.message);
      }
    },
    [setCancelAccounts, setCancelTotal, setCancelPerPage, setCancelPage]
  );

  const fetchCancelHistory = useCallback(
    async (page = 1, filter_by?: string, filter_value?: string) => {
      try {
        const token = loadEncryptedData()?.token;
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        if (filter_by && filter_value) {
          queryParams.append("filter_by", filter_by);
          queryParams.append("filter_value", filter_value);
        }

        const res = await apiRequest<CancelRequestApiResponse>(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/v1/admin/cancellationHistory?${queryParams.toString()}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (res.data.success) {
          setHistoryAccounts(res.data.data);
          setHistoryTotal(res.data.meta.total);
          setHistoryPerPage(res.data.meta.per_page);
          setHistoryPage(page);
        } else {
          toast.error("Error fetching history: " + res.data.message);
        }
      } catch (err: any) {
        toast.error("Error fetching history: " + err.message);
      }
    },
    [setHistoryAccounts, setHistoryTotal, setHistoryPerPage, setHistoryPage]
  );

const refetchAll = useCallback(() => {
  fetchCancelAccounts();
  fetchCancelHistory();
}, [fetchCancelAccounts, fetchCancelHistory]);

useEffect(() => {
  refetchAll();
}, [refetchAll]);


  return (
    <>
      <LineTitle onClick={() => {}} title="Cancel Accounts" />
      <AdminSearchBox
        title="Search"
        filterOptions={filterOptions}
        onSearch={(filter_by, filter_value) => {
          fetchCancelAccounts(1, filter_by, filter_value);
          fetchCancelHistory(1, filter_by, filter_value);
        }}
        onClear={() => refetchAll()}
      />
      <CancelRequestList requests={cancelAccounts} refetch={refetchAll} />
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(cancelTotal / cancelPerPage)}
          page={cancelPage}
          onChange={(event, page) => fetchCancelAccounts(page)}
        />
      </div>

      <ExportFormatBox />

      <LineTitle onClick={() => {}} title="Cancel Accounts History" />
      <AdminSearchBox
        filterOptions={filterHistoryOptions}
        onSearch={(filter_by, filter_value) => {
          fetchCancelHistory(1, filter_by, filter_value);
          fetchCancelHistory(1, filter_by, filter_value);
        }}
        onClear={() => refetchAll()}
      />
      <CancelAccountHistoryList
        requests={historyAccounts}
        refetch={refetchAll}
      />
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(historyTotal / historyPerPage)}
          page={historyPage}
          onChange={(event, page) => fetchCancelHistory(page)}
        />
      </div>
    </>
  );
}
