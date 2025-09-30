import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import "./LatestNewBox.css";


type LastNewboxType = {
  lastNewInfo: {
    id:number;
    img: any;
    categories: string;
    description: string;
    time: string;
  };
  classNameCustom: any;
};

function LatestNewBox({ lastNewInfo }: LastNewboxType) {
  return (
    <div
      className={`latest-new-box p-2 flex justify-start items-start w-full`}
    >
      <div className="latest-new-wrapper mx-auto w-full">
        <Link href={`/blog-info/${lastNewInfo?.id}`}>
          <motion.img
            initial={{ y: 50 , opacity:0  }}
            whileInView={{ y: 0 , opacity:100 }}  
            transition={{ duration: 0.2 , delay:.2}} 
            src={lastNewInfo.img}
            className="w-full"
            alt="latest new"
          />
        </Link>
        <motion.button
          initial={{ y: "20px" }}
          whileInView={{ y: "0" }}
          transition={{ duration: 0.5 }}
          className="text-white p-2 my-5"
        >
          {lastNewInfo.categories}
        </motion.button>
        <div className="latest-new-body">
          <motion.p
            initial={{ y: "20px" }}
            whileInView={{ y: "0" }}
            transition={{ duration: 0.5 }}
            className="text-white"
          >
            {lastNewInfo.description}
          </motion.p>
        </div>
        <motion.div
          initial={{ y: "20px" }}
          whileInView={{ y: "0" }}
          transition={{ duration: 0.5 }}
          className="latest-new-box-footer flex justify-between items-center mt-5"
        >
          <li className="flex justify-center items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"
                stroke="#747580"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#888] text-[.9rem]">{lastNewInfo.time}</span>
          </li>

          <Link
            href={`/blog-info/${lastNewInfo?.id}`}
            className="h-[3rem] w-[3rem] flex justify-center items-center rounded-full"
          >
            <span>
              <FaArrowRight className="text-[#383C47] dark:text-white" />
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default LatestNewBox;
