"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import UserPanelSidebar from "@/components/templates/user-panel/UserPanelSidebar/UserPanelSidebar";
import UserPanelHeader from "@/components/templates/user-panel/UserPanelHeader/UserPanelHeader";
import CryptoContent from "@/components/modules/UserPanel/CryptoContent";
import AcountActivation from "@/components/templates/UserPanel/AccountActivator";
import PaymentMethod from "@/components/templates/UserPanel/PaymentMethod";
import Breadcrumbs from "@/components/modules/UserPanel/Breadcrumbs/Breadcrumbs";
import MobileMenu from "@/components/templates/user-panel/MobileMenu/MobileMenu";
import Spinner from "@/components/modules/Spinner";
import { useHeader } from "@/contextApi/HeaderContext";
import { useVerify } from "@/contextApi/TitanContext";
import { useAuth } from "@/contextApi/AuthContext";
import PaymentTitan from "../templates/Payments/PaymentTitan";

export default function DashboardClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { isSidebarOpen, accountActivation } = useVerify();
  const { headerData, isLoading } = useHeader();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [messages] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // if (pathname === "/dashboard" || pathname?.startsWith("/payment/")) return;
    // if (Number(headerData?.deposit) === 0) router.replace("/dashboard");
  }, [pathname, headerData, router, mounted]);

  // useEffect(() => {
  //   if (!mounted) return;

  //   let echo: any;
  //   const setupEcho = async () => {
  //     const PusherEcho = (await import("@/libs/PusherConfig")).default;
  //     echo = PusherEcho;

  //     const channel = echo.channel("public-crypto-prices");
  //     const handler = (data: any) => {
  //       setMessages((prev) => [...prev, data.message]);
  //     };

  //     channel.listen(".crypto.pricesa.updated", handler);

  //     return () => {
  //       channel.unbind(".crypto.pricesa.updated", handler);
  //       echo.leave("public-crypto-prices");
  //     };
  //   };

  //   const cleanupPromise = setupEcho();
  //   return () => {
  //     cleanupPromise.then((cleanup) => cleanup && cleanup());
  //   };
  // }, [mounted]);

  // if (!mounted) {
  //   return <div suppressHydrationWarning />;
  // }

  return (
    <div className="min-h-screen relative dashboard-layout-container">
      <ul className="text-gray-900 text-right relative z-[99999] bg-green-200">
        {messages.map((m, i) => (
          <li key={i}>
            <span className="text-[#383C47] dark:text-white">{m}</span>
          </li>
        ))}
      </ul>

      <div className="w-full dashboard-layout-wrapper flex justify-center items-center">
        <div
          className={`static sm:relative xl:static z-[1000] hidden sm:block ${
            !isSidebarOpen ? "w-0 left-0" : "sm:block w-[40%]"
          } dashoard-sidear xl:min-w-fit xl:w-[20%] min-h-screen`}
        >
          <UserPanelSidebar />
        </div>

        <div
          className={`
            dashoard-content min-h-[100vh] pb-[1rem] w-full h-auto sm:w-[100%] xl:w-[80%] sm:ml-auto md:mx-auto
            bg-gradient-to-b
            from-white to-gray-300 dark:from-[#080a1d] dark:to-[#1b2972]
          `}
        >
          {" "}
          <div className="dashoard-content-bottom mb-20">
            <UserPanelHeader />
          </div>
          <div className="dashoard-content-bottom pb-[1rem] mb-[70px] sm:mb-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-[80vh]">
                <Spinner />
              </div>
            ) : Number(headerData?.deposit) > 0 ? (
              <>
                <CryptoContent />
                <Breadcrumbs
                  items={pathname?.split("/")?.filter(Boolean) as string[]}
                />
                <div className="w-[95%] mx-auto">{children}</div>
              </>
            ) : (
              <>
                <CryptoContent />
                <div className="w-[95%] mx-auto">
                  {accountActivation === "METHOD" ? (
                    <PaymentMethod />
                  ) : accountActivation === "LAW" ? (
                    <AcountActivation type={user?.plan?.type || ""} />
                  ) : (
                    <PaymentTitan />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MobileMenu />
    </div>
  );
}
