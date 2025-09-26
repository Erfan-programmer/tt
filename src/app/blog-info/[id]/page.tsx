"use client";
import React from "react";
import { blogInfo } from "@/data/blogInfo";
import "./page.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return (
    <div className="blog-info w-[90%] sm:w-[60%] mx-auto my-[10rem] pb-5">
      <motion.div
        viewport={{ once: true }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        id="pdfContent"
        className="blog-info-wrapper mx-auto w-[90%] sm:w-[100%]"
        dangerouslySetInnerHTML={{ __html: blogInfo[0].renderText() }}
      />

      {/* <button
        onClick={generatePDF}
        className="mt-4 p-2 border border-[#383C47] w-full mx-auto text-white rounded-[1rem] flex justify-center items-center gap-2"
      >
        Download PDF
        <FaArrowDown className="text-[#1A68FF]" />
      </button> */}
      <button
        onClick={() => router.back()}
        className="p-2 rounded-[1rem] border-2 border-[#383C47] flex justify-center items-center gap-2 mt-5 w-full w-full mx-auto text-[#383C47] dark:text-white"
      >
        Home
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12.9662C6 12.9662 7.6 14.9662 10 14.9662C12.4 14.9662 14 12.9662 14 12.9662M1 12.5662V10.0964C1 8.94767 1 8.37331 1.14805 7.84438C1.2792 7.37584 1.49473 6.93517 1.78405 6.54399C2.11067 6.10239 2.56404 5.74977 3.47078 5.04453L6.07078 3.0223C7.47608 1.92929 8.17873 1.38279 8.95461 1.17271C9.63921 0.987351 10.3608 0.987351 11.0454 1.17271C11.8213 1.38279 12.5239 1.9293 13.9292 3.02231L16.5292 5.04453C17.436 5.74977 17.8893 6.10239 18.2159 6.54399C18.5053 6.93517 18.7208 7.37584 18.8519 7.84438C19 8.37331 19 8.94767 19 10.0964V12.5662C19 14.8065 19 15.9266 18.564 16.7822C18.1805 17.5349 17.5686 18.1468 16.816 18.5303C15.9603 18.9662 14.8402 18.9662 12.6 18.9662H7.4C5.15979 18.9662 4.03969 18.9662 3.18404 18.5303C2.43139 18.1468 1.81947 17.5349 1.43597 16.7822C1 15.9266 1 14.8065 1 12.5662Z"
            stroke="#1A68FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default Page;
