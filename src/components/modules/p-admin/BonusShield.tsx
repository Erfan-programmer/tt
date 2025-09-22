"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BonusShield() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div className="titan-bonus-shield relative px-4 py-2 text-white my-8 border-[2px] border-[#383C47] rounded-lg bg-gradient-to-r from-[#090D23] via-[#090D23] via-55% to-[#1651C6]">
      {/* AnimatePresence for enter/exit animations */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="hint absolute z-50 w-[95%] h-fit sm:h-[80%] p-2 sm:p-6  rounded-lg backdrop-blur-md bg-gray/20 "
          >
            <button
              onClick={() => setShowHint(false)}
              className="absolute top-2 right-4 text-white text-3xl leading-none"
            >
              &times;
            </button>
            <div className="hint-title text-white sm:text-[#FFB300] sm:text-2xl font-bold">
              <p>Why Did You Receive This Bonus?</p>
            </div>
            <div className="hint-description text-[#D1D1D1] sm:text-[#FFB300] mt-4">
              <span>
                Your account qualified for the TITAN Bonus Shield after two
                consecutive months without returns. We’ve credited a temporary
                20% bonus to support your recovery. This bonus is virtual and
                will not be included in final withdrawal unless the contract is
                renewed.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="titan-bonus-shield-title relative z-[2] flex justify-between items-center ">
        <h4 className="font-bold text-bold flex items-center gap-2">
          <svg
            onClick={() => setShowHint(true)}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            className="sm:hidden"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 6.93191C10.5 6.80789 9.68508 6.80333 9 6.80789M9 6.80789C8.77091 6.80942 8.90941 6.79968 8.6 6.80789C7.79258 6.83308 7.00165 7.16866 7 8.11941C6.99825 9.13224 8 9.43191 9 9.43191C10 9.43191 11 9.66311 11 10.7444C11 11.557 10.1925 11.9131 9.1861 12.031C8.3861 12.031 8 12.0569 7 11.9319M9 6.80789L9 5.432M9 12.0314V13.432M17 9.932C17 14.3931 11.54 17.6257 9.64142 18.615C9.43607 18.722 9.33339 18.7755 9.19095 18.8032C9.08 18.8248 8.92 18.8248 8.80905 18.8032C8.66661 18.7755 8.56393 18.722 8.35858 18.615C6.45996 17.6257 1 14.3931 1 9.932V6.1496C1 5.35009 1 4.95033 1.13076 4.6067C1.24627 4.30314 1.43398 4.03228 1.67766 3.81753C1.9535 3.57444 2.3278 3.43408 3.0764 3.15335L8.4382 1.14267C8.6461 1.06471 8.75005 1.02573 8.85698 1.01028C8.95184 0.996573 9.04816 0.996573 9.14302 1.01028C9.24995 1.02573 9.3539 1.06471 9.5618 1.14267L14.9236 3.15335C15.6722 3.43408 16.0465 3.57444 16.3223 3.81753C16.566 4.03228 16.7537 4.30314 16.8692 4.6067C17 4.95033 17 5.35009 17 6.1496V9.932Z"
              stroke="#D9D9D9"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>TITAN Bonus Shield</span>
          <svg
            onClick={() => setShowHint(true)}
            className="hidden sm:block"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 6H10.01M10 9V14M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h4>
        <div className="text-[#65FFD9] flex sm:hidden items-center gap-2">
          Active{" "}
          <div className="w-[6px] h-[6px] mt-1 rounded-full bg-[#65FFD9]"></div>
        </div>
      </div>
      <div className="titan-bonus-shield-description text-center relative z-[2] my-6 sm:my-2">
        <p className="text-white">
          <span className="text-3xl sm:text-5xl font-bold">+20%</span>
          <span> Bonus Activated</span>
          <p>Based Your Investment of $10,000</p>
        </p>
        <div className="now-tranding-with mt-6">
          <p>Now Trading with: $12,000</p>
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-[2]">
        <span>Status:</span>
        <div className="text-[#65FFD9] sm:flex items-center gap-2 hidden">
          Active{" "}
          <div className="w-[6px] h-[6px] mt-1 rounded-full bg-[#65FFD9]"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-[2]">
        <span>Since:</span>
        <span className="text-sm"> May 2025</span>
      </div>
      <div className="absolute right-0 bottom-0 opacity-40">
        <Image
          src="/titan-bonus-shield.png"
          alt=""
          className="sm:w-[25vw]"
          width={1500}
          height={1500}
        />
      </div>
      <div className="absolute right-4 bottom-4 hidden sm:block">
        <Image
          src="/titan-main-avatar.png.png"
          alt=""
          className="w-32"
          width={1500}
          height={1500}
        />
      </div>
    </div>
  );
}
