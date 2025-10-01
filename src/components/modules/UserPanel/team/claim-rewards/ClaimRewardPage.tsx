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
        description="Titan Investments recommends selecting the cash equivalent option for greater convenience and faster access to your rewards. After reviewing the process, the company will either transfer the amount to the referral section of your account or, alternatively, you may receive your reward directly by providing your wallet address."
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
