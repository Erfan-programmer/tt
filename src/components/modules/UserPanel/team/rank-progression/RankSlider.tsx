import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaAngleRight, FaCheck } from "react-icons/fa";

function StatusBadge({ status }: { status: string }) {
  if (status === "achieved") {
    return (
      <div className="flex text-black justify-center items-center gap-2 bg-gradient-to-r from-[#00FF1E] to-[#CCFFC2] py-1 px-3 rounded-lg sm:rounded-l-lg">
        <span className="text-sm sm:text-base">Rank Achieved</span>
        <FaCheck />
      </div>
    );
  }

  if (status === "current") {
    return (
      <Link
        href="/dashboard/team/claim-rewards"
        className="text-black bg-[#FCE803] px-4 py-2 rounded-full text-[.8rem] font-semibold flex items-center space-x-1"
      >
        <span>Claim Reward 🎉</span>
      </Link>
    );
  }

  return null;
}

export default function RankSlider({ ranks = [] }: { ranks?: any[] }) {
  const [openDescriptionLevel, setOpenDescriptionLevel] = useState<
    number | null
  >(null);

  const ranksData = ranks.length
    ? ranks
    : [
        {
          level: 1,
          title: "Bronze",
          image: "/bronze-medal-placeholder.png",
          description:
            "Reach $25,000 in total team investments (up to level 10) to achieve Bronze. While it carries no fixed reward, Bronze leaders can earn exclusive prizes during Titan tournaments and challenges.",
          rank: 2,
          award: "-",
          teamInvestment: 25000,
          status: "upcoming",
        },
      ];

  const toggleDescription = (level: number) => {
    setOpenDescriptionLevel(openDescriptionLevel === level ? null : level);
  };

  return (
    <div className="flex flex-col gap-8">
      {ranksData.map((rank, index) => (
        <div key={rank.level || index} className="w-full relative z-10">
          <div
            className={`${
              rank.status === "upcoming"
                ? "bg-gray-200 dark:bg-gray-700"
                : "bg-white dark:bg-[#090D23]"
            } overflow-hidden w-full text-white p-4 rounded-xl z-[100] shadow-xl border border-gray-700 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 relative`}
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full">
              <div className="flex-shrink-0 flex flex-col items-center sm:mr-6 sm:border-r sm:pr-2 sm:border-gray-700">
                <div className="w-32 h-32 md:w-40 md:h-40 relative">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${rank.icon}`}
                    alt={rank.title}
                    className="scale-[1.2]"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <p
                  className={`mt-2 text-center text-sm font-semibold ${
                    rank.status === "upcoming"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-[#92959C] dark:text-gray-300"
                  }`}
                >
                  {rank?.name?.toUpperCase()}
                </p>
              </div>

              <div className="flex flex-row justify-center sm:justify-start sm:flex-col sm:border-r sm:pr-2 sm:border-gray-700">
                <div className="grid grid-cols-1 gap-4 text-center sm:text-left">
                  <div className="p-2">
                    <p className="text-xl font-bold text-black dark:text-white">
                      {rank.level}
                    </p>
                    <p className="text-[#92959C] dark:text-gray-400 text-sm">
                      Rank
                    </p>
                  </div>
                  <div className="p-2 hidden sm:block">
                    <p className="text-xl font-bold text-black dark:text-white">
                      ${rank.required_sales_volume?.toLocaleString()}
                    </p>
                    <p className="text-[#92959C] dark:text-gray-400 text-sm">
                      Team Investment
                    </p>
                  </div>
                  <div className="p-2">
                    <p className="text-xl font-bold text-black dark:text-white">
                      {rank.award_name || "-"}
                    </p>
                    <p className="text-[#92959C] dark:text-gray-400 text-sm">
                      Award
                    </p>
                  </div>
                </div>
              </div>

              <div className="right-section-container w-auto hidden sm:block">
                <p
                  className={`text-sm leading-relaxed ${
                    rank.status === "upcoming"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {rank.description}
                </p>
                {rank.status !== "upcoming" && (
                  <div className="justify-end flex absolute bottom-4 right-4">
                    <StatusBadge status={rank.status} />
                  </div>
                )}
              </div>
            </div>

            <div className="right-section-container w-80 flex justify-center sm:justify-between items-center sm:hidden">
              <div className="p-2 block sm:hidden">
                <p className="text-sm font-bold text-black dark:text-white">
                  ${rank.required_sales_volume?.toLocaleString()}
                </p>
                <p className="text-[#92959C] dark:text-gray-400 text-sm">
                  Team Investment
                </p>
              </div>
              {rank.status !== "upcoming" && (
                <div className="flex justify-end mt-2">
                  <StatusBadge status={rank.status} />
                </div>
              )}
            </div>

            <div
              className="flex items-center w-full sm:hidden cursor-pointer mt-2"
              onClick={() => toggleDescription(rank.level)}
            >
              <FaAngleRight
                className={`text-gray-700 dark:text-gray-300 transition-transform ${
                  openDescriptionLevel === rank.level ? "rotate-90" : "rotate-0"
                }`}
              />
              <div className="w-full h-[2px] bg-gray-700 dark:bg-gray-400 ml-2" />
            </div>

            {openDescriptionLevel === rank.level && (
              <div className="flex sm:hidden items-center justify-center mt-2">
                <p
                  className={`text-sm ${
                    rank.status === "upcoming"
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-[#92959C] dark:text-gray-300"
                  }`}
                >
                  {rank.description}
                </p>
              </div>
            )}
          </div>

          {index !== ranksData.length - 1 && (
            <div className="w-20 h-2 bg-[#1A68FF] mx-auto rotate-90 relative z-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}
