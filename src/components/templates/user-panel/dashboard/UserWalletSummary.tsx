"use client"
import { useHeader } from "@/contextApi/HeaderContext";
import UserWalletSummarySkeleton from "@/skeletons/User-Panel/dashboard/UserWalletSummarySkeleton";
import Link from "next/link";

interface UserWalletPropTyp {
  id: number;
  title: string;
  subTitle: string;
  btn: string;
  icon: JSX.Element;
}

export default function UserWalletSummary() {
  const { headerData, isLoading } = useHeader();

  if (isLoading) {
    return <UserWalletSummarySkeleton />;
  }

  const userWalletSummary: UserWalletPropTyp[] = [
    {
      id: 1,
      icon: (
        <svg
          width="46"
          height="44"
          viewBox="0 0 46 44"
          fill="none"
          className="text-[1rem] sm:text-[2rem]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M37.6667 11.5V9.4C37.6667 6.45972 37.6667 4.98959 37.1338 3.86655C36.6651 2.8787 35.9172 2.07555 34.9973 1.57222C33.9515 1 32.5825 1 29.8444 1H8.82222C6.08419 1 4.71517 1 3.66938 1.57222C2.74948 2.07555 2.00157 2.8787 1.53286 3.86655C1 4.98959 1 6.45972 1 9.4V11.5M45 22H40.1111C37.4111 22 35.2222 24.3505 35.2222 27.25C35.2222 30.1495 37.4111 32.5 40.1111 32.5H45M1 11.5V34.6C1 37.5403 1 39.0104 1.53286 40.1334C2.00157 41.1213 2.74948 41.9244 3.66938 42.4278C4.71517 43 6.08419 43 8.82222 43H37.1778C39.9158 43 41.2848 43 42.3306 42.4278C43.2505 41.9244 43.9984 41.1213 44.4671 40.1334C45 39.0104 45 37.5403 45 34.6V19.9C45 16.9597 45 15.4896 44.4671 14.3666C43.9984 13.3787 43.2505 12.5756 42.3306 12.0722C41.2848 11.5 39.9158 11.5 37.1778 11.5H1Z"
            className="stroke-[var(--main-background)] dark:stroke-white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "$ 2000",
      subTitle: "T-wallet Balance",
      btn: "T-Wallet Action",
    },
    {
      id: 2,
      icon: (
        <svg
          width="45"
          height="50"
          viewBox="0 0 45 50"
          className="text-[var(--main-background)] dark:text-[var(--main-background)] dark:text-white text-[1rem] sm:text-[2rem]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M44 41L27.875 41M35.9375 33V49M1 49C1 38.6907 9.42264 30.3333 19.8125 30.3333C21.6802 30.3333 23.4844 30.6034 25.1875 31.1063M30.5625 11.6667C30.5625 17.5577 25.7496 22.3333 19.8125 22.3333C13.8754 22.3333 9.0625 17.5577 9.0625 11.6667C9.0625 5.77563 13.8754 1 19.8125 1C25.7496 1 30.5625 5.77563 30.5625 11.6667Z"
            className="stroke-[var(--main-background)] dark:stroke-white"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "",
      subTitle: "TID",
      btn: "Sponsor Plus",
    },
  ];

  const getWalletValue = (walletInfo: UserWalletPropTyp) => {
    if (walletInfo.subTitle.includes("TID")) {
      return headerData?.t_id || "---";
    }
    return `$${headerData?.t_wallet || 0}`;
  };

  const getSubTitle = (walletInfo: UserWalletPropTyp) => {
    if (walletInfo.subTitle.includes("TID")) {
      return "TID";
    }
    return walletInfo.subTitle;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 sm:justify-between items-center gap-5 mt-[1rem]">
      {userWalletSummary.map((walletInfo) => {
        // if (walletInfo.id === 1 && !twallet_action) return null;
        // if (walletInfo.id === 2 && !sponsor_plus) return null;

        return (
          <div
            key={walletInfo.id}
            className="t-wallet-container border-standard rounded-xl px-3 py-2 pb-4 w-[100%] sm:h-[17vh] bg-[#f4f7fd] dark:bg-[var(--sidebar-bg)]"
          >
            <h6 className="text-[var(--main-background)] dark:text-white text-[1.3rem] sm:text-[1rem] h-[5vh] flex gap-4 items-center mb-4 sm:mb-0">
              <span className="block sm:hidden">{walletInfo.icon}</span>
              {walletInfo.title === "$ 2000" ? "TITAN T-Wallet" : walletInfo.title}
            </h6>
            <div className="flex justify-between flex-wrap gap-4 sm:mt-0">
              <div className="flex justify-center gap-5">
                <span className="hidden sm:block">{walletInfo.icon}</span>
                <div className="flex flex-col justify-center">
                  <div className="flex justify-start gap-3 items-center text-[var(--main-background)] dark:text-white">
                    {getWalletValue(walletInfo)}
                  </div>
                  <span className="text-[var(--box-background)] dark:text-white">{getSubTitle(walletInfo)}</span>
                </div>
              </div>
              <Link
                href={walletInfo.btn === "T-Wallet Action" ? "/dashboard/t-wallet/action" : "/dashboard/financial/sponsor-plus"}
                className="titan-btn"
              >
                {walletInfo.btn}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
