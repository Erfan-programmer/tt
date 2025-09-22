"use client";

import { useWealthy } from "@/contextApi/PieContext";
import "./Pie.css";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts/types/polar/Pie";

type DataItem = { name: string; value: number; color: string };

const pieData: DataItem[] = [
  { name: "Real Estate", value: 25, color: "#FF00D0" },
  { name: "Crypto", value: 15, color: "#FF0004" },
  { name: "Stock", value: 30, color: "#00FF3C" },
  { name: "Cash & Liquidity", value: 10, color: "#d0d0d0" },
  { name: "Gold & Precious Metals", value: 20, color: "#FFC800" },
  { name: "TITAN INVESTMENTS", value: 20, color: "#0057FF" },
];

const inactiveColor = "#9EB8EA";
const CONTAINER_SIZE = 400;

export default function CarouselPieChart() {

  const {activeIndex , setActiveIndex} = useWealthy()
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % pieData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [setActiveIndex]);

  const coloredData = pieData.map((entry, index) => ({
    ...entry,
    fill: index === activeIndex ? entry.color : inactiveColor,
  }));

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, name } = props;
    const RADIAN = Math.PI / 180;
    const offset = 40;
    const inner = Number(innerRadius);
    const outer = Number(outerRadius);
    const centerX = Number(cx);
    const centerY = Number(cy);
    const radius = inner + (outer - inner) * 0.6 + offset;
    const x = centerX + radius * Math.cos(-midAngle * RADIAN);
    const y = centerY + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={14}>
        {name}
      </text>
    );
  };

const getHaloCenter = useCallback(() => {
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  let startAngle = 0;
  const safeIndex = Math.min(activeIndex, pieData.length - 1);
  for (let i = 0; i < safeIndex; i++) {
    startAngle += (pieData[i].value / total) * 360;
  }

  const midAngle =
    startAngle + ((pieData[safeIndex]?.value ?? 0) / total) * 180;
  const cx = CONTAINER_SIZE / 2;
  const cy = CONTAINER_SIZE / 2;
  const radius = 140;
  const RADIAN = Math.PI / 180;
  return {
    x: cx + radius * Math.cos(-midAngle * RADIAN),
    y: cy + radius * Math.sin(-midAngle * RADIAN),
  };
}, [activeIndex]); 


  const [starOffsets, setStarOffsets] = useState<{ x: number; y: number }[]>([]);

useEffect(() => {
  const center = getHaloCenter();
  const count = 12;
  const offsets = Array.from({ length: count }, () => {
    const angle = Math.random() * 2 * Math.PI;
    const r = 40 + Math.random() * 20;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  });
  setStarOffsets(offsets);
}, [activeIndex, getHaloCenter]);


  const haloPos = getHaloCenter();

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
      className="pie-container relative"
      style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}
    >
      {/* Halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: isNaN(haloPos.x) ? 0 : haloPos.x - 140,
          top: isNaN(haloPos.y) ? 0 : haloPos.y - 140,
          width: CONTAINER_SIZE,
          height: CONTAINER_SIZE,
          background: "radial-gradient(circle, rgba(16,52,132,0.7) 0%, rgba(16,52,132,0) 70%)",
          zIndex: 0,
        }}
      >
        {starOffsets.map((star, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: isNaN(star.x) ? 0 : star.x - (haloPos.x - 140),
              top: isNaN(star.y) ? 0 : star.y - (haloPos.y - 140),
              width: ".1rem",
              height: ".1rem",
              borderRadius: "50%",
              backgroundColor: "#fff",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
     data={coloredData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={"40%"}
            outerRadius={"80%"}
            paddingAngle={2}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={false}
          >
            {coloredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                style={{
                  filter: index === activeIndex ? "blur(1px)" : "blur(4px)",
                  transition: "filter 0.3s",
                }}
              />
            ))}
          </Pie>

          <text
            x={CONTAINER_SIZE / 2}
            y={CONTAINER_SIZE / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={24}
            fill="#fff"
          >
            {pieData[Math.min(activeIndex, pieData.length - 1)]?.value ?? 0}%
          </text>

          <Tooltip formatter={(value: number) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
