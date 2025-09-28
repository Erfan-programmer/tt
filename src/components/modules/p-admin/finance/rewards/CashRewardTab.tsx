"use client";
import React, { useState, useEffect, useCallback } from "react";
import CashAwardRecipientList, {
  UnClaimerDataType,
  UnClaimerResponse,
} from "./CashAwardRecipientList";
import CashAwardHistoryRecipientList from "./CashAwardHistoryRecipientList";
import LineTitle from "../../LineTitle";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import {
  CashRewardHistoryRecipient,
} from "@/types/p-admin/Message";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { toast } from "react-toastify";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import RewardExport from "./RewardExport";
import AdminSearchBox from "../../AdminSearchBox/AdminSearchBox";

type summaryType = {
  amount_pending_recipient: number;
  amount_recipient: number;
  pending_recipient: number;
  total_recipient: number;
};

export default function CashRewardTab() {
  const [showTitle, setShowTitle] = useState(true);

  const [summary, setSummary] = useState<summaryType>({
    amount_pending_recipient: 0,
    amount_recipient: 0,
    pending_recipient: 0,
    total_recipient: 0,
  });

  const [recipients, setRecipients] = useState<UnClaimerDataType[]>([]);
  const [historyRecipents] = useState<CashRewardHistoryRecipient[]>([]);

  const [recipientPage, setRecipientPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);


  const recipientPerPage = 10;
  const historyPerPage = 10;

  const handleRecipientPageChange = (_event: any, value: number) => {
    setRecipientPage(value);
  };

  const handleHistoryPageChange = (_event: any, value: number) => {
    setHistoryPage(value);
  };

  // 📌 Fetch Summary
  useEffect(() => {
    const fetchSummary = async () => {
      const token = loadEncryptedData()?.token;
      try {
        const res = await apiRequest<{ data: summaryType }>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/unclaimedPrizeCashSummery`,
          "GET",
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (res?.data) {
          setSummary({
            amount_pending_recipient: res.data.data.amount_pending_recipient,
            amount_recipient: res.data.data.amount_recipient,
            pending_recipient: res.data.data.pending_recipient,
            total_recipient: res.data.data.total_recipient,
          });
        }
      } catch {
        toast.error("Failed to fetch cash reward summary");
      }
    };
    fetchSummary();
  }, []);

 const fetchRecipients = useCallback(
  async (filter_by?: string, filter_value?: string) => {
    try {
      const token = loadEncryptedData()?.token;
      const queryParams = new URLSearchParams();

      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      } else {
        queryParams.append("filter_by", "client_id");
        queryParams.append("filter_value", "");
      }

      const  endpoint = `/v1/admin/unclaimedPrizeCash?${queryParams.toString()}`;

      const res = await apiRequest<UnClaimerResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setRecipients(res.data.data);
      } else {
        toast.error(res.message || "Failed to fetch recipients");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error fetching recipients");
    }
  },
  []
);


  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  // 📌 Search & Clear handlers
  const handleSearch = (filter_by: string, filter_value: string) => {
    fetchRecipients(filter_by, filter_value);
  };

  const handleClear = () => {
    fetchRecipients();
  };

  // 📌 Pagination recipients slice
  const paginatedRecipients = recipients.slice(
    (recipientPage - 1) * recipientPerPage,
    recipientPage * recipientPerPage
  );

  return (
    <>
      <AdminSearchBox
        title="Search"
        filterOptions={[
          {
            label: "Client ID",
            value: "client_id",
            placeholder: "Enter Client ID...",
          },
          {
            label: "Rank ID",
            value: "rank_id",
            placeholder: "Enter Rank ID...",
          },
          { label: "Status", value: "status", placeholder: "Enter Status..." },
          {
            label: "Shipping Country",
            value: "shipping_country",
            placeholder: "Enter Country...",
          },
          {
            label: "Currency",
            value: "currency",
            placeholder: "Enter Currency...",
          }
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <RewardExport />

      {/* recipients list */}
      <div className="flex items-center flex-wrap gap-4 mt-12">
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Total Request:</span>
          <span>{summary.pending_recipient}</span>
        </div>
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Amount : </span>
          <span>{summary.amount_pending_recipient}</span>
        </div>
      </div>

      <CashAwardRecipientList
        recipients={paginatedRecipients}
        refetch={fetchRecipients}
      />

      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(recipients.length / recipientPerPage)}
          page={recipientPage}
          onChange={handleRecipientPageChange}
        />
      </div>

      {/* history list */}
      <LineTitle
        title="Rewards Paid History"
        onClick={() => {
          setShowTitle(!showTitle);
        }}
      />

      {showTitle && (
        <AnimationTemplate>
          <div className="flex items-center flex-wrap gap-4 mt-12">
            <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
              <span>Total Recipient: </span>
              <span>{summary.total_recipient}</span>
            </div>
            <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
              <span>Amount : </span>
              <span>{summary.amount_recipient}</span>
            </div>
          </div>

          <CashAwardHistoryRecipientList type={"cash"} />

          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(historyRecipents.length / historyPerPage)}
              page={historyPage}
              onChange={handleHistoryPageChange}
            />
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
