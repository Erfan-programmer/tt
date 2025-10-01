"use client";
import { apiRequest } from "@/libs/api";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { loadUserData } from "../../EncryptData/SavedEncryptData";
import { IoMdClose } from "react-icons/io";
import TeamBuildersTournamentModal from "@/components/Ui/Modals/TeamBuildersTournamentModal";
import TitanNotification from "../../UserPanel/TitanNotification/TitanNotification";
import TimerTournoment from "../../p-admin/TimerTournoment";
import TournomentStepLevel from "../../p-admin/TournomentStepLevel";
import { AchievementType } from "@/types/Layout/FormLayout";

type TournamentStatus =
  | "can_start"
  | "not_started"
  | "active"
  | "completed"
  | "expired"
  | "not_eligible";

interface TournamentActiveDetails {
  starts_at: string;
  ends_at: string;
  current_sales_volume: number;
  progress_percentage: number;
  milestones: {
    name: string;
    icon_path: string;
    min_sales_volume: number;
    tournament_prize_amount: string;
  }[];
}

interface TournamentOtherDetails {
  duration_days: number;
  rewards: {
    name: string;
    icon_path: string;
    min_sales_volume: number;
    tournament_prize_amount: string;
  }[];
}

interface TournamentStatusResponse {
  status: number;
  data: {
    status: TournamentStatus;
    details?: TournamentActiveDetails | TournamentOtherDetails;
    badges?: AchievementType[];
  };
}
interface TeamBuilderTournomentsProps {
  setAchievements: React.Dispatch<
    React.SetStateAction<AchievementType[] | undefined>
  >;
}

