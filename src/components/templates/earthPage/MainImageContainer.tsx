"use client";
import React from "react";
import { motion } from "framer-motion";

import Style from "@/styles/Home/page.module.css";
import EarthSvg from "@/Svgs/EarthSvg";
import thunder from "@/../public/animations/electric.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function MainImageContainer() {
  return (
    <div className="main-image-container relative w-full h-[19rem] -top-28">
      <motion.div
        initial={{ y: "-50rem" }}
        animate={{ y: "var(--translate-y)" }}
        transition={{ delay: 1.4, duration: 2 }}
        viewport={{ once: true }}
        className={`${Style.main_image} [--translate-y:0rem] md:[--translate-y:-1rem] lg:[--translate-y:7rem]`}
      >
        <EarthSvg />
        <motion.div
          className="lottie-animation-thunder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 5 }}
        >
          <Lottie 
            animationData={thunder} 
            loop 
            style={{ width: "100%", height: "100%" }} 
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
