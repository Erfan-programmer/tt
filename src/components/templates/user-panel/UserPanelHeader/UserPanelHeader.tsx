"use client";
import { useEffect, useRef, useState } from "react";
import "./UserPanelHeader.css";
import ThemeSwitcher from "@/components/modules/UserPanel/ThemeSwitcher/ThemeSwitcher";
import { FaBars } from "react-icons/fa6";
import HeaderSkeleton from "@/skeletons/User-Panel/HeaderSkeleton";
import { useHeader } from "@/contextApi/HeaderContext";
import { useVerify } from "@/contextApi/TitanContext";
import Image from "next/image";
import NotificationContainer from "@/components/modules/UserPanel/NotificationContainer/NotificationContainer";
import { apiRequest } from "@/libs/api";
import { loadUserData } from "@/components/modules/EncryptData/SavedEncryptData";

export default function UserPanelHeader() {
  const [notifPopUp, setNotifPopUp] = useState(false);
  const { setIsSidebarOpen } = useVerify();
  const { headerData, isLoading } = useHeader();
  const [notifications, setNotifications] = useState([]);
  const getNotification = async () => {
    const token = loadUserData()?.access_token;
    const res = await apiRequest<{data:any}>(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/client/getNotifications`,
      "GET",
      undefined,
      { Authorization: `Bearer ${token}` }
    );
    if (res.status) {
      setNotifications(res.data.data);
    }
  };

  useEffect(() => {
    getNotification();
  }, []);
  const handleNotificationClose = () => {
    setNotifPopUp(false);
  };
  const headerRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <HeaderSkeleton />;
  }
  const unreadCount = notifications?.filter(
    (notifi: any) => notifi.read_at === null
  ).length;

  return (
    <>
      <header
        ref={headerRef}
        className={`dashbo  ard-header z-[999] transition-transform duration-1000  ease-in-out "bg-secondary-black-light backdrop-blur-md w-full xl:w-[80%] fixed top-0  right-0`}
      >
        <div className="w-[97%] sm:w-[95%] mx-auto flex justify-between  items-center h-[12vh] sm:gap-4">
          <button
            className=" hidden sm:flex xl:hidden w-10 h-10 bg-[#ECECED] dark:bg-[#275edf]   justify-center items-center rounded-lg"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            <FaBars className="text-[var(--main-background)] dark:text-white" />
          </button>

          <div className="hidden md:flex  justify-center gap-4 items-center">
            <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit">
              <div className="text-[var(--main-background)] dark:text-white">
                <span>Deposit : </span>
                <span>${headerData?.deposit || 0}</span>
              </div>
            </div>
            <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit">
              <div className="text-[var(--main-background)] dark:text-white">
                <span>T-Wallet : </span>
                <span>${headerData?.t_wallet || 0}</span>
              </div>
            </div>
            <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex justify-center gap-2 items-center w-fit text-[var(--main-background)] dark:text-white">
              <span>TID</span>
              <span>{headerData?.t_id || "---"}</span>
            </div>
          </div>
          <div className="flex justify-between gap-2 sm:gap-4 !text-sm items-center w-full sm:w-auto">
            <div className="border-standard rounded-[2rem] flex-1 gap-2 flex sm:hidden sm:justify-between flex-wrap justify-center items-center text-[0.8rem] sm:text-md p-1 px-2 mr-2 ">
              <p className="text-[var(--main-background)] dark:text-white">
                TID {headerData?.t_id || "---"}
              </p>
            </div>
            <ThemeSwitcher />
            <div
              className="w-fit px-2 sm:px-3 py-1 rounded-lg flex gap-2 justify-evenly items-center relative border border-1 border-[#707070] cursor-pointer transition-colors"
              onClick={() => setNotifPopUp(!notifPopUp)}
            >
              <svg
                width="17"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-[var(--main-background)] dark:stroke-[#d9d9d9]"
              >
                <path
                  d="M8.5087 3C9.94087 3 11.3144 3.50571 12.3271 4.40589C13.3398 5.30606 13.9087 6.52696 13.9087 7.8C13.9087 9.76906 14.3538 11.2436 14.931 12.3279C15.6684 13.7133 16.0371 14.406 16.0166 14.5642C15.9927 14.7489 15.9622 14.7997 15.8104 14.9075C15.6803 15 15.0332 15 13.7389 15H3.27847C1.9842 15 1.33706 15 1.20697 14.9075C1.05522 14.7997 1.02473 14.7489 1.00081 14.5642C0.980304 14.406 1.34902 13.7133 2.08644 12.3279C2.66362 11.2436 3.1087 9.76906 3.1087 7.8C3.1087 6.52696 3.67763 5.30606 4.69033 4.40589C5.70302 3.50571 7.07653 3 8.5087 3ZM8.5087 3V1M5.86271 18C6.56895 18.6233 7.49666 19.0016 8.51271 19.0016C9.52875 19.0016 10.4565 18.6233 11.1627 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="text-[#707070]">{unreadCount} news</span>

              {unreadCount > 0 && (
                <div className="w-3 h-3 rounded-full bg-[#1A68FF] shadow-[0_0_10px_rgba(26,104,255,0.5)] absolute bottom-[-5px] right-0"></div>
              )}
            </div>

            <span className="text-standard">
              {headerData?.rank_icon && (
                <Image
                  width={400}
                  height={400}
                  alt=""
                  className="w-20 h-20"
                  src={`${process.env.NEXT_PUBLIC_API_URL_STORAGE}/${headerData?.rank_icon}`}
                />
              )}
            </span>
          </div>
        </div>
      </header>
      <div className="h-[60px]" />

      {notifPopUp && notifications && notifications?.length > 0 && (
        <NotificationContainer
          onClose={handleNotificationClose}
          onRefetch={getNotification}
          notifications={notifications}
        />
      )}
    </>
  );
}
