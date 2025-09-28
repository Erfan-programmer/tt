"use client";
import React, { useState, useEffect } from "react";
import CashAwardRecipientList from "./CashAwardRecipientList";
import CashAwardHistoryRecipientList from "./CashAwardHistoryRecipientList";
import LineTitle from "../../LineTitle";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import {
  CashRewardHistoryRecipient,
  CashRewardRecipient,
} from "@/types/p-admin/Message";
import Pagination from "@/components/modules/UserPanel/Pagination/Pagination";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";

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

  const [recipents] = useState<CashRewardRecipient[]>([]);
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

  return (
    <>
      {/* recipients list */}
      <div className="flex items-center flex-wrap gap-4 mt-12">
        <div className="rounded-[.5rem] p-2 px-6 border-[2px] border-[#383C47] flex items-center text-lg text-white">
          <span>Total Request:</span>
          <span>{summary.pending_recipient}</span>
        </div>
      </div>

      <CashAwardRecipientList type={"physical"} />

      <div className="flex justify-center mt-6">
        <Pagination
          count={Math.ceil(recipents.length / recipientPerPage)}
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
