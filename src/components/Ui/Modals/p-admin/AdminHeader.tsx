"use client";
import NotificationContainer from "@/components/modules/UserPanel/NotificationContainer/NotificationContainer";
import { useVerify } from "@/contextApi/TitanContext";
import { useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import { apiRequest, ApiResponse } from "@/libs/api";
import { loadEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { toast } from "react-toastify";

export default function AdminHeader() {
  const [notifPopUp, setNotifPopUp] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen, setIsSidebarOpen } = useVerify();

  const fetchNotifications = async () => {
    try {
      const res: ApiResponse = await apiRequest<any>(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admin/notifications`,
        "GET",
        undefined,
        loadEncryptedData()?.token
      );
      if (res.success) {
        setNotifications(res.data || []);
      } else {
        toast.error(res.message || "Failed to load notifications");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error fetching notifications");
    }
  };

  const handleOpenPopup = () => {
    setNotifPopUp(true);
    fetchNotifications();
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`dashboard-header z-[999] transition-transform duration-1000 ease-in-out bg-[var(--admin-bg-dark)] backdrop-blur-md w-full xl:w-[80%] fixed top-0 right-0`}
      >
        <div className="w-[97%] sm:w-[95%] mx-auto flex justify-between items-center h-[12vh] sm:gap-4">
          {/* Sidebar button */}
          <button
            className="hidden sm:flex xl:hidden w-10 h-10 bg-gray-700 justify-center items-center rounded-lg"
            onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
            }}
          >
            <FaBars className="text-white" />
          </button>

          {/* Deposit / Wallet / TID */}
          <div className="hidden md:flex justify-center gap-4 items-center">
            <div className="border-1 rounded-xl border-[#444] px-4 py-2 flex gap-2 items-center w-fit  text-white">
              <span>Admin : </span>
              <span>CEO</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex justify-between gap-2 sm:gap-4 !text-sm items-center w-full sm:w-auto">
            {/* Notification button */}
            <div
              className="w-10 h-10 flex items-center justify-center px-2 sm:px-3 py-1 rounded-full bg-[#0D111D] flex gap-2 items-center relative border border-1 border-[#707070] cursor-pointer transition-colors"
              onClick={handleOpenPopup}
            >
              <svg
                width="17"
                height="20"
                viewBox="0 0 17 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-[#d9d9d9] text-2xl"
              >
                <path
                  d="M8.5 3C9.9 3 11.3 3.5 12.3 4.4C13.3 5.3 13.9 6.5 13.9 7.8C13.9 9.7 14.4 11.2 15 12.3C15.7 13.7 16 14.4 16 14.6C16 14.7 16 14.8 15.8 14.9C15.6 15 15 15 13.7 15H3.3C2 15 1.3 15 1.2 14.9C1 14.8 1 14.7 1 14.6C1 14.4 1.3 13.7 2.1 12.3C2.7 11.2 3.1 9.7 3.1 7.8C3.1 6.5 3.7 5.3 4.7 4.4C5.7 3.5 7.1 3 8.5 3ZM8.5 3V1M5.9 18C6.6 18.6 7.5 19 8.5 19C9.5 19 10.5 18.6 11.2 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[60px]" />

      <AnimatePresence>
        {notifPopUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -30 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[12vh] right-4 z-[1000]"
          >
            <NotificationContainer
              onClose={() => setNotifPopUp(false)}
              notifications={notifications}
              onRefetch={fetchNotifications}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
