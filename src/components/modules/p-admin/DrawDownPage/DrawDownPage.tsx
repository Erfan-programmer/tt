"use client";
import React, { useState, useEffect } from "react";
import LineTitle from "../LineTitle";
import AdminSearchBox from "../AdminSearchBox/AdminSearchBox";
import DrawDownHistoryList from "./DrawDownHistoryList";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { loadEncryptedData } from "../../EncryptData/SavedEncryptData";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";

export default function DrawDownPage() {
  const [showLineTitle, setShowLineTile] = useState({ drawdown: true });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/drawdownAccounts`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setData(res.data?.data || []);
      } else {
        toast.error("Error fetching drawdown accounts: " + res.message);
      }
    } catch (error: any) {
      console.error("Error fetching drawdown accounts:", error);
      toast.error("Error fetching drawdown accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            drawdown: !showLineTitle.drawdown,
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
            onClear={() => {
              fetchData();
            }}
          />

          <DrawDownHistoryList data={data} loading={loading} />
        </AnimationTemplate>
      )}
    </>
  );
}
