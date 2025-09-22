"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState, useEffect } from "react";
import SVGComponent from "../site_icon";
import { IoMdClose } from "react-icons/io";
import "./Header.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserMenu, { menuItems } from "./MenuItem";
import TitanModal from "@/components/Ui/Modals/TitanModal";
import TitanModalField from "@/components/Ui/Modals/TitanModalField";
import { useForm, FormProvider } from "react-hook-form";
import MobileSidebar from "./MobileSidebar";
import CustomModal from "../CustomModal";

interface FormModalState {
  newInvestment: boolean;
  claimProfit: boolean;
}

function HeaderTest() {
  const pathname = usePathname();
  const [isToggle, setIsToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 76);
      }
    };

    const handleResize = () => {
      if (typeof window !== "undefined") {
        const mobile = window.innerWidth < 1024;
        setIsMobileView(mobile);
        if (mobile) setIsToggle(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);

      handleResize();
      handleScroll();
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    document.body.removeAttribute("cz-shortcut-listen");
  }, []);

  const [formModal, setFormModal] = useState<FormModalState>({
    newInvestment: false,
    claimProfit: false,
  });
  const methods = useForm({ mode: "onChange" });
  const router = useRouter();
  const [user, setUser] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedUser = localStorage.getItem("user");
    console.log("saved User >=", user)
    if (savedUser && savedUser !== "undefined") setUser(true);
  }, []);

  const handleMenuItemClick = (item: string) => {
    if (item.toLowerCase() === "withdraw") {
      setFormModal((prev) => ({
        ...prev,
        claimProfit: !formModal.claimProfit,
      }));
    } else {
      router.push(`/titan-algotrade#${item.toLowerCase()}`);
    }
    setIsToggle(false);
  };

  const menuItemsList = [
    "Services",
    "Blog",
    "About",
    "FAQs",
    ...(!user ? ["Login"] : []),
  ];

  return (
    <>
      <nav
        className={`header-custom bg-transparent top-0  md:fixed left-0 opacity-100 mx-auto w-[100%] mx-auto sm:w-[100vw] border-gray-200 transition duration-150 ${
          isScrolled ? "relative md:fixed top-0 left-0 w-full" : "md:fixed"
        }`}
      >
        <div className="w-[95%] flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex w-full  gap-5 sm:gap-0 justify-between items-center">
            <SVGComponent isScrolled={isScrolled} />
            {pathname === "/" ? null : (
              <>
                {!isToggle && (
                  <motion.div
                    initial={{ y: -100, width: "0" }}
                    animate={{ y: 0, width: "auto " }}
                    transition={{ duration: 1, ease: "easeOut", delay: 2.5 }}
                    id="dropdownNavbar"
                    className={` p-4 pt-0 sm:p-0  lg:block md:w-full ${
                      isToggle
                        ? "block absolute top-[100%] right-0 left-0"
                        : "hidden"
                    }`}
                  >
                    <motion.ul
                      initial={{ width: "5rem" }}
                      animate={{ width: "" }}
                      transition={{ duration: 2, delay: 3.5, ease: "linear" }}
                      className={`font-medium flex flex-col mt-4 transition-all duration-2000 border navbar_ul rounded-lg  dark:bg-[#222335] bg-[#222335] md:flex-row md:space-x-8  rtl:space-x-reverse md:mt-0 md:border-0  dark:border-gray-700 ${
                        isScrolled ? "" : "w-full sm:w-[calc(100%-100px)]"
                      }`}
                      style={{ transition: "all 1s" }}
                    >
                      <li className="active">
                        <Link
                          href="/"
                          className="block py-2 px-3 text-white rounded bg-[#363848] md:px-3 md:py-2"
                          aria-current="page"
                        >
                          <motion.span
                            className="p-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: 1,
                              delay: 3.8,
                              ease: "easeOut",
                            }}
                          >
                            Home
                          </motion.span>
                        </Link>
                      </li>

                      {[
                        "Services",
                        "Blog",
                        "About",
                        "FAQs",
                        ...(user ? [] : ["Login"]),
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 1,
                            delay: 4,
                            ease: "easeOut",
                          }}
                          onClick={() =>
                            item.toLowerCase() === "withdraw" &&
                            setFormModal((prev) => ({
                              ...prev,
                              claimProfit: !formModal.claimProfit,
                            }))
                          }
                        >
                          <Link
                            href={item.toLowerCase() === "login" ? "/login" : `/titan-algotrade#${item.toLowerCase()}`}
                            className={`block p-1 px-3 xm:px-1 text-gray-200 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:px-3 md:py-2  md:hover:text-blue-500  dark:hover:text-white md:dark:hover:bg-transparent`}
                          >
                            {item}
                          </Link>
                        </motion.li>
                      ))}

                      <div
                        className={`flex justify-center items-center gap-2  relative ${
                          isScrolled
                            ? ""
                            : "translate-x-[20px] sm:translate-x-[40px] md:translate-x-[60px] 2xl:translate-x-[15vw]"
                        }`}
                        style={{ transition: "all .6s" }}
                      >
                        <div
                          className={`border-l-2 h-5 border-[#555] w-1 ${
                            isScrolled ? "hidden xl:block" : "hidden"
                          } `}
                        ></div>
                        {user ? (
                          <UserMenu />
                        ) : (
                          <button
                            className={`${
                              isScrolled && "mr-2"
                            } topBarBg py-2 px-8 md:px-5 text-[#222] font-semibold flex justify-center items-center gap-2 transition-all duration-1000 `}
                            onClick={() => {
                              // setFormModal((prev) => ({
                              //   ...prev,
                              //   newInvestment: !formModal.newInvestment,
                              // }));
                              // setIsOpen(true);
                              router.push("/register");
                            }}
                          >
                            <span>Register</span>
                          </button>
                        )}
                      </div>

                      <ul className="block sm:hidden">
                        <Accordion
                          sx={{
                            bgcolor: "#363848",
                            borderRadius: "8px",
                            boxShadow: 1,
                            color: "#fff",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "#fff" }} />
                            }
                          >
                            <span>Dashboard</span>
                            <Typography fontWeight="bold" color="#fff">
                              Account
                            </Typography>
                          </AccordionSummary>

                          <AccordionDetails sx={{ p: 0 }}>
                            <List>
                              {menuItems.map((item) => (
                                <Link key={item.label} href={item.href}>
                                  <ListItemButton sx={{ color: "#fff" }}>
                                    <ListItemIcon sx={{ color: "#fff" }}>
                                      {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                  </ListItemButton>
                                </Link>
                              ))}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      </ul>
                    </motion.ul>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut", delay: 2 }}
                  className={`flex  header_right items-center gap-2  ${
                    isScrolled ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* <div
                    className={`flex justify-center items-center gap-2 ${
                      isScrolled && "scrollBtn "
                    }`}
                    style={{ transition: "all .6s" }}
                  >
                    <div
                      className={`border-l-2 h-5 border-[#555] w-1 ${
                        isScrolled ? "hidden md:block" : "hidden"
                      } `}
                    ></div>
                    {user ? (
                      <UserMenu />
                    ) : (
                      <button

                        className={`${
                          isScrolled && "mr-2"
                        } topBarBg py-2 px-8 md:px-5 text-[#222] font-semibold flex justify-center items-center gap-2 transition-all duration-1000 `}
                        onClick={() => {
                          setFormModal((prev) => ({
                            ...prev,
                            newInvestment: !formModal.newInvestment,
                          }));
                          // router.push("/register")
                        }}
                      >
                        <span>Register</span>
                      </button>
                    )}
                  </div> */}

                  <button
                    onClick={() => setIsToggle((prev) => !prev)}
                    id="dropdownNavbarLink"
                    type="button"
                    className="inline-flex items-center bg-[#212335] p-3 px-4 rounded-[1rem] w-15 h-15 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    aria-controls="dropdownNavbar"
                    aria-expanded={isToggle ? "true" : "false"}
                  >
                    <span className="sr-only">Open main menu</span>
                    {!isToggle ? (
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 17 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 1h15M1 7h15M1 13h15"
                        />
                      </svg>
                    ) : (
                      <IoMdClose className="w-5 h-5" />
                    )}
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMobileView && (
        <MobileSidebar
          isSidebarOpen={isToggle}
          toggleSidebar={() => setIsToggle((prev) => !prev)}
          menuItemsList={menuItemsList}
          handleMenuItemClick={handleMenuItemClick}
          isScrolled={isScrolled}
          user={user}
          router={router}
        />
      )}

      {/* Modals */}
      {formModal.newInvestment ? (
        <FormProvider {...methods}>
          <TitanModal
            onClose={() =>
              setFormModal((prev) => ({
                ...prev,
                newInvestment: false,
              }))
            }
            title={`New Investments Paused`}
            description="Our investment dashboard is currently under development. At this time, we are unable to offer new investment opportunities or provide access to the investment dashboard for new users. Please enter your email address below, and we will notify you as soon as it becomes available."
          >
            <>
              <TitanModalField
                name="name"
                label="Name (Optional)"
                placeholder="Enter your name"
                type="text"
                // Pass the validation rules as an object to the 'validation' prop
                validation={{
                  minLength: {
                    value: 1,
                    message: "Invalid name format",
                  },
                }}
              />
              <TitanModalField
                name="email"
                label="Email"
                placeholder="Enter your email address"
                type="email"
                // Pass the regex as a pattern within the 'validation' object
                validation={{
                  required: "Email is required", // You can also use a string for simple messages
                  pattern: {
                    value: /^[^\s@]+@gmail\.com$/,
                    message: "Please enter a valid email",
                  },
                }}
              />
            </>
          </TitanModal>
        </FormProvider>
      ) : (
        formModal.claimProfit && (
          <FormProvider {...methods}>
            <TitanModal
              onClose={() =>
                setFormModal((prev) => ({
                  ...prev,
                  claimProfit: false,
                }))
              }
              title={`<img src="/images/tether.png" /><span>Claim Your Profit</span>`}
              description={`Please enter the <span class="text-white font-bold">Email address</span> you used to register with Titan and your <span class="!text-white !font-bold">TRC20 USDT</span> wallet address carefully, so our finance team can process your profit payouts. Make sure all the information you provide is accurate.`}
            >
              <>
                <TitanModalField
                  name="name"
                  label="name (optional)"
                  placeholder="Enter your name"
                  type="text"
                  validation={{
                    required: false,
                  }}
                />
                <TitanModalField
                  name="email"
                  label="Email"
                  placeholder="Enter your email address"
                  type="email"
                  validation={{
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@gmail\.com$/,
                      message: "Please enter a valid email.",
                    },
                  }}
                />
                <TitanModalField
                  name="wallet"
                  label="USDT-TRC20 Wallet Address:"
                  placeholder="Enter your USDT wallet address (TRC20 network)"
                  type="text"
                  validation={{
                    required: "Wallet address is required.",
                    pattern: {
                      value: /\d/,
                      message: "Invalid wallet address format.",
                    },
                  }}
                />
              </>
            </TitanModal>
          </FormProvider>
        )
      )}

      <div>
        <CustomModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registration Notice"
        >
          <p>
            Registration will be available soon. The website is still under
            development.
          </p>
        </CustomModal>
      </div>
    </>
  );
}

export default HeaderTest;
