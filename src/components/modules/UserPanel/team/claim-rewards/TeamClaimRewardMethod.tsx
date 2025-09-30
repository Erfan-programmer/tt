"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";
import { Puff } from "react-loader-spinner";

interface RankReward {
  type: "cash" | "physical" | "claim_reward";
  description: string;
  cash_value: number;
  amount: number;
}

interface Rank {
  id: number;
  name: string;
  rewards: RankReward[];
  description: string | null;
}

interface RewardItem {
  id: number;
  client_id: number;
  rank_id: number;
  prize_description: string | null;
  cash_value: string;
  status: string;
  created_at: string;
  updated_at: string;
  rank: Rank;
}

interface TeamClaimRewardMethodProps {
  setRewardType: (
    type: "claim_reward" | "cashReward" | "physical_reward"
  ) => void;
  setRewardId: (id: number) => void;
}

export default function TeamClaimRewardMethod({
  setRewardType,
  setRewardId,
}: TeamClaimRewardMethodProps) {
  const [selectedOptions, setSelectedOptions] = useState<{
    [id: number]: string;
  }>({});
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest<{ data: RewardItem[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/prizes/unclaimed`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        setRewards(res.data?.data);
      } else {
        setError(res.message || "Failed to fetch rewards");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const handleSelect = (rewardId: number, type: string) => {
    setSelectedOptions((prev) => ({ ...prev, [rewardId]: type }));
  };

  const handleClaimReward = async (reward: RewardItem) => {
    const selectedMethod = selectedOptions[reward.id];

    if (reward.status === "pending_choice" && !selectedMethod) {
      toast.error("Please select a reward method first.");
      return;
    }

    if (reward.status === "pending_choice") {
      try {
        const token = loadUserData()?.access_token;
        const res = await apiRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/client/prizes/unclaimed/${reward.id}/claim`,
          "POST",
          { prize_method: selectedMethod },
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) {
          toast.success("Reward claimed successfully!");
          setRewardId(reward.id);
          if (selectedMethod === "cash") setRewardType("cashReward");
          if (selectedMethod === "physical") setRewardType("physical_reward");
          if (selectedMethod === "claim_reward") setRewardType("claim_reward");
          fetchRewards();
        } else {
          toast.error(res.message || "Failed to claim reward");
        }
      } catch (err: any) {
        toast.error(err.message || "Error claiming reward");
      }
    }

    if (reward.status === "pending_shipping_details") {
      setRewardId(reward.id);
      setRewardType("physical_reward");
    }
    if (reward.status === "pending_wallet_details") {
      setRewardId(reward.id);
      setRewardType("cashReward");
    }
  };

  const handleClaimToRef = async (reward: RewardItem) => {
    try {
      const token = loadUserData()?.access_token;
      const res = await apiRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/client/prizes/unclaimed/${reward.id}/claimToRef`,
        "POST",
        {},
        { Authorization: `Bearer ${token}` }
      );

      if (res.success) {
        toast.success("Reward claimed to referral successfully!");
        fetchRewards();
      } else {
        toast.error(res.message || "Failed to claim reward to referral");
      }
    } catch (err: any) {
      toast.error(err.message || "Error claiming reward to referral");
    }
  };

  if (isLoading) return <div className="p-8">Loading rewards...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!rewards || rewards.length === 0)
    return <div className="p-8 text-center">No rewards found</div>;

  return (
    <>
      {rewards.map((reward) => {
        const isPendingConfirmed = reward.status === "pending_to_confirmed";
        const selectedMethod = selectedOptions[reward.id];

        return (
          <div
            key={reward.id}
            className={`team-account-content px-4 sm:px-[2rem] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)] bg-shadow-custom border-standard rounded-xl py-4 mt-5 pb-[2rem] relative ${
              isPendingConfirmed ? "blur-sm pointer-events-none" : ""
            }`}
          >
            {isPendingConfirmed && (
              <div className="absolute inset-0 flex justify-center items-center">
                <Puff
                  visible={true}
                  height="80"
                  width="80"
                  color="#d7fe63"
                  ariaLabel="puff-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}

            <div className="team-claim-reward px-4 sm:px-[2rem] flex flex-col sm:flex-row gap-4 sm:gap-2 justify-between items-center flex-wrap">
              <p className="text-[var(--main-background)] dark:text-white">
                Congratulations! You got {reward.rank.name} Rank Reward
              </p>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[.8rem] font-bold
                    ${
                      reward.status === "done"
                        ? "bg-green-100 text-green-700"
                        : ""
                    }
                    ${
                      reward.status === "pending_choice"
                        ? "bg-blue-100 text-blue-700"
                        : ""
                    }
                    ${
                      reward.status === "pending_shipping_details"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }
                  `}
                >
                  {reward.status === "done" && "Paid"}
                  {reward.status === "pending_choice" && "Ready to claim"}
                  {reward.status === "pending_shipping_details" &&
                    "Waiting for shipping details"}
                  {reward.status === "pending_to_confirmed" && "Confirming..."}
                </span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-standard my-3"></div>

            <div className="team-account-content-wrapper px-2 sm:px-[2rem]">
              <p className="text-[var(--main-background)] dark:text-white">
                {reward.prize_description ||
                  reward.rank.description ||
                  "Select your preferred method of reward."}
              </p>
            </div>

            {(reward.status === "pending_choice" ||
              reward.status === "pending_shipping_details" ||
              reward.status === "pending_wallet_details") &&
              !isPendingConfirmed && (
                <div className="mt-[3rem] flex flex-col sm:flex-row gap-4 justify-between sm:items-center mt-8 sm:mt-[2rem]">
                  {reward.rank.rewards
                    ?.filter(
                      (r) =>
                        reward.status === "pending_choice" ||
                        r.type === "physical" ||
                        r.type === "claim_reward"
                    )
                    .map((r) => (
                      <motion.div
                        key={r.type}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`register-inputs-reward ${
                          selectedMethod === r.type
                            ? "selected"
                            : "unselected"
                        } flex justify-between rounded-[2rem] py-3 border-standard p-2 items-center gap-3 md:ml-[2rem] sm:w-[40%] cursor-pointer`}
                        onClick={() => handleSelect(reward.id, r.type)}
                      >
                        <span className="text-[var(--main-background)] dark:text-white">
                          {r.type === "cash"
                            ? `Cash: ${r.amount.toLocaleString()}`
                            : r.type === "physical"
                            ? `Physical: ${r.description}`
                            : `Claim Reward`}
                        </span>
                      </motion.div>
                    ))}

                  <div className="flex gap-2 sm:flex-row flex-wrap sm:items-center flex-col">
                    <button
                      onClick={() => handleClaimReward(reward)}
                      className={`titan-btn  text-center md:mx-0 ${
                        reward.status === "pending_choice" &&
                        !selectedMethod
                          ? "!bg-gray-400 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={reward.status === "pending_choice" && !selectedMethod}
                    >
                      Claim
                    </button>

                    {reward.status === "pending_choice" && (
                      <button
                        onClick={() => handleClaimToRef(reward)}
                        className="titan-btn w-fit text-center md:mx-0 bg-purple-500 hover:bg-purple-600"
                      >
                        Claim to Referral
                      </button>
                    )}
                  </div>
                </div>
              )}
          </div>
        );
      })}
    </>
  );
}
