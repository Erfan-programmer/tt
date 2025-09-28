"use client";
import React, { useState, useEffect, useCallback } from "react";
import CashAwardRecipientList, {
  UnClaimerDataType,
  UnClaimerResponse,
} from "./CashAwardRecipientList";
import CashAwardHistoryRecipientList from "./CashAwardHistoryRecipientList";
import LineTitle from "../../LineTitle";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import { CashRewardHistoryRecipient } from "@/types/p-admin/Message";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import AdminSearchBox from "../../AdminSearchBox/AdminSearchBox";

type summaryType = {
  pending_recipient: number;
  total_recipient: number;
};

export default function PhysicalRewardTab() {
  const [showTitle, setShowTitle] = useState(true);
  const [summary, setSummary] = useState<summaryType>({
    pending_recipient: 0,
    total_recipient: 0,
  });

  const [historyRecipents] = useState<CashRewardHistoryRecipient[]>([]);
  const [recipients, setRecipients] = useState<UnClaimerDataType[]>([]);

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

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = loadEncryptedData()?.token;
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/unclaimedPrizePhysicalSummery`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

        if (res) {
          setSummary({
            total_recipient: res.data.data.total_recipient,
            pending_recipient: res.data.data.pending_recipient,
          });
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch physical reward summary");
      }
    };

    fetchSummary();
  }, []);

 const fetchRecipients = useCallback(
  async (filter_by?: string, filter_value?: string) => {
    try {
      const queryParams = new URLSearchParams();
      const token = loadEncryptedData()?.token;

      if (filter_by && filter_value) {
        queryParams.append("filter_by", filter_by);
        queryParams.append("filter_value", filter_value);
      } else {
        queryParams.append("filter_by", "client_id");
        queryParams.append("filter_value", "");
      }

      const endpoint = `/v1/admin/unclaimedPrizePhysical?${queryParams.toString()}`;

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

  const handleSearch = (filter_by: string, filter_value: string) => {
    fetchRecipients(filter_by, filter_value);
  };

  const handleClear = () => {
    fetchRecipients();
  };

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
          },
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <div className="flex items-center flex-wrap gap-4 mt-12">
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Total Request:</span>
          <span>{summary.pending_recipient}</span>
        </div>
      </div>

      <CashAwardRecipientList
        refetch={fetchRecipients}
        recipients={recipients}
      />

      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(recipients.length / recipientPerPage)}
          page={recipientPage}
          onChange={handleRecipientPageChange}
        />
      </div>

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
              <span>Total Recipient:</span>
              <span>{summary.total_recipient}</span>
            </div>
          </div>

          <CashAwardHistoryRecipientList type={"physical"} />

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
