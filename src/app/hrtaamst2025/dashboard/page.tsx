import AdminDashboardDatas from "@/components/Ui/Modals/AdminDashboardDatas";
import AdminDashboardProfitLoss from "@/components/Ui/Modals/p-admin/AdminDashboardProfitLoss";
import AdminDashboardTrade from "@/components/Ui/Modals/p-admin/AdminDashboardTrade";
import React from "react";

export default function Dashboard() {
  return (
    <>
     {/* <DashboardTableList /> */}
      <AdminDashboardDatas />
      <AdminDashboardTrade />
      <AdminDashboardProfitLoss />
    </>
  );
}
