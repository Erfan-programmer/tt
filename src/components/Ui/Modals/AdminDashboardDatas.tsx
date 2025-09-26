"use client";
import React, { useEffect, useState } from "react";
import AdminDashboardDataBox from "../../modules/p-admin/dashboard/AdminDashboardDataBox";
import LineTitle from "@/components/modules/p-admin/LineTitle";
import { DashboardResponse } from "@/types/p-admin/dashoard";
import { apiRequest } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { AnimatePresence } from "framer-motion";
import AnimationTemplate from "./p-admin/AnimationTemplate";

export default function AdminDashboardDatas() {
  const [dahsboardInfo, setDashboardInfo] = useState<DashboardResponse>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [showLineTitle, setShowLineTile] = useState({
    dashboard: true,
    task: true,
    System_Overview: true,
    Ranks_Overview: true,
    status_cart: true,
    profit_and_loss: true,
  });
  useEffect(() => {
    const fetchStats = async () => {
      const token = loadEncryptedData()?.token;
      const res = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/dashboard/stats`,
        "GET",
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      if (res.success) {
        setDashboardInfo(res.data.data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!dahsboardInfo) return <p>No data</p>;

  const adminDashboardData = {
    dashboardInfo: [
      {
        id: 1,
        title: "Users",
        subTitle: dahsboardInfo.user_stats?.total,
        chart: `+${dahsboardInfo.user_stats?.total_new_today}`,
      },
      {
        id: 2,
        title: "Investors",
        subTitle: dahsboardInfo.user_stats?.investors,
        chart: `+${dahsboardInfo.user_stats?.investors_new_today}`,
      },
      {
        id: 3,
        title: "Marketers",
        subTitle: dahsboardInfo.user_stats?.marketers,
        chart: `+${dahsboardInfo.user_stats?.marketers_new_today}`,
      },
      {
        id: 4,
        title: "Contract Free",
        subTitle: dahsboardInfo.user_stats?.contract_free,
        chart: "",
      },
      {
        id: 5,
        title: "Expired",
        subTitle: dahsboardInfo.user_stats?.expired_contracts,
        chart: "",
      },
      {
        id: 5,
        title: "Total",
        subTitle: dahsboardInfo.user_stats?.total,
        chart: `+${dahsboardInfo.user_stats?.total_new_today}`,
      },
    ],
    tasksInfo: [
      {
        id: 1,
        title: "Deposit",
        subTitle: dahsboardInfo?.tasks?.pending_deposits,
        status: "blue",
        link: "/hrtaamst2025/finance/t-wallet",
      },
      {
        id: 2,
        title: "Investment",
        subTitle: dahsboardInfo?.tasks?.pending_investments,
        status: "blue",
        link: "/hrtaamst2025/finance/investments",
      },
      {
        id: 3,
        title: "Withdraw Req",
        subTitle: dahsboardInfo?.tasks?.pending_withdrawals,
        status: "blue",
        link: "/hrtaamst2025/finance/withdraw",
      },
      {
        id: 4,
        title: "Cancel",
        subTitle: dahsboardInfo?.tasks?.pending_cancellations,
        status: "red",
        link: "/hrtaamst2025/users/cancel-accounts",
      },
    ],
    systermOverview: [
      {
        id: 1,
        title: "Total Invest",
        subTitle: dahsboardInfo?.system_overview?.total_investment,
        status: "normal",
      },
      {
        id: 2,
        title: "Total ROI",
        subTitle: dahsboardInfo?.system_overview?.total_roi_paid,
        status: "normal",
      },
      {
        id: 3,
        title: "Total REF",
        subTitle: dahsboardInfo?.system_overview?.total_referrals_paid,
        status: "normal",
      },
      {
        id: 4,
        title: "Total Commissions",
        subTitle: dahsboardInfo?.system_overview?.total_commissions_paid,
        status: "normal",
      },
      {
        id: 5,
        title: "Total Pay",
        subTitle: dahsboardInfo?.system_overview?.total_payouts,
        status: "normal",
      },
      {
        id: 6,
        title: "Total T-Wallet",
        subTitle: dahsboardInfo?.system_overview?.total_t_wallet_balance,
        status: "normal",
      },
      {
        id: 7,
        title: "Not Active Acc",
        subTitle: dahsboardInfo?.system_overview?.inactive_accounts,
        status: "normal",
      },
      {
        id: 8,
        title: "Award Winners",
        subTitle: dahsboardInfo?.system_overview?.award_winners,
        status: "normal",
      },
      {
        id: 9,
        title: "Total Renew",
        subTitle: dahsboardInfo?.system_overview?.total_renewals,
        status: "normal",
      },
      {
        id: 10,
        title: "Total Cancel",
        subTitle: dahsboardInfo?.system_overview?.total_cancellations,
        status: "normal",
      },
      {
        id: 11,
        title: "Perfect",
        subTitle: dahsboardInfo?.system_overview?.capital_health.perfect,
        status: "green",
      },
      {
        id: 12,
        title: "Normal",
        subTitle: dahsboardInfo?.system_overview?.capital_health.normal,
        status: "yellow",
      },
      {
        id: 13,
        title: "Risky",
        subTitle: dahsboardInfo?.system_overview?.capital_health.risky,
        status: "red",
      },
      {
        id: 14,
        title: "Total DD",
        subTitle: dahsboardInfo?.system_overview?.capital_health.total_dd,
        bgColor: "#5D0000",
      },
      {
        id: 15,
        title: "Total %Fee",
        subTitle: dahsboardInfo?.system_overview?.total_fees,
      },
    ],
    ranksOverview: Object.entries(dahsboardInfo?.ranks_overview).map(
      ([rank, value], idx) => ({
        id: idx + 1,
        title: rank,
        subTitle: value,
      })
    ),
  };

  return (
    <>
      <LineTitle
        title="Dashboard"
        onClick={() =>
          setShowLineTile((prev) => ({ ...prev, dashboard: !prev.dashboard }))
        }
      />
      <AnimatePresence>
        {showLineTitle.dashboard && (
          <AnimationTemplate>
            <div className="flex items-center gap-4 flex-wrap">
              {adminDashboardData.dashboardInfo.map((info) => (
                <AdminDashboardDataBox
                  key={info.id}
                  title={info.title}
                  subTitle={info.subTitle}
                  chart={info.chart}
                />
              ))}
            </div>
          </AnimationTemplate>
        )}
      </AnimatePresence>

      <LineTitle
        onClick={() =>
          setShowLineTile((prev) => ({ ...prev, task: !prev.task }))
        }
        title="Task"
      />
      {showLineTitle.task && (
        <AnimationTemplate>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-2">
            {adminDashboardData.tasksInfo.map((info) => (
              <AdminDashboardDataBox
                key={info.id}
                title={info.title}
                link={info.link}
                subTitle={info.subTitle}
                status={info.status}
              />
            ))}
          </div>
        </AnimationTemplate>
      )}

      <div className="flex items-center my-8 gap-2">
        <LineTitle
          title="System Overview"
          onClick={() =>
            setShowLineTile((prev) => ({
              ...prev,
              System_Overview: !prev.System_Overview,
            }))
          }
        />
        <div className="h-[1px] w-full bg-[#383C47]"></div>
      </div>
      {showLineTitle.System_Overview && (
        <AnimationTemplate>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-2">
            {adminDashboardData.systermOverview.map((info) => (
              <AdminDashboardDataBox
                key={info.id}
                title={info.title}
                subTitle={info.subTitle}
                status={info.status}
                bgColor={info.bgColor}
              />
            ))}
          </div>
        </AnimationTemplate>
      )}

      <LineTitle
        onClick={() =>
          setShowLineTile((prev) => ({
            ...prev,
            Ranks_Overview: !prev.Ranks_Overview,
          }))
        }
        title="Ranks Overview"
      />
      {showLineTitle.Ranks_Overview && (
        <AnimationTemplate>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-2">
            {adminDashboardData.ranksOverview.map((info) => (
              <AdminDashboardDataBox
                key={info.id}
                title={info.title}
                subTitle={info.subTitle}
              />
            ))}
          </div>
        </AnimationTemplate>
      )}
    </>
  );
}
