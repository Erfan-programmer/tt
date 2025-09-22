"use client";

import { useState, useEffect } from "react";
import { GoTriangleDown } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import Logout from "./Logout";
import "./AdminSidebar.css";
import { menuItems } from "./AdminSidebarMenus";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { removeEncryptedData } from "@/components/modules/EncryptData/SavedEncryptData";
import { useVerify } from "@/contextApi/TitanContext";

export interface SubMenuItem {
  svg?: JSX.Element;
  span: string;
  link: string;
  id?: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItemProps {
  item: SubMenuItem;
  level: number;
  pathname: string | null;
}

const SubMenuItemComponent: React.FC<SubMenuItemProps> = ({
  item,
  level,
  pathname,
}) => {
  const [isOpen] = useState(false);
  const { isSidebarOpen, setIsSidebarOpen } = useVerify();

  const toggleSubMenu = (e: React.MouseEvent) => {
    if (item.subItems && item.subItems.length > 0) {
      e.preventDefault();
      setIsSidebarOpen(isSidebarOpen);
      console.log("sidebaropen =>", isSidebarOpen);
    }
  };

  const isActive =
    pathname === item.link || pathname?.startsWith(item.link + "/");

  return (
    <div style={{ paddingRight: `${level * 4}px` }}>
      <Link
        href={item.link || "#"}
        className={`submenu-item flex items-center justify-start rounded-[1rem] gap-3 cursor-pointer
    ${
      isActive
        ? "active-sub-item bg-[var(--admin-bg-main)] text-white"
        : item.subItems && item.subItems.length > 0
        ? "bg-[#275edf] text-white"
        : level > 1
        ? "bg-[var(--admin-bg-dark)]"
        : "bg-[var(--admin-bg-main)]"
    }
  `}
        onClick={toggleSubMenu}
      >
        <div className="flex items-center gap-2">
          {item.svg}
          <div>
            <span>{item.span}</span>
          </div>
        </div>
        {item.subItems && item.subItems.length > 0 && (
          <GoTriangleDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </Link>

      {item.subItems && item.subItems.length > 0 && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden ml-2 mt-1 flex flex-col gap-1"
            >
              {item.subItems.map((child, idx) => (
                <SubMenuItemComponent
                  key={idx}
                  item={child}
                  level={level + 1}
                  pathname={pathname}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default function AdminSidebar() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { isSidebarOpen, setIsSidebarOpen } = useVerify();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 640);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const pathSegments = pathname.split("/hrtaamst2025/")?.filter(Boolean);

    if (pathSegments.length > 0) {
      const mainSection = pathSegments[0];
      let menuItemId = mainSection;

      if (mainSection === "team") menuItemId = "network";
      else if (mainSection === "t-wallet") menuItemId = "twallet";

      if (!activeItem) {
        setActiveItem(menuItemId);
      }
    }
  }, [pathname, activeItem]);

  const handleItemClick = (itemId: string) => {
    if (itemId === "logout") {
      setIsLogoutOpen(true);
      return;
    }
    if (activeItem === itemId) {
      setActiveItem(null);
    } else {
      setActiveItem(itemId);
    }
  };

  const handleLogout = () => {
    removeEncryptedData();
    router.push("/hrtaamst2025/auth/sign-in");
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

  const renderLinks = (item: any) => {
    const hiddenInMobile = ["dashboard", "withdraw"].includes(item.id);
    if (isMobile && hiddenInMobile) return null;

    return (
      <>
        <div
          className={`content flex justify-between items-center cursor-pointer p-4 ${
            activeItem === item.id
              ? "bg-[#275EDF] text-white"
              : " bg-[var(--admin-bg-dark)]"
          } hover:bg-[#275EDF] hover:text-white transition-colors rounded-lg`}
          onClick={() => handleItemClick(item.id)}
        >
          <div className="flex items-center gap-4 lg:gap-[2rem]">
            {item.icon}
            <span>{item.title}</span>
          </div>
          {item.subItems.length > 0 && (
            <GoTriangleDown
              className={`transition-transform duration-300 ${
                activeItem === item.id ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
        <AnimatePresence>
          {activeItem === item.id && item.subItems.length > 0 && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="submenu-container">
                {item.subItems.map((subItem: SubMenuItem, index: number) => (
                  <SubMenuItemComponent
                    key={index}
                    item={subItem}
                    level={1}
                    pathname={pathname}
                  />
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
      className={`admin-sidebar-container relative left-0   w-full sm:w-[40%] md:w-[30%] xl:w-[20%]  overflow-x-hidden transition-all transition-300 ${
        !isSidebarOpen
          ? "translate-x-[-100%] xl:translate-x-0"
          : "sm:block translate-x-0"
      }`}
    >
      <button
        className="hidden w-8 h-8 sm:flex xl:hidden absolute top-[1%] right-0 z-[1000] bg-gray-700 text-white rounded-l-xl text-[1rem] p-2 transition-all duration-300 hover:bg-[#1a4db5] hover:scale-110 shadow-lg hover:shadow-[#275edf]/50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 1V17M13 9H1M1 9L5 5M1 9L5 13"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="sidebar-titan-brand flex justify-center items-center pt-4">
        <Image
          width={500}
          height={500}
          onClick={() => {
            router.push("/");
          }}
          src="/titan-main-avatar.png"
          className="w-[40%]"
          alt="logo"
        />
      </div>

      <div className="line"></div>

      <div className="sidebar-items w-[95%] mx-auto mt-[1rem] overflow-x-auto">
        <ul className="sidear-items-container space-y-1">
          {menuItems.map((item) =>
            item.subItems?.length === 0 ? (
              item.id === "logout" ? (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-[#585966] cursor-pointer ${
                    activeItem === item.id ? "open" : ""
                  }`}
                >
                  {renderLinks(item)}
                </div>
              ) : (
                <Link
                  href={`/${item.link}`}
                  key={item.id}
                  className={`text-[#585966] mt-4 ${
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
          width={1500}
          height={1500}
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
