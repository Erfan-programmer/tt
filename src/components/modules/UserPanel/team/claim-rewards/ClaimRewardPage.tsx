"use client";

import { useState } from "react";
import TitanNotice from "../../TitanNotice/TitanNotice";
import TeamClaimRewardMethod from "./TeamClaimRewardMethod";
import TeamReceiveRewardPhysical from "./TeamReceiveRewardPhysical";
import TeamReceiveRewardCash from "./TeamReceiveRewardCash";

type RewardType = "claim_reward" | "cashReward" | "physical_reward";

export default function ClaimRewardPage() {
  const [rewardState, setRewardState] = useState<{
    type: RewardType | null;
    rewardId: number | null;
  }>({
    type: "claim_reward",
    rewardId: null,
  });

  return (
    <>
      <TitanNotice
        title="Notice"
        description="Note: Please be aware that if you choose the cash equivalent option, Titan Investments will credit your account with 20% more than the current value of the reward. This ensures that when the 20% company fee is deducted during withdrawal, you will receive the full amount."
      />

      {rewardState.type === "claim_reward" && (
        <TeamClaimRewardMethod
          setRewardType={(type) =>
            setRewardState((prev) => ({ ...prev, type }))
          }
          setRewardId={(id) =>
            setRewardState((prev) => ({ ...prev, rewardId: id }))
          }
        />
      )}

      {rewardState.type === "cashReward" && rewardState.rewardId && (
        <TeamReceiveRewardCash
          rewardId={rewardState.rewardId}
          goBack={() =>
            setRewardState({ type: "claim_reward", rewardId: null })
          }
        />
      )}

      {rewardState.type === "physical_reward" && rewardState.rewardId && (
        <TeamReceiveRewardPhysical
          rewardId={rewardState.rewardId}
          goBack={() =>
            setRewardState({ type: "claim_reward", rewardId: null })
          }
        />
      )}
    </>
  );
}
