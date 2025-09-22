"use client";
import React, { useCallback, useEffect, useState } from "react";
import LineTitle from "../LineTitle";
import CreateCommissionsLevel from "./CreateCommissionsLevel";
import AddSpecialCommissionRule from "./AddSpecialCommissionRule";
import SpecialCommissionList from "./SepicialCommissionList";
import Pagination from "../../UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";

interface CommissionData {
  id: number;
  user: number;
  level: number;
  receive_percentage: string;
  rank: string;
}

interface MetaData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface CommissionProps<T> {
  success: boolean;
  message: string;
  data: T;
  meta: MetaData;
  errors: null | any;
}

export default function CommissionPage() {
  const [commissionLevels, setCommissionsLevel] = useState<CommissionData[]>(
    []
  );
  const [meta, setMeta] = useState<MetaData | null>(null);
  const [page, setPage] = useState(1);

  const token = loadEncryptedData()?.token;
  const fetchCommissionList = useCallback(
    async (pageNumber: number = 1) => {
      if (!token) return;

      try {
        const res = await apiRequest<CommissionProps<CommissionData[]>>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/getSpecialCommission?page=${pageNumber}`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success && res.data) {
          setCommissionsLevel(res.data.data);
          setMeta(res.data.meta);
          setPage(res.data.meta.current_page || pageNumber);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to fetch commission list:", err.message);
        } else {
          console.error("Failed to fetch commission list:", err);
        }
      }
    },
    [token, setCommissionsLevel, setMeta, setPage]
  );

  useEffect(() => {
    fetchCommissionList(page);
  }, [fetchCommissionList , page]);

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
    fetchCommissionList(newPage);
  };

  return (
    <>
      <LineTitle onClick={() => {}} title="Commission" />
      <CreateCommissionsLevel />
      <AddSpecialCommissionRule refetch={() => fetchCommissionList(page)} />
      <SpecialCommissionList
        commissionsLevel={commissionLevels}
        refetch={() => fetchCommissionList(page)}
      />

      {meta && (
        <div className="flex items-center justify-center mt-4">
          <Pagination
            count={meta.last_page}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}
