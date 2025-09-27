"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa6";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "../../EncryptData/SavedEncryptData";
import Image from "next/image";
import ReferralTreeSkeleton from "@/skeletons/User-Panel/dashboard/ReferralTreeSkeleton";

export interface ReferralType {
  children?: ReferralType[];
  name: string;
  id: string;
  rank: string;
  rank_icon: string;
  status: "pending" | "closed" | "active";

  tid: string;
}

const ReferralNode: React.FC<{
  referral: ReferralType;
  isLast?: boolean;
  level?: number;
  selectedTID: string | null;
  onSelect: (referral: ReferralType) => void;
}> = ({ referral, level = 0, selectedTID, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = selectedTID === referral.tid;
  return (
    <div className="relative">
      <div className="flex items-center">
        {isExpanded && referral?.children && (
          <div
            className="absolute left-[14px] h-full w-[2px] border-l-[2px] border-dashed border-[var(--dark-color)] dark:border-white/30"
            style={{
              top: "42px",
              height: "calc(100% - 42px)",
            }}
          />
        )}

        {referral.children && referral?.children.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              absolute left-[2px] w-6 h-6 rounded-full 
              bg-[#275edf] dark:bg-white flex items-center justify-center 
              transition-transform duration-300 z-20
            `}
          >
            <span className="text-white dark:text-[#0f163a] text-lg font-bold leading-none ">
              {isExpanded ? "-" : <FaPlay className="text-[.9rem]" />}
            </span>
          </button>
        )}

        <div className="w-8 h-[2px] border-t-[2px] border-dashed border-[var(--dark-color)] dark:border-white/30 ml-3" />

        <div
          onClick={() => onSelect(referral)}
          className={`flex items-center gap-2 rounded-lg h-[42px] px-6 relative z-10 cursor-pointer transition-colors
    ${
      isSelected
        ? "bg-[#d9d9d9] dark:bg-[#192879]"
        : "bg-[#f9f9fe] dark:bg-[#0f163a]"
    }
    ${
      referral.status === "pending"
        ? "border border-[var(--normal)]"
        : referral.status === "closed"
        ? "border border-[var(--loss)]"
        : "border border-none"
    }
  `}
        >
          <div className="w-12 h-12 rounded-full overflow-auto">
            <Image
              width={300}
              height={300}
              src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${referral.rank_icon}`}
              alt={referral.tid}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/titan-logo.svg";
              }}
            />
          </div>
          <span className="text-[var(--dark-color)] dark:text-white text-sm font-medium min-w-[120px]">
            {referral.tid}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && referral?.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
            style={{ marginLeft: `${level === 0 ? "3rem" : "3rem"}` }}
          >
            {referral?.children?.map((subReferral, index) => (
              <div key={subReferral.tid} className="relative">
                <div
                  className="absolute left-[14px] w-[2px] border-l-[2px] border-dashed border-[var(--dark-color)] dark:border-white/30"
                  style={{
                    top: "-1rem",
                    height:
                      index ===
                      (referral?.children && referral?.children?.length - 1)
                        ? "2rem"
                        : "130%",
                  }}
                />
                <ReferralNode
                  referral={subReferral}
                  isLast={
                    index ===
                    (referral?.children && referral?.children?.length - 1)
                  }
                  level={level + 1}
                  selectedTID={selectedTID}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TeamTreeStructureContentProps {
  onReferralSelect: (referral: ReferralType) => void;
}

// Skeleton component for referral loading state
function ReferralSkeleton() {
  return (
    <div className="flex items-center w-[12rem] left-10 gap-2 rounded-lg h-[42px] px-6 relative z-10 bg-gray-200 dark:bg-gray-700 animate-pulse">
      <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
}

export default function TeamTreeStructureContent({
  onReferralSelect,
}: TeamTreeStructureContentProps) {
  const [selectedTID, setSelectedTID] = useState<string | null>(null);
  const [showScroll, setShowScroll] = useState(true);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = loadUserData()?.access_token;
      try {
        const res = await apiRequest<any>(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/downline/tree`,
          "GET",
          null,
          {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        );

        if (res.success) {
          setData(res?.data?.data);
        } else {
          setError(res.message || "Failed to fetch data");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScroll(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading)
    return (
      <>
        <ReferralTreeSkeleton />
      </>
    );
  if (error) return <div>Error fetching data</div>;
  if (!data) return <div>No data found</div>;

  // Ensure referrals is always an array
  const referrals: ReferralType[] = data?.children ?? [];

  return (
    <div className=" bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] min-h-screen w-[95%] sm:w-[75%] border-standard rounded-xl bg-shadow-custom overflow-x-auto">
      <div className="flex items-center justify-between px-2 sm:px-[2rem] mt-3">
        <div className="relative w-[300px] sm:block hidden">
          <input
            type="text"
            placeholder="Enter TID to view details"
            className="w-full bg-transparent border border-[#192879] rounded-full px-4 py-2 text-[var(--dark-color)] dark:text-white text-sm"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-[var(--dark-color)] dark:stroke-white"
            >
              <path
                d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-full h-[1px] bg-standard my-3"></div>

      <div
        className={`relative mt-8 mx-[1rem] overflow-x-auto transition-all duration-500 w-fit max-h-[86vh] overflow-y-auto ${
          showScroll
            ? ""
            : "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        }`}
      >
        {/* You node */}
        <div className="flex flex-col  mt-2 relative pl-[2rem]">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${data?.rank_icon}`}
            width={400}
            height={400}
            alt=""
            className="w-16 h-16 relative scale-[1.4] -translate-x-4"
          />

          <span className="text-[var(--dark-color)] dark:text-white text-sm">
            You
          </span>
          <div className="w-8 h-[2rem] border-l-[2px] border-dashed border-[var(--dark-color)] dark:border-white/30 ml-[.85rem]" />
        </div>

        <div className="absolute left-[12.8px] top-16 bottom-0 w-[2px] border-l-[2px] border-dashed border-[var(--dark-color)] dark:border-white/30 ml-[2rem]"></div>

        <div className="space-y-6 ml-[2rem]">
          {isLoading
            ? [...Array(3)].map((_, idx) => <ReferralSkeleton key={idx} />)
            : referrals.map((referral: ReferralType, index: number) => (
                <ReferralNode
                  key={referral.tid}
                  referral={referral}
                  isLast={index === referrals.length - 1}
                  level={0}
                  selectedTID={selectedTID}
                  onSelect={(referral) => {
                    if (selectedTID === referral.tid) {
                      setSelectedTID(null);
                      onReferralSelect(null as any);
                    } else {
                      setSelectedTID(referral.tid);
                      onReferralSelect(referral);
                    }
                  }}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
