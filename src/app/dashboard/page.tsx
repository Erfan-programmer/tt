"use client";
import TeamBuilderTournoments from "@/components/modules/phase2/Tournoments/TeamBuilderTournoments";
import HealthCheck from "@/components/templates/user-panel/dashboard/HealthCheck";
import InvestmentPendingActivation from "@/components/templates/user-panel/dashboard/InvestmentPendingActivation";
import MessageNotification from "@/components/templates/user-panel/dashboard/MessageNotification";
import ProfitAndLoss from "@/components/templates/user-panel/dashboard/ProfitAndLoss";
import TournomentRewards from "@/components/templates/user-panel/dashboard/TournomentRewards";
import TradingProfitChart from "@/components/templates/user-panel/dashboard/TradingProfitChart";
import UserAccountCondition from "@/components/templates/user-panel/dashboard/UserAccountCondition";
import UserWalletSummary from "@/components/templates/user-panel/dashboard/UserWalletSummary";
import { AchievementType } from "@/types/Layout/FormLayout";
import React, { useState } from "react";



export default function Page() {
  const [achievements, setAchievements] = useState<AchievementType[] | undefined>();

  return (
    <div className="titan-content-container mt-[1rem]">
      {/* {permissionArray.includes("dashboard.infobox1") && ( */}
      <InvestmentPendingActivation />
      <UserAccountCondition />
      {/* // )} */}
      <UserWalletSummary
      // twallet_action={permissionArray.includes("dashboard.twallet_action")}
      // sponsor_plus={permissionArray.includes("dashboard.sponsor_plus")}
      />
      <TeamBuilderTournoments setAchievements={setAchievements}/>
      {/* {permissionArray.includes("dashboard.capital_health") &&  */}
      <HealthCheck />
      {/* // } */}

      {/* {permiss0ionArray.includes("dashboard.profit_loss") && */}
      <ProfitAndLoss />
      {/* //  } */}
      {/* {permissionArray.includes("dashboard.profit_network") && ( */}
      <TradingProfitChart />
      {/* )} */}
      {/* <TradeOverViewHistory /> */}
      {/* {permissionArray.includes("dashboard.messages") && ( */}
      <MessageNotification />

      <TournomentRewards achievements={achievements} />
      {/* )} */}
    </div>
  );
}
