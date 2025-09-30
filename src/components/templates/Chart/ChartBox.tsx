"use client";
import React from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/modules/AnimatedCounter/AnimatedCounter";
import BusinessChart from "@/components/modules/Chart/Chart";
import "./Chart.css";

function ChartBox() {
  return (
    <div id="Performance" className="titan-chart-container w-full lg:w-1/2">
      <div className="titan-chart-wrapper w-full lg:w-7/10">
        <motion.h3
          viewport={{ once: true }}
          initial={{ opacity: 0, filter: "blur(2px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-2xl lg:text-4xl text-white font-semibold mb-2"
        >
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Investment {" "}
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Returns from {" "} <br />
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            2021 to 2023
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(2px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.56 }}
            className="text-[#888] text-[1.1rem]"
          >
            {"  "}
            ( Based on a $10,000 Investment)
          </motion.span>
        </motion.h3>

        <motion.p
          viewport={{ once: true }}
          initial={{ opacity: 0, y: "10px" }}
          whileInView={{ opacity: 1, y: "0" }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-[#888] text-sm lg:text-lg"
        >
          The timing of the investment can affect the percentage of profit and loss. For this reason, in this comparative chart, we have considered the criteria from the beginning of 2021 to the end of 2023.
        </motion.p>
      </div>

      <div className="titan-chart-info-boxes mt-5 p-0 sm:pl-5">
        <div className="lg:hidden">
          <BusinessChart queryCondition="mobile" />
        </div>

        <div className="flex justify-center lg:justify-start items-end gap-2 w-full">
          <motion.svg
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.9 }}
            width="58"
            height="82"
            className="hidden lg:block"
            viewBox="0 0 58 82"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.71272 1C-14.8923 46.5 38.7738 49.5 38.2675 25C37.7612 0.5 -12.3609 73.2547 57 73.2547M57 73.2547L46.8857 64.9967M57 73.2547L47.5137 81"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "draw 1s forwards" }}
            />
          </motion.svg>

          <motion.p
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-[0.8rem] text-[#888] mt-8 sm:mt-0  md:ml-0 md:mr-2 lg:ml-12"
          >
            Investing after 2 Years
          </motion.p>
        </div>

        <div className="box-graph-bio flex justify-center lg:justify-start items-center mt-5 gap-16">
          {/* First Graph */}
          <div className="first-graph flex flex-col items-center relative right-[3.4rem]">
            <motion.svg
              viewport={{ once: true }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="first-graph-svg"
              transition={{ duration: 1, delay: 1.3 }}
              width="114"
              height="98"
              viewBox="0 0 114 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 97V73C1 59.7452 11.7452 49 25 49L89 49C102.255 49 113 38.2548 113 25L113 1"
                stroke="url(#paint0_linear_1_695)"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1_695"
                  x1="95.3099"
                  y1="1"
                  x2="95.3099"
                  y2="97"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A5E6E" />
                  <stop offset="1" stopColor="#080A1D" />
                </linearGradient>
              </defs>
            </motion.svg>

            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, scaleY: 0.2 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="chartbox-chart flex flex-col gap-1"
            >
              <motion.p
                viewport={{ once: true }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.6 }}
                className="text-[#1A68FF]"
              >
                TITAN
              </motion.p>

              <div className="flex justify-center items-center w-full sm:w-auto gap-2  text-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.6 }}
                  className="text-white"
                >
                  <AnimatedCounter from={0} to={250} />%
                </motion.span>
              </div>
            </motion.div>
          </div>

          {/* Second Graph */}
          <div className="second-graph flex flex-col items-center relative left-[3.4rem] relative">
            <motion.svg
              viewport={{ once: true }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="second-graph-svg"
              width="114"
              height="98"
              viewBox="0 0 114 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M113 97V73C113 59.7452 102.255 49 89 49L25 49C11.7452 49 1 38.2548 1 25L1 1"
                stroke="url(#paint0_linear_1_696)"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1_696"
                  x1="18.6901"
                  y1="1"
                  x2="18.6901"
                  y2="97"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#0A5E6E" />
                  <stop offset="1" stopColor="#080A1D" />
                </linearGradient>
              </defs>
            </motion.svg>

            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, scaleY: 0.2 }}
              whileInView={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 1, delay: 2 }}
              className="chartbox-chart investment_box flex flex-col gap-1"
            >
              <motion.p
                viewport={{ once: true }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.6 }}
                className="text-[#F2C94C]"
              >
                Bitcoin
              </motion.p>

              <div className="flex justify-center items-center w-full sm:w-auto gap-2  text-xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <motion.span
                  viewport={{ once: true }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.6 }}
                  className="text-white"
                >
                  <AnimatedCounter from={0} to={101} />%
                </motion.span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartBox;
