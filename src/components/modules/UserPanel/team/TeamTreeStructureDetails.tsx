"use client";
import { useState, useEffect } from "react";
import { ReferralType } from "./TeamTreeStructoreContent";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "../../EncryptData/SavedEncryptData";
import { formatToTwoDecimals } from "../../FormatToDecimal";

interface TeamTreeStructureDetailsProps {
  selectedReferral: ReferralType | null;
}

export default function TeamTreeStructureDetails({ selectedReferral }: TeamTreeStructureDetailsProps) {
  const [memberDetails, setMemberDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedReferral) {
      setMemberDetails(null);
      return;
    }

    const fetchMemberDetails = async () => {
      setLoading(true);
      setError(null);
      const token = loadUserData()?.access_token;
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/downline/member/${selectedReferral.id}`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        );
        if (res.success) {
          setMemberDetails(res?.data?.data);
        } else {
          setError(res.message || "Failed to fetch member details");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [selectedReferral]);

  if (!selectedReferral) {
    return (
      <div className="teamtree-structure-detail-container border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[100%] rounded-xl bg-shadow-custom">
        <div className="teamtree-structure-detail-header px-[2rem] mt-3">
          <p className="text-[var(--dark-color)] dark:text-white">Quick Details</p>
        </div>
        <div className="w-full h-[1px] bg-standard my-3 mt-5"></div>
        <div className="teamtree-structure-detail-wrapper px-[2rem] text-[var(--dark-color)] dark:text-white">
          <p className="text-center mt-8">Select a referral to view details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="teamtree-structure-detail-container border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[100%] rounded-xl bg-shadow-custom flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="teamtree-structure-detail-container border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[100%] rounded-xl bg-shadow-custom flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="teamtree-structure-detail-container border-standard bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] py-4 sm:py-0 sm:min-h-screen w-[95%] sm:w-[100%] max-h-[80vh] overflow-y-auto p-3 sm:p-0 rounded-xl bg-shadow-custom">
      <div className="teamtree-structure-detail-header px-2 sm:px-[2rem] mt-0 sm:mt-3">
        <p className="text-[var(--dark-color)] dark:text-white">Quick Details</p>
      </div>
      <div className="w-full h-[1px] bg-standard my-3 mt-5"></div>
      {memberDetails && (
        <div className="teamtree-structure-detail-wrapper px-2 sm:px-[2rem] text-[var(--dark-color)] dark:text-white space-y-4">
          <p className="text-lg font-medium">{memberDetails.tid}</p>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Level :</p>
            <p>{memberDetails.level_relative_to_you}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Position :</p>
            <p>{memberDetails.position}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Deposit :</p>
            <p>$ {memberDetails.total_deposit}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Start Date :</p>
            <p>{memberDetails.start_date}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Rank:</p>
            <p>{memberDetails.rank}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Annual Sales:</p>
            <p>$ {formatToTwoDecimals(memberDetails.annual_sales)}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Country:</p>
            <p>{memberDetails.country?.name}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap ">
            <p className="text-gray-400">Down-line:</p>
            <p>{memberDetails.total_downline_count}</p>
          </div>
        </div>
      )}
    </div>
  );
}
