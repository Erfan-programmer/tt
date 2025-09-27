"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Checkbox from "@mui/material/Checkbox";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import { MdOutlineErrorOutline } from "react-icons/md";

type TournamentStatus =
  | "can_start"
  | "not_started"
  | "active"
  | "completed"
  | "expired"
  | "not_eligible";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  status: TournamentStatus | null;
  // Corrected the type here to include 'undefined'
  details:
    | {
        duration_days: number;
        rewards: {
          name: string;
          icon_path: string;
          min_sales_volume: number;
          tournament_prize_amount: string;
        }[];
      }
    | null
    | undefined; // Added 'undefined' to the type
  onImportantNoticeClick: () => void;
  onStartTournament: () => void;
}

export default function TeamBuildersTournamentModal({
  isModalOpen,
  onClose,
  status,
  details,
  refetch,
  onImportantNoticeClick,
  onStartTournament,
}: Props) {
  const [isStarting, setIsStarting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleStartTournament = async () => {
    if (!agreed) {
      toast.error("You must agree to the tournament rules.");
      return;
    }

    setIsStarting(true);
    const token = loadUserData()?.access_token;

    try {
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/startTournament`,
        "POST",
        undefined,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (res.success) {
        toast.success(res.message || "Tournament started successfully!");
        onStartTournament();
        onClose();
        refetch()
      } else {
        toast.error(res.message || "Failed to start tournament.");
      }
    } catch (error) {
      console.error("Failed to start tournament:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(event.target.checked);
  };

  const renderContent = () => {
    const commonContent = (
      <>
        <div className="flex items-center justify-center text-center text-gray-700 dark:text-[#707070] w-[80%] sm:w-[95%] mx-auto">
          <span>
            {status === "can_start" || status === "not_started"
              ? "Join our exclusive challenge and compete for amazing rewards!"
              : "Here are the details and rewards for this tournament."}
          </span>
        </div>
        <div className="border-[2px] border-gray-300 dark:border-[#555555] px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-[#1A68FF] flex items-center justify-center">
              <span className="text-white dark:text-gray-900">1</span>
            </div>
            <p className="text-gray-900 dark:text-white text-lg">
              One-Time Challenge
            </p>
          </div>
          <div className="description mt-1">
            <span className="text-gray-600 dark:text-[#707070]">
              Once activated, the challenge cannot be paused or reset. Make sure
              you&apos;re ready to commit!
            </span>
          </div>
        </div>
        <div className="border-[2px] border-gray-300 dark:border-[#555555] px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-[#1A68FF] flex items-center justify-center">
              <span className="text-white dark:text-gray-900">2</span>
            </div>
            <p className="text-gray-900 dark:text-white text-lg">Duration</p>
          </div>
          <div className="description mt-1">
            <span className="text-gray-600 dark:text-[#707070]">
              Challenge duration is:
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 my-4 flex-wrap">
            <button className="bg-white border-[2px] rounded-lg border-blue-600 text-blue-600 px-4 py-1">
              {details?.duration_days ?? "N/A"} days
            </button>
          </div>
        </div>
        <div className="border-[2px] border-gray-300 dark:border-[#555555] px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-[#1A68FF] flex items-center justify-center">
              <span className="text-white dark:text-gray-900">3</span>
            </div>
            <p className="text-gray-900 dark:text-white text-lg">Rewards</p>
          </div>
          <div className="description mt-1">
            <span className="text-gray-600 dark:text-[#707070]">
              Earn rewards based on your performance and rank:
            </span>
          </div>
          <div className="flex items-center justify-center flex-wrap gap-4 my-4">
            {details?.rewards.map((reward, index) => (
              <div
                key={index}
                className="border-[2px] rounded-[3rem] w-[95%] border-orange-700 dark:border-[#713F00] flex items-center gap-8 text-gray-900 dark:text-white pr-4"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${reward.icon_path}`}
                  alt={`${reward.name} medal`}
                  width={1000}
                  height={1000}
                  className="w-20 h-20 scale-150"
                />
                <span>{reward.name}</span>
                <p className="font-bold text-xl">
                  {reward.tournament_prize_amount}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[2px] border-gray-300 dark:border-[#555555] px-4 py-3 rounded-lg bg-gray-100 dark:bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-[#1A68FF] flex items-center justify-center">
              <span className="text-white dark:text-gray-900">4</span>
            </div>
            <p className="text-gray-900 dark:text-white text-lg">
              Requirements
            </p>
          </div>
          <div className="description mt-1">
            <span className="text-gray-600 dark:text-[#707070]">
              Consistent effort and adherence to team-building principles are
              required to qualify for any reward.
            </span>
          </div>
        </div>
        {(status === "can_start" || status === "not_started") && (
          <>
            <div
              className="border-[2px] rounded-lg border-yellow-500 dark:border-[#FFB300] px-4 py-2 bg-yellow-100 dark:bg-[#352F42] my-4 cursor-pointer"
              onClick={onImportantNoticeClick}
            >
              <div className="flex items-center justify-center sm:justify-start text-yellow-800 dark:text-white">
                <p className="font-bold text-2xl flex items-center gap-2">
                  <MdOutlineErrorOutline /> Important Notice
                </p>
              </div>
              <div className="flex items-center mt-2 justify-center text-yellow-800 dark:text-white w-[80%] sm:w-full mx-auto">
                <span>
                  You must activate this challenge within the first year of your
                  contract...
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-900 dark:text-white">
                <Checkbox
                  checked={agreed}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: "#004ada",
                    "&.Mui-checked": {
                      color: "#004ada",
                    },
                    "& .MuiSvgIcon-root": {
                      fill: "#004ada",
                    },
                  }}
                />
              </span>
              <span className="text-gray-900 dark:text-white">
                I understand and agree to the tournament rules above
              </span>
            </div>
            <div className="flex items-center flex-wrap gap-4 mt-8">
              <button
                className="start-tournoment px-6 py-2 flex items-center w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white justify-center text-center disabled:opacity-50"
                onClick={handleStartTournament}
                disabled={isStarting || !agreed}
              >
                <span>
                  {isStarting ? "Starting..." : "🚀 Start Tournament"}
                </span>
              </button>
              <button
                className="px-6 py-2 flex items-center w-full sm:w-auto rounded-xl bg-gray-300 dark:bg-white text-gray-900 dark:text-black justify-center text-center"
                onClick={onClose}
              >
                <span>Cancel</span>
              </button>
            </div>
          </>
        )}
        {(status === "active" ||
          status === "completed" ||
          status === "expired") && (
          <button
            onClick={onClose}
            className="px-6 py-2 mt-6 rounded-xl bg-blue-600 text-white"
          >
            Close
          </button>
        )}
      </>
    );

    switch (status) {
      case "active":
        return (
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-xl mb-4">Tournament is Active</h2>
            <Image
              src="/running-cup.png"
              alt="Active Tournament"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="text-gray-700 dark:text-[#707070]">
              You have already started this challenge. Keep up the good work!
            </p>
            {commonContent}
          </div>
        );
      case "completed":
        return (
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-xl mb-4">Tournament Completed</h2>
            <Image
              src="/completed-cup.png"
              alt="Completed Tournament"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="text-gray-700 dark:text-[#707070]">
              Congratulations! You have successfully completed the tournament.
            </p>
            {commonContent}
          </div>
        );
      case "expired":
        return (
          <div className="flex flex-col items-center text-center">
            <h2 className="font-bold text-xl mb-4">Tournament Expired</h2>
            <Image
              src="/expired-cup.png"
              alt="Expired Tournament"
              width={100}
              height={100}
              className="mb-4"
            />
            <p className="text-gray-700 dark:text-[#707070]">
              This tournament has expired. You can no longer participate.
            </p>
            {commonContent}
          </div>
        );
      default:
        return (
          <div className="team-builders-tournoment">
            <div className="flex items-center justify-center">
              <div className="bg-yellow-100 dark:bg-[#eddd0030] rounded-full p-4">
                <Image
                  src={"/cup.png"}
                  alt="Cup icon"
                  width={2000}
                  height={2000}
                  className="w-auto h-16"
                />
              </div>
            </div>
            <div className="flex items-center justify-center text-center text-gray-900 dark:text-white">
              <h2 className="font-bold">Team Builders Tournament</h2>
            </div>
            {commonContent}
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#111827] text-gray-900 dark:text-white p-8 rounded-2xl w-[90%] sm:w-[500px] max-h-[90vh] overflow-y-auto flex flex-col gap-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-900 dark:text-white text-lg font-bold"
              onClick={onClose}
            >
              ✕
            </button>
            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
