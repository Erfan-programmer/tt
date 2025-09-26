"use client";
import { useEffect, useState } from "react";
import Logout from "./Logout";
import "./AdminSidebar.css";
import AdminSidebar from "./AdminSidebar";
import Link from "next/link";
import ActiveIndicator from "../ActiveIndicator";
import { useRouter, usePathname } from "next/navigation";
import { useVerify } from "@/contextApi/TitanContext";

export default function AdminMobileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const {isSidebarOpen, setIsSidebarOpen} = useVerify();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); 

useEffect(() => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }
}, []);



  const isActive = (path: string) => pathname?.startsWith(path);

  const handleLogout = () => {
    setTimeout(() => {
      router.push("/login");
    }, 5000);
  };

const toggleTheme = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      if (newTheme) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      return newTheme;
    });
  }
};




  return (
    <>
      <Logout
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onLogout={handleLogout}
      />
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-[#0000007a] bg-opacity-50 z-[999] sm:hidden"
          onClick={()=>setIsSidebarOpen(!isSidebarOpen)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-full w-[70%] bg-[var(--sidebar-bg)] z-[1000] transform transition-transform duration-300 ease-in-out sm:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            onClick={()=>setIsSidebarOpen(true)}
            className="text-white mb-4"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <AdminSidebar />
        </div>
      </div>

      {/* Bottom Mobile Menu */}
      <div className="fixed bottom-0 left-0 right-0  bg-[var(--admin-bg-main)] border-t border-[#ffffff1a] sm:hidden z-[1001] py-2 px-[1rem]">
        <div className="admin-menu-mobile flex justify-between items-center px-2 py-1 max-w-[465px] mx-auto border-2 border-[#6188B4] bg-[var(--admin-bg-main)] rounded-[1rem] shadow-[0_-8px_20px_-6px_rgba(97,136,180,0.3)] ">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center group relative"
          >
            <div className="p-2 rounded-lg transition-colors duration-300">
              {isDark ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 1V2M10 18V19M2 10H1M4.31412 4.31412L3.5 3.5M15.6859 4.31412L16.5 3.5M4.31412 15.69L3.5 16.5001M15.6859 15.69L16.5 16.5001M19 10H18M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z"
                    stroke="#888888"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4V1M16.5 10V5M12.5 2.5H9.5M19 7.5H14M13.5548 14.8151C14.7829 14.8151 15.9493 14.5506 17 14.0754C15.6867 16.9794 12.7642 19 9.36985 19C4.74731 19 1 15.2527 1 10.6302C1 7.23576 3.02061 4.31331 5.92462 3C5.44944 4.05072 5.18492 5.21708 5.18492 6.44523C5.18492 11.0678 8.93223 14.8151 13.5548 14.8151Z"
                    stroke="#888888"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              )}
            </div>
            {/* Active indicator SVG */}
          </button>

          {/* Withdraw Link */}
          <button
            onClick={() => router.push("/financial/withdraw")}
            className="flex flex-col items-center group relative"
          >
            <div
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isActive("/financial/withdraw") ? "bg-primary" : ""
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isActive("/financial/withdraw")
                    ? "stroke-[#fff]"
                    : "stroke-[#71717A]"
                }
              >
                <path
                  d="M10 1V7M10 1L7.5 3.5M10 1L12.5 3.5M3.82333 7.00037C4.2383 7.36683 4.5 7.90285 4.5 8.5C4.5 9.60457 3.60457 10.5 2.5 10.5C1.90285 10.5 1.36683 10.2383 1.00037 9.82333M3.82333 7.00037C3.94144 7 4.06676 7 4.2 7H6M3.82333 7.00037C2.94852 7.00308 2.46895 7.02593 2.09202 7.21799C1.71569 7.40973 1.40973 7.71569 1.21799 8.09202C1.02593 8.46895 1.00308 8.94852 1.00037 9.82333M1.00037 9.82333C1 9.94144 1 10.0668 1 10.2V15.8C1 15.9332 1 16.0586 1.00037 16.1767M1.00037 16.1767C1.36683 15.7617 1.90285 15.5 2.5 15.5C3.60457 15.5 4.5 16.3954 4.5 17.5C4.5 18.0971 4.2383 18.6332 3.82333 18.9996M1.00037 16.1767C1.00308 17.0515 1.02593 17.5311 1.21799 17.908C1.40973 18.2843 1.71569 18.5903 2.09202 18.782C2.46895 18.9741 2.94852 18.9969 3.82333 18.9996M3.82333 18.9996C3.94144 19 4.06676 19 4.2 19H15.8C15.9332 19 16.0586 19 16.1767 18.9996M19 16.1771C18.6335 15.7619 18.0973 15.5 17.5 15.5C16.3954 15.5 15.5 16.3954 15.5 17.5C15.5 18.0971 15.7617 18.6332 16.1767 18.9996M19 16.1771C19.0004 16.0589 19 15.9334 19 15.8V10.2C19 10.0668 19 9.94144 18.9996 9.82333M19 16.1771C18.9973 17.0516 18.974 17.5311 18.782 17.908C18.5903 18.2843 18.2843 18.5903 17.908 18.782C17.5311 18.9741 17.0515 18.9969 16.1767 18.9996M18.9996 9.82333C18.6332 10.2383 18.0971 10.5 17.5 10.5C16.3954 10.5 15.5 9.60457 15.5 8.5C15.5 7.90285 15.7617 7.36683 16.1767 7.00037M18.9996 9.82333C18.9969 8.94852 18.9741 8.46895 18.782 8.09202C18.5903 7.71569 18.2843 7.40973 17.908 7.21799C17.5311 7.02593 17.0515 7.00308 16.1767 7.00037M16.1767 7.00037C16.0586 7 15.9332 7 15.8 7H14M12 13C12 14.1046 11.1046 15 10 15C8.89543 15 8 14.1046 8 13C8 11.8954 8.89543 11 10 11C11.1046 11 12 11.8954 12 13Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[.8rem]  mt-1 transition-all duration-300 ${
                isActive("/financial/withdraw")
                  ? "text-white -translate-y-1"
                  : "text-zinc-500"
              }`}
            >
              {isActive("/financial/withdraw") && "Withdraw"}
            </span>
            {isActive("/financial/withdraw") && <ActiveIndicator />}
          </button>

          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className="flex flex-col items-center group relative"
          >
            <div
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isActive("/dashboard") ? "bg-primary" : ""
              }`}
            >
              <svg
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isActive("/dashboard")
                    ? "stroke-[#fff]"
                    : "stroke-[#71717A]"
                }
              >
                <path
                  d="M6 11.917C6 11.917 7.6 13.8289 10 13.8289C12.4 13.8289 14 11.917 14 11.917M1 11.5346V9.17347C1 8.07533 1 7.52626 1.14805 7.02061C1.2792 6.5727 1.49473 6.15142 1.78405 5.77747C2.11067 5.35531 2.56404 5.01821 3.47078 4.34402L6.07078 2.41083C7.47608 1.36594 8.17873 0.843492 8.95461 0.642665C9.63921 0.465466 10.3608 0.465466 11.0454 0.642665C11.8213 0.843491 12.5239 1.36594 13.9292 2.41083L16.5292 4.34402C17.436 5.01822 17.8893 5.35531 18.2159 5.77747C18.5053 6.15142 18.7208 6.5727 18.8519 7.02061C19 7.52626 19 8.07533 19 9.17347V11.5346C19 13.6762 19 14.747 18.564 15.5649C18.1805 16.2845 17.5686 16.8694 16.816 17.2361C15.9603 17.6528 14.8402 17.6528 12.6 17.6528H7.4C5.15979 17.6528 4.03969 17.6528 3.18404 17.2361C2.43139 16.8694 1.81947 16.2845 1.43597 15.5649C1 14.747 1 13.6762 1 11.5346Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[.8rem]  mt-1 transition-all duration-300 ${
                isActive("/dashboard")
                  ? "text-white -translate-y-1"
                  : "text-zinc-500"
              }`}
            >
              {isActive("/dashboard") && "Dashboard"}
            </span>
            {isActive("/dashboard") && <ActiveIndicator />}
          </Link>

          {/* T-wallet Link */}
          <Link
            href="/dashboard/t-wallet/action"
            className="flex flex-col items-center group relative"
          >
            <div
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isActive("/t-wallet") ? "bg-primary" : ""
              }`}
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isActive("/t-wallet")
                    ? "stroke-[#fff]"
                    : "stroke-[#71717A]"
                }
              >
                <path
                  d="M3.82333 8.6732C4.2383 9.02353 4.5 9.53595 4.5 10.1068C4.5 11.1628 3.60457 12.0188 2.5 12.0188C1.90285 12.0188 1.36683 11.7686 1.00037 11.3719M3.82333 8.6732C3.94144 8.67285 4.06676 8.67285 4.2 8.67285H15.8C15.9332 8.67285 16.0585 8.67285 16.1767 8.6732M3.82333 8.6732C2.94852 8.6758 2.46895 8.69764 2.09202 8.88124C1.71569 9.06455 1.40973 9.35704 1.21799 9.71679C1.02593 10.0771 1.00308 10.5356 1.00037 11.3719M1.00037 11.3719C1 11.4848 1 11.6046 1 11.732V17.0854C1 17.2128 1 17.3326 1.00037 17.4455M1.00037 17.4455C1.36683 17.0488 1.90285 16.7986 2.5 16.7986C3.60457 16.7986 4.5 17.6546 4.5 18.7106C4.5 19.2814 4.2383 19.7939 3.82333 20.1442M1.00037 17.4455C1.00308 18.2818 1.02593 18.7403 1.21799 19.1006C1.40973 19.4603 1.71569 19.7528 2.09202 19.9361C2.46895 20.1197 2.94852 20.1416 3.82333 20.1442M3.82333 20.1442C3.94144 20.1445 4.06676 20.1445 4.2 20.1445H15.8C15.9332 20.1445 16.0585 20.1445 16.1767 20.1442M19 17.4459C18.6335 17.049 18.0973 16.7986 17.5 16.7986C16.3954 16.7986 15.5 17.6546 15.5 18.7106C15.5 19.2814 15.7617 19.7939 16.1767 20.1442M19 17.4459C19.0004 17.3329 19 17.2129 19 17.0854V11.732C19 11.6046 19 11.4848 18.9996 11.3719M19 17.4459C18.9973 18.2819 18.974 18.7403 18.782 19.1006C18.5903 19.4603 18.2843 19.7528 17.908 19.9361C17.531 20.1197 17.0515 20.1416 16.1767 20.1442M18.9996 11.3719C18.6332 11.7686 18.0971 12.0188 17.5 12.0188C16.3954 12.0188 15.5 11.1628 15.5 10.1068C15.5 9.53595 15.7617 9.02353 16.1767 8.6732M18.9996 11.3719C18.9969 10.5356 18.9741 10.0771 18.782 9.71679C18.5903 9.35704 18.2843 9.06455 17.908 8.88124C17.531 8.69764 17.0515 8.6758 16.1767 8.6732M16.1767 8.6732C16.0586 8.67334 15.9332 8.67334 15.8 8.67334H14M12 14.4087C12 15.4646 11.1046 16.3206 9.99999 16.3206C8.89543 16.3206 8 15.4646 8 14.4087C8 13.3528 8.89543 12.4967 9.99999 12.4967C11.1046 12.4967 12 13.3528 12 14.4087Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[.8rem]  mt-1 transition-all duration-300 ${
                isActive("/t-wallet")
                  ? "text-white -translate-y-1"
                  : "text-zinc-500"
              }`}
            >
              {isActive("/t-wallet") && "Twallet"}
            </span>
            {isActive("/t-wallet") && <ActiveIndicator />}
          </Link>

          {/* Menu Button */}
          <button
            onClick={()=> setIsSidebarOpen(!isSidebarOpen)}
            className="flex flex-col items-center group relative"
          >
            <div
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isSidebarOpen ? "bg-primary" : ""
              }`}
            >
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={
                  isSidebarOpen
                    ? "stroke-[#fff]"
                    : "stroke-[#71717A]"
                }
              >
                <path
                  d="M1 2.37917C1 1.84377 1 1.57607 1.10899 1.37158C1.20487 1.1917 1.35785 1.04546 1.54601 0.953804C1.75992 0.849609 2.03995 0.849609 2.6 0.849609H5.4C5.96005 0.849609 6.24008 0.849609 6.45399 0.953804C6.64215 1.04546 6.79513 1.1917 6.89101 1.37158C7 1.57607 7 1.84377 7 2.37917V6.96785C7 7.50324 7 7.77094 6.89101 7.97543C6.79513 8.15531 6.64215 8.30156 6.45399 8.39321C6.24008 8.49741 5.96005 8.49741 5.4 8.49741H2.6C2.03995 8.49741 1.75992 8.49741 1.54601 8.39321C1.35785 8.30156 1.20487 8.15531 1.10899 7.97543C1 7.77094 1 7.50324 1 6.96785V2.37917Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 10.027C11 9.49157 11 9.22387 11.109 9.01938C11.2049 8.8395 11.3578 8.69325 11.546 8.6016C11.7599 8.49741 12.0399 8.49741 12.6 8.49741H15.4C15.9601 8.49741 16.2401 8.49741 16.454 8.6016C16.6422 8.69325 16.7951 8.8395 16.891 9.01938C17 9.22387 17 9.49157 17 10.027V14.6156C17 15.151 17 15.4187 16.891 15.6232C16.7951 15.8031 16.6422 15.9494 16.454 16.041C16.2401 16.1452 15.9601 16.1452 15.4 16.1452H12.6C12.0399 16.1452 11.7599 16.1452 11.546 16.041C11.3578 15.9494 11.2049 15.8031 11.109 15.6232C11 15.4187 11 15.151 11 14.6156V10.027Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 13.8509C1 13.3155 1 13.0478 1.10899 12.8433C1.20487 12.6634 1.35785 12.5172 1.54601 12.4255C1.75992 12.3213 2.03995 12.3213 2.6 12.3213H5.4C5.96005 12.3213 6.24008 12.3213 6.45399 12.4255C6.64215 12.5172 6.79513 12.6634 6.89101 12.8433C7 13.0478 7 13.3155 7 13.8509V14.6156C7 15.151 7 15.4187 6.89101 15.6232C6.79513 15.8031 6.64215 15.9494 6.45399 16.041C6.24008 16.1452 5.96005 16.1452 5.4 16.1452H2.6C2.03995 16.1452 1.75992 16.1452 1.54601 16.041C1.35785 15.9494 1.20487 15.8031 1.10899 15.6232C1 15.4187 1 15.151 1 14.6156V13.8509Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 2.37917C11 1.84377 11 1.57607 11.109 1.37158C11.2049 1.1917 11.3578 1.04546 11.546 0.953804C11.7599 0.849609 12.0399 0.849609 12.6 0.849609H15.4C15.9601 0.849609 16.2401 0.849609 16.454 0.953804C16.6422 1.04546 16.7951 1.1917 16.891 1.37158C17 1.57607 17 1.84377 17 2.37917V3.14395C17 3.67934 17 3.94704 16.891 4.15154C16.7951 4.33141 16.6422 4.47766 16.454 4.56931C16.2401 4.67351 15.9601 4.67351 15.4 4.67351H12.6C12.0399 4.67351 11.7599 4.67351 11.546 4.56931C11.3578 4.47766 11.2049 4.33141 11.109 4.15154C11 3.94704 11 3.67934 11 3.14395V2.37917Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={`text-[.8rem]  mt-1 transition-all duration-300 ${
                isSidebarOpen
                  ? "text-white -translate-y-1"
                  : "text-zinc-500"
              }`}
            >
              {isSidebarOpen && "Menu"}
            </span>
            {isSidebarOpen && <ActiveIndicator />}
          </button>
        </div>
      </div>
    </>
  );
}
