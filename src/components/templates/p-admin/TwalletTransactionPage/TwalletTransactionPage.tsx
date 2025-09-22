"use client";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import TWalletTransactionHistory , {Transaction} from "@/components/modules/p-admin/users/TWalletTransactions";
import PendingDepositsList, { TransactionPending } from "./PendingDepositList";

export default function TwalletTransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingDeposits, setPendingDeposits] = useState<TransactionPending[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLineTitle, setShowLineTile] = useState({
    wallet_transaction: true,
  });
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const perPage = 10;
  const [searchParams, setSearchParams] = useState<{
    filter_by?: string;
    filter_value?: string;
  }>({});

  const fetchTransactions = async (
    pageNumber = 1,
    filter_by?: string,
    filter_value?: string
  ) => {
    try {
      setLoading(true);
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();
      queryParams.append("page", pageNumber.toString());
      queryParams.append("per_page", perPage.toString());
      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      }

      const res = await apiRequest<{
        data: Transaction[];
        meta: {
          current_page: number;
          total: number;
        };
      }>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/search/tWalletTransactions?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setTransactions(res.data.data || []);
        setPage(res.data.meta.current_page || 1);
        setTotalCount(res.data.meta.total || 0);
      } else {
        toast.error("Error fetching transactions: " + res.message);
      }
    } catch (err: any) {
      toast.error("Error fetching transactions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDeposits = async (
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

      const res = await apiRequest<{ data: TransactionPending[] }>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/v1/admin/wallet/pending-deposits?${queryParams.toString()}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setPendingDeposits(res.data.data);
      } else {
        toast.error("Error fetching pending deposits: " + res.message);
      }
    } catch (err: any) {
      toast.error("Error fetching pending deposits: " + err.message);
    }
  };

  useEffect(() => {
    fetchTransactions(page, searchParams?.filter_by, searchParams?.filter_value);
    fetchPendingDeposits();
  }, [page, searchParams]);

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            wallet_transaction: !prev.wallet_transaction,
          }));
        }}
        title="T-Wallet Transaction"
      />

      {showLineTitle.wallet_transaction && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "From User",
                value: "from_user",
                placeholder: "Enter From User...",
              },
              {
                label: "To User",
                value: "to_user",
                placeholder: "Enter To User...",
              },
            ]}
            onSearch={(filter_by, filter_value) =>
              setSearchParams({ filter_by, filter_value })
            }
            onClear={() => setSearchParams({})}
          />

          {loading ? (
            <p className="text-gray-400 mt-4">Loading...</p>
          ) : (
            <>
              <TWalletTransactionHistory transactions={transactions} />
              <div className="flex justify-center mt-4">
                <Pagination
                  count={Math.ceil(totalCount / perPage)}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                />
              </div>
            </>
          )}

          {pendingDeposits.length > 0 && (
            <div className="mt-8">
              <LineTitle onClick={() => {}} title="Pending Deposits" />
              <PendingDepositsList transactions={pendingDeposits} />
            </div>
          )}
        </AnimationTemplate>
      )}
    </>
  );
}
