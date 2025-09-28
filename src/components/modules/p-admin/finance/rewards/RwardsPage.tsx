"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import LineTitle from "../../LineTitle";
import PhysicalRewardTab from "./PhysicalRewardTab";
import CashRewardTab from "./CashRewardTab";
import AnimationTemplate from "@/components/Ui/Modals/p-admin/AnimationTemplate";
import AdminSearchBox from "../../AdminSearchBox/AdminSearchBox";

type ActiveTabType = "CASH" | "PHYSICAL" | "";

export default function RewardsPage() {
  const [showTitle, setShowTitle] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>(
    (process.env.NEXT_PUBLIC_CASH as ActiveTabType) || ""
  );

//   const handleSearch = (filter_by: string, filter_value: string) => {};
  const handleSearch = () => {};
  const handleClear = () => {};

  return (
    <>
      <LineTitle
        title="Rewards Management"
        onClick={() => {
          setShowTitle(!showTitle);
        }}
      />

      {showTitle && (
        <AnimationTemplate>
          <div className="flex items-center gap-1 text-white">
            {/* Cash Rewards */}
            <motion.button
              onClick={() => setActiveTab("CASH")}
              className="px-4 py-1 rounded-t-lg relative overflow-hidden"
              animate={{
                backgroundColor: activeTab === "CASH" ? "#2563eb" : "#374151",
                scale: activeTab === "CASH" ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span>Cash Rewards</span>
            </motion.button>

            {/* Physical Rewards */}
            <motion.button
              onClick={() => setActiveTab("PHYSICAL")}
              className="px-4 py-1 rounded-t-lg relative overflow-hidden"
              animate={{
                backgroundColor:
                  activeTab === "PHYSICAL" ? "#2563eb" : "#374151",
                scale: activeTab === "PHYSICAL" ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span>Physical Rewards</span>
            </motion.button>
          </div>
          <AdminSearchBox
            title="Search"
            filterOptions={[
              {
                label: "Full Name",
                value: "full_name",
                placeholder: "Enter Full Name...",
              },
              {
                label: "Transaction ID",
                value: "tid",
                placeholder: "Enter Transaction ID...",
              },
              { label: "Rank", value: "rank", placeholder: "Enter Rank..." },
              {
                label: "Account Type",
                value: "account_type",
                placeholder: "Enter Account Type...",
              },
              {
                label: "Income",
                value: "income",
                placeholder: "Enter Income...",
              },
            ]}
            onSearch={handleSearch}
            onClear={handleClear}
          />

        </AnimationTemplate>
      )}

      <>{activeTab === "CASH" ? <CashRewardTab /> : <PhysicalRewardTab />}</>
    </>
  );
}
