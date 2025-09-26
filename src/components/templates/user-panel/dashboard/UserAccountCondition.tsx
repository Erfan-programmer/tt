"use client";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/libs/api";
import { useAuth } from "@/contextApi/AuthContext";
import "./UserAccountCondition.css";
import Stars from "../Stars/Stars";
import BackgroundPattern from "@/components/modules/UserPanel/dashboard/BackgroundPattern";
import { LuBadge, LuBadgeCheck } from "react-icons/lu";
import AcountDetails from "./AcountDetails";
import Link from "next/link";
import { FaFileContract } from "react-icons/fa";
import {
  FaArrowsLeftRight,
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaCableCar,
} from "react-icons/fa6";
import { IoTrendingUpOutline } from "react-icons/io5";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useHeader } from "@/contextApi/HeaderContext";

interface DashboardInfoType {
  success: boolean;
  message: string;
  data: {
    t_id: number;
    total_income_percentage_change: number;
    rank: string;
    position: string;
    start_date: string;
    total_deposit: number;
    total_referral: number;
    total_roi: number;
    total_commission: number;
    total_annual_sales: number;
    next_rank_needed: number;
    next_rank_name: string;
    turnover_reset_date: string;
    total_organization_size: number;
    total_income: number;
    t_wallet_balance: number;
    start_of_investment: string;
  };
}

interface IncomeTrendProps {
  change: number;
  variant?: "desktop" | "mobile";
}

