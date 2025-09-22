"use client"
import React from "react";
import Style from "@/styles/Option.module.css";
import OptionBoxes from "@/components/templates/Option/OptionBoxes";
import { motion } from "framer-motion"; 

export default function page() {
  return (
    <div className="static w-full flex flex-col justify-evenly items-center mt-[7rem]  gap-10 h-auto md:h-[80vh] md:mt-[15vh] ">
      
      <motion.h1
        className={`text-[1.6rem] sm:text-[2rem] lg:text-4xl xl:text-5xl font-clash titan-header md:w-[80%] w-[90%] lg:w-[60%] xl:w-[50%] text-white text-center ${Style.option_header}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
      >
        Explore the <span className={Style.option_header_span}>TITAN</span> Universe Select Your Service
      </motion.h1>

      <motion.div
        className="flex justify-center items-center flex-wrap gap-5  "
        initial={{ opacity: 0, y: 100 }} 
        animate={{ opacity: 1, y: 0 }}   
        transition={{ duration: 1, delay: 4 }}
      >
        <OptionBoxes />
      </motion.div>

      {/* <motion.div
        className={`${Style.backGround_img} w-[90%] sm:w-[90%] md:w-[80%] `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 4 }}
      ></motion.div> */}
      
    </div>
  );
}
