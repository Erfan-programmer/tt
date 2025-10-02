"use client";
import React, { useState, useEffect } from "react";
import "@/styles/p-admin/TimerTournoment.css";
import { motion, AnimatePresence } from "framer-motion";

interface IRemainingTime {
  days: number | string;
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
}

interface ITimerProps {
  countdownTimestampMs: number;
}

const getRemainingTime = (timestamp: number): IRemainingTime => {
  const totalSeconds = (timestamp - Date.now()) / 1000;
  if (totalSeconds < 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));

  const formatNumber = (num: number): string =>
    num < 10 ? `0${num}` : `${num}`;

  return {
    days: formatNumber(days),
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

const defaultRemainingTime: IRemainingTime = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

const useCountdown = (countdownTimestampMs: number): IRemainingTime => {
  const [remainingTime, setRemainingTime] =
    useState<IRemainingTime>(defaultRemainingTime);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRemainingTime(getRemainingTime(countdownTimestampMs));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [countdownTimestampMs]);

  return remainingTime;
};

const AnimatedNumber = ({
  number,
  label,
}: {
  number: number | string;
  label: string;
}) => {
  return (
    <div
      className="flex flex-col items-center mx-2 md:mx-4 relative overflow-hidden min-w-[70px] xl:w-[4rem]"
      style={{ height: "80px" }}
    >
      <AnimatePresence>
        <motion.div
          key={number}
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex justify-center items-center text-[1.4rem] md:text-[1.7rem] xl:text-4xl md:text-5xl font-bold mb-2"
        >
          {number}
        </motion.div>
      </AnimatePresence>
      <span className="text-[.8rem] sm:text-md uppercase text-[#888] mt-1 md:mt-1.5 absolute -bottom-0">
        {label}
      </span>
    </div>
  );
};

const TimerTournoment = ({
  countdownTimestampMs,
}: ITimerProps): JSX.Element => {
  const { days, hours, minutes, seconds } = useCountdown(countdownTimestampMs);

  return (
    <>
      <div className="timer-tournoment-title mb-6">
        <h2 className="text-lg md:text-xl  font-bold text-gray-900 dark:text-white">
          Team Builders Tournament
        </h2>
      </div>
      <div
        className="
          flex flex-wrap sm:flex-nowrap
          mb-4 justify-center items-center
          w-full sm:w-fit mx-auto p-5 rounded-lg shadow-xl 
          relative 
          bg-white dark:bg-[#202020] 
          bg-gradient-to-t dark:from-[#202020] dark:to-[#000] 
          text-gray-900 dark:text-white
        "
      >
        <AnimatedNumber number={days} label="Days" />
        <span className="hidden sm:block text-4xl md:text-5xl font-light text-gray-500 dark:text-[#555] mx-2">
          |
        </span>
        <AnimatedNumber number={hours} label="Hours" />
        <span className="hidden sm:block text-4xl md:text-5xl font-light text-gray-500 dark:text-[#555] mx-2">
          |
        </span>
        <AnimatedNumber number={minutes} label="Min" />
        <span className="hidden sm:block text-4xl md:text-5xl font-light text-gray-500 dark:text-[#555] mx-2">
          |
        </span>
        <AnimatedNumber number={seconds} label="Sec" />
      </div>
    </>
  );
};

export default TimerTournoment;
