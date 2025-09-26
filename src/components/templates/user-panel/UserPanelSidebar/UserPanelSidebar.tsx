"use client";

import { useState, useEffect } from "react";
import { GoTriangleDown } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logout from "@/components/modules/UserPanel/Logout/Logout";
import "./UserPanelSidebar.css";
import { FaAngleLeft } from "react-icons/fa6";
import { useVerify } from "@/contextApi/TitanContext";
import { removeUserData } from "@/components/modules/EncryptData/SavedEncryptData";
import { menuItems } from "./UserSidebarMenus";
import Image from "next/image";
import { useHeader } from "@/contextApi/HeaderContext";

export interface SubMenuItem {
  svg?: JSX.Element;
  span: string;
  link: string;
  id?: string;
}

export default function UserPanelSidebar() {
  const { activeItem, setActiveItem, isSidebarOpen, setIsSidebarOpen } =
    useVerify();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const pathname: any = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 640);
      }
    };
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    const pathSegments = pathname?.split("/dashboard/")?.filter(Boolean);
    let menuItemId = "";

    if (pathSegments.length > 0) {
      menuItemId = pathSegments[0];
      if (menuItemId === "team") menuItemId = "network";
      else if (menuItemId === "t-wallet") menuItemId = "twallet";
    } else if (pathname === "/dashboard") {
      menuItemId = "dashboard";
    }

    if (menuItemId) setActiveItem(menuItemId);

    menuItems.forEach((item) => {
      const shouldBeOpen =
        item.id === menuItemId ||
        item.subItems.some((sub) => pathname.startsWith(sub.link));
      setOpenDropdowns((prev) => ({ ...prev, [item.id]: shouldBeOpen }));
    });
  }, [pathname, setActiveItem]);

  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "logout") {
      setIsLogoutOpen(true);
      return;
    }
    setActiveItem(itemId);
  };

  const handleLogout = () => {
    removeUserData();
    router.push("/login");
  };

  const dateUTC = new Date();
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const parts = formatter.formatToParts(dateUTC);
  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value || "";
  const utcTimeString = `${getPart("year")}/${getPart("month")}/${getPart(
    "day"
  )} ${getPart("hour")}:${getPart("minute")} ${getPart("dayPeriod")}`;
  const { headerData } = useHeader();
  const permissions = headerData?.permission;
  const renderLinks = (item: any) => {
    const hiddenInMobile = ["dashboard", "withdraw"].includes(item.id);
    if (isMobile && hiddenInMobile) return null;

    const isActive =
      activeItem === item.id ||
      (pathname === `/dashboard` && item.id === "dashboard");
    const isDropdownOpen = openDropdowns[item.id] || false;

    return (
      <>
        <div
          className={`content flex justify-between items-center cursor-pointer p-4 ${
            isActive ? "bg-[#192879] text-white" : ""
          } hover:bg-[#192879] hover:text-white transition-colors rounded-lg`}
          onClick={() => {
            handleItemClick(item.id);
            if (item.subItems.length > 0) toggleDropdown(item.id);
          }}
        >
          <div className="flex items-center gap-4 lg:gap-[2rem]">
            {item.icon}
            <span>{item.title}</span>
          </div>
          {item.subItems.length > 0 && (
            <GoTriangleDown
              className={`transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        <AnimatePresence>
          {isDropdownOpen && item.subItems.length > 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="submenu-container">
                {item.subItems
                  .filter((subItem: any) =>
                    permissions?.some((permission) => {
                      const parts = permission.split(".");
                      return parts.length > 1 && parts[1] === subItem.id;
                    })
                  )
                  .map((subItem: any, index: number) => (
                    <Link
                      key={index}
                      href={
                        subItem.id.toLowerCase() === "verification"
                          ? ""
                          : subItem?.link
                      }
                      className={`submenu-item flex items-center rounded-[1rem] select-none gap-3  ${
                        pathname?.startsWith(subItem.link) &&
                        subItem.id.toLowerCase() !== "verification"
                          ? "active-before"
                          : "border-none"
                      }`}
                      onClick={(e: any) => e.stopPropagation()}
                    >
                      {subItem.svg}
                      <span>
                        {subItem.id.toLowerCase() === "verification" ? (
                          <div className="flex items-center">
                            <span
                              className={`${
                                subItem.id.toLowerCase() === "verification"
                                  ? "opacity-30"
                                  : ""
                              }`}
                            >
                              {subItem.span}{" "}
                            </span>
                            <span className="p-1 px-1 mb-1 !text-[.8rem]  rounded-xl text-green-600 absolute right-4">
                              verified
                            </span>
                          </div>
                        ) : (
                          subItem.span
                        )}
                      </span>{" "}
                    </Link>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div
      className={`sidebar-container relative xl:w-[20%] overflow-x-hidden transition-all transition-300 ${
        !isSidebarOpen
          ? "w-full sm:w-0 left-0 overflow-x-hidden"
          : "sm:block w-[100%] sm:w-[40%] overflow-x-hidden"
      }`}
    >
      <button
        className="hidden w-8 h-8 sm:flex xl:hidden absolute top-[1%] right-0 z-[1000] bg-[#275edf] text-white rounded-xl text-[1rem] p-2 transition-all duration-300 hover:bg-[#1a4db5] hover:scale-110 shadow-lg hover:shadow-[#275edf]/50"
        onClick={() => setIsSidebarOpen(false)}
      >
        <FaAngleLeft className="pointer-events-none w-full h-full" />
      </button>

      <div className="sidebar-titan-brand flex justify-center items-center pt-4">
        <Image
          width={400}
          height={400}
          onClick={() => router.push("/")}
          src="/titan-main-avatar.png"
          className="w-[40%]"
          alt="logo"
        />
      </div>

      <div className="line"></div>

      <div className="sidebar-items w-[95%] mx-auto mt-[1rem] overflow-x-auto">
        <ul className="sidear-items-container">
          {menuItems
            .filter((item) => permissions?.includes(item.id.toLowerCase()))
            .map((item) =>
              item.subItems.length === 0 ? (
                item.id === "logout" ? (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`text-[#585966] ${
                      activeItem === item.id ? "open" : ""
                    }`}
                  >
                    {renderLinks(item)}
                  </div>
                ) : (
                  <Link
                    href={`/${item.link}`}
                    key={item.id}
                    className={`text-[#585966] ${
                      activeItem === item.id ? "open" : ""
                    }`}
                  >
                    {renderLinks(item)}
                  </Link>
                )
              ) : (
                <div
                  key={item.id}
                  className={`text-[#585966] ${
                    activeItem === item.id ? "open" : ""
                  }`}
                >
                  {renderLinks(item)}
                </div>
              )
            )}
        </ul>
      </div>

      <div
        className="bottom-28 sm:bottom-16"
        style={{
          position: "absolute",
          left: 16,
          width: "calc(100% - 32px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <Image
          width={120}
          height={140}
          src="/world.png"
          alt="World"
          style={{
            width: "8rem",
            marginBottom: "-1rem",
            display: "block",
          }}
        />
        <div
          className="sidebar-datetime text-gray-400"
          style={{
            borderRadius: "6px",
            padding: "4px 16px",
            fontFamily: "Montserrat !important",
            fontWeight: 500,
            fontSize: "1rem",
            letterSpacing: "1px",
            display: "inline-block",
            background: "rgba(0,0,0,0.02)",
          }}
        >
          {utcTimeString}
        </div>
      </div>

      <Logout
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
}
