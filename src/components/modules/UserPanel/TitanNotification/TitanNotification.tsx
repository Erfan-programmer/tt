"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface TitanNotificationPropType {
  className?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  btn: string;
  btnStyle?: string;
  onClose?: () => void;
  btnLink?: string;
}

export default function TitanNotification({
  icon,
  children,
  btn,
  btnLink,
  btnStyle = "",
  onClose,
}: TitanNotificationPropType) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="notification-bg fixed inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`titan-notification-container rounded-xl w-[90%] md:w-[40%] bg-white shadow-lg`}
        >
          <div className="titan-notification-wrapper w-[90%] mx-auto p-4">
            <div className="flex justify-end items-center mb-3">
              <button
                onClick={handleClose}
                className="w-10 h-10 flex justify-center items-center bg-[#fff] text-white  rounded-full hover:bg-gray-100 transition-colors"
              >
                {icon}
              </button>
            </div>
            <div className="mb-4">
              <p className="text-lg text-center text-[var(--main-background)] dark:text-white">
                {children}
              </p>
            </div>
            <div className="flex justify-center items-center mt-[1rem]">
              <button
                className={`titan-btn px-6 py-2 bg-[#275EDF] ${btnStyle} text-[var(--main-background)] dark:text-white rounded-lg hover:bg-[#1c4bb0] transition-colors`}
                onClick={() => (btnLink ? router.push(btnLink) : handleClose())}
              >
                {btn}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}