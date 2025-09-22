import React, { ReactNode } from "react";
import AdminSidebar from "../Ui/Modals/p-admin/AdminSidebar";
import AdminHeader from "../Ui/Modals/p-admin/AdminHeader";
import AdminMobileMenu from "../Ui/Modals/p-admin/AdminMobileMenu";
import { usePathname } from "next/navigation";
import { useVerify } from "@/contextApi/TitanContext";

interface AdminLayoutProps {
  children: ReactNode;
  geistClash: { variable: string };
  geistJakarta: { variable: string };
}

export default function AdminLayout({ children, geistClash, geistJakarta }: AdminLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("hrtaamst2025/auth");
  const {isSidebarOpen} = useVerify();

  return (
    <div
      className={`min-h-screen relative dashboard-layout-container ${geistJakarta.variable} ${geistClash.variable} antialiased`}
    >
      <div className="w-full dashboard-layout-wrapper flex">
        {!isAuthPage && (
          <aside className={`hidden sm:block mt-[4rem] xl:static z-[1000] ${isSidebarOpen ? "" : "w-0"}  min-h-screen dashboard-sidebar`}>
            <AdminSidebar />
          </aside>
        )}

        <main
          className={`dashboard-content bg-[var(--admin-bg-main)] min-h-[100vh] pb-4 ${
            !isAuthPage
              ? "w-full sm:w-full xl:w-[80%] sm:ml-auto"
              : "w-full sm:w-full"
          }`}
        >
          {!isAuthPage && (
            <header className="mb-20">
              <AdminHeader />
            </header>
          )}

          <section className="pb-4 mb-[70px] sm:mb-0">
            <div
              className={`${
                !isAuthPage ? "w-[95%] mx-auto" : "w-full flex justify-center"
              }`}
            >
              {children}
            </div>
          </section>
        </main>
      </div>

      {!isAuthPage && <AdminMobileMenu />}
    </div>
  );
}
