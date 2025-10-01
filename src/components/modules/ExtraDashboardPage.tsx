"use client"

import Image from "next/image";
import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { useRouter } from "next/navigation";

export default function ExtraDashboardPage() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
 const router = useRouter()
  return (
    <div className="space-y-4">
      <div className="border-[#383C47] border-[1px] p-6 bg-[#090D23] sm:bg-[linear-gradient(to_right,_#090D23,_#1651C6)] rounded-xl relative">
        <div className="text-white font-bold text-2xl">
          <p>Team Builders Tournament </p>
        </div>
        <div className="team-tournoment-description mt-2 w-[100%] sm:w-[80%]">
          <span className="text-white text-sm">
            A special challenge for those determined to build a powerful team or
            organization.As you progress through building your team and reach
            Bronze, Silver, and Gold ranks, you’ll earn increasing valuable
            rewards and receive support on your growth journey.Limited time
            offer. it’s time to get started!
          </span>
        </div>
        <div className="team-tournoment-btn mt-8 flex justify-center sm:justify-start">
          <button className="flex items-center justify-center gap-4 text-white px-6 py-2 rounded-2xl bg-[#004ADA] tournoment-btn transition-all duration-300  hover:drop-shadow-[0_0_px_#1A68FF4D] py-2">
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
          className="absolute blur-[.05px] top-1/2 right-[50%] translate-x-1/2 sm:translate-x-0 -translate-y-[50%]  sm:right-0 sm:top-0 sm:translate-y-0  z-[2] opacity-40 sm:opacity-100"
        />
      </div>

      <div className="border-[#383C47] border-[1px] p-6 bg-[#090D23] sm:bg-[linear-gradient(to_right,_#090D23,_#1651C6)] rounded-xl relative">
        <div className="text-white font-bold text-2xl">
          <p>Leader Builders Tournament</p>
        </div>
        <div className="team-tournoment-description mt-2 w-[80%]">
          <span className="text-white text-sm">
            Invite direct members and lead them to the SILVER rank.For each
            successful leader you build, $1000 will be rewarded directly to your
            T-Wallet.
          </span>
        </div>
        <div className="flex items-center flex-col sm:flex-row gap-4 relative z-[4] mt-4">
          <div className="border-[2px] rounded-xl border-[#383C47] w-[90%] sm:w-auto mx-auto sm:mx-0 bg-[#041125] p-2 px-4">
            <p className="text-white text-lg">6</p>
            <p className="text-[#92959C]">Direct Referrals</p>
          </div>
          <div className="border-[2px] rounded-xl border-[#383C47] w-[90%] sm:w-auto mx-auto sm:mx-0 bg-[#041125] p-2 px-4">
            <p className="text-white text-lg">61</p>
            <p className="text-[#92959C]">Reached Silver Rank</p>
          </div>
          <div className="border-[2px] rounded-xl border-[#383C47] w-[90%] sm:w-auto mx-auto sm:mx-0 bg-[#041125] p-2 px-4">
            <p className="text-white text-lg">6</p>
            <p className="text-[#92959C]">more to unlock bonus</p>
          </div>
          <div className="border-[2px] rounded-xl border-[#383C47] w-[90%] sm:w-auto mx-auto sm:mx-0 bg-[#041125] p-2 px-4">
            <p className="text-white text-lg">$21000</p>
            <p className="text-[#92959C]">Rewards Collected</p>
          </div>
        </div>
        <div className="team-tournoment-btn mt-8 flex justify-center sm:justify-start">
          <button className="flex items-center justify-center gap-4 text-white px-6 py-2 rounded-2xl bg-[#004ADA] tournoment-btn transition-all duration-300  hover:drop-shadow-[0_0_px_#1A68FF4D] py-2">
            <span>View Full Details</span>
          </button>
        </div>
        <Image
          src={"/a93f0dd72f8c0088035bbc191589db891b28f12a.png"}
          alt=""
          width={200}
          height={200}
          className="absolute blur-[.05px] top-1/2 right-[50%] translate-x-1/2 sm:translate-x-0 -translate-y-[50%]  sm:right-0 sm:top-0 sm:translate-y-0  z-[2] opacity-40 sm:opacity-100 "
        />
      </div>
      <div className="team-builders-tournoment">
        <div className="flex items-center justify-center">
          <div className="bg-[#eddd0030] rounded-full p-4 ">
            <Image
              src={"/cup.png"}
              alt=""
              width={2000}
              height={2000}
              className="w-auto h-16"
            />
          </div>
        </div>
        <div className="flex items-center justify-center text-center text-[#383C47] dark:text-white">
          <h2 className="font-bold">Team Builders Tournament</h2>
        </div>
        <div className="flex items-center justify-center text-center text-white w-[80%] sm:w-[95%] mx-auto">
          <span className="text-[#707070]">
            Join our exclusive challenge and compete for amazing rewards!
          </span>
        </div>
        <div className="border-[2px] border-[#555555] px-4 py-3 rounded-[.5rem] bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A68FF] flex items-center justify-center">
              <span className="text-[#383C47] dark:text-white">1</span>
            </div>
            <p className="text-white text-lg">One-Time Challenge</p>
          </div>
          <div className="description mt-1">
            <span className="text-[#707070]">
              Once activated, the challenge cannot be paused or reset. Make sure
              you&apos;re ready to commit!
            </span>
          </div>
        </div>
        <div className="border-[2px] border-[#555555] px-4 py-3 rounded-[.5rem] bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A68FF] flex items-center justify-center">
              <span className="text-[#383C47] dark:text-white">2</span>
            </div>
            <p className="text-white text-lg">Duration</p>
          </div>
          <div className="description mt-1">
            <span className="text-[#707070]">
              Challenge duration depends on your investment contract:
            </span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 my-4 flex-wrap">
            <button className="bg-white border-[2px] rounded-[.5rem] border-[#0052B4] text-[#0052B4] px-4 py-1">
              2-Year: 180 days
            </button>
            <button className="bg-white border-[2px] rounded-[.5rem] border-[#0052B4] text-[#0052B4] px-4 py-1">
              4-Year: 360 days
            </button>
          </div>
        </div>

        <div className="border-[2px] border-[#555555] px-4 py-3 rounded-[.5rem] bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A68FF] flex items-center justify-center">
              <span className="text-[#383C47] dark:text-white">2</span>
            </div>
            <p className="text-white text-lg">Rewards</p>
          </div>
          <div className="description mt-1">
            <span className="text-[#707070]">
              Earn rewards based on your performance and rank:
            </span>
          </div>
          <div className="flex items-center justify-center flex-wrap  gap-4 my-4">
            <div className="border-[2px] rounded-[3rem] border-[#713F00] flex items-center gap-8  text-white pr-4">
              <Image
                src={"/a58e966524ed48ef746f85c029dc8be4d803c91a.png"}
                alt=""
                width={1000}
                height={1000}
                className="w-20 h-20 scale-150"
              />
              <span>Bronze</span>
              <p className="font-bold text-xl">$ 1000</p>
            </div>
            <div className="border-[2px] rounded-[3rem] border-[#C5C5C5] flex items-center gap-8  text-white pr-4">
              <Image
                src={"/1565115e51f7c810be2fabd1198365392749a9ef.png"}
                alt=""
                width={1000}
                height={1000}
                className="w-20 h-20 scale-150"
              />
              <span>Bronze</span>
              <p className="font-bold text-xl">$ 1000</p>
            </div>
            <div className="border-[2px] rounded-[3rem] border-[#FFC857] flex items-center gap-8  text-white pr-4">
              <Image
                src={"/33f366cf531c7cf8b51564b0ccabb7c967988af1.png"}
                alt=""
                width={1000}
                height={1000}
                className="w-20 h-20 scale-150"
              />
              <span>Bronze</span>
              <p className="font-bold text-xl">$ 1000</p>
            </div>
          </div>
        </div>

        <div className="border-[2px] border-[#555555] px-4 py-3 rounded-[.5rem] bg-[#161E36] mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A68FF] flex items-center justify-center">
              <span className="text-[#383C47] dark:text-white">4</span>
            </div>
            <p className="text-white text-lg">Requirements</p>
          </div>
          <div className="description mt-1">
            <span className="text-[#707070]">
              Consistent effort and adherence to team-building principles are
              required to qualify for any reward.
            </span>
          </div>
        </div>
        <div className="border-[2px] rounded-[.5rem] border-[#FFB300] px-4 py-2 bg-[#352F42] my-4">
          <div className="flex items-center justify-center sm:justify-start text-[#FFFFFF]">
            <p className="font-bold text-2xl">⚠️ Important Notice</p>
          </div>
          <div className="flex items-center mt-2 justify-center text-[#FFFFFF] w-[80%] sm:w-full mx-auto">
            <span>
              You must activate this challenge within the first year of your
              contract, otherwise this opportunity will not be available in your
              second investment round.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#383C47] dark:text-white">
            <Checkbox
              {...label}
              defaultChecked
              sx={{
                color:"#004ada",
                "&.Mui-checked": {
                  color:"#004ada",
                },
                "& .MuiSvgIcon-root": {
                  fill: "white",
                },
              }}
            />
          </span>
          <span className="text-[#383C47] dark:text-white">
            I understand and agree to the tournament rules above
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-4 mt-8">
          <button className="start-tournoment px-6 py-2 flex items-center w-full sm:w-auto rounded-xl titan-confirm-btn justify-center text-center">
            <span className="text-[#383C47] dark:text-white" onClick={()=> router.push("extraDashboard/start-map")}>🚀 Start Tournament</span>
          </button>
          <button className="px-6 py-2 flex items-center w-full sm:w-auto rounded-xl bg-white text-[#090F29] justify-center text-center">
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
