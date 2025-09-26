"use client";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "./LatestNews.css";
import LatestNewBox from "@/components/modules/LatestNewBox/LatestNewBox";
import { lastNews } from "@/data/data";
import { motion } from "framer-motion";
import { Navigation } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function LatestNews() {
  return (
    <div id="blog" className="latest-news-container w-full md:w-[90%] mt-[18rem] lg:mt-auto">
      <div className="latest-news-title flex flex-col md:flex-row justify-between sm:items-start max-w-[90%] md:max-w-[92%] mx-auto">
        <h4 className="text-[#888] text-center sm:text-left text-xl sm:text-3xl mb-4 md:mb-0 w-full sm:w-[75%] md:w-[35%]">
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
          >
            Be aware of the{" "}
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[#383C47] dark:text-white"
          >
            {" "}
            latest news and events{" "}
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            in the forex World
          </motion.span>
        </h4>
        <motion.button
          viewport={{ once: true }}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="latest-new-button flex justify-center w-fit sm:w-auto mx-auto sm:mr-0 items-center gap-[1rem] border-2 border-[#383C47] p-2 rounded-[1rem] px-4"
        >
          <span className="text-white ">Discover More</span>
          <FaArrowRight className="text-[#1A68FF]" />
        </motion.button>
      </div>

      <div className="latest-news-items mt-10">
        <Swiper
          slidesPerView={1}
          loop={true}
          allowSlideNext={true}
          allowSlidePrev={true}
          centeredSlides={true}
          modules={[Navigation]}
          breakpoints={{
            480: {
              centeredSlides: true,
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 10,
              centeredSlides: true,
            },
            768: {
              slidesPerView: 2,
              centeredSlides: true,
            },
            1180: {
              slidesPerView: 3,
              centeredSlides: true,
            },
          }}
          className="mySwiper"
        >
          {lastNews.map((newBox, index) => (
            <SwiperSlide key={index}>
              <LatestNewBox
                classNameCustom={"active_lates_slide"}
                lastNewInfo={newBox}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
