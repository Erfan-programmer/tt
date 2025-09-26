"use client";
import AccordionQuestion from "@/components/modules/AccordionQuestion/AccordionQuestion";
import { accordionInfo } from "@/data/data";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "./UserQuestions.css";

function UserQuestions() {
  return (
    <div
      id="faqs"
      className="w-[90%] mx-auto mb-[12rem] sm:mb-0 mt-20 lg:mt-[10rem] h-auto"
    >
      <div className="question-wrapper flex flex-col sm:flex-row justify-center items-start">
        <div className="question-left flex-1">
          <div className="question-title text-[#888] mt-5">
            <h4 className="text-2xl sm:text-4xl text-white sm:text-[#888] text-center sm:text-left w-full sm:w-[70%]">
              <motion.span
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1 }}
              >
                Get
              </motion.span>{" "}
              <motion.span
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-[#383C47] dark:text-white"
              >
                {" "}
                all your Questions{" "}
              </motion.span>
              <motion.span
                viewport={{ once: true }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.3, delay: 0.7 }}
              >
                answered here!
              </motion.span>
            </h4>
            <motion.p
              viewport={{ once: true }}
              initial={{ opacity: 0, y: "10px" }}
              whileInView={{ opacity: 1, y: "0px" }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-[2rem] sm:mt-5 w-[90%] mx-auto sm:mx-0"
            >
              Got questions about forex trading? Our FAQs section has the
              answers! From account types to risk management tips, we&apos;ve
              got you covered. Check it out and start learning how to make the
              most of your investments.
            </motion.p>
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, filter: "blur(10px)", y: "20px" }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: "0" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden sm:block question-bio-button flex justify-start items-center w-full mt-5"
            >
              <Link
                href="/faqs"
                className="bg-white sm:w-[10rem] question-bio-button flex justify-center gap-2 items-center p-2 rounded-[1rem]"
              >
                <span className="ml-5 text-sm text-[#000]">Show All</span>
                <FaArrowRight className="text-[#1A68FF] mr-5" />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="questions-accordion flex-1">
          {accordionInfo.map((info, index) => (
            <AccordionQuestion key={info.id} info={info} index={index} />
          ))}
          <motion.div
            initial={{
              transform: "translateX(100px)",
              opacity: 0,
              filter: "blur(10px)",
            }}
            whileInView={{
              transform: "translateX(0)",
              opacity: 1,
              filter: "blur(0)",
            }}
            viewport={{ once: true }}
            transition={{ duration: 3, delay: 0.4 }}
            className="sm:hidden question-bio-button flex justify-start items-center w-full mt-5"
          >
            <Link
              href="/faqs"
              className="link flex justify-center items-center p-3 gap-2"
            >
              <span className="ml-5 text-sm">Show All</span>
              <FaArrowRight className="text-[#1A68FF] mr-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default UserQuestions;
