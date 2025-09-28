"use client";
import React, { useState, useEffect, useCallback } from "react";
import LineTitle from "../LineTitle";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import DrawDownHistoryList from "./DrawDownHistoryList";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import Pagination from "../../UserPanel/Pagination/Pagination";

interface DrawDownData {
  id: number;
  date: string;
  tid: number;
  fullname: string;
  account_type: string;
  deposit: string;
  dd_percent: string;
  balance: string;
  capital_health: string;
  account_in_trade: string;
  capital_return_request: string;
}

interface DrawDownMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface DrawDownType {
  success: boolean;
  message: string;
  data: DrawDownData[];
  meta: DrawDownMeta;
  errors: any | null;
}

export default function DrawDownPage() {
  const [showLineTitle, setShowLineTile] = useState({ drawdown: true });
  const [data, setData] = useState<DrawDownData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [per_page, setPerPage] = useState<number>(15);
  const [drawdownPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const token = loadEncryptedData()?.token;
        const res = await apiRequest<DrawDownType>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/drawdownAccounts?page=${page}&per_page=${per_page}`,
          "GET",
          null,
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          setData(res.data.data || []);
          setTotal(res.data.meta.total);
          setPerPage(res.data.meta.per_page);
        } else {
          toast.error("Error fetching drawdown accounts: " + res.message);
        }
      } catch (error: any) {
        console.error("Error fetching drawdown accounts:", error);
        toast.error("Error fetching drawdown accounts");
      } finally {
        setLoading(false);
      }
    },
    [per_page]
  );

  useEffect(() => {
    fetchData(drawdownPage);
  }, [drawdownPage, fetchData]);

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            drawdown: !prev.drawdown,
          }));
        }}
        title="Drawdown"
      />

      {showLineTitle.drawdown && (
        <AnimationTemplate>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "User ID",
                value: "userId",
                placeholder: "Enter User ID...",
              },
              {
                label: "Transaction ID",
                value: "transactionId",
                placeholder: "Enter Transaction ID...",
              },
              { label: "Date", value: "date", placeholder: "Enter Date..." },
            ]}
            onSearch={(filter, value) => {
              console.log("Search:", filter, value);
            }}
            onClear={() => fetchData(drawdownPage)}
          />
          <DrawDownHistoryList data={data} loading={loading} />
          <div className="flex justify-center mt-4">
            <Pagination
              count={Math.ceil(total / per_page)}
              page={drawdownPage}
              onChange={(_, newPage) => fetchData(newPage)}
            />
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
