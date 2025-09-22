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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useState, useEffect } from "react";
import SVGComponent from "../site_icon";
import { IoMdClose } from "react-icons/io";

import "./Header.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {FaUser } from "react-icons/fa";
import UserMenu, { menuItems } from "./MenuItem";

function Header() {
  const router = usePathname();
  const [isToggle, setIsToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined") {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 76);
    };

   

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }
}, []);

useEffect(() => {
  if (typeof document !== "undefined") {
    document.body.removeAttribute("cz-shortcut-listen");
  }
}, []);


  const isLoging = false;
  return (
    <nav
      className={`header-custom bg-transparent top-0  md:fixed left-0 opacity-1 mx-auto w-[100%] mx-auto sm:w-[100vw] border-gray-200 transition duration-150 ${
        isScrolled ? "relative md:fixed top-0 left-0 w-full" : "md:fixed"
      }`}
    >
      <div className="w-[95%] flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex w-full  gap-5 sm:gap-0 justify-between items-center">
          <SVGComponent isScrolled={isScrolled} />
          {router === "/options" ? null : (
            <>
              <motion.div
                initial={{ y: -100, width: "0" }}
                animate={{ y: 0, width: "auto " }}
                transition={{ duration: 1, ease: "easeOut", delay: 2.5 }}
                id="dropdownNavbar"
                className={` p-4 pt-0 sm:p-0  md:block md:w-auto ${
                  isToggle
                    ? "block absolute top-[100%] right-0 left-0"
                    : "hidden"
                }`}
              >
                <motion.ul
                  initial={{ width: "5rem" }}
                  animate={{ width: "" }}
                  transition={{ duration: 2, delay: 3.5, ease: "linear" }}
                  className={`font-medium flex flex-col mt-4 transition-all duration-2000 border navbar_ul rounded-lg  md:flex-row md:space-x-8  rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 md:relative ${
                    isScrolled && "scroll_ul"
                  }`}
                  style={{ transition: "all 1s" }}
                >
                  <li className="active">
                    <Link
                      href="/"
                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:px-3 md:py-2 dark:text-white md:dark:text-blue-500"
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
                    `${isLoging ? "Dashboard" : "Login"}`,
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
                    >
                      <Link
                        href={`/titan-algotrade#${item.toLowerCase()}`}
                        className={`block p-1 px-3 xm:px-1 text-gray-200 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:px-3 md:py-2 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 hover:text-white md:dark:hover:bg-transparent`}
                      >
                        {item}
                      </Link>
                    </motion.li>
                  ))}

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
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                      >
                        <FaUser style={{ marginRight: 8, color: "#fff" }} />
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

              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 2 }}
                className={`flex  header_right items-center gap-2  ${
                  isScrolled ? "justify-start" : "justify-end"
                }`}
              >
                <div
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
                  {isLoging ? (
                    <UserMenu />
                  ) : (
                    <button
                      className={`${isScrolled && "mr-2"} topBarBg py-2 px-8 md:px-5 text-[#222] font-semibold flex justify-center items-center gap-2 transition-all duration-1000 `}
                    >
                      <span>Register</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsToggle((prev) => !prev)}
                  id="dropdownNavbarLink"
                  type="button"
                  className="inline-flex items-center bg-[#212335] p-3 px-4 rounded-[1rem] w-15 h-15 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
  );
}

export default Header;
