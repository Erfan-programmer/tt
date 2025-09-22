"use client";
import React, { useEffect, useState } from "react";
import "./LastMainSection.css";
import { motion } from "framer-motion";

function LastMainSection() {
  const numberOfStars = 30;
  const [starsPosition, setStarsPosition] = useState<
    { top: string; left: string }[]
  >([]);

  useEffect(() => {
    const positions = Array.from({ length: numberOfStars }).map(() => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
    }));
    setStarsPosition(positions);
  }, []);

  const stars = starsPosition.map((position, index) => (
    <motion.div
      viewport={{ once: true }}
      key={index}
      className="star"
      style={{
        position: "absolute",
        width: `5px`,
        height: `5px`,
        backgroundColor: "#aaa",
        borderRadius: "50%",
        top: position.top,
        left: position.left,
      }}
      initial={{
        opacity: 0,
        scale: 0,
      }}
      whileInView={{
        opacity: 0.8,
        scale: 1,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: Math.random() * 3 + 2,
        ease: "easeInOut",
        delay: 0.3,
      }}
    />
  ));

  return (
    <div className="last-main-section w-full h-auto p-4 pb-10 mt-20 mx-auto hidden sm:block ">
      <div
        className="relative w-full h-[50vh] bg-transparent hidden sm:flex"
        style={{ zIndex: 2 }}
      >
        {stars}
      </div>
      <div className="last-main-section-wrapper relative overflow-hidden">
        <div className="flex flex-col justify-start items-center flex-col">
          <motion.img
            viewport={{ once: true }}
            initial={{
              transform: "translateY(251px)",
              clipPath: "inset(0% 0% 58% 0%)",
            }}
            whileInView={{
              transform: "translateY(10px)",
              clipPath: "inset(0% 0 0% 0%)",
            }}
            transition={{ duration: 5, ease: "easeOut" }}
            src={"/images/iphone.png"}
            alt="mobile img"
            className="absolute top-[0rem] z-10 rounded-lg"
          />
          <motion.div
            viewport={{ once: true }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 4 }}
            className="mobile_shadow h-10 w-10  rounded-lg absolute"
          ></motion.div>
          <svg
            className="w-[100vw] sm:w-[90vw]"
            width="992"
            height="200"
            viewBox="0 0 992 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g style={{ mixBlendMode: "color-dodge" }}>
              <ellipse
                cx="496"
                cy="100"
                rx="496"
                ry="100"
                fill="url(#paint0_radial_1_758)"
              />
            </g>
            <defs>
              <radialGradient
                id="paint0_radial_1_758"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(496 100) rotate(90) scale(100 496)"
              >
                <stop />
                <stop offset="0.4" stopColor="#333333" />
                <stop offset="0.5" stopColor="white" />
                <stop offset="0.6" stopColor="#333333" />
                <stop offset="1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="last-main-section-bio mt-5 flex flex-col justify-center items-center">
        <h3 className="text-3xl xl:text-4xl text-white w-[60%] lg:w-[30%] text-center">
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Experience the
          </motion.span>{" "}
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            power of investing
          </motion.span>{" "}
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            on the go!
          </motion.span>{" "}
        </h3>
        <div className="last-main-section-bio-des w-[75%] mt-5 text-center">
          <motion.span
            viewport={{ once: true }}
            initial={{ opacity: 0, y: "20px" }}
            whileInView={{ opacity: 1, y: "0" }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-[#888] text-center"
          >
            Our website is fully mobile-responsive, making it easy to invest
            anytime, anywhere. You can invest in the Forex market faster,
            smarter, and more conveniently with our user-friendly mobile
            interface.
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default LastMainSection;
