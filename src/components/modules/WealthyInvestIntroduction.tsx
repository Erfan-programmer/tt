"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWealthy } from "@/contextApi/PieContext";

export default function WealthyInvestIntroduction() {
  const {activeIndex} = useWealthy()
  const items = [
    "How do they build portfolios that grow steadily while managing risk?",
    "Maybe it’s time to start thinking like them.",
    "TITAN INVESTMENTS is exactly the kind of smart, strategic piece your portfolio needs",
    "Not everything, but a serious part of the big picture.",
  ];

  const portfolioList = [
    "25% Real Estate",
    "15% Crypto",
    "25% Stocks",
    "10% Cash & Liquidity",
    "15% Gold & Precious Metals",
    "20% TITAN INVESTMENTS",
    "This isn’t a one-size-fits-all solution, but it’s a smart starting point for building long-term wealth.",
  ];

  const motionProps = (i: number) => ({
    initial: { opacity: 0, x: 50, filter: "blur(2px)" },
    whileInView: { opacity: 1, x: 0, filter: "blur(0px)" },
    transition: { duration: 0.6, delay: i * 0.2 },
    viewport: { once: true },
  });



  return (
    <div className="wealthy-investment-bio px-4 sm:px-6 lg:px-20 py-10">
      <motion.h2
        initial={{ opacity: 0, y: -20, filter: "blur(2px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: items.length * 0.2 }}
        viewport={{ once: true }}
        className="text-gray-400 text-2xl sm:text-3xl font-semibold"
      >
        Ever wondered how the{" "}
        <span className="text-white !font-clash">wealthy invest?</span>
      </motion.h2>


      <div className="mt-6 sm:mt-8 flex flex-col gap-2 sm:gap-3">
        {items.map((text, i) => (
          <motion.span
            key={i}
            className="text-gray-400 text-sm sm:text-base"
            {...motionProps(i)}
          >
            {text.includes("TITAN INVESTMENTS") ? (
              <>
                <span className="text-white">TITAN INVESTMENTS </span>
                {text.replace("TITAN INVESTMENTS ", "")}
              </>
            ) : (
              text
            )}
          </motion.span>
        ))}
      </div>

      <div className="mt-6 sm:mt-10">
        <motion.span
          initial={{ opacity: 0, y: -20, x: -50, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: items.length * 0.2 }}
          className="text-gray-400 text-sm sm:text-base"
        >
          Here’s an example of what a balanced, diversified portfolio might look
          like:
        </motion.span>

        <ul className="mt-2 sm:mt-4 text-gray-400 text-sm sm:text-base list-disc list-inside space-y-1 sm:space-y-2 font-jakarta">
          {portfolioList.map((text, i) => (
            <motion.li
              key={i}
              className={activeIndex === i ? "text-white" : "text-gray-400"}
              initial={{ opacity: 0, y: 20, x: 50, filter: "blur(2px)" }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: (items.length + 1 + i) * 0.2,
              }}
            >
              {text}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}