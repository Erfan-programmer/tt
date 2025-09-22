"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

interface RankBoxPropsType {
  title: string;
  description: string;
  footer: string;
  src: string;
}

export default function RankBox({
  title,
  description,
  footer,
  src,
}: RankBoxPropsType) {
  // Array of stars with random positions for a scattered effect
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
  }));

  return (
    <div className="rank-box-container px-4 py-2 text-white my-8 border-[2px] border-[#383C47] rounded-lg bg-gradient-to-r from-[#090D23] via-[#090D23] via-60% to-[#1651C6] relative overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute text-white rounded-full bg-white opacity-50"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      <div className="flex flex-col-reverse lg:flex-row items-center gap-4 relative z-10">
        <div className="rank-box-detail flex-grow">
          <h3 className="font-bold text-2xl">{title}</h3>
          <div className="rank-box-description lg:ml-10 text-[.9rem] mt-6">
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="rank-box-footer lg:ml-10 text-[.9rem]">
            <p dangerouslySetInnerHTML={{ __html: footer }} />
          </div>
        </div>
        <div className="rank-box-image flex-shrink-0 flex items-center justify-center w-[15rem] h-[15rem] mx-10 scale-[1.5]">
          <Image
            src={src}
            width={300}
            height={300}
            alt=""
            className="object-contain w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}