import React from "react";
import { FaPlus } from "react-icons/fa6";

interface ItemsOptionProfitsType {
  user_per: number;
  company_per: number;
  loss_cover: boolean;
  bonus_shield: boolean;
  referral: boolean;
  plan?: string;
  commission: boolean;
}

interface ProfitItemProps {
  index: number;
  isActive: boolean;
  label: string;
  value: string;
}

const ProfitItem = ({ index, isActive, label, value }: ProfitItemProps) => (
  <div className="flex items-center gap-4 text-gray-400">
    <span
      className={`rounded-md p-1 w-5 h-5 ${
        isActive ? "bg-[#00CB08]" : "bg-[#FF6060]"
      }`}
    >
      {isActive ? (
        <svg
          width="13"
          height="10"
          viewBox="0 0 13 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 5.44444L4.38462 9L12 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L12 12M12 1L1 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
    <span className="flex-1 flex text-[.9rem] sm:text-md">
      {index}.{" "}
      <p>
        {label}:{" "}
        <span className="text-[var(--sidebar-bg)] dark:text-white font-bold">
          {value}
        </span>
      </p>
    </span>
  </div>
);

export default function ItemsOptionProfits({
  user_per,
  company_per,
  loss_cover,
  bonus_shield,
  referral,
  commission,
  plan,
}: ItemsOptionProfitsType) {
  const items = [
    {
      active: !!(user_per && company_per),
      label: "Profit Split",
      value: `Investor ${user_per}% / Company ${company_per}%`,
    },
    {
      active: loss_cover,
      label: "Loss Protection (>5%/month)",
      value: loss_cover ? "Included" : "Not Included",
    },
    {
      active: bonus_shield,
      label: "Titan Bonus Shield",
      value: bonus_shield ? "Included" : "Not Included",
    },
    {
      active: referral && commission,
      label: "Referral & Commission Program",
      value: referral && commission ? "Active" : "Inactive",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <>
          <ProfitItem
            key={i}
            index={i + 1}
            isActive={item.active}
            label={item.label}
            value={item.value}
          />

          {i + 1 === items.length && plan === "Investor - 4 Year" && user_per === 85 && (
            <div className="flex items-center gap-4 text-gray-400">
              <span className={`rounded-md p-1 w-5 h-5 bg-[#00CB08] flex items-center justify-center`}>
                <FaPlus className="text-white" />
              </span>
              <span className="flex-1 flex text-[.9rem] sm:text-md">
                {items.length + 1}.{" "}
                <p>
                  <span className="text-[var(--sidebar-bg)] dark:text-white font-bold">
                    Enhanced Benefits for Long-Term Partners
                  </span>
                </p>
              </span>
            </div>
          )}
        </>
      ))}
    </div>
  );
}
