"use client";
import React, { useRef } from "react";
import { DotLottiePlayer } from "@dotlottie/react-player";
import imageBox1 from "@/../public/animations/box1.json"
import imageBox4 from "@/../public/animations/box4.json";
import imageBox3 from "@/../public/animations/box3.json"  ;
import imageBox2 from "@/../public/animations/box2.json"  ;
import imageMobile1 from "@/../public/animations/box-mob-1.json";
import imageMobile2 from "@/../public/animations/box-mob-2.json";
import imageMobile3 from "@/../public/animations/box-mob-3.json"
import Image from "next/image";
import { motion } from "framer-motion";
import "./BenefitsSlider.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SliderGraph from "@/components/modules/Slider/SliderGraph";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


// import Image from "next/image";
const BenefitsSlides = () => {
  const lottiePlayers = useRef<Array<any | null>>([]);

  const lottieOptionsArray = [
    { src: imageBox1, cover: "/images/box2.jpg" },
    { src: imageBox4, cover: "/images/box4.png" },
    { src: imageBox3, cover: "/images/box3.jpg" },
    { src: imageBox2, cover: "/images/box1.jpg" },
  ];

  const lottieMobileOptionsArray = [imageMobile1, imageMobile2, imageMobile3];

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.realIndex;
    lottiePlayers.current?.forEach((player, index) => {
      if (player) {
        if (index === currentIndex) {
          player.play();
        } else {
          player.stop();
        }
      }
    });
  };

  return (
    <div id="what_makes" className="w-full mt-[10rem]">
      <div className="slider-title mb-10 text-center">
        <h3 className="w-[90%] sm:w-auto text-2xl sm:text-4xl lg:text-center text-[#888]">
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            What
          </motion.span>
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {" "}
            makes us the
          </motion.span> <br />
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, transform: "translateY(-10px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0)" }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-white"
          >
            {" "}
            right choice?
          </motion.span>
        </h3>
      </div>

      {/* Desktop Version */}
      <div className="slider-container hidden md:block w-[80%] pt-[4rem] mx-auto sm:relative sliderLottie">
        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={true}
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1180: { slidesPerView: 3 },
          }}
          onSlideChange={handleSlideChange}
          className="mySwip"
        >
          {lottieOptionsArray.map((lottieOptions, index) => (
            <SwiperSlide key={index} className="">
              <DotLottiePlayer
                src={lottieOptions.src}
                ref={(el: any | null) => {
                  lottiePlayers.current[index] = el;
                }}
                style={{ width: "100%", height: "100%" }}
              />
              <Image
                width={1600}
                height={600}
                quality={100}
                src={lottieOptions.cover}
                alt=""
                className="lottie-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-button-prev">
          <FaArrowLeft className="text-[#1A68FF] text-3xl" />
        </div>
        <div className="swiper-button-next">
          <FaArrowRight className="text-[#1A68FF] text-3xl" />
        </div>
      </div>

      <motion.div
        viewport={{ once: true }}
        initial={{ opacity: 0, y: "20px" }}
        whileInView={{ opacity: 1, y: "0" }}
        transition={{ duration: 2, delay: 0.3 }}
        className="grid grid-cols-1 md:hidden gap-3 p-2 lottie_mobile relative"
        style={{ zIndex: 100 }}
      >
        {lottieMobileOptionsArray.map((lottie, index) => (
          <DotLottiePlayer
            key={index}
            loop={true}
            autoplay={true}
            src={lottie}
            style={{ width: "100%", height: "100%" }}
          />
        ))}
      </motion.div>

      <div className="slider-graph lg:mb-[20rem] mt-[-5rem] sm:mt-auto">
        <SliderGraph />
      </div>
    </div>
  );
};

export default BenefitsSlides;
