"use client";
import AdminSearchBox from "@/components/modules/p-admin/AdminSearchBox/AdminSearchBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import React, { useState, useEffect, useCallback } from "react";
import TopEarnersList, { ProfitableUser } from "./TopEarnersList";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";

interface MetaData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function TopEarners() {
  const [users, setUsers] = useState<ProfitableUser[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<MetaData | null>(null);
  const token = loadEncryptedData()?.token;

  const fetchProfitableUsers = useCallback(
    async (
      pageNumber: number = 1,
      filter_by?: string,
      filter_value?: string
    ) => {
      if (!token) return;

      try {
        const query = new URLSearchParams();
        query.append("page", pageNumber.toString());
        if (filter_by && filter_value) {
          query.append("filter_by", filter_by);
          query.append("filter_value", filter_value);
        }

        const res = await apiRequest<{
          data: ProfitableUser[];
          meta: MetaData;
        }>(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/v1/admin/profitableUsers?${query.toString()}`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success && res.data) {
          setUsers(res.data.data);
          setMeta(res.data.meta || null);
          setPage(res.data.meta?.current_page || pageNumber);

          const sum = res.data.data.reduce(
            (acc, user) => acc + parseFloat(user.income),
            0
          );
          setTotalIncome(sum);
        } else {
          setUsers([]);
          setTotalIncome(0);
          setMeta(null);
        }
      } catch (err) {
        console.error("Error fetching profitable users:", err);
        setUsers([]);
        setTotalIncome(0);
        setMeta(null);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchProfitableUsers(page);
  }, [fetchProfitableUsers , page]);

  const handleSearch = (filter_by: string, filter_value: string) => {
    fetchProfitableUsers(1, filter_by, filter_value);
  };

  const handleClear = () => {
    fetchProfitableUsers(1);
  };

  return (
    <div>
      <LineTitle title="Profitable Users" onClick={() => {}} />

      <AdminSearchBox
        title="Search"
        filterOptions={[
          {
            label: "Full Name",
            value: "full_name",
            placeholder: "Enter Full Name...",
          },
          {
            label: "Transaction ID",
            value: "tid",
            placeholder: "Enter Transaction ID...",
          },
          { label: "Rank", value: "rank", placeholder: "Enter Rank..." },
          {
            label: "Account Type",
            value: "account_type",
            placeholder: "Enter Account Type...",
          },
          { label: "Income", value: "income", placeholder: "Enter Income..." },
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="my-2 text-right font-bold">
        Total Income: ${totalIncome.toFixed(2)}
      </div>

      <TopEarnersList users={users} />

      {meta && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={meta.last_page}
            page={page}
            onChange={(_, newPage) => fetchProfitableUsers(newPage)}
          />
        </div>
      )}
    </div>
  );
}
