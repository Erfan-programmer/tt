"use client";
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "@/styles/layout/FormLayout.css";
import Stars from "@/Svgs/Star";
import "locomotive-scroll/dist/locomotive-scroll.css";
import localFont from "next/font/local";
import Image from "next/image";
import { ThemeProvider } from "next-themes";

interface FormLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
}

const datas: Record<string, { title: string }> = {
  login: {
    title: "Welcome back! Please login to your Titan Investments account.",
  },
  register: {
    title:
      "The future starts here! Join Titan Investments and embark on an investment journey that turns your dreams into reality.",
  },
  "forgot-password": {
    title: "Forgot your password? Let’s reset it safely.",
  },
  "reset-password": {
    title: "Reset your password securely.",
  },
  "reset-2-fa": {
    title: "Reset your 2FA settings.",
  },
  "reset-2-fa-confirm": {
    title: "Confirm your 2FA reset.",
  },
};
const geistClash = localFont({
  src: [
    // { path: "./../fonts/ClashDisplay-Bold.otf" },
    { path: "./../fonts/ClashDisplay-Light.otf" },
    { path: "./../fonts/ClashDisplay-Medium.otf" },
    { path: "./../fonts/ClashDisplay-Semibold.otf" },
    { path: "./../fonts/ClashDisplay-Extralight.otf" },
    { path: "./../fonts/ClashDisplay-Regular.otf" },
  ],
  variable: "--font-clash",
  weight: "100 900",
});
const geistJakarta = localFont({
  src: [
    { path: "./../fonts/PlusJakartaSans-Medium.ttf" },
    { path: "./../fonts/PlusJakartaSans-Light.ttf" },
    { path: "./../fonts/PlusJakartaSans-Bold.ttf" },
    { path: "./../fonts/PlusJakartaSans-SemiBold.ttf" },
  ],
  variable: "--font-jakarta",
  weight: "100 900",
});

export default function FormLayout({ children, subtitle }: FormLayoutProps) {
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (!pathname) return null;

  const pathKey = pathname.replace(/^\//, "");
  const title = datas[pathKey]?.title || "";
  return (
    <html>
      <body
        className={`${geistJakarta.variable} ${geistClash.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="theme"
          enableSystem={true}
        >
          <div className="min-h-screen relative form-layout-container bg-gradient-to-b from-white to-gray-200 dark:from-[#080A1D] dark:to-[#1b2972]">
            <div className="w-full flex items-start justify-center flex-col sm:flex-row gap-8">
              <div className=" sm:h-screen hidden sm:flex items-center justify-center pl-[1rem] w-full sm:w-[48%]">
                <div
                  className={`formLayout-left-side-wrppaer fixed sm:w-[50%] xl:w-[48%] bg-[#090d23] border-2 border-[#585966] rounded-[2rem] sm:h-[90vh] w-[100%] ${
                    pathKey === "login" || pathKey === "register"
                      ? "px-[1rem] pt-[2rem]"
                      : ""
                  }`}
                >
                  <Stars />
                  {pathKey !== "forgot-password" &&
                    pathKey !== "reset-password" &&
                    pathKey !== "reset-2-fa" &&
                    pathKey !== "reset-2-fa-confirm" && (
                      <>
                        <motion.div
                          className="flex relative z-10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7 }}
                        >
                          <Image
                            width={800}
                            className="w-auto"
                            height={800}
                            src={`${
                              pathKey === "forgot-password" ||
                              pathKey === "reset-password"
                                ? "/3c3fa8f9fb03e29bb146ad7.png"
                                : "/titan-main-avatar.png"
                            }  `}
                            alt="Titan Avatar"
                          />
                        </motion.div>
                        <motion.div
                          className="formLayout-left-side-title mt-[2rem] relative z-10 hidden sm:block"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                        >
                          <h1 className="w-[90%] md:w-[80%] lg:w-[85%]">
                            {title}
                          </h1>
                          {subtitle && (
                            <p className="text-white text-[1.4rem] font-[400]">
                              {subtitle}
                            </p>
                          )}
                        </motion.div>
                      </>
                    )}
                  {(pathKey === "forgot-password" ||
                    pathKey === "reset-password") && (
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 50, opacity: 1 }}
                      transition={{ duration: 1.8, delay: 1 }}
                      className={`form-layout-titan-img ${
                        pathKey === "reset-password"
                          ? "reset-password-titan-img"
                          : ""
                      }`}
                    ></motion.div>
                  )}
                  {pathKey === "forgot-password" ? (
                    <motion.div
                      className="form-layout-forgot-bg w-full relative bottom-0"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex forgot-password-img-wrapper justify-center gap-4 px-[2rem] absolute bottom-[2rem]">
                        <motion.img
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1,
                          }}
                          src="/947ab9bac45b92e4228aad24fa218214745e8e37.png"
                          className="w-[6rem]"
                          alt="Titan Investments"
                        />
                        <motion.p
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1.3,
                          }}
                          className="text-[var(--main-background)] dark:text-white text-[1.8rem] font-[600]"
                        >
                          We Always by your side, empowering your journey every
                          step of the way
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : pathKey === "reset-2-fa" ? (
                    <motion.div
                      className="form-layout-reset-2fa-bg w-full relative bottom-0"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex reset-password-img-wrapper justify-center gap-4 px-[2rem] absolute top-[2rem]">
                        <motion.img
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1,
                          }}
                          src="/947ab9bac45b92e4228aad24fa218214745e8e37.png"
                          className="w-[10rem]"
                          alt="Titan Investments"
                        />
                      </div>
                    </motion.div>
                  ) : pathKey === "reset-2-fa-confirm" ? (
                    <motion.div
                      className="form-layout-reset-2fa-confirm-bg w-full relative bottom-0"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex reset-password-img-wrapper justify-center gap-4 px-[2rem] absolute top-[2rem]">
                        <motion.img
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1,
                          }}
                          src="/947ab9bac45b92e4228aad24fa218214745e8e37.png"
                          className="w-[10rem]"
                          alt="Titan Investments"
                        />
                      </div>
                    </motion.div>
                  ) : pathKey === "reset-password" ? (
                    <motion.div
                      className="form-layout-reset-bg w-full relative bottom-0"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <div className="flex reset-password-img-wrapper justify-center gap-4 px-[2rem] absolute top-[2rem]">
                        <motion.img
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1,
                          }}
                          src="/947ab9bac45b92e4228aad24fa218214745e8e37.png"
                          className="w-[6rem]"
                          alt="Titan Investments"
                        />
                        <motion.p
                          initial={{ y: 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{
                            duration: 0.6,
                            ease: "easeOut",
                            delay: 1.3,
                          }}
                          className="text-[var(--main-background)] dark:text-white text-[1.8rem] font-[600]"
                        >
                          We Always by your side, empowering your journey every
                          step of the way
                        </motion.p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="form-layout-bg w-full absolute bottom-0"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  )}
                </div>
              </div>

              <div
                className="h-[100vh] sm:h-[90vh] overflow-y-auto w-[100%] sm:w-[48%] sm:px-4 mx-auto sm:border sm:border-white/30 
                 sm:mt-10 sm:py-6 pb-6 sm:rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-xl shadow-lg"
              >
                {children}
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