export default function TeamBuilderTournoments({
  setAchievements,
}: TeamBuilderTournomentsProps) {
  const [status, setStatus] = useState<TournamentStatus | null>(null);
  const [tournamentDetails, setTournamentDetails] = useState<
    TournamentStatusResponse["data"]["details"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);


const fetchStatus = useCallback(async () => {
  const token = loadUserData()?.access_token;
  if (!token) {
    setLoading(false);
    return;
  }

  try {
    const res = await apiRequest<TournamentStatusResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/contracts/tournamentStatus`,
      "GET",
      undefined,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (res.status === 200 && res.data) {
      setStatus(res.data.data.status);

      if (res.data.data.status === "completed" && res.data.data.badges) {
        setAchievements(res.data.data.badges);
      }

      if (res.data.data.details) {
        setTournamentDetails(res.data.data.details);
      }
    }
  } catch (error) {
    console.error("Failed to fetch tournament status:", error);
  } finally {
    setLoading(false);
  }
}, [setAchievements, setTournamentDetails, setStatus, setLoading]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (loading || status === "not_eligible" || status === "completed") {
    return null;
  }

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleImportantNoticeClick = () => {
    setShowNotification(true);
  };

  const activeDetails =
    tournamentDetails && "starts_at" in tournamentDetails
      ? tournamentDetails
      : null;
  const generalDetails =
    tournamentDetails && "duration_days" in tournamentDetails
      ? tournamentDetails
      : null;

  return (
    <>
      {status === "active" && activeDetails && (
        <div className="titan-form-container my-6 px-6 py-2 rounded-lg bg-[#F4F7FD] dark:bg-[#090D23]">
          <TimerTournoment
            countdownTimestampMs={new Date(activeDetails.ends_at).getTime()}
          />
          <TournomentStepLevel
            startTime={new Date(activeDetails.starts_at)}
            milestones={activeDetails.milestones}
            currentSalesVolume={activeDetails.current_sales_volume}
            progress_percentage={activeDetails.progress_percentage}
          />
        </div>
      )}

      {status === "can_start" && (
        <>
          <div className="titan-form-container border border-[#383C47] dark:border-[#383C47] my-6 p-6 bg-white dark:bg-[#090D23] sm:bg-[linear-gradient(to_right,_#ffffff,_#cfe2ff)] dark:sm:bg-[linear-gradient(to_right,_#090D23,_#1651C6)] rounded-xl relative">
            <div className="font-bold text-xl lg:text-2xl text-gray-900 dark:text-white">
              <p>Team Builders Tournament</p>
            </div>
            <div className="team-tournoment-description mt-2 w-[100%] sm:w-[80%]">
              <span className="text-gray-700 dark:text-white text-sm">
                A special challenge for those determined to build a powerful
                team or organization. As you progress through building your team
                and reach Bronze, Silver, and Gold ranks, you’ll earn increasing
                valuable rewards and receive support on your growth journey.
                Limited time offer. It’s time to get started!
              </span>
            </div>
            <div className="team-tournoment-btn mt-8 flex justify-center sm:justify-start">
              <button
                onClick={handleButtonClick}
                className="flex items-center justify-center gap-4 text-white dark:text-white text-gray-900 px-6 py-2 rounded-2xl bg-blue-600 dark:bg-[#004ADA] tournoment-btn transition-all duration-300 hover:drop-shadow-[0_0_px_#1A68FF4D]"
              >
                <svg
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.10009 7.65958L4.59389 8.49037C4.39644 8.55583 4.29772 8.58855 4.20971 8.63924C4.13163 8.68421 4.05999 8.73952 3.99672 8.80368C3.92542 8.87599 3.86877 8.96322 3.75547 9.13768L1.06564 13.2797L7.14352 11.2649M13.8095 12.0167L14.0698 14.6441C14.0904 14.8511 14.1006 14.9546 14.0901 15.0556C14.0808 15.1453 14.0594 15.2332 14.0265 15.3171C13.9895 15.4117 13.9328 15.4989 13.8195 15.6733L11.1297 19.8153L10.4982 13.4434M10.4548 9.83813L6.6423 15.7088M9.82329 3.46622L16.5327 7.82334M15.9012 1.45143L10.6822 2.88569C10.4652 2.94532 10.3567 2.97514 10.2599 3.02627C10.1741 3.07162 10.0954 3.12922 10.0262 3.19726C9.94813 3.27397 9.88685 3.36834 9.76429 3.55707L7.64473 6.82091C6.88216 7.99515 6.50088 8.58228 6.43814 9.17919C6.38296 9.70424 6.49541 10.2333 6.75939 10.6905C7.05948 11.2103 7.64661 11.5916 8.82086 12.3541C9.99511 13.1167 10.5822 13.498 11.1791 13.5607C11.7042 13.6159 12.2332 13.5035 12.6905 13.2395C13.2102 12.9394 13.5915 12.3523 14.3541 11.178L16.4737 7.91418C16.5962 7.72545 16.6575 7.63109 16.6958 7.52859C16.7298 7.43769 16.7504 7.34232 16.757 7.24548C16.7643 7.1363 16.7474 7.02506 16.7137 6.80257L15.9012 1.45143Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Start Challenge</span>
              </button>
            </div>
            <Image
              src={"/07ed5e46ce10bc2169151051da85673f1e15c433 (1).png"}
              alt=""
              width={200}
              height={200}
              style={{ opacity: 0.3 }}
              className="absolute blur-[.08px] top-1/2 right-[50%] translate-x-1/2 sm:translate-x-0 -translate-y-[50%] sm:right-0 sm:top-0 sm:translate-y-0 -scale-x-[1] z-[2]"
            />
          </div>
          <TeamBuildersTournamentModal
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            status={status}
            refetch={fetchStatus}
            details={generalDetails}
            onImportantNoticeClick={handleImportantNoticeClick}
            onStartTournament={() => {}}
          />
          {showNotification && (
            <TitanNotification
              icon={
                <IoMdClose className="text-[var(--main-background)] text-2xl" />
              }
              className="border-failed"
              btn="Ok"
              btnStyle="bg-[var(--loss)]"
              onClose={() => setShowNotification(false)}
            >
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-2">
                  Team Builders Tournament
                </h2>
                <p className="text-sm text-center">
                  You must activate this challenge within the first year of your
                  contract. If not activated in time, you will permanently lose
                  access to this opportunity in your second investment round.
                </p>
              </div>
            </TitanNotification>
          )}
        </>
      )}
    </>
  );
}
