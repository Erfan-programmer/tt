"use client";
import React, { useEffect, useState } from "react";
import LineTitle from "../LineTitle";
import UserDocumentResult from "./UserDocumentResult";
import UserDocumentAction from "./UserDocumentAction";
import UserInformationSection from "./UserInformationSection";
import UserInformationSwitch from "./UserInformationSwitch";
import UserOverviewResult from "./UserOverviewResult";
import UserFinanceDeposit from "./UserFinanceDeposit";
import UsersFinanceTWallet from "./UsersFinanceTWallet";
import UsersFinanceROI from "./UsersFinanceROI";
import UsersFinanceCommission from "./UsersFinanceCommission";
import UsersProfileResetPassword from "./UsersProfileResetPassword";
import UsersProfileEmailChange from "./UsersProfileEmailChange";
import UsersTransactionHistory from "./UsersTransactionHistory";
import { useUserDocuments } from "@/contextApi/DocumentContext";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import UsersProfileReset2FACode from "./UsersProfileReset2FACode";
// import { useUserDocuments } from "@/contextApi/DocumentContext";

export default function UserInformationDetailPage({ id }: { id: number }) {
  const { userInfo, fetchUserInfo, loading } = useUserDocuments();
  const [showLineTitle, setShowLineTile] = useState({
    user_documents: true,
    user_information: true,
    finance: true,
    profile: true,
    trans_history: true,
  });

  useEffect(() => {
    fetchUserInfo(id);
  }, [id, fetchUserInfo]);

  const getStatusText = (status?: string) => {
    if (!status) return "";
    return status.toLowerCase() === "cancellation_pending" ? "pending" : status;
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-500",
    active: "text-green-500",
    suspend: "text-red-500",
    cancellation_pending: "text-orange-400",
    closed: "text-gray-500",
    delete_account: "text-red-700",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="user-document-detail-header">
        <div className="flex items-center flex-wrap gap-4">
          <span className="text-lg text-white">
            TID {userInfo?.tid} -{" "}
            <span
              className={`${
                userInfo?.status?.toLowerCase() === "cancellation_pending"
                  ? "text-[var(--normal)]"
                  : userInfo?.status === "approved"
                  ? "text-[#00FF90]"
                  : ""
              }`}
            >
              {getStatusText(userInfo?.status)}
            </span>
          </span>
        </div>
        <div className="flex items-center flex-wrap gap-4 text-[#6A6A6A]">
          <span>{userInfo?.contract_info?.plan?.name}</span>
          <span>Start: {formatDate(userInfo?.contract_info?.start_date)}</span>
          <span>End: {formatDate(userInfo?.contract_info?.end_date)}</span>
          <span
            className={
              statusColors[userInfo?.status?.toLowerCase() || ""] ||
              "text-white"
            }
          >
            {userInfo?.status}
          </span>
        </div>
      </div>
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            user_documents: !showLineTitle.user_documents,
          }));
        }}
        title="User Documents"
      />
      {showLineTitle.user_documents && (
        <AnimationTemplate>
          <UserDocumentResult />
          <UserDocumentAction />
        </AnimationTemplate>
      )}
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            user_information: !showLineTitle.user_information,
          }));
        }}
        title="User Management"
      />
      {showLineTitle.user_information && (
        <AnimationTemplate>
          <UserInformationSection />
          <UserInformationSwitch />
          <UserOverviewResult />
        </AnimationTemplate>
      )}
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            finance: !showLineTitle.finance,
          }));
        }}
        title="Finance"
      />
      {showLineTitle.finance && (
        <AnimationTemplate>
          <UserFinanceDeposit />
          <UsersFinanceTWallet />
          <UsersFinanceROI />

          <UsersFinanceCommission />
        </AnimationTemplate>
      )}
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            profile: !showLineTitle.profile,
          }));
        }}
        title="Profile"
      />
      {showLineTitle.profile && (
        <AnimationTemplate>
          <UsersProfileResetPassword />
          <UsersProfileEmailChange />
          <UsersProfileReset2FACode />
        </AnimationTemplate>
      )}
      <LineTitle
        onClick={() => {
          setShowLineTile((prev) => ({
            ...prev,
            trans_history: !showLineTitle.trans_history,
          }));
        }}
        title="Transaction History"
      />
      {showLineTitle.trans_history && <UsersTransactionHistory />}
    </>
  );
}