function IncomeTrend({ change, variant = "desktop" }: IncomeTrendProps) {
  if (change === 0) {
    return (
      <div
        className={`flex items-center gap-2 ${
          variant === "desktop" ? "text-[var(--gold)]" : "text-[var(--gold)]"
        }`}
      >
        <FaArrowsLeftRight className="mx-1" />
        <span>{change}%</span>
      </div>
    );
  }

  if (change > 0) {
    return (
      <div
        className={`flex items-center gap-2 ${
          variant === "desktop"
            ? "text-[#00CB08] dark:text-[#06FF93]"
            : "text-[#00CB08] dark:text-[#06FF93]"
        }`}
      >
        <FaArrowTrendUp />
        <span>+</span>
        <span>{change}%</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 ${
        variant === "desktop" ? "text-[#FF6060]" : "text-[#FF6060]"
      }`}
    >
      <FaArrowTrendDown />
      <span>-</span>
      <span>{change}%</span>
    </div>
  );
}

export default function UserAccountCondition() {
  const { user } = useAuth();
  const { headerData } = useHeader();
  const token = loadUserData()?.access_token;

  const fetchDashboardInfo = async (): Promise<DashboardInfoType["data"]> => {
    const res = await apiRequest<DashboardInfoType>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/dashboard`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );

    if (!res.success) {
      throw new Error(res.message || "Failed to fetch dashboard info");
    }

    return res.data.data;
  };

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery<DashboardInfoType["data"]>({
    queryKey: ["dashboardInfo"],
    queryFn: fetchDashboardInfo,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center">
        Error loading dashboard info
      </div>
    );

  const userPosition =
    dashboardData?.position?.toLowerCase() ||
    user?.type?.toLowerCase() ||
    "investor";

  const getVisibleItems = () => {
    switch (userPosition) {
      case "investor":
        return [
          {
            id: 1,
            title: `$ ${dashboardData?.start_of_investment}`,
            subTitle: "Start Of Investment",
          },
          {
            id: 2,
            title: `$ ${dashboardData?.total_annual_sales}`,
            subTitle: "Total Annual Sales",
          },
          {
            id: 3,
            title: `$ ${dashboardData?.next_rank_needed}`,
            subTitle: "To Rank Up",
          },
          { id: 4, title: `$ ${dashboardData?.total_roi}`, subTitle: "ROI" },
          {
            id: 5,
            title: `$ ${dashboardData?.total_commission}`,
            subTitle: "Commission",
          },
          {
            id: 6,
            title: `$ ${dashboardData?.total_referral}`,
            subTitle: "Referral",
          },
        ];
      case "marketer":
        return [
          {
            id: 1,
            title: `$ ${dashboardData?.start_of_investment}`,
            subTitle: "Start Of Investment",
          },
          {
            id: 2,
            title: `$ ${dashboardData?.total_annual_sales}`,
            subTitle: "Total Annual Sales",
          },
          {
            id: 3,
            title: `$ ${dashboardData?.next_rank_needed}`,
            subTitle: "To Rank Up",
          },
          {
            id: 4,
            title: `$ ${dashboardData?.total_referral}`,
            subTitle: "Referral",
          },
          {
            id: 5,
            title: `$ ${dashboardData?.total_commission}`,
            subTitle: "Commission",
          },
        ];
      case "contract":
        return [
          {
            id: 1,
            title: `$ ${dashboardData?.start_of_investment}`,
            subTitle: "Start Of Investment",
          },
          { id: 2, title: `$ ${dashboardData?.total_roi}`, subTitle: "ROI" },
        ];
      default:
        return [
          {
            id: 1,
            title: `$ ${dashboardData?.start_of_investment}`,
            subTitle: "Start Of Investment",
          },
          {
            id: 2,
            title: `$ ${dashboardData?.total_annual_sales}`,
            subTitle: "Total Annual Sales",
          },
          {
            id: 3,
            title: `$ ${dashboardData?.next_rank_needed}`,
            subTitle: "To Rank Up",
          },
          { id: 4, title: `$ ${dashboardData?.total_roi}`, subTitle: "ROI" },
          {
            id: 5,
            title: `$ ${dashboardData?.total_commission}`,
            subTitle: "Commission",
          },
          {
            id: 6,
            title: `$ ${dashboardData?.total_referral}`,
            subTitle: "Referral",
          },
        ];
    }
  };

  const visibleItems = getVisibleItems();

  return (
    <>
      <div className="user-account-condition-wrapper bg-gradient-to-b from-[#ECECED] to-[#fff]  dark:from-[#233389CC] dark:to-[#090D23] sm:from-[#ECECED] sm:to-[#ECECED] sm:bg-[#ECECED] sm:dark:from-[#0d092b] sm:dark:to-[#0d092b] shadow-[0_0_50px_rgba(0,74,218,0.3)_inset_0_0_30px_rgba(0,74,218,0.4)] overflow-hidden px-4 py-3  border-l-2 border-l-white sm:border-2 sm:border-[#585966] sm:border-l-none sm:min-h-[30vh] rounded-xl relative ">
        <div className="hidden sm:block">
          <Stars />
        </div>
        <BackgroundPattern />

        <div className="user-account-condition-wrapper-box shadow-[0_19px_30px_#FEFCDA,_0_46px_60px_#FEFCDA,_0_73px_90px_#FEFCDA] dark:shadow-[0_19px_30px_#004ada,_0_46px_60px_#004ada,_0_73px_90px_#004ada]"></div>

        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-start w-full">
          <div className="user-account-condition-price w-[30%] lg:border-r-2 border-[var(--main-background)] dark:lg:border-white ">
            <div className="price-title flex gap-4 items-center text-[var(--main-background)] dark:text-white">
              <span>$ {Number(dashboardData?.total_income)?.toFixed()}</span>
            </div>
            <div className="user-account-condition-income flex justify-start gap-2 items-center">
              <span className="text-[#585966]">Total Income </span>
              <IncomeTrend
                change={dashboardData?.total_income_percentage_change ?? 0}
                variant="desktop"
              />
            </div>
            <div className="user-role relative left-0 flex justify-start gap-2 mt-[1rem] items-center text-[var(--main-background)] dark:text-white">
              <span className="w-9 h-5 bg-[var(--sidebar-bg)] dark:bg-white"></span>
              <span className="">{dashboardData?.rank?.toUpperCase()}</span>
            </div>
            <div className="deposit-account-condition ml-[2.5rem] flex flex-col justify-center text-[var(--main-background)] dark:text-white">
              <div className="flex items-center">
                <span>$</span>
                <span>{dashboardData?.total_deposit}</span>
              </div>
              <span className="text-[var(--box-background)] dark:text-white deposit-condition-kind">
                Deposit
              </span>
            </div>
          </div>
          <div className="user-account-info sm:w-[70%] lg:w-[60%] pt-4">
            <div className="verified-container relative w-full h-[14vh]">
              <div
                className={`verified-label absolute right-0 bg-[#0c286b] w-fit px-3 gap-3 py-1 flex justify-center items-center  ${
                  headerData?.verified ? " text-[#00CB08]" : "text-[#FF6060]"
                }`}
              >
                {headerData?.verified ? (
                  <>
                    <LuBadgeCheck className="text-[2rem]" />
                    <span>verified</span>
                  </>
                ) : (
                  <>
                    <LuBadge className="text-[2rem]" />
                    <span>Not verified</span>
                  </>
                )}
              </div>
            </div>
            <div
              className={`user-account-info-details grid ${
                userPosition === "contract" ? "grid-cols-2" : "grid-cols-3"
              } content-center`}
            >
              {visibleItems.map((item) => (
                <AcountDetails key={item.id} detail={item} />
              ))}
              {userPosition === "contract" && (
                <div className="flex flex-col  mt-4">
                  <Link
                    href="/financial/my-investments"
                    className="flex w-fit items-center gap-2 titan-btn text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <FaFileContract className="text-lg" />
                    <span>Contract</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col pl-4">
              <div className="flex items-baseline gap-1 mobile-dashboard-title ">
                <span className="text-[var(--main-background)] dark:text-white text-[2rem]">
                  $
                </span>
                <span className="text-[var(--main-background)] dark:text-white text-[4rem] font-bold">
                  {dashboardData?.total_income}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 w-fit">
                <span className="text-[#8E92BC] min-w-24">Total income</span>
                <IncomeTrend
                  change={dashboardData?.total_income_percentage_change ?? 0}
                  variant="mobile"
                />
              </div>
            </div>
            {headerData?.verified && (
              <div className="verified-label bg-[#0c286b] px-3 py-1 rounded-lg flex items-center gap-2 text-[#00CB08]">
                <span className="">verified</span>
                <LuBadgeCheck className=" text-xl" />
              </div>
            )}
          </div>

          <div
            className={`grid ${
              userPosition === "contract" ? "grid-cols-2" : "grid-cols-3"
            } gap-4 mt-8`}
          >
            {userPosition === "contract" ? (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--main-background)] dark:text-white text-md font-medium">
                     {dashboardData?.start_of_investment}
                  </span>
                  <span className="text-[#8E92BC] text-sm mt-1">
                    Start Of Investment
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--main-background)] dark:text-white text-md font-medium">
                    $ {dashboardData?.total_roi}
                  </span>
                  <span className="text-[#8E92BC] text-sm mt-1">ROI</span>
                </div>
                <div className="flex flex-col items-center col-span-2">
                  <button className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    <FaFileContract className="text-lg" />
                    <span>Contract</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--main-background)] dark:text-white text-md font-medium">
                    $ {dashboardData?.total_roi}
                  </span>
                  <span className="text-[#8E92BC] text-sm mt-1">ROI</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--main-background)] dark:text-white text-md font-medium">
                    $ {dashboardData?.total_referral}
                  </span>
                  <span className="text-[#8E92BC] text-sm mt-1">Referral</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[var(--main-background)] dark:text-white text-md font-medium">
                    $ {dashboardData?.total_commission}
                  </span>
                  <span className="text-[#8E92BC] text-sm mt-1">
                    Commission
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="grid sm:hidden grid-cols-2 gap-4 mt-8">
        <div className="bg-gradient-to-b to-[#d9d9d9] text-center dark:to-[#090d23] from-[#fff] dark:from-[#275edf] border border-[#1E3A8A] rounded-xl p-4">
          <div className="text-[var(--main-background)]  dark:text-white text-2xl font-bold">
            <span>
              $ {Number(dashboardData?.total_annual_sales)?.toFixed(0)}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2 justify-center">
            <FaCableCar className="text-[#8E92BC]" />
            <span className="text-[#8E92BC]">Annual Sales</span>
          </div>
        </div>
        <div className="bg-gradient-to-b to-[#d9d9d9] text-center dark:to-[#090d23] from-[#fff] dark:from-[#275edf] border border-[#1E3A8A] rounded-xl p-4">
          <div className="text-[var(--main-background)]  dark:text-white text-2xl font-bold">
            $ {dashboardData?.next_rank_needed}K
          </div>
          <div className="flex items-center gap-2 mb-2 justify-center">
            <IoTrendingUpOutline className="text-[#8E92BC]" />
            <span className="text-[#8E92BC]">To Rank Up</span>
          </div>
        </div>
      </div>
    </>
  );
}
